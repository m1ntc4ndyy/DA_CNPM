const { Event, QRCode, User, Registration } = require('../models');
const qrGenerator = require('../utils/qrGenerator');

// Generate QR code for an event
exports.generateEventQR = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { expiresIn = 24 } = req.body;  // Hours until QR expires
    
    // Find event
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && !(req.user.role === 'organizer' && event.organizerId === req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to generate QR codes for this event'
      });
    }
    
    // Check if event is published
    if (event.status !== 'published' && event.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot generate QR code for unpublished or canceled events'
      });
    }
    
    // Generate unique code
    const code = qrGenerator.generateUniqueCode();
    
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    
    // Save to database
    const qrCode = await QRCode.create({
      eventId,
      code,
      expiresAt,
      isActive: true,
      createdBy: req.user.id
    });
    
    // Generate QR code image
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const qrData = `${baseUrl}/api/attendances/check-in/${code}`;
    const qrDataURL = await qrGenerator.generateQRCodeDataURL(qrData);
    
    return res.status(201).json({
      status: 'success',
      message: 'QR code generated successfully',
      data: {
        qrCode: {
          id: qrCode.id,
          code: qrCode.code,
          expiresAt: qrCode.expiresAt
        },
        qrDataURL,
        checkinUrl: qrData
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while generating QR code'
    });
  }
};

// Get QR codes for an event
exports.getEventQRCodes = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Find event
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && !(req.user.role === 'organizer' && event.organizerId === req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view QR codes for this event'
      });
    }
    
    // Get QR codes
    const qrCodes = await QRCode.findAll({
      where: { eventId },
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: {
        qrCodes
      }
    });
  } catch (error) {
    console.error('Get QR codes error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching QR codes'
    });
  }
};

// Deactivate a QR code
exports.deactivateQRCode = async (req, res) => {
  try {
    const { qrCodeId } = req.params;
    
    // Find QR code
    const qrCode = await QRCode.findByPk(qrCodeId, {
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });
    
    if (!qrCode) {
      return res.status(404).json({
        status: 'error',
        message: 'QR code not found'
      });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && !(req.user.role === 'organizer' && qrCode.event.organizerId === req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to deactivate this QR code'
      });
    }
    
    // Deactivate QR code
    await qrCode.update({ isActive: false });
    
    return res.status(200).json({
      status: 'success',
      message: 'QR code deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate QR code error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deactivating QR code'
    });
  }
};