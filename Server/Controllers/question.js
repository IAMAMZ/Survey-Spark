// get the survey model
const Survey = require("../Models/Survey");

const displayQuestionCreateForm = (req, res, next) => {
  res.render("question/create", { title: "Add Question", page: "create" });
};

module.exports = {
  displayQuestionCreateForm,
};
