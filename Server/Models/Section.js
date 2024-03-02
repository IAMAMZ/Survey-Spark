const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  order: Number,
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  nextSection: { type: Schema.Types.ObjectId, ref: "Section" }, // fill that if one of the options has next section, otherwise display by order
});

module.exports = mongoose.model("Section", sectionSchema);
