// const { verifySignUp } = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");
const verifyToken = require("../middleware/authMiddleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.post(
  //   "/api/auth/signup",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted,
  //   ],
  //   controller.signup
  // );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout",verifyToken, controller.signout);
};
