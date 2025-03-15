const db = require("../models");
const Registration = db.registration;

exports.registerForEvent = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Unauthorized" });

  const registration = await Registration.create({ student_id: req.user.id, event_id: req.body.event_id });
  res.json(registration);
};
