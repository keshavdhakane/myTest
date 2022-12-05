const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    dateTime: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    "accountStatus": { type: String, default: '1' },
    "loginStatus": { type: String, default: '0' },
    userDetails: { type: Object },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
