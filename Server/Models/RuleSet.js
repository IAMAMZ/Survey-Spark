const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ruleSetSchema = new Schema({
  sourceQuestionId: String,
  dependentQuestionId: String,
  option: String, // the mapping could be through an option or
  condition: String, // or it could me some other mapping for rating and other question types
});

module.exports = mongoose.model("RuleSet", responseSchema);
