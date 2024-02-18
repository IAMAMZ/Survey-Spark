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

module.exports = {
  displayQuestionCreateForm,
  saveSurveyQuestion,
  deleteQuestion,
};
