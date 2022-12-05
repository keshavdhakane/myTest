const mongoose = require("mongoose");
const UserTask = mongoose.model(
    "UserTask",
    new mongoose.Schema({
        "username": { type: String },
        "email": { type: String },
        "userId": { type: mongoose.Schema.Types.ObjectId, index: true },
        "taskId": { type: mongoose.Schema.Types.ObjectId},
        "taskDetails": { type: Object },
        "dateTime": { type: Date, default: Date.now },
    })
);

module.exports = UserTask;
