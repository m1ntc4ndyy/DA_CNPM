const {createEvent,getEvents} = require("../controllers/event.controller");
const roleMiddleware = require("../middleware/roleMiddleware");
const verifyToken = require("../middleware/authMiddleware");
module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    app.post(
        "/api/event",
        [verifyToken, roleMiddleware(["organization", "admin"])],
        createEvent
    );
    
    app.get("/api/event", [verifyToken], getEvents);
  
}
