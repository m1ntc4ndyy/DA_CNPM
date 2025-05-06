import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { Event } from '../types';
import axiosInstance from '../utils/axiosInstance';

const EventFeed: React.FC =  () => {
  const { currentUser, authToken, isAdmin, isStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params: {
            status: 'published'
          }
        });
        console.log(response.data.data)
        setEvents(response.data.data.events as Event[]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  const  toggleApply = async (id: number): Promise<void> => {
    if (!currentUser) return;
    try {
      const isApplied = events.find(event => event.id === id)?.registeredUsers.includes(currentUser.id);
      if (isApplied) {
        const res = await axiosInstance.delete(`/api/registrations/${id}/unregister`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        if (!res.status){
          throw new Error('Failed to cancel registration for event');
        }
      } else {
        
        const res = await axiosInstance.post(`/api/registrations/${id}/register`, {
         headers: {
           Authorization: `Bearer ${authToken}`
         }
       });
       if (!res.status){
         throw new Error('Failed to register for event');
        }
      }

    } catch (error) {

    }
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
            capacity: isApplied ? event.registrationCount - 1 : event.registrationCount + 1
          };
        }
        return event;
      })
    );
  };

  const getStatusColor = (status: Event['status']): string => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
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
      return ['published'].includes(event.status);
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
        {loading ? (
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Loading events...</p>
           
          </div>
        ) : 
        paginatedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No events available.</p>
          </div>
        ) : (

        <div className="grid grid-cols-2 gap-6">
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
                        <h2 className="mt-2 text-xl font-semibold text-gray-900 origin-top-left transition-transform duration-200 hover:scale-110 hover:text-blue-600">{event.title}</h2>
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
                  <p className="line-clamp-4 mt-3 text-base text-gray-500 h-fu">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{event.startDate}</div>
                    <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{event.endDate}</div>
                    {/* {event.time && (<div className="flex items-center"><Clock className="mr-1 h-4 w-4" />{event.time}</div>)} */}
                    {event.location && (<div className="flex items-center"><MapPin className="mr-1 h-4 w-4" />{event.location}</div>)}
                    <div className="flex items-center"><Users className="mr-1 h-4 w-4" />{event.registrationCount}/{event.capacity}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
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
