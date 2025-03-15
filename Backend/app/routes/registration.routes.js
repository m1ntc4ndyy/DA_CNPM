const { registerForEvent } = require("../controllers/registration.controller");
const verifyToken = require("../middleware/authMiddleware");


module.exports = function(app) {

    
    app.post("/register", verifyToken, registerForEvent);
  
}
