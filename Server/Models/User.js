const mongoose = require("mongoose");
const plm = require('passport-local-mongoose'); 
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  refreshToken: String, // just adding this in case we use JWT
  roles: {
    type: Object,
    default: {
      User: 2001, // code 2001 is the default user role, we can add more roles here
    },
  },
  email: String,
  responses: [{ type: Schema.Types.ObjectId, ref: "Response" }], // to query responses per user easily (otherwise you have to query response collection)
});

userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);