const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define questionSchema first to avoid reference issues
const optionSchema = new Schema({
  text: String,
  value: String,
  nextSection: { type: Schema.Types.ObjectId, ref: "Section" },
});

const questionSchema = new Schema({
  text: String,
  type: {
    type: String,
  },
  options: [optionSchema],
});

module.exports = mongoose.model("Question", questionSchema);
