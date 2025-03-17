const db = require("../models");
const Event = db.event;
const User = db.user;

exports.createEvent = async (req, res) => {
  console.log(req)
  // if (req.user.role !== "organization" || req.user.role !== "admin" ) return res.status(403).json({ message: "Unauthorized" });
  const event = await Event.create({ ...req.body, created_by: req.user.id });
  if (!event) return res.status(400).json({ message: "Event creation failed" });
  res.status(200).json(event);
};

exports.getEvents = async (req, res) => {
  // const events = await Event.findAll();
  // res.json(events);
  const events = await Event.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] }, // Hide the junction table columns
        attributes: ["id", "name", "email"], // Fetch only necessary user fields
      },
    ],
  });
  // events.map((event) => console.log(event.Users))
  return res.status(200).json(
    
    events.map((event) => ({
    id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      time: event.time,
      // image: event.image,
      status: event.status,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
      registeredUsers: event.Users.map((user) => user.id), // Extract user IDs
      // attendedUsers: event.Users.filter((user) => user.registrations.attended).map(
      //   (user) => user.id
      // ),
    }))
  )
  // return res.json(events);
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.status(200).json(event);
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await event.destroy();
  res.status(200).json({ message: "Event deleted successfully" });

}

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await event.update(req.body);
  res.status(200).json(event);
}

