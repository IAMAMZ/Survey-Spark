const express = require("express");

const router = express.Router();

const questionController = require("../Controllers/question");

router.get(
  "/:surveyId/questions/add",
  questionController.displayQuestionCreateForm
);

router.post("/:surveyId/questions/add", questionController.saveSurveyQuestion);

module.exports = router;
