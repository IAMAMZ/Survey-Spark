const express = require('express');
const router = express.Router();

const surveyController = require('../Controllers/survey');

/* GET: default route */
router.get('/', (req, res, next) => {
    surveyController.index(req, res, next);
});

/* GET: /survey/create => display blank form */
router.get('/create', (req, res, next) => {
    surveyController.displayCreateForm(req, res, next);
});

/* POST: /survey/create => process form submission for creating */
router.post('/create', (req, res, next) => {
    surveyController.createSurvey(req, res, next);
});

/* GET: /survey/delete/abc123 => delete selected Survey doc */
router.get('/delete/:_id', (req, res, next) => {
    surveyController.deleteSurvey(req, res, next);
});

/* GET: /survey/edit/abc123 => display blank form */
router.get('/edit/:_id', (req, res, next) => {
    surveyController.displayEditForm(req, res, next);
});

/* POST: /survey/edit/abc123 => process form submission for updating */
router.post('/edit/:_id', (req, res, next) => {
    surveyController.updateSurvey(req, res, next);
});

module.exports = router;