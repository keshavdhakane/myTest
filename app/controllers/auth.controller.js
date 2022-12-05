const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
exports.signup = (req, res) => {
  let checkReq = taskQueryCheckRequest(req.body.username);
  if (!checkReq) {
    return res.send({ status: false, message: "Try after 5 sec!" });;
  }
  User.findOne({
    username: req.body.username
  })
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    userDetails: req.body.userArray
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            //res.send({ status: false, message: "Try after 5 sec!" });
            res.send({ status: true ,message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ status: true , message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.login = async (req, res) => {
  let checkReq = taskQueryCheckRequest(req.body.username);
  if (!checkReq) {
    return res.send({ status: false, message: "Try after 10 sec!" });;
  }
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      if (user.accountStatus == 0) {
        return res.status(401).send({
          accessToken: null,
          message: "Your Account is Disabled!"
        });
      }
      if (user.loginStatus == 1) {
        return res.status(401).send({
          accessToken: null,
          message: "Your Already in LogIn!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      let updateStatusData = {
        loginStatus: "1"
      }
      let logintime = {
        lastLogin: Date.now 
      }
      console.log( mongoose.Types.ObjectId(user.id));

      let changeStatus =   User.updateOne( {_id:  mongoose.Types.ObjectId(user.id)} , { $set: updateStatusData });
      let changeStatus1 =   User.updateOne( {_id: mongoose.Types.ObjectId(user.id)}, { $set: logintime });
      if(changeStatus){
        console.log('ok')
        }else{
          console.log('error')
        }
      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({ 
        status: true,
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

let taskQueryCheckRequest = function (id) {
  const orderwith = taskoArray.indexOf(id.toString());
  if (orderwith == -1) {
    taskoArray.push(id.toString())
    setTimeout(_intervalFunc, 20000, id.toString());
    return true;
  } else {
    setTimeout(_intervalFunc, 20000, id.toString());
    return false;
  }
}
let taskoArray = [];
function _intervalFunc(orderwith) {
  orderwith = orderwith.toString();
  var index = taskoArray.indexOf(orderwith);
  if (index > -1) {
    taskoArray.splice(index, 1);
  }
}