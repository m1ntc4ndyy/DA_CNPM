const { Event, QRCode, User, Registration, Attendance } = require('../models');

// Student checks in to an event using QR code
exports.checkIn = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;
    
    // Find QR code
    const qrCode = await QRCode.findOne({
      where: { code },
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
        message: 'Invalid QR code'
      });
    }
    
    // Check if QR code is still valid
    const now = new Date();
    if (new Date(qrCode.expiresAt) < now || !qrCode.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'QR code has expired or is inactive'
      });
    }
    
    // Check if event is still active
    const event = qrCode.event;
    if (event.status !== 'published' && event.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'This event is not active'
      });
    }
    
    // Check if user is registered for the event
    const registration = await Registration.findOne({
      where: {
        userId,
        eventId: event.id,
      }
    });
    
    if (!registration) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not registered for this event or your registration has not been approved'
      });
    }
    
    // Check if user already checked in
    const existingAttendance = await Attendance.findOne({
      where: {
        userId,
        eventId: event.id
      }
    });
    
    if (existingAttendance) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already checked in to this event'
      });
    }
    
    // Create attendance record
    const attendance = await Attendance.create({
      userId,
      eventId: event.id,
      checkInTime: now,
      qrCodeId: qrCode.id
    });
    
    return res.status(201).json({
      status: 'success',
      message: 'Check-in successful',
      data: {
        event: {
          id: event.id,
          title: event.title,
          location: event.location
        },
        checkInTime: attendance.checkInTime
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during check-in'
    });
  }
};

// Student checks out from an event (optional)
exports.checkOut = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    
    // Find attendance record
    const attendance = await Attendance.findOne({
      where: {
        userId,
        eventId
      }
    });
    
    if (!attendance) {
      return res.status(404).json({
        status: 'error',
        message: 'You have not checked in to this event'
      });
    }
    
    // Update check-out time
    await attendance.update({ checkOutTime: new Date() });
    
    return res.status(200).json({
      status: 'success',
      message: 'Check-out successful',
      data: {
        attendance
      }
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during check-out'
    });
  }
};

// Get attendance statistics for an event (for admin and organizer)
exports.getEventAttendance = async (req, res) => {
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
        message: 'You do not have permission to view attendance for this event'
      });
    }
    
    // Get attendance data
    const attendances = await Attendance.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'studentId', 'department']
        }
      ],
      order: [['checkInTime', 'DESC']]
    });
    
    // Get registration count
    const registrationCount = await Registration.count({
      where: {
        eventId,
        status: 'approved'
      }
    });
    
    return res.status(200).json({
      status: 'success',
      data: {
        attendances,
        stats: {
          totalAttendees: attendances.length,
          registeredUsers: registrationCount,
          attendanceRate: registrationCount > 0 
            ? Math.round((attendances.length / registrationCount) * 100) 
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching attendance data'
    });
  }
};

// Get user attendance history (for students)
exports.getUserAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const attendances = await Attendance.findAll({
      where: { userId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'title', 'point'],
          // include: [
          //   {
          //     model: User,
          //     as: 'organizer',
          //     attributes: ['id', 'name', 'email']
          //   }
          // ]
        }
      ],
      order: [['checkInTime', 'DESC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: {
        attendances
      }
    });
  } catch (error) {
    console.error('Get user attendance error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching attendance history'
    });
  }
};