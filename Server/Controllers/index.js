const User = require('../Models/User');

/**
 * This function will display the home page
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

function DisplayHome(req, res, next) {
  const currentYear = new Date().getFullYear();
  res.render("content/home", { title: "Home", page: "home", User: req.User, currentYear: currentYear });
}

function DisplayAbout(req, res, next) {
  res.render("content/about", { title: "About Us", page: "about", User: req.User });
}

function DisplayContact(req, res, next) {
  res.render("content/contact", { title: "Contact Us", page: "contact", User: req.User });
}

function DisplayServices(req, res, next) {
  res.render("content/services", { title: "Services", page: "services", User: req.User });
}
// match every other path here
function DisplayNotFound(req, res, next) {
  res.render("content/notFound", { title: "NotFound", page: "notFound" });
}

function DisplayGetStarted(req, res, next) {
  res.render("content/get-started", { title: "Get Started", page: "get-started", noHeaderFooter: true, User: req.User });
}

function DisplayDocs(req, res, next) {
  res.render("content/docs", { title: "Docs", page: "docs", User: req.User });
}

function DisplayPrivacyPolicy(req, res, next) {
  res.render("content/privacy-policy", { title: "Privacy Policy", page: "privacy-policy", User: req.User });
}

module.exports = {
  DisplayHome: DisplayHome,
  DisplayAbout: DisplayAbout,
  DisplayContact: DisplayContact,
  DisplayServices: DisplayServices,
  DisplayNotFound: DisplayNotFound,
  DisplayGetStarted: DisplayGetStarted,
  DisplayDocs: DisplayDocs,
  DisplayPrivacyPolicy: DisplayPrivacyPolicy
};
