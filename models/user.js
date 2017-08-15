const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  displayName: String,
  facebookId: String,
  twitterId: String,
  githubId: String,
  twitterImages: [],
  githubImages: [],
  images: []
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
