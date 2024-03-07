const allSurveys = async (req, res, next) => {
  res.render("takeSurvey/index");
};

module.exports = {
  allSurveys,
};
