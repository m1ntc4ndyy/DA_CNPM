// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Clock, MapPin, Users } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Event } from '../types';

// const EventFeed: React.FC = () => {
//   const { currentUser, isAdmin, isStudent } = useAuth();
  
//   // Sample event data
//   const [events, setEvents] = useState<Event[]>([
//     {
//       id: 1,
//       title: 'Web Development Workshop',
//       description: 'Learn the fundamentals of modern web development with React and Tailwind CSS. Suitable for beginners and intermediate developers.',
//       location: 'Tech Hub, Downtown',
//       date: '2025-03-25',
//       time: '10:00 AM - 2:00 PM',
//       image: '/api/placeholder/600/400',
//       status: 'ongoing',
//       attendees: 24,
//       maxAttendees: 40,
//       registeredUsers: []
//     },
//     {
//       id: 2,
//       title: 'Data Science Meetup',
//       description: 'Join us for an evening of insightful talks and networking focused on the latest trends in data science and machine learning.',
//       location: 'Data Center, Midtown',
//       date: '2025-04-10',
//       time: '6:00 PM - 9:00 PM',
//       image: '/api/placeholder/600/400',
//       status: 'pending',
//       attendees: 45,
//       maxAttendees: 60,
//       registeredUsers: [2]
//     },
//     {
//       id: 3,
//       title: 'UI/UX Design Conference',
//       description: 'A full-day conference featuring top designers discussing trends and techniques in modern user interface and experience design.',
//       location: 'Design Studio, Westside',
//       date: '2025-05-15',
//       time: '9:00 AM - 5:00 PM',
//       status: 'ongoing',
//       attendees: 32,
//       maxAttendees: 50,
//       registeredUsers: []
//     }
//   ]);

//   // Toggle application status
//   const toggleApply = (id: number): void => {
//     if (!currentUser) return;
    
//     setEvents(
//       events.map(event => {
//         if (event.id === id) {
//           const isApplied = event.registeredUsers.includes(currentUser.id);
//           const newRegisteredUsers = isApplied 
//             ? event.registeredUsers.filter(userId => userId !== currentUser.id)
//             : [...event.registeredUsers, currentUser.id];
          
//           return {
//             ...event,
//             registeredUsers: newRegisteredUsers,
//             attendees: isApplied ? event.attendees - 1 : event.attendees + 1
//           };
//         }
//         return event;
//       })
//     );
//   };

//   // Function to determine status badge color
//   const getStatusColor = (status: Event['status']): string => {
//     switch(status) {
//       case 'ongoing': return 'bg-green-100 text-green-800';
//       case 'ended': return 'bg-gray-100 text-gray-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-blue-100 text-blue-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Check if the current user has registered for an event
//   const isRegistered = (event: Event): boolean => {
//     if (!currentUser) return false;
//     return event.registeredUsers.includes(currentUser.id);
//   };

//   // Filter events based on status and user role
//   const filteredEvents = events.filter(event => {
//     // Admins can see all events
//     if (isAdmin()) return true;
    
//     // Students can only see accepted and ongoing events
//     if (isStudent()) {
//       return ['accepted', 'ongoing'].includes(event.status);
//     }
    
//     return false;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-bold mb-6">Event Feed</h1>
        
//         {filteredEvents.length === 0 && (
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <p className="text-gray-500">No events available.</p>
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 gap-6">
//           {filteredEvents.map(event => (
//             <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="md:flex">
//                 <Link to={`/events/${event.id}`} className="block">
//                 {event.image && (
//                   <div className="md:flex-shrink-0">
//                     <img className="h-48 w-full object-cover md:w-48" src={event.image} alt={event.title} />
//                   </div>
//                 )}
//                 </Link>
//                 <div className="p-6 w-full">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
//                         {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
//                       </span>
//                       <Link to={`/events/${event.id}`} className="block">
//                         <h2 className="mt-2 text-xl font-semibold text-gray-900">{event.title}</h2>
//                       </Link>
//                     </div>
//                     <button
//                       onClick={() => toggleApply(event.id)}
//                       className={`px-4 py-2 rounded-md text-sm font-medium ${
//                         isRegistered(event)
//                           ? 'bg-red-50 text-red-700 hover:bg-red-100'
//                           : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
//                       }`}
//                     >
//                       {isRegistered(event) ? 'Cancel Registration' : 'Register Now'}
//                     </button>
//                   </div>
                  
