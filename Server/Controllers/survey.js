// get the survey model
const Survey = require("../Models/Survey");

let surveyIndex = async (req, res, next) => {
  try {
    const surveyCollection = await Survey.find();
    res.render("survey/surveyindex", {
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
  res.render("survey/surveyCreate", {
    title: "Survey Index",
    page: "surveyCreate",
  });
};

let createSurvey = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const newSurvey = new Survey({
      title,
      description,
    });
    await newSurvey.save();
    res.redirect("/survey"); // Adjust the redirect as needed
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
    survey: survey,
  });
};

let updateSurvey = async (req, res, next) => {
  await Survey.findByIdAndUpdate(req.params._id, req.body);
  res.redirect("/survey");
};

module.exports = {
  surveyIndex,
  displayCreateForm,
  createSurvey,
  deleteSurvey,
};
