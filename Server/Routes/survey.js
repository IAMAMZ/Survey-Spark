const express = require("express");

const router = express.Router();

const surveyController = require("../Controllers/survey");

router.get("/create", (req, res, next) => {
  surveyController.displayCreateForm(req, res, next);
});

router.post("/create", (req, res, next) => {
  surveyController.createSurvey(req, res, next);
});
router.get("/", (req, res, next) => {
  surveyController.surveyIndex(req, res, next);
});

module.exports = router;
