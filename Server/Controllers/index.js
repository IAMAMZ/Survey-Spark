/**
 * This function will display the home page
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function DisplayHome(req, res, next) {
  res.render("index", { title: "Home", page: "home" });
}

function DisplayAbout(req, res, next) {
  res.render("index", { title: "About Us", page: "about" });
}

function DisplayContact(req, res, next) {
  res.render("index", { title: "Contact Us", page: "contact" });
}

function DisplayServices(req, res, next) {}

module.exports = {
  DisplayHome: DisplayHome,
  DisplayAbout: DisplayAbout,
  DisplayContact: DisplayContact,
  DisplayServices: DisplayServices,
};
