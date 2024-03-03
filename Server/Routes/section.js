const express = require("express");

const router = express.Router();

const sectionController = require("../Controllers/section");

router.get("/:surveyId/sections", sectionController.displaySectionsInSurvey);

router.get(
  "/:surveyId/sections/add",
  sectionController.displaySectionCreateForm
);

router.post("/:surveyId/sections/add", sectionController.saveSurveyQuestion);

router.get(
  "/:surveyId/sections/:sectionId/delete",
  sectionController.deleteSection
);

router.get(
  "/:surveyId/section/:sectionId/edit",
  sectionController.displaySectionEditForm
);
router.post(
  "/:surveyId/questions/:questionId/edit",
  sectionController.updateSurveySection
);

module.exports = router;
