import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { Event } from '../types';
import axiosInstance from '../utils/axiosInstance';

interface EventFormState {
  id?: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  maxAttendees: number;
  status: Event['status'];
}

const EventManagement: React.FC = () => {
  const { currentUser, authToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    // {
    //   id: 1,
    //   title: 'Web Development Workshop',
    //   description: 'Learn the fundamentals of modern web development with React and Tailwind CSS.',
    //   location: 'Tech Hub, Downtown',
    //   date: '2025-03-25',
    //   time: '10:00 AM - 2:00 PM',
    //   attendees: 24,
    //   maxAttendees: 40,
    //   status: 'ongoing',
    //   registeredUsers: []
    // },
    // {
    //   id: 2,
    //   title: 'Data Science Meetup',
    //   description: 'Join us for an evening of insightful talks and networking.',
    //   location: 'Data Center, Midtown',
    //   date: '2025-04-10',
    //   time: '6:00 PM - 9:00 PM',
    //   attendees: 45,
    //   maxAttendees: 60,
    //   status: 'pending',
    //   registeredUsers: [2]
    // },
    // {
    //   id: 3,
    //   title: 'UI/UX Design Conference',
    //   description: 'A full-day conference featuring top designers.',
    //   location: 'Design Studio, Westside',
    //   date: '2025-05-15',
    //   time: '9:00 AM - 5:00 PM',
    //   attendees: 32,
    //   maxAttendees: 50,
    //   status: 'ongoing',
    //   registeredUsers: []
    // },
    // {
    //   id: 4,
    //   title: 'Mobile App Development Hackathon',
    //   description: 'Build a mobile app in 24 hours.',
    //   location: 'Innovation Hub',
    //   date: '2025-04-22',
    //   time: '9:00 AM',
    //   attendees: 15,
    //   maxAttendees: 30,
    //   status: 'approved',
    //   registeredUsers: []
    // },
    // {
    //   id: 5,
    //   title: 'Blockchain Technology Seminar',
    //   description: 'Learn about the latest in blockchain technology.',
    //   location: 'Tech Campus',
    //   date: '2025-03-18',
    //   time: '2:00 PM',
    //   attendees: 8,
    //   maxAttendees: 25,
    //   status: 'rejected',
    //   registeredUsers: []
    // },
    // {
    //   id: 6,
    //   title: 'Digital Marketing Workshop',
    //   description: 'Boost your digital marketing skills.',
    //   location: 'Marketing Center',
    //   date: '2025-02-10',
    //   time: '10:00 AM',
    //   attendees: 50,
    //   maxAttendees: 50,
    //   status: 'ended',
    //   registeredUsers: []
    // }
  ]);

  useEffect(() => {
    // Fetch events data from API
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get('/api/event',{
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        
        setEvents(res.data);
      } catch (err) {
        setError("failed to fetch events");
        console.error("error fetching events: ",err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);
  
  // State for modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<EventFormState | null>(null);

  const openCreateModal = (): void => {
    setCurrentEvent({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      maxAttendees: 50,
      status: 'pending'
    });
    setShowModal(true);
  };

  const openEditModal = (event: Event): void => {
    setCurrentEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      time: event.time || '',
      maxAttendees: event.maxAttendees,
      status: event.status
    });
    setShowModal(true);
  };

  const deleteEvent = async (id: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await axiosInstance.delete(`/api/event/${id}`,{
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        if (!res.status) {
          throw new Error(res.data.message);
        }
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        console.error("error deleting event: ", err);
        setError("failed to delete event");
        window.alert("Failed to delete event");
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    if (!currentEvent) return;
    
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: name === 'maxAttendees' ? parseInt(value) : value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!currentEvent) {
			// window.alert('Please Login');
			return;
		}
    try {
      let res;
      // if (currentEvent.id) {
      //   // Update existing event
      //   setEvents(events.map(event => 
      //     event.id === currentEvent.id 
      //       ? { 
      //           ...event, 
      //           ...currentEvent,
      //           attendees: event.attendees // Preserve existing attendees
      //         } 
      //       : event
      //   ));
      // } else {
      //   // Create new event
      //   const newEvent: Event = {
      //     id: Math.max(...events.map(e => e.id)) + 1,
      //     ...currentEvent,
      //     attendees: 0,
      //     registeredUsers: []
      //   };
      //   setEvents([...events, newEvent]);
      // }
      if (currentEvent.id) {
        // Update existing event
        res = await axiosInstance.put(`/api/event/${currentEvent.id}`, JSON.stringify(currentEvent), {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      } else {
        // Create new event
        res = await axiosInstance.post('/api/event', JSON.stringify(currentEvent), {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
      if (!res.status) {
        throw new Error(res.data.message);
      }
      const updatedEvents = res.data;
      if (currentEvent.id) {
        setEvents(events.map(event => 
          event.id === currentEvent.id 
            ? updatedEvents
            : event
        ));
      } else {
        setEvents([...events, updatedEvents]);
        }
        setShowModal(false);
    } catch (err) {
      console.error("error saving event: ", err);
      setError("failed to save event");
      window.alert("Failed to update event");
    }
  };

  // Function to determine status badge color
  const getStatusColor = (status: Event['status']): string => {
    switch(status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Attendees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 origin-top-left hover:scale-105 transition-transform duration-200"
                        onClick={() => openEditModal(event)}  
                      >{event.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900">
                        {event.attendees} / {event.maxAttendees}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(event)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Event"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Event"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Event Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentEvent?.id ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={currentEvent?.title || ''}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={currentEvent?.description || ''}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={currentEvent?.location || ''}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={currentEvent?.date || ''}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      step="900"
                      id="time"
                      value={currentEvent?.time || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
								</div>
								<div>
								<label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
									Capacity
								</label>
								<input
									type="number"
									name="capacity"
									id="capacity"
									value={currentEvent?.maxAttendees || ''}
									onChange={handleFormChange}
									required
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								/>
								</div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={currentEvent?.status || 'pending'}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-[30%] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>

            </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentEvent?.id ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;


                