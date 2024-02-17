// get the survey model
const Survey = require("../Models/Survey");

let surveyIndex = async (req, res, next) => {
  console.log("survey controller fired");
  // fetch all media docs
  try {
    const surveyCollection = await Survey.find();
    console.log(surveyCollection);

    res.render("index", {
      title: "Survey Index",
      page: "surveyindex",
      Survey: surveyCollection,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).send("Error fetching surveys");
  }
};

let displayCreateForm = (req, res, next) => {
  res.render("survey/create", { title: "Add New Survey" });
};

let createSurvey = async (req, res, next) => {
  await Survey.create(req.body);

  res.redirect("/survey");
};

let deleteSurvey = async (req, res, next) => {
  await Survey.findByIdAndDelete(req.params._id);

  res.redirect("/survey");
};

let displayEditForm = async (req, res, next) => {
  let survey = await Survey.findById(req.params._id);

  res.render("survey/edit", {
    title: "Update Survey",
    survey: survey,
  });
};

let updateSurvey = async (req, res, next) => {
  await Survey.findByIdAndUpdate(req.params._id, req.body);
  res.redirect("/survey");
};

module.exports = {
  surveyIndex,
};
