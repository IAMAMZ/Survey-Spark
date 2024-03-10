
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  surveyId: { type: Schema.Types.ObjectId, ref: "Survey" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  isSubmitted: Boolean,
  answers: [
    {
      questionId: String,
      answer: Schema.Types.Mixed,
    },
  ],
});

module.exports = mongoose.model("Response", responseSchema);
