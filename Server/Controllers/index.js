const User = require('../Models/user');

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
  res.render("content/home", { title: "Home", page: "home", user: req.user, currentYear: currentYear });
}

function DisplayAbout(req, res, next) {
  res.render("content/about", { title: "About Us", page: "about", user: req.user });
}

function DisplayContact(req, res, next) {
  res.render("content/contact", { title: "Contact Us", page: "contact", user: req.user });
}

function DisplayServices(req, res, next) {
  res.render("content/services", { title: "Services", page: "services", user: req.user });
}
// match every other path here
function DisplayNotFound(req, res, next) {
  res.render("content/notFound", { title: "NotFound", page: "notFound", user: req.user });
}

// function DisplayLogin(req, res, next) {
//   res.render("content/login", { title: "Login", page: "login", noHeaderFooter: true });
// }

function DisplayGetStarted(req, res, next) {
  res.render("content/get-started", { title: "Get Started", page: "get-started", noHeaderFooter: true, user: req.user });
}

function DisplayDocs(req, res, next) {
  res.render("content/docs", { title: "Docs", page: "docs", user: req.user });
}

module.exports = {
  DisplayHome: DisplayHome,
  DisplayAbout: DisplayAbout,
  DisplayContact: DisplayContact,
  DisplayServices: DisplayServices,
  DisplayNotFound: DisplayNotFound,
  DisplayGetStarted: DisplayGetStarted,
  DisplayDocs: DisplayDocs
};
