/*
The survey collection will have 3 schemas nested.

each survery will have many questions each question belongs to one and only one survey

options and questions are one to one
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
  dependsOn: String, // a question can depend on another question, this would be questionId
  showIf: Schema.Types.Mixed, // you can add any condtion to have the show if
});

const surveySchema = new Schema({
  title: String,
  description: String,
  questions: [questionSchema],
});

module.exports = mongoose.model("Survey", surveySchema);
