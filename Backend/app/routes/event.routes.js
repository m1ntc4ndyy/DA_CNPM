const {createEvent,getEvents, deleteEvent, updateEvent} = require("../controllers/event.controller");
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
    //get all events  
    app.get("/api/event", [verifyToken], getEvents);

    //create an event
    app.post(
        "/api/event",
        [verifyToken, roleMiddleware(["organization", "admin"])],
        createEvent
    );
    
    //delete an event
    app.delete("/api/event/:id", 
      [verifyToken, roleMiddleware(["organization", "admin"])], deleteEvent);

    //update an event
    app.put("/api/event/:id", 
      [verifyToken, roleMiddleware(["organization", "admin"])], updateEvent);
}
