const mongoose = require("mongoose");
const UserAssignTask = mongoose.model(
    "UserAssignTask",
    new mongoose.Schema({
        "date": { type: String },
        "name": { type: String },
        "email": { type: String  },
        "username": { type: String },
        "givenBy": { type: mongoose.Schema.Types.ObjectId},
        "nameOfRecord": { type: String , default:'' },
        "Remark":  { type: String },
        "userId": { type: mongoose.Schema.Types.ObjectId},
        "status": { type: String ,default: '0'}, //1-Close
        "fixed":{ type: String ,default: '0'},
        "regular": { type: String ,default: '0'},
        "noOfGivenRecord":  { type: Number , default: 0 },
        "noOfSubmited":  { type: Number , default: 0 },
        "correctRec":  { type: Number, default:0 },
        "incorrectRec":  { type: Number , default:0 },
        "dateofCorrection": { type: Date, default: Date.now },
        "dateTime": { type: Date, default: Date.now },
    })
);

module.exports = UserAssignTask;