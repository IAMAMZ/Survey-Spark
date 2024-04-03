// get the survey model
const Survey = require("../Models/Survey");
const Section = require("../Models/Section");
const Question = require("../Models/Question");
const User = require("../Models/User");

const displayQuestionCreateForm = async (req, res, next) => {
  res.render("question/create", {
    title: "Add Question",
    page: "create",
    User: req.User,
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
    // Find the section parent
    const section = await Section.findById(req.params.sectionId)
      .populate("questions")
      .exec();

    // Remove the question from the section's questions array
    // Filter out the question to delete by its ID
    section.questions = section.questions.filter(
      (question) => question._id.toString() !== req.params.questionId
    );

    // Save the updated survey
    await section.save();

    // Redirect back to the survey details page,
    res.redirect(
      `/survey/${req.params.surveyId}/sections/${req.params.sectionId}/questionsPortal`
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send("Error deleting the question");
  }
};

const updateSurveyQuestion = async (req, res, next) => {
  try {
    // Find the survey by ID

    console.log(req.params.sectionId);
    await Question.findByIdAndUpdate(req.params.questionId, req.body);

    // Redirect back to the survey details page
    res.redirect(
      `/survey/${req.params.surveyId}/sections/${req.params.sectionId}/questionsPortal`
    );
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).send("Error updating question");
  }
};

const displayQuestionEditForm = async (req, res, next) => {
  // Retrieve the survey and question details
  const section = await Section.findById(req.params.sectionId)
    .populate("questions")
    .exec();

  let question = section.questions.find(
    (q) => q._id.toString() === req.params.questionId
  );

  console.log("HERE IS THE QUEATON ", question);

  // Render the edit question form
  res.render("question/edit", {
    title: "Edit Question",
    page: "edit",
    user: req.user,
    question: question,
  });
};
const displayQuestionOptionsPortal = async (req, res, next) => {
  const { surveyId, questionId } = req.params;

  console.log(surveyId);
  //get all the options

  const question = await Question.findById(questionId).populate({
    path: "options.nextSection",
    select: "title",
  });
  const options = question.options;

  // get the sections in the survey

  res.render("question/option/index", {
    question: question,
    user: req.user,
    options: options,
  });
};
const displayOptionCreateForm = async (req, res, next) => {
  const { surveyId, questionId } = req.params;
  const surveySections = await Survey.findById(surveyId).populate("sections");

  res.render("question/option/create", {
    surveySections: surveySections.sections,
    user: req.user,
  });
};

const saveOption = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { text, value, nextSection } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Create a new option object
    const newOption = { text, value, nextSection: nextSection || undefined };

    question.options.push(newOption);

    await question.save();

    // Redirect
    res.redirect(
      `/survey/${req.params.surveyId}/sections/${req.params.sectionId}/questions/${req.params.questionId}/options`
    );
  } catch (error) {
    console.error("Error saving option:", error);
    res.status(500).send("Error saving option");
  }
};

const deleteOption = async (req, res, next) => {
  try {
    // Find the question parent

    const question = await Question.findById(req.params.questionId)
      .populate("options")
      .exec();

    // Remove the option from the quesion's options array
    // Filter out the option to delete by its ID
    question.options = question.options.filter(
      (option) => option._id.toString() !== req.params.optionId
    );

    // Save the updated question
    await question.save();

    // Redirect back to the survey details page,
    res.redirect(
      `/survey/${req.params.surveyId}/sections/${req.params.sectionId}/questions/${req.params.questionId}/options`
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send("Error deleting the question");
  }
};

const displayOptionEditForm = async (req, res, next) => {
  const { surveyId, optionId, questionId } = req.params;
  try {
    // Fetch the survey with all sections populated
    const survey = await Survey.findById(surveyId).populate("sections");
    const allSections = survey.sections;

    // Find the question to which the option belongs
    const question = await Question.findById(questionId).populate({
      path: 'options.nextSection',
      model: 'Section' 
    });

    // Find the specific option to edit. 

    const optionToEdit = question.options.find(option => option._id.toString() === optionId);

    console.log(optionToEdit);

    // Render the edit option form with the found option and all sections for the dropdown
    res.render("question/option/edit", {
      user: req.user,
      allSections: allSections,
      option: optionToEdit, 
    });
  } catch (error) {
    console.error("Error displaying option edit form:", error);
  }
}

module.exports = {
  displayQuestionCreateForm,
  saveSurveyQuestion,
  displayQuestionEditForm,
  updateSurveyQuestion,
  deleteQuestion,
  displayQuestionOptionsPortal,
  displayOptionCreateForm,
  saveOption,
  deleteOption,
  displayOptionEditForm
};
