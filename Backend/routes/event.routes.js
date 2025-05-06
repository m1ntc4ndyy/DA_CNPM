const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', auth, eventController.getAllEvents);
router.get('/:eventId', auth, eventController.getEventById);

// Protected routes
router.post('/', auth, roleCheck('admin', 'organizer'), eventController.createEvent);
router.put('/:eventId', auth, roleCheck('admin', 'organizer'), eventController.updateEvent);
router.delete('/:eventId', auth, roleCheck('admin', 'organizer'), eventController.deleteEvent);
router.get('/:eventId/participants', auth, roleCheck('admin', 'organizer'), eventController.getEventParticipants);
router.post('/:eventId/publish', auth, roleCheck('admin', 'organizer'), eventController.publishEvent);

module.exports = router;