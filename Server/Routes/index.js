const express = require("express");
const router = express.Router();

// import the controllers
const IndexController = require("../Controllers/index");

const ContactController = require("../Controllers/contact");

/* GET Default Route */
router.get("/", IndexController.DisplayHome);

/* GET Home Page */
router.get("/home", IndexController.DisplayHome);

/* GET About Page */
router.get("/about", IndexController.DisplayAbout);

/* GET Contact Page */
router.get("/contact", IndexController.DisplayContact);

/* GET Services Page */
router.get("/services", IndexController.DisplayServices);

//POST /email
router.post("/email", ContactController.sendEmail);

/* GET Get Started Page */
router.get("/get-started", IndexController.DisplayGetStarted);

/* GET Docs Page */
router.get("/docs", IndexController.DisplayDocs);

/* GET Privacy Policy Page */
router.get("/privacy-policy", IndexController.DisplayPrivacyPolicy);

/* GET Terms of Use Page Page */
router.get("/terms-of-use", IndexController.DisplayTermsOfUse);

router.use((req, res, next) => {
  IndexController.DisplayNotFound(req, res, next);
});

module.exports = router;
