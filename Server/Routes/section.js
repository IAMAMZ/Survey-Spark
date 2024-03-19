const express = require("express");

const router = express.Router();

let isAuthenticated = require('../Config/authCheck');


const sectionController = require("../Controllers/section");

router.get("/:surveyId/sections", isAuthenticated, sectionController.displaySectionsInSurvey);

router.get(
  "/:surveyId/sections/:sectionId/questionsPortal",
  sectionController.displayQuestionPortal
);

router.get(
  "/:surveyId/sections/add",
  isAuthenticated,
  sectionController.displaySectionCreateForm
);

router.post("/:surveyId/sections/add",isAuthenticated,sectionController.saveSurveySection);

router.get(
  "/:surveyId/sections/:sectionId/delete",
  isAuthenticated,
  sectionController.deleteSection
);

router.get(
  "/:surveyId/sections/:sectionId/edit",
  isAuthenticated,
  sectionController.displaySectionEditForm
);
router.post(
  "/:surveyId/sections/:sectionId/edit",
  isAuthenticated,
  sectionController.updateSurveySection
);

module.exports = router;
