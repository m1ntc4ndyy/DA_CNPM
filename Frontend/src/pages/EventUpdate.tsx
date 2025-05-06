import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Edit, Trash, X, Save, AlertCircle } from 'lucide-react';
import { Event } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axiosInstance from '../utils/axiosInstance';

interface ExtendedEvent extends Event {
  organizer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function EventUpdate() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<ExtendedEvent | null>(null);
  const [editedEvent, setEditedEvent] = useState<ExtendedEvent | null>(null);
  
  const { authToken } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setEvent(res.data.data.event);
        console.log(res.data.data.event);
        setEditedEvent(res.data.data.event);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to load event details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, authToken]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (editedEvent) {
    console.log('Saving event:', editedEvent);

      setEditedEvent(prev => ({
        ...prev!,
        [name]: value,
        ...(name === "date" && { startDate: value }),
        ...(name === "time" && { startTime: value }),

      }));
    }

  };

  // Save changes
  const handleSave = async () => {
    if (!editedEvent || !eventId) return;
    console.log('Saving event:', editedEvent);

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/api/events/${eventId}`,
        editedEvent,
        {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }
      );
      
      setEvent(editedEvent);
      setIsEditing(false);
      showSuccessMessage('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Failed to update event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      showSuccessMessage('Event deleted successfully!');
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        navigate('/manage'); // Assuming you have an events list page
      }, 1000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage('Failed to delete event. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message temporarily
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage(''); // Clear any error messages
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Show error message temporarily
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage(''); // Clear any success messages
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  // Format date for display
  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  if (isLoading && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Event not found or you don't have access to it.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-end items-center">
          {!isEditing && event && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Success message */}
      {successMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Event details */}
          <div className="px-4 py-5 sm:p-6">
            {isEditing && editedEvent ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={editedEvent.title || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={editedEvent.startDate.split("T")[0] || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      value={editedEvent.startTime || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={editedEvent.location || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={editedEvent.description || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
                    <input
                      readOnly
                      type="text"
                      name="organizer"
                      id="organizer"
                      value={editedEvent.organizer.name || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Expected Attendees</label>
                    <input
                      type="number"
                      name="capacity"
                      id="capacity"
                      value={editedEvent.capacity || 0}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedEvent(event);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : event ? (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-600">Start Date: </span>
                    <span className="ml-2 text-gray-900 font-medium">{event.startDate.split("T")[0]}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-600">Time: </span>
                    <span className="ml-2 text-gray-900 font-medium">{event.startTime.slice(0,5)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-600">Location: </span>
                    <span className="ml-2 text-gray-900 font-medium">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-600">Organizer: </span>
                    <span className="ml-2 text-gray-900 font-medium">{event.organizer.name}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">About This Event</h3>
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Expected Attendees</h3>
                      <p className="text-gray-600">{event.capacity} people</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading event details...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Event</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}