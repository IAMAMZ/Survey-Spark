/*
The survey collection will have 3 schemas nested.

each survey will have many questions each question belongs to one and only one survey

options and questions are one to many
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: String,
  value: String,
});

const questionSchema = new Schema({
  questionId: String,
  text: String,
  type: { type: String, enum: ["multiple-choice", "text", "rating"] },
  options: [optionSchema],
  showIf: Schema.Types.Mixed, // you can add any condtion to have the show if
});

const surveySchema = new Schema({
  title: String,
  description: String,
  questions: [questionSchema],
}, { collection: 'Surveys' });

module.exports = mongoose.model("Surveys", surveySchema);