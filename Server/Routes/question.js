const express = require("express");

const router = express.Router();

const questionController = require("../Controllers/question");

router.get("/:surveyId/questions/add", (req, res, next) => {
  questionController.displayQuestionCreateForm(req, res, next);
});

module.exports = router;
