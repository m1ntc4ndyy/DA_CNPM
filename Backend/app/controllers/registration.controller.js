const db = require("../models");
const Registration = db.registration;

exports.registerForEvent = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Unauthorized" });

  const registration = await Registration.create({ student_id: req.user.id, event_id: req.body.event_id });
  if (!registration) return res.status(400).json({ message: "Registration failed" });
  res.status(200).json(registration);
};
