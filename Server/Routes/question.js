const express = require("express");

const router = express.Router();

const questionController = require("../Controllers/question");

router.get(
  "/:surveyId/questions/add",
  questionController.displayQuestionCreateForm
);

router.post("/:surveyId/questions/add", questionController.saveSurveyQuestion);

router.get(
  "/:surveyId/questions/:questionId/delete",
  questionController.deleteQuestion
);

router.get("/:surveyId/questions/:questionId/edit", questionController.displayQuestionEditForm);
router.post("/:surveyId/questions/:questionId/edit", questionController.updateSurveyQuestion);

module.exports = router;
