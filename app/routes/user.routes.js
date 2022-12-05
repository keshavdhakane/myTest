const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const admincontroller = require("../controllers/admin.controller");
const commonb =require("../controllers/common.controller");
const { verifySignUp } = require("../middlewares");
module.exports = function(app) {
  
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/user/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/user/signin", controller.login);
  app.get("/api/user/logout", controller.logout);
};
