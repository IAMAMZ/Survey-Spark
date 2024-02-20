// get the survey model
const Survey = require("../Models/Survey");

const displayQuestionCreateForm = async (req, res, next) => {
  let survey = await Survey.findById(req.params.surveyId);
  res.render("question/create", {
    title: "Add Question",
    page: "create",
    survey: survey,
  });
};

const saveSurveyQuestion = async (req, res, next) => {
  try {
    // Find the survey by ID
    let survey = await Survey.findById(req.params.surveyId);

    // if it doesn't exist return 404
    if (!survey) {
      return res.status(404).send("Survey not found");
    }

    // Extract question details from request body
    const { text, type, options } = req.body;

    // create a  new question object
    let newQuestion = {
      text: text,
      type: type,
      options: [],
    };

    // If the question type is 'multiple-choice', parse the options --> we could handle options some other way, it's csv for now
    if (type === "multiple-choice" && options) {
      newQuestion.options = options.split(",").map((option) => ({
        text: option.trim(), // Create an option object for each option
        value: option.trim(),
      }));
    }

    // Add the new question to the survey's questions array
    survey.questions.push(newQuestion);

    // Save the updated survey
    await survey.save();

    // Redirect to the survey details page and pass the survey id
    res.redirect(`/survey/details/${survey._id}`);
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
  let question = survey.questions.find(q => q._id.toString() === req.params.questionId);

  // Render the edit question form
  res.render("question/edit", {
    title: "Edit Question",
    page: "edit",
    survey: survey,
    question: question
  });
};

module.exports = {
  displayQuestionCreateForm,
  saveSurveyQuestion,
  displayQuestionEditForm,
  updateSurveyQuestion,
  deleteQuestion,
};
