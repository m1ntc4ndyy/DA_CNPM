const verifyToken = require("../middleware/authMiddleware");

const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/v1/users",
    [verifyToken],
    controller.listUser
  );

  app.get(
    "/api/v1/users/:id",
    [],
    controller.getUser
  );


  app.delete(
    "/api/v1/users/:id",
    controller.deleteUser
  );

  app.put(
    "/api/v1/users/:id",
    controller.updateUser
  )
  // METHOD: GET, POST, PUT, DELETE, PATCH
};
