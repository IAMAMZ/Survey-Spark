const express = require("express");

const router = express.Router();

const takeSurveyController = require("../Controllers/takeSurvey");
router.get("/complete", takeSurveyController.renderSurveyComplete);

router.get("/:surveyId", takeSurveyController.takeSurvey);

router.get(
  "/:surveyId/sections/:sectionId",
  takeSurveyController.displaySection
);

router.post(
  "/:surveyId/sections/:sectionId/saveResponse",
  takeSurveyController.handleResponse
);

router.get("/", takeSurveyController.allSurveys);
module.exports = router;
