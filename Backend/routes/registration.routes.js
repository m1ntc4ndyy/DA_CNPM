const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Student routes
router.post('/:eventId/register', auth, roleCheck('student','admin'), registrationController.registerForEvent);
router.delete('/:eventId/unregister', auth, roleCheck('student','admin'), registrationController.unregisterFromEvent);
router.get('/my-registrations', auth, roleCheck('student'), registrationController.getUserRegistrations);

// Admin/Organizer routes
// router.put('/:registrationId/status', auth, roleCheck('admin', 'organizer'), registrationController.updateRegistrationStatus);

module.exports = router;