//                   <p className="mt-3 text-base text-gray-500">{event.description}</p>
                  
//                   <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <Calendar className="mr-1 h-4 w-4" />
//                       {event.date}
//                     </div>
//                     {event.time && (
//                       <div className="flex items-center">
//                         <Clock className="mr-1 h-4 w-4" />
//                         {event.time}
//                       </div>
//                     )}
//                     {event.location && (
//                       <div className="flex items-center">
//                         <MapPin className="mr-1 h-4 w-4" />
//                         {event.location}
//                       </div>
//                     )}
//                     <div className="flex items-center">
//                       <Users className="mr-1 h-4 w-4" />
//                       {event.attendees}/{event.maxAttendees} attendees
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EventFeed;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';
import eventsData from '../assets/TempEvents.json';
const EventFeed: React.FC = () => {
  const { currentUser, isAdmin, isStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const [events, setEvents] = useState<Event[]>(eventsData as Event[]);
  // useEffect(() => {
  //   setEvents(eventsData); // Load the events from JSON file
  // }, []); 
  
  const toggleApply = (id: number): void => {
    if (!currentUser) return;
    setEvents(
      events.map(event => {
        if (event.id === id) {
          const isApplied = event.registeredUsers.includes(currentUser.id);
          const newRegisteredUsers = isApplied 
            ? event.registeredUsers.filter(userId => userId !== currentUser.id)
            : [...event.registeredUsers, currentUser.id];
          
          return {
            ...event,
            registeredUsers: newRegisteredUsers,
            attendees: isApplied ? event.attendees - 1 : event.attendees + 1
          };
        }
        return event;
      })
    );
  };

  const getStatusColor = (status: Event['status']): string => {
    switch(status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isRegistered = (event: Event): boolean => {
    if (!currentUser) return false;
    return event.registeredUsers.includes(currentUser.id);
  };

  const filteredEvents = events.filter(event => {
    if (isAdmin()) return true;
    if (isStudent()) {
      return ['accepted', 'ongoing'].includes(event.status);
    }
    return false;
  }).filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) 
    // ||
    // event.description.toLowerCase().includes(searchQuery.toLowerCase()
    // )
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className='flex justify-end'>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 w-[30%] border border-gray-300 rounded" 
          />
        </div>

        {paginatedEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No events available.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {paginatedEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                <Link to={`/events/${event.id}`} className="block">
                  {event.image && (
                    <div className="md:flex-shrink-0">
                      <img className="h-48 w-full object-cover md:w-48" src={event.image} alt={event.title} />
                    </div>
                  )}
                </Link>
                <div className="p-6 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <Link to={`/events/${event.id}`} className="block">
                        <h2 className="mt-2 text-xl font-semibold text-gray-900 hover:underline">{event.title}</h2>
                      </Link>
                    </div>
                    <button
                      onClick={() => toggleApply(event.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isRegistered(event)
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {isRegistered(event) ? 'Cancel Registration' : 'Register Now'}
                    </button>
                  </div>
                  <p className="mt-3 text-base text-gray-500">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{event.date}</div>
                    {event.time && (<div className="flex items-center"><Clock className="mr-1 h-4 w-4" />{event.time}</div>)}
                    {event.location && (<div className="flex items-center"><MapPin className="mr-1 h-4 w-4" />{event.location}</div>)}
                    <div className="flex items-center"><Users className="mr-1 h-4 w-4" />{event.attendees}/{event.maxAttendees} attendees</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
        </div>
      </main>
    </div>
  );
};

export default EventFeed;
