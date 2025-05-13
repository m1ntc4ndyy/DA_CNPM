const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Admin/Organizer routes
router.post('/:eventId/generate', auth, roleCheck('admin', 'organizer'), qrController.generateEventQR);
router.get('/:eventId', auth, roleCheck('admin', 'organizer'), qrController.getEventQRCodes);
router.put('/:qrCodeId/deactivate', auth, roleCheck('admin', 'organizer'), qrController.deactivateQRCode);

module.exports = router;
