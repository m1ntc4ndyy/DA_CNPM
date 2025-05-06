const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Student routes
router.post('/check-in/:code', auth, roleCheck('student'), attendanceController.checkIn);
router.post('/events/:eventId/check-out', auth, roleCheck('student'), attendanceController.checkOut);
router.get('/my-history', auth, roleCheck('student'), attendanceController.getUserAttendance);

// Admin/Organizer routes
router.get('/events/:eventId', auth, roleCheck('admin', 'organizer'), attendanceController.getEventAttendance);

module.exports = router;