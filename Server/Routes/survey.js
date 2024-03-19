const express = require("express");

const router = express.Router();

let isAuthenticated = require('../Config/authCheck');

const surveyController = require("../Controllers/survey");

router.get("/create", isAuthenticated, (req, res, next) => {
  surveyController.displayCreateForm(req, res, next);
});

router.post("/create", isAuthenticated, (req, res, next) => {
  surveyController.createSurvey(req, res, next);
});

router.get("/delete/:_id", isAuthenticated, (req, res, next) => {
  surveyController.deleteSurvey(req, res, next);
});
router.get("/edit/:_id", isAuthenticated, (req, res, next) => {
  surveyController.displayEditForm(req, res, next);
});
router.post("/edit/:_id", isAuthenticated, (req, res, next) => {
  surveyController.updateSurvey(req, res, next);
});
router.get("/details/:_id", isAuthenticated, (req, res, next) => {
  surveyController.surveyDetails(req, res, next);
});
router.get("/", isAuthenticated, (req, res, next) => {
  surveyController.surveyIndex(req, res, next);
});

module.exports = router;
