// get the survey model
const Survey = require("../Models/Survey");

let surveyIndex = async (req, res, next) => {
  console.log("survey controller fired");
  // fetch all media docs
  try {
    const newSurvey = new Survey({
      title: "Customer Feedback",
      description: "Tell us about your experience",
      questions: [
        {
          questionId: "q1",
          text: "How satisfied are you with our service?",
          type: "rating",
          options: [],
          showIf: null,
        },
        {
          questionId: "q2",
          text: "Would you recommend us to a friend?",
          type: "multiple-choice",
          options: [
            { text: "Yes", value: "yes" },
            { text: "No", value: "no" },
          ],
          showIf: null,
        },
      ],
    });
    await newSurvey.save();
    const surveyCollection = await Survey.find(); // Use await to wait for the promise to resolve
    console.log(surveyCollection); // This should now log the actual documents found

    res.render("index", {
      title: "Survey Index",
      page: "surveyindex",
      Survey: surveyCollection, // Make sure this matches the variable name expected in your template
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).send("Error fetching surveys");
  }
};

module.exports = {
  surveyIndex,
};
