const express = require("express");

const router = express.Router();

const sectionController = require("../Controllers/section");

router.get("/:surveyId/sections", sectionController.displaySectionsInSurvey);

router.get(
  "/:surveyId/sections/:sectionId/questionsPortal",
  sectionController.displayQuestionPortal
);

router.get(
  "/:surveyId/sections/add",
  sectionController.displaySectionCreateForm
);

router.post("/:surveyId/sections/add", sectionController.saveSurveySection);

router.get(
  "/:surveyId/sections/:sectionId/delete",
  sectionController.deleteSection
);

router.get(
  "/:surveyId/sections/:sectionId/edit",
  sectionController.displaySectionEditForm
);
router.post(
  "/:surveyId/sections/:sectionId/edit",
  sectionController.updateSurveySection
);

module.exports = router;
