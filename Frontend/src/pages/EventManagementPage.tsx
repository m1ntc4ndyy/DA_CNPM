import { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
import { Event } from '../types';
import { Link } from 'react-router-dom';

import { 
  Calendar, 
  Clock, 
  Edit2, 
  Filter, 
  MapPin, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  Users,
  Edit
} from "lucide-react";

export default function EventManagementPage() {
  const { authToken } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        console.log(response.data.data)
        setEvents(response.data.data.events as Event[]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } 
    };

    fetchEvents();
    setIsLoading(false);
   
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...events];
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(event => event.status === statusFilter);
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.category?.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(result);
  }, [events, statusFilter, searchTerm]);

  const handleCreateEvent = () => {
    // Navigate to create event page or open a modal
    console.log("Create new event");
  };

  const handleEditEvent = (id:string) => {
    console.log("Edit event", id);
  };

  const handleDeleteEvent = (id:string) => {
    console.log("Delete event", id);
    // Confirm before deletion
    if (window.confirm("Are you sure you want to delete this event?")) {
      // In a real application, this would be an API call
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const handleViewDetails = (id:string) => {
    console.log("View event details", id);
  };

  const formatDateTime = (date:string, time:string) => {
    return new Date(`${date}T${time}`).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClasses = (status:string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <button 
            onClick={handleCreateEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                <button 
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter === "all" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Events
                </button>
                <button 
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter === "draft" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Drafts
                </button>
                <button 
                  onClick={() => setStatusFilter("published")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter === "published" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Published
                </button>
                <button 
                  onClick={() => setStatusFilter("canceled")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter === "canceled" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Canceled
                </button>
                <button 
                  onClick={() => setStatusFilter("completed")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter === "completed" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Events table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No events found. Try adjusting your filters or create a new event.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <div className="flex-shrink-0 h-10 w-10">
                            {event.image ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={event.image} alt={event.title} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div> */}
                          <div className="ml-4">
                            <Link to={`/events/update/${event.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline hover:cursor-pointer hover:scale-110 transition-transform duration-200 origin-top-left">
                              {event.title}
                            </Link>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description.length > 60 
                                ? `${event.description.substring(0, 60)}...` 
                                : event.description}
                            </div>
                            <div className="text-xs text-gray-400">
                              {event.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {event.startDate} - {event.startTime}
                          </span>
                         
                        </div>
                        
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        {!event.isPublic && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Private
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {event.registrationCount} / {event.capacity}
                          </span>
                        </div>
                        {/* Progress bar for capacity */}
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-1 bg-indigo-500 rounded-full" 
                            style={{ width: `${Math.min(100, (event.registrationCount / event.capacity) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          {/* <div className="relative inline-block text-left">
                            <button
                              onClick={() => handleViewDetails(event.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            
                          </div> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of{' '}
                  <span className="font-medium">{filteredEvents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
