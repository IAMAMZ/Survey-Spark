const express = require("express");

const router = express.Router();

let isAuthenticated = require("../Config/authCheck");

const questionController = require("../Controllers/question");

router.get(
  "/:surveyId/sections/:sectionId/questions/add",
  isAuthenticated,
  questionController.displayQuestionCreateForm
);

router.post(
  "/:surveyId/sections/:sectionId/questions/add",
  isAuthenticated,
  questionController.saveSurveyQuestion
);

router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/delete",
  isAuthenticated,
  questionController.deleteQuestion
);

router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/edit",
  isAuthenticated,
  questionController.displayQuestionEditForm
);
router.post(
  "/:surveyId/sections/:sectionId/questions/:questionId/edit",
  isAuthenticated,
  questionController.updateSurveyQuestion
);
router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/options",
  isAuthenticated,
  questionController.displayQuestionOptionsPortal
);
router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/options/add",
  isAuthenticated,
  questionController.displayOptionCreateForm
);
router.post(
  "/:surveyId/sections/:sectionId/questions/:questionId/options/add",
  isAuthenticated,
  questionController.saveOption
);

router.get(
  "/:surveyId/sections/:sectionId/questions/:questionId/options/:optionId/delete",
  isAuthenticated,
  questionController.deleteOption
);
module.exports = router;
