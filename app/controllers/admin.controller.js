const db = require("../models");
const User = db.user;
const Role = db.role;
const UserAssignTask = db.UserAssignTask;
const mongoose = require('mongoose');
const UserTask = db.UserTask;
var bcrypt = require("bcryptjs");

exports.getLogs = async function (req, res) {
  var file = path.join(__dirname, '../pm2logs/out.log');
  fs.readFile(file, "utf8", function (err, data) {
      res.send(data);
  });
},
exports.deleteLogs = async function (req, res) {
  var file = path.join(__dirname, '../pm2logs/out.log');
  fs.writeFile(file, '', (err) => {
      res.send('data');
  });
},
exports.getErrLogs = async function (req, res) {
  var file = path.join(__dirname, '../pm2logs/err.log');
  fs.readFile(file, "utf8", function (err, data) {
      res.send(data);
  });
},
exports.deleteErrLogs = async function (req, res) {
  var file = path.join(__dirname, '../pm2logs/err.log');
  fs.writeFile(file, '', (err) => {
      res.send('data');
  });
},


exports.userListData = async function (req, res) {
  try {
  let findAdmin = await Role.find({ name: 'user' });
  const userdata = await User.find({ roles: mongoose.Types.ObjectId(findAdmin[0]._id) });
  if (!userdata) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User get Error!" });
  } else {
    res.send({ status: true, message: "User get !", data: userdata });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}

};

exports.oneUserDetails = async function (req, res) {
  try {
  let Userid = req.body._id
  const userdataDetails = await User.findOne({ _id: mongoose.Types.ObjectId(Userid) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    res.send({ status: true, message: "User Details get !", data: userdataDetails });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};
//checkUserPass
exports.checkUserPass = async function (req, res) {
  try {
  let Userid = req.body._id;

  const userdataDetails = await User.findOne({ _id: mongoose.Types.ObjectId(Userid) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    let Password = userdataDetails.password
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      Password
    );

    res.send({ status: true, message: "User Details get !", data: Password });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}

};

exports.disableUserAccount = async function (req, res) {
  try {
  let Userid = req.body._id;
  const userdataDetails = await User.findOne({ _id: mongoose.Types.ObjectId(Userid) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    let updateStatusData = {
      accountStatus: userdataDetails.accountStatus == 1 ? 0 : 1
    }
    let logInState = {
      loginStatus: 0
    }
    let changeStatus = await User.updateOne({ _id: mongoose.Types.ObjectId(Userid) }, { $set: updateStatusData });
    let loginSttaus = await User.updateOne({ _id: mongoose.Types.ObjectId(Userid) }, { $set: logInState });
    res.send({ status: true, message: userdataDetails.accountStatus == 1 ? 'User status is Disable' : 'User status is Enable', data: userdataDetails });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};

exports.checkUserReport = async function (req, res) {
  try {
    let getFromDate = req.body.fromdate;
    let getTodate = req.body.todate;
    console.log(req.body.userEmail)
    var a = new Date(new Date(getFromDate).setHours(00, 00, 00)).toUTCString();
    var b = new Date(new Date(getTodate).setHours(23, 59, 59)).toUTCString();
    const userdata = await UserTask.find({
      email: req.body.userEmail, dateTime: {
        $gte: a,
        $lt: b
      },
    });
    if (!userdata) {
      res.status(500).send({ message: err });
      res.send({ status: false, message: "User get Error!" });
    } else {
      res.send({ status: true, message: "User get !", data: userdata });
    }
  } catch (e) {
    console.log('getStakingHistory', e);
    res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
  }
};

exports.changeUserPassByAdmin = async function (req, res) {
  try {
  let Userid = req.body.userId;
  let newEncpassword = bcrypt.hashSync(req.body.newPassword, 8);
  const userdataDetails = await User.findOne({ _id: mongoose.Types.ObjectId(Userid) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {

    let updateStatusData = {
      password: newEncpassword
    }
    let changeStatus = await User.updateOne({ _id: mongoose.Types.ObjectId(Userid) }, { $set: updateStatusData });
    if (changeStatus) {
      res.send({ status: true, message: "Password Changed  !", data: 'ok' });
    }

  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}

};

exports.assignATaskUser = async (req, res) => {
  try {
   

  if (req.body.username != '' && req.body.email != '') {
    const userAsign = new UserAssignTask({
   email: req.body.email,
    userId: req.body.userCode,
    nameOfRecord:req.body.nameOfRecord,
    username: req.body.username,
    date:  req.body.date,
    name:  req.body.name,
    email:  req.body.email,
    noOfGivenRecord:  req.body.noOfGivenRecord,
    givenBy:  req.userId,
    Remark: req.body.Remark,
    userCode:  req.body.userCode,
    fixed:  req.body.fixed,
    regular: req.body.regular,
    correctRec: req.body.correctRec,
    incorrectRec:  req.body.correctRec
    });
  
   
    // userAsign.save(err => {
    //   if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //   }
    //   res.send({status: true, message: "Task Assigned Submit!" });
    // });
    const insData = await UserAssignTask.create(userAsign);
    if(insData){
      res.send({status: true, message: "Task Assigned Submit!" });
    }
  }
  else {
    res.send({ status: false, message: "Task Error!" });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};


exports.oneUserAllassigned = async function (req, res) {
  try {
  let Userid = req.body._id
  const userdataDetails = await UserAssignTask.find({ userId: mongoose.Types.ObjectId(Userid) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    res.send({ status: true, message: "User Details get !", data: userdataDetails });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};

exports.oneUserAssignDelete = async function (req, res) {
  try {
  let taskId = req.body._id
  const userdataDetails = await UserAssignTask.deleteOne({ _id: mongoose.Types.ObjectId(taskId) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    res.send({ status: true, message: "User Details get !", data: userdataDetails });
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};

exports.oneUserTaskCorrection = async function (req, res) {
  try {
  let taskId = req.body.taskId
  let correctData=req.body.correctRec;
  const userdataDetails = await UserAssignTask.findOne({ _id: mongoose.Types.ObjectId(taskId) });
  if (!userdataDetails) {
    res.status(500).send({ message: err });
    res.send({ status: false, message: "User Details get Error!" });
  } else {
    const userdataDetails1 = await UserAssignTask.updateOne({ _id: mongoose.Types.ObjectId(taskId) }, { $set : {"status":1 , correctRec:correctData , incorrectRec:req.body.incorrectRec} });
    if(userdataDetails1){
      res.send({ status: true, message: "User Details Update By Task !", data: userdataDetails1 });
    }else{
      res.send({ status: false, message: "User Details Error !", data: userdataDetails1 });
    }
   
  }
} catch (e) {
  console.log('getStakingHistory', e);
  res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
}
};


let queryCheckRequest = function (id) {
  const orderwith = oArray.indexOf(id.toString());
  if (orderwith == -1) {
    oArray.push(id.toString())
    setTimeout(_intervalFunc, 5000, id.toString());
    return true;
  } else {
    setTimeout(_intervalFunc, 5000, id.toString());
    return false;
  }
}
let oArray = [];
function _intervalFunc(orderwith) {
  orderwith = orderwith.toString();
  var index = oArray.indexOf(orderwith);
  if (index > -1) {
    oArray.splice(index, 1);
  }
}

exports.tryCatchad = async function (req, res) {
  try {

  } catch (e) {
    console.log('getStakingHistory', e);
    res.json({ "status": false, "message": "Something went wrong! Please try again some other time" });
  }
};
