const express = require("express");

const router = express.Router();

const questionController = require("../Controllers/question");

router.get(
  "/:surveyId/sections/:sectionId/questions/add",
  questionController.displayQuestionCreateForm
);

router.post(
  "/:surveyId/sections/:sectionId/questions/add",
  questionController.saveSurveyQuestion
);

router.get(
  "/:surveyId/sections/:sectionId/questions/delete",
  questionController.deleteQuestion
);

router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/edit",
  questionController.displayQuestionEditForm
);
router.post(
  "/:surveyId/sections/:sectionId/questions/:questionId/edit",
  questionController.updateSurveyQuestion
);
router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/options",
  questionController.displayQuestionOptionsPortal
);
module.exports = router;
