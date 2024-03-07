const express = require("express");

const router = express.Router();

const takeSurveyController = require("../Controllers/takeSurvey");

router.get("/", takeSurveyController.allSurveys);
module.exports = router;
