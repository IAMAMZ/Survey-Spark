const express = require("express");

const router = express.Router();

let isAuthenticated = require('../Config/authCheck');

const responseController = require("../Controllers/response");
router.get("/",isAuthenticated,responseController.index)




module.exports = router;