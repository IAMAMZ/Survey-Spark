const express = require("express");

const router = express.Router();

const surveyController = require("../Controllers/survey");

router.get("/", (req, res, next) => {
  console.log("routes fired for survey");
  surveyController.surveyIndex(req, res, next);
});

module.exports = router;
