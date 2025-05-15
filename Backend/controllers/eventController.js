const { format } = require('sequelize/lib/utils');
const { Event, User, Registration, Attendance, QRCode } = require('../models');
const { Op } = require('sequelize');

const formattedDate = (isoDate) => {
  const date = new Date(isoDate);
  const formatted = `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')
  }/${date.getFullYear()}`;
  return formatted;
}
function formattedTime(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12; // convert 0 → 12 for 12 AM
  return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      startTime,
      registrationDeadline,
      capacity,
      point,
      category,
      isPublic
    } = req.body;
    
    // Check if user is admin or organizer
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to create events'
      });
    }
    
    // Create the event
    const event = await Event.create({
      title,
      description,
      location,
      startDate,
      startTime,
      registrationDeadline,
      capacity,
      category,
      point,
      isPublic: isPublic !== undefined ? isPublic : true,
      organizerId: req.user.id,
      status: 'draft'
    });
    
    return res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: {
        event
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the event'
    });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search,
      category,
      startDate,
      status
    } = req.query;
    console.log('Query:', req.query.status);
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereConditions = {};
    
    // Search filter
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Category filter
    if (category) {
      whereConditions.category = category;
    }
    
    // Date range filter
    if (startDate) {
      whereConditions.startDate = { [Op.gte]: new Date(startDate) };
    }
      
    // Status filter
    if (status) {
      whereConditions.status = status;
    }
    
    // For students and general public, only show published events
    if (req.user && req.user.role === 'student' || !req.user) {
      whereConditions.status = 'published';
      whereConditions.isPublic = true;
    }
    
    // For organizers, only show their own events
    if (req.user && req.user.role === 'organizer') {
      whereConditions.organizerId = req.user.id;
    }
    
    // Get events with pagination
    const { count, rows: events } = await Event.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'registeredUsers',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDate', 'ASC']]
    });

    
    return res.status(200).json({
      status: 'success',
      data: {
        events : events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,

            startDate: formattedDate(event.startDate),
            startTime: formattedTime(event.startTime),
            
            registrationDeadline: event.registrationDeadline,
            capacity: event.capacity,
            category: event.category,
            image: event.image,
            status: event.status,
            isPublic: event.isPublic,
            organizer: event.organizer,
            registeredUsers: event.registeredUsers.map((user) => user.id),
            registrationCount: event.registeredUsers.length
          }
        }),
        pagination: {
          totalEvents: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching events'
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email','phone']
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check permissions for non-public events
    if (!event.isPublic) {
      if (!req.user) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to view this event'
        });
      }
      
      if (req.user.role === 'student') {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to view this event'
        });
      }
      
      if (req.user.role === 'organizer' && event.organizerId !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to view this event'
        });
      }
    }
    
    // If user is admin or the organizer of the event, include registration count

    const registrationCount = await Registration.count({
      where: { eventId }
    });
    
    const attendanceCount = await Attendance.count({
      where: { eventId }
    });
    
    event.dataValues.registrationCount = registrationCount;
    event.dataValues.attendanceCount = attendanceCount;
    
    
    // Check if the authenticated user is registered for this event
    if (req.user &&( req.user.role === 'student' || req.user.role === 'admin')) {
      const registration = await Registration.findOne({
        where: {
          userId: req.user.id,
          eventId
        }
      });
      event.dataValues.isRegistered = !!registration;
      if (registration) {
        event.dataValues.registrationStatus = registration.status;
      }
      
      const attendance = await Attendance.findOne({
        where: {
          userId: req.user.id,
          eventId
        }
      });
      
      event.dataValues.hasAttended = !!attendance;
    }
    event.dataValues.unFormattedStartDate = event.startDate;
    event.dataValues.unFormattedStartTime = event.startTime;
    return res.status(200).json({
      status: 'success',
      data: {
        event: {
          ...event.dataValues,
          startDate: event.startDate,
          startTime: event.startTime,
          registrationDeadline: event.registrationDeadline,
        },
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the event'
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;
    console.log('Update Data:', updateData);
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
        message: 'You do not have permission to update this event'
      });
    }
    
    // Don't allow changing the organizer if not admin
    if (req.user.role !== 'admin' && updateData.organizerId) {
      delete updateData.organizerId;
    }
    
    // Update the event
    await event.update(updateData);
    
    return res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: {
        event
      }
    });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the event'
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
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
        message: 'You do not have permission to delete this event'
      });
    }
    
    // Check if there are registrations
    const registrationCount = await Registration.count({
      where: { eventId }
    });
    
    if (registrationCount > 0 && req.user.role !== 'admin') {
      // For non-admins, don't allow deletion if there are registrations
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete event with active registrations. Consider canceling the event instead.'
      });
    }
    
    // Delete the event (and related registrations/attendances for admin)
    if (req.user.role === 'admin') {
      // Hard delete for admin
      await event.destroy();
    } else {
      // Soft delete for organizer (just mark as canceled)
      await event.update({ status: 'canceled' });
    }
    
    return res.status(200).json({
      status: 'success',
      message: req.user.role === 'admin' ? 'Event deleted successfully' : 'Event canceled successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the event'
    });
  }
};

exports.getEventParticipants = async (req, res) => {
    try {
      const { eventId } = req.params;
      const { status } = req.query;
      
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
          message: 'You do not have permission to view participants'
        });
      }
      
      // Build query conditions
      const whereConditions = { eventId };
      if (status) {
        whereConditions.status = status;
      }
      
      // Get registrations with user details
      const registrations = await Registration.findAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'studentId', 'department', 'phone']
          }
        ]
      });
      
      // Get attendance information
      const attendances = await Attendance.findAll({
        where: { eventId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'studentId']
          }
        ]
      });
      
      return res.status(200).json({
        status: 'success',
        data: {
          registrations,
          attendances,
          stats: {
            totalRegistrations: registrations.length,
            totalAttendees: attendances.length,
            attendanceRate: registrations.length > 0 
              ? Math.round((attendances.length / registrations.length) * 100) 
              : 0
          }
        }
      });
    } catch (error) {
      console.error('Get participants error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching participants'
      });
    }
  };
  
  // Publish event (change status from draft to published)
  exports.publishEvent = async (req, res) => {
    try {
      const { eventId } = req.params;
      
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
          message: 'You do not have permission to publish this event'
        });
      }
      
      if (event.status !== 'draft') {
        return res.status(400).json({
          status: 'error',
          message: 'Only draft events can be published'
        });
      }
      
      // Validate event details before publishing
      const now = new Date();
      if (new Date(event.startDate) < now) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot publish an event with a start date in the past'
        });
      }
      
      if (new Date(event.registrationDeadline) < now) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot publish an event with a registration deadline in the past'
        });
      }
      
      // Update the event status
      await event.update({ status: 'published' });
      
      return res.status(200).json({
        status: 'success',
        message: 'Event published successfully',
        data: {
          event
        }
      });
    } catch (error) {
      console.error('Publish event error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while publishing the event'
      });
    }
};