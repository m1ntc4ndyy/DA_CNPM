const { Event, Registration, Attendance } = require('../models');
const { Op } = require('sequelize');

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    console.log('userId', userId);
    console.log('eventId', eventId);
    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found test'
      });
    }
    
    // Check if event is open for registration
    if (event.status !== 'published') {
      return res.status(400).json({
        status: 'error',
        message: 'Event is not open for registration'
      });
    }
    
    // Check if registration deadline has passed
    const now = new Date();
    if (new Date(event.registrationDeadline) < now) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration deadline has passed'
      });
    }
    
    // Check if event has already started
    if (new Date(event.startDate) < now) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot register for an event that has already started'
      });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      where: { userId, eventId }
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already registered for this event'
      });
    }
    
    // Check if event has reached capacity
    const registrationCount = await Registration.count({
      where: { 
        eventId,
      }
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Event has reached its capacity'
      });
    }
    
    
    
    
    // Create registration
    const registration = await Registration.create({
      userId,
      eventId,
      registrationDate: now
    });
    
    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        registration
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration'
    });
  }
};

// Unregister from an event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    
    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check if user is registered
    const registration = await Registration.findOne({
      where: { userId, eventId }
    });
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'You are not registered for this event'
      });
    }
    
    // Check if event has already started
    const now = new Date();
    if (new Date(event.startDate) < now) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot unregister from an event that has already started'
      });
    }
    
    // delete registration by userId
    await Registration.destroy({
      where: { userId, eventId }
    });
  
    
    return res.status(200).json({
      status: 'success',
      message: 'You have successfully unregistered from the event'
    });
  } catch (error) {
    console.error('Unregistration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during unregistration'
    });
  }
};

// Get all registrations for a user
exports.getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const {withAttended} = req.query;
    console.log(withAttended)
    if (withAttended === 'false') {
      // Get all attended eventIds for the user
      const attendedEvents = await Attendance.findAll({
        where: { userId },
        attributes: ['eventId']
      });
      console.log('attendedEvents', attendedEvents)
      const attendedEventIds = attendedEvents.map(a => a.eventId);
      const registrations = await Registration.findAll({
        where: { userId,
          eventId: {
            [Op.notIn]: attendedEventIds.length ? attendedEventIds : [0]
          }
        },
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'point'],
          
          }
        ]
      });
      return res.status(200).json({
      status: 'success',
      data: {
        registrations
      }
      });
    } else {

      const registrations = await Registration.findAll({
        where: { userId,
          // eventId: {
          //   [Op.notIn]: attendedEventIds.length ? attendedEventIds : [0]
          // }
        },
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'point'],
          
          }
        ]
      });
      
      return res.status(200).json({
        status: 'success',
        data: {
          registrations
        }
      });
    }

  } catch (error) {
    console.error('Get registrations error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registrations'
    });
  }
};

exports.getUserRegistrationsNotAttended= async (req, res) => {
  try {
    const userId = req.user.id;

    

    // Find registrations where eventId is NOT in attendedEventIds
    const registrations = await Registration.findAll({
      where: {
        userId,
        eventId: {
          [Op.notIn]: attendedEventIds.length ? attendedEventIds : [0]
        }
      },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'title', 'point']
        }
      ]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        registrations
      }
    });
  } catch (error) {
    console.error('Get registration history error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registration history'
    });
  }
};


// Update registration status (for admin and organizer)
// exports.updateRegistrationStatus = async (req, res) => {
//   try {
//     const { registrationId } = req.params;
//     const { status } = req.body;
    
//     // Validate status
//     const validStatuses = ['approved', 'rejected', 'waitlisted'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid status. Must be one of: approved, rejected, waitlisted'
//       });
//     }
    
//     // Find registration
//     const registration = await Registration.findByPk(registrationId, {
//       include: [
//         {
//           model: Event,
//           as: 'event'
//         }
//       ]
//     });
    
//     if (!registration) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Registration not found'
//       });
//     }
    
//     // Check permissions
//     if (req.user.role !== 'admin' && !(req.user.role === 'organizer' && registration.event.organizerId === req.user.id)) {
//       return res.status(403).json({
//         status: 'error',
//         message: 'You do not have permission to update this registration'
//       });
//     }
    
//     // If approving, check capacity
//     if (status === 'approved') {
//       const approvedCount = await Registration.count({
//         where: {
//           eventId: registration.eventId,
//           status: 'approved'
//         }
//       });
      
//       if (approvedCount >= registration.event.capacity) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'Cannot approve registration: event has reached capacity'
//         });
//       }
//     }
    
//     // Update status
//     await registration.update({ status });
    
//     return res.status(200).json({
//       status: 'success',
//       message: `Registration status updated to ${status}`,
//       data: {
//         registration
//       }
//     });
//   } catch (error) {
//     console.error('Update registration status error:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while updating registration status'
//     });
//   }
// };