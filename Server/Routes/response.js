const express = require("express");

const router = express.Router();

const responseController = require("../Controllers/response");
router.get("/",responseController.index)




module.exports = router;