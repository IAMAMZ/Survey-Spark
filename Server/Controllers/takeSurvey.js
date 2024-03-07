const Survey = require("../Models/Survey");
const Section = require("../Models/Section");

const allSurveys = async (req, res, next) => {
  const surveys = await Survey.find();

  res.render("takeSurvey/index", { surveys: surveys });
};

const takeSurvey = async (req, res, next) => {
  const { surveyId } = req.params;

  try {
    // Find the survey by ID and populate the sections
    const survey = await Survey.findById(surveyId).populate("sections").exec();

    if (!survey) {
      res.status(404).send("Survey not found");
      return;
    }

    // If sections are not populated with full details this will fail
    let sectionWithOrderOne = survey.sections.find(
      (section) => section.order === 1
    );

    if (!sectionWithOrderOne) {
      // todo : handle when not found maybe redirect to another not found page
      redirect("/");
      return;
    }

    // Extract the ID of the section with order 1
    let sectionId = sectionWithOrderOne._id;

    // Redirect to the specific section of the survey
    res.redirect(`/takeSurvey/${surveyId}/sections/${sectionId}`);
  } catch (error) {
    console.error("Error fetching survey:", error);
    next(error); // Pass the error to next
  }
};

const displaySection = async (req, res, next) => {
  const { surveyId, sectionId } = req.params;

  // get all the questions in the section and pass it along
  const section = await Section.findById(sectionId)
    .populate("questions")
    .exec();

  res.render("takeSurvey/sectionQuestionRenderer", {
    section: section,
  });
};

const handleResponse = async (req, res, next) => {
  console.log(req.body);
};

module.exports = {
  allSurveys,
  takeSurvey,
  displaySection,
  handleResponse,
};
