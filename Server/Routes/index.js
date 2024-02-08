const express = require("express");
const router = express.Router();

// import the controllers
const IndexController = require("../Controllers/index");

const ContactController = require("../Controllers/contact");

/* GET Default Route */
router.get("/", (req, res, next) => {
  IndexController.DisplayHome(req, res, next);
});

/* GET Home Page */
router.get("/home", (req, res, next) => {
  IndexController.DisplayHome(req, res, next);
});

/* GET About Page */
router.get("/about", (req, res, next) => {
  IndexController.DisplayAbout(req, res, next);
});

/* GET Contact Page */
router.get("/contact", (req, res, next) => {
  IndexController.DisplayContact(req, res, next);
});

/* GET Services Page */
router.get("/services", (req, res, next) => {
  IndexController.DisplayServices(req, res, next);
});

//POST /email
router.post("/email", (req, res, next) => {
  ContactController.sendEmail(req, res, next);
});
router.use((req, res, next) => {
  IndexController.DisplayNotFound(req, res, next);
});

module.exports = router;
