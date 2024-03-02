const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
  {
    title: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" }, // this is for future when we add authentication
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  },
  { collection: "Surveys" }
);

module.exports = mongoose.model("Survey", surveySchema);
