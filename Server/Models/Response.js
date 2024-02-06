/*

a response is to one survey by one user with multiple answers for each question.
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  surveyId: { type: Schema.Types.ObjectId, ref: "Survey" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      questionId: String,
      answer: Schema.Types.Mixed,
    },
  ],
});

module.exports = mongoose.model("Response", responseSchema);
