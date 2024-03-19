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
  res.render("content/home", { title: "Home", page: "home", currentYear: currentYear });
}

function DisplayAbout(req, res, next) {
  res.render("content/about", { title: "About Us", page: "about" });
}

function DisplayContact(req, res, next) {
  res.render("content/contact", { title: "Contact Us", page: "contact" });
}

function DisplayServices(req, res, next) {
  res.render("content/services", { title: "Services", page: "services" });
}
// match every other path here
function DisplayNotFound(req, res, next) {
  res.render("content/notFound", { title: "NotFound", page: "notFound" });
}

// function DisplayLogin(req, res, next) {
//   res.render("content/login", { title: "Login", page: "login", noHeaderFooter: true });
// }

function DisplayGetStarted(req, res, next) {
  res.render("content/get-started", { title: "Get Started", page: "get-started", noHeaderFooter: true });
}

function DisplayDocs(req, res, next) {
  res.render("content/docs", { title: "Docs", page: "docs" });
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
