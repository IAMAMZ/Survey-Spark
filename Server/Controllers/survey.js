let Survey = require('../Models/Survey');

let index = async (req, res, next) => {
    let survey = await Survey.find();

    res.render('survey/index', { 
        title: 'Survey Library',
        survey: survey
    });
};

let displayCreateForm = (req, res, next) => {
    res.render('survey/create', { title: 'Add New Survey' });
};

let createSurvey = async (req, res, next) => {
    await Survey.create(req.body);

    res.redirect('/survey');
};

let deleteSurvey = async (req, res, next) => {
    await Survey.findByIdAndDelete(req.params._id);

    res.redirect('/survey');
};

let displayEditForm = async (req, res, next) => {
    let survey = await Survey.findById(req.params._id);

    res.render('survey/edit', { 
        title: 'Update Survey',
        survey: survey
    });
};

let updateSurvey = async (req, res, next) => {
    await Survey.findByIdAndUpdate(req.params._id, req.body);
    res.redirect('/survey');
};

module.exports = {
    index, displayCreateForm, createSurvey, deleteSurvey, displayEditForm,
    updateSurvey
};