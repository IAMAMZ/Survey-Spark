/**
 * This function will display the home page
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

function DisplayHome(req, res, next) {
  res.render("content/home", { title: "Home", page: "home" });
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

module.exports = {
  DisplayHome: DisplayHome,
  DisplayAbout: DisplayAbout,
  DisplayContact: DisplayContact,
  DisplayServices: DisplayServices,
  DisplayNotFound: DisplayNotFound,
};
