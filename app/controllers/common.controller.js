
const db = require("../models");
const mongoose = require('mongoose');
const UserTask = db.UserTask;
exports.gettermsAndpolicy = async (req, res) => {
let policy='TEST'
let vartems='TEST'
    res.send({ status: true, policy: policy, terms:vartems });
  };
