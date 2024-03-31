const express = require("express");

const router = express.Router();

let isAuthenticated = require('../Config/authCheck');

const takeSurveyController = require("../Controllers/takeSurvey");
router.get("/complete",isAuthenticated, takeSurveyController.renderSurveyComplete);

router.get("/:surveyId",isAuthenticated, takeSurveyController.takeSurvey);

router.get(
  "/:surveyId/sections/:sectionId",isAuthenticated,
  takeSurveyController.displaySection
);

router.post(
  "/:surveyId/sections/:sectionId/saveResponse",isAuthenticated,
  takeSurveyController.handleResponse
);

router.get("/", takeSurveyController.allSurveys);
module.exports = router;
