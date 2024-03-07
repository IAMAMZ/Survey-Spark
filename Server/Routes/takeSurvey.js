const express = require("express");

const router = express.Router();

const takeSurveyController = require("../Controllers/takeSurvey");

router.get("/:surveyId", takeSurveyController.takeSurvey);

router.get(
  "/:surveyId/sections/:sectionId",
  takeSurveyController.displaySection
);
router.get("/", takeSurveyController.allSurveys);
module.exports = router;
