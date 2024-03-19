// get the survey model
const Survey = require("../Models/Survey");
const User = require('../Models/user');

let surveyIndex = async (req, res, next) => {
  try {
    const surveyCollection = await Survey.find();
    res.render("survey/surveyindex", {
      title: "Survey Index",
      page: "surveyindex",
      user: req.user,
      Survey: surveyCollection,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).send("Error fetching surveys");
  }
};

let displayCreateForm = (req, res, next) => {
  res.render("survey/surveyCreate", {
    title: "Survey Index",
    user: req.user,
    page: "surveyCreate",
  });
};

let createSurvey = async (req, res, next) => {
  console.log("create run");
  try {
    const { title, description } = req.body;
    const newSurvey = new Survey({
      title,
      description,
    });
    await newSurvey.save();
    res.redirect("/survey");
  } catch (error) {
    console.error("Failed to create survey:", error);
    res.status(500).send("Error creating the survey");
  }
};

let deleteSurvey = async (req, res, next) => {
  await Survey.findByIdAndDelete(req.params._id);

  res.redirect("/survey");
};

let displayEditForm = async (req, res, next) => {
  let survey = await Survey.findById(req.params._id);

  res.render("survey/edit", {
    title: "Update Survey",
    user: req.user,
    survey: survey,
  });
};

let updateSurvey = async (req, res, next) => {
  console.log(req.params._id);
  await Survey.findByIdAndUpdate(req.params._id, req.body);
  res.redirect("/survey");
};

let surveyDetails = async (req, res, next) => {
  console.log(req.params._id);
  let survey = await Survey.findById(req.params._id);
  res.render("survey/details", {
    title: `${survey.title} Details`,
    user: req.user,
    survey: survey,
  });
};

module.exports = {
  surveyIndex,
  displayCreateForm,
  createSurvey,
  deleteSurvey,
  displayEditForm,
  updateSurvey,
  surveyDetails,
};
