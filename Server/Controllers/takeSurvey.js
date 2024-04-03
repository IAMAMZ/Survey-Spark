const Survey = require("../Models/Survey");
const Section = require("../Models/Section");
const Response = require("../Models/Response");
const Question = require("../Models/Question");
const mongoose = require("mongoose");
const User = require('../Models/User');

const allSurveys = async (req, res, next) => {
  const surveys = await Survey.find();

  res.render("takeSurvey/index", { surveys: surveys, user: req.user  });
};

const takeSurvey = async (req, res, next) => {
  const { surveyId } = req.params;

  try {
    // Find the survey by ID and populate the sections
    const survey = await Survey.findById(surveyId).populate("sections").exec();

    if (!survey) {
      res.render("takeSurvey/noQuestionsfound");
      return;
    }

    // If sections are not populated with full details this will fail
    let sectionWithOrderOne = survey.sections.find(
      (section) => section.order === 1
    );

    if (!sectionWithOrderOne) {
      res.render("takeSurvey/noQuestionsfound");
      return;
    }

    // Extract the ID of the section with order 1
    let sectionId = sectionWithOrderOne._id;

    // Redirect to the specific section of the survey
    res.redirect(`/takeSurvey/${surveyId}/sections/${sectionId}`);
  } catch (error) {
    res.render("takeSurvey/noQuestionsfound");
    return;
  }
};

const displaySection = async (req, res, next) => {
  const { surveyId, sectionId } = req.params;

  // get all the questions in the section and pass it along
  const section = await Section.findById(sectionId)
    .populate("questions")
    .exec();
    console.log("SECTION ", section);
    console.log("SURVEY QUESTIONS " , section.questions)

    if(!section.questions){
       res.render("takeSurvey/noQuestionsfound");
       return;
    }

  res.render("takeSurvey/sectionQuestionRenderer", {
    section: section,
    user: req.user
  });
};

const handleResponse = async (req, res, next) => {
  let idOfNextSection;
  const { surveyId, sectionId } = req.params;

  const responses = req.body;
  // make a response

  const response = new Response({
    surveyId: surveyId,
  });
  // Iterate over each question-response pair
  for (const [questionId, answer] of Object.entries(responses)) {
    // see if question id is multiple choice
    const question = await Question.findById(questionId);

    if (question.type === "Multiple Choice") {
      // then find the option
      for (const option of question.options) {
        if (option.value === answer) {
          // set the id of next section
          idOfNextSection = option.nextSection;
        }
      }
    }

    // save the resposne
    const answerObj = { questionId: questionId, answer: answer };

    // add the response to response
    response.answers.push(answerObj);

    await response.save();
  }
  console.log("________________________>____________");
  console.log("ID OF NEXt " + idOfNextSection);
  console.log("ID OF SECTION  " + sectionId);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  // if options don't lead to next section then go by next section of survey
  const currentSection = await Section.findById(sectionId);

  if (currentSection.nextSection) {
    idOfNextSection = currentSection.nextSection;
  }
  // if all fails fo by order
  if (!idOfNextSection) {
    const currentOrder = currentSection.order;
    console.log("((DLSDJF ");
    console.log(currentOrder);
    const nextOrder = currentOrder + 1; // Calculate the next order

    console.log("NEX ORDER IS ", nextOrder);

    // Try to find the next section by its order
    const nextSection = await Section.findOne({
      surveyId: surveyId,
      order: nextOrder,
    });

    console.log("SURVEY ID IS ", surveyId);

    console.log("NEXT SECTIONIS ", nextSection);

    if (nextSection) {
      // If a next section is found, use its ID for redirection
      idOfNextSection = nextSection._id;
    } else {
      // If no next section is found, this indicates the end of the survey
      // Redirect to the survey completion or submission page
      return res.redirect("/takeSurvey/complete");
    }
  }

  // Redirect to the next section
  res.redirect(`/takeSurvey/${surveyId}/sections/${idOfNextSection}`);
  //await response.save();
};

const renderSurveyComplete = async (req, res, next) => {
  console.log("<<<<<<<<<<<<_>>>>>>>>>>>>>>>>");
  res.render("takeSurvey/surveyComplete");
};

module.exports = {
  allSurveys,
  takeSurvey,
  displaySection,
  handleResponse,
  renderSurveyComplete,
};
