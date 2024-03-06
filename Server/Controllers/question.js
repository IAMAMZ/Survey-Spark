// get the survey model
const Survey = require("../Models/Survey");
const Section = require("../Models/Section");
const Question = require("../Models/Question");

const displayQuestionCreateForm = async (req, res, next) => {
  res.render("question/create", {
    title: "Add Question",
    page: "create",
    surveyId: req.params.surveyId,
  });
};

const saveSurveyQuestion = async (req, res, next) => {
  try {
    // Find the section by ID
    let section = await Section.findById(req.params.sectionId);

    // If the section doesn't exist, return 404
    if (!section) {
      return res.status(404).send("Section not found");
    }

    // Extract question details from request body
    const { text, type } = req.body;

    // Create a new Question document
    let newQuestion = new Question({
      text: text,
      type: type,
      // Add other fields as necessary
    });

    // Save the Question document to get an ObjectId
    let savedQuestion = await newQuestion.save();

    // Add the ObjectId of the new Question to the Section's questions array
    section.questions.push(savedQuestion._id);

    // Save the updated Section
    await section.save();

    // Redirect to the survey details page
    res.redirect(
      `/survey/${req.params.surveyId}/sections/${req.params.sectionId}/questionsPortal`
    );
  } catch (error) {
    console.error("Error saving new question:", error);
    res.status(500).send("Error saving new question");
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    // Find the survey by ID
    let survey = await Survey.findById(req.params.surveyId);

    // If the survey doesn't exist, return 404
    if (!survey) {
      return res.status(404).send("Survey not found");
    }

    // Remove the question from the survey's questions array
    // Filter out the question to delete by its ID
    survey.questions = survey.questions.filter(
      (question) => question._id.toString() !== req.params.questionId
    );

    // Save the updated survey
    await survey.save();

    // Redirect back to the survey details page,
    res.redirect(`/survey/details/${req.params.surveyId}`);
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send("Error deleting the question");
  }
};

const updateSurveyQuestion = async (req, res, next) => {
  try {
    // Find the survey by ID
    let survey = await Survey.findById(req.params.surveyId);

    // If the survey doesn't exist, return 404
    if (!survey) {
      return res.status(404).send("Survey not found");
    }

    // Find the question within the survey's questions array by its ID
    let question = survey.questions.find(
      (question) => question._id.toString() === req.params.questionId
    );

    // If the question doesn't exist, return 404
    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Extract updated question details from request body
    const { text, type, options } = req.body;

    // Update the question details
    question.text = text;
    question.type = type;

    // If the question type is 'multiple-choice', parse the options
    if (type === "multiple-choice" && options) {
      question.options = options.split(",").map((option) => ({
        text: option.trim(),
        value: option.trim(),
      }));
    } else {
      // If the question type is not 'multiple-choice', clear the options array
      question.options = [];
    }

    // Save the updated survey
    await survey.save();

    // Redirect back to the survey details page
    res.redirect(`/survey/details/${survey._id}`);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).send("Error updating question");
  }
};

const displayQuestionEditForm = async (req, res, next) => {
  // Retrieve the survey and question details
  let survey = await Survey.findById(req.params.surveyId);
  let question = survey.questions.find(
    (q) => q._id.toString() === req.params.questionId
  );

  // Render the edit question form
  res.render("question/edit", {
    title: "Edit Question",
    page: "edit",
    survey: survey,
    question: question,
  });
};
const displayQuestionOptionsPortal = async (req, res, next) => {
  const { surveyId, questionId } = req.params;

  console.log(surveyId);
  //get all the options

  const question = await Question.findById(questionId);
  const options = question.option;

  // get the sections in the survey

  res.render("question/option/index", {
    question: question,
    options: options,
  });
};
const displayOptionCreateForm = async (req, res, next) => {
  const { surveyId, questionId } = req.params;
  const surveySections = await Survey.findById(surveyId).populate("sections");

  res.render("question/option/create", {
    surveySections: surveySections.sections,
  });
};
module.exports = {
  displayQuestionCreateForm,
  saveSurveyQuestion,
  displayQuestionEditForm,
  updateSurveyQuestion,
  deleteQuestion,
  displayQuestionOptionsPortal,
  displayOptionCreateForm,
};
