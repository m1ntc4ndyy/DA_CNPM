import { useState, useEffect } from 'react';
import { Save, AlertCircle, Calendar, QrCode, Users, Clock, MapPin, Award, Tag, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
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


export default function EventAdminPanel() {
  const [isPublished, setIsPublished] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { authToken } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<ExtendedEvent | null>(null);
  const [editedEvent, setEditedEvent] = useState<ExtendedEvent | null>(null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setEventData(res.data.data.event);
        setEditedEvent(res.data.data.event);
        console.log(res.data.data.event);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage(''); // Clear any error messages
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  const handleTogglePublish = () => {
    setIsPublished(!isPublished);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  const generateQRCode = async (eventId : string) => {
        try {
            await axiosInstance.post(`/api/qr/${eventId}/generate`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
        } catch (error) {
            console.error("Error creating QR code:", error);
            alert("Failed to create QR code.");
        }
    }
  const handleDeleteEvent = async () => {
    // In a real application, this would make an API call to delete the event
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
  
  const navigateToParticipants = () => {
    // In a real application, this would navigate to the participants page
    navigate(`/events/participant/${eventId}`);
  };
  
  const navigateToQRCode = () => {
    if (eventData?.status !== 'published') {
      setErrorMessage('Event must be published to generate a QR code.');
      return;
    }
    window.open(`/events/qr-code/${eventId}`, '_blank');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSaveChanges = async () => {
    if (!eventData || !eventId) return;
    console.log('Saving event:', editedEvent);

    setIsLoading(true);
    try {
      await axiosInstance.put(
        `/api/events/${eventId}`,
        editedEvent,
        {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }
      );
      setEventData(editedEvent);
      setIsEditing(false);
      showSuccessMessage('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Failed to update event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

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
  if (isLoading && !eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData && !isLoading) {
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
    <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {/* Admin Control Bar */}
      
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Event?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone and all registrations will be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isEditing && editedEvent ? (
        <> 
        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Admin Controls</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Edit size={14} className="mr-1" /> Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            className="flex items-center text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Edit size={14} className="mr-1" /> Confirm
          </button>
          <button 
            onClick={handleDeleteConfirm}
            className="flex items-center text-sm px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </button>
        </div>
      </div>
      
      {/* Banner Image */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white relative">
        <p className="text-xl font-medium">Event Banner Image</p>
        <button className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
          <Edit size={16} />
        </button>
      </div>
      
      {/* Event Title Section */}
      <div className="p-6 bg-white border-b border-gray-200 flex flex-col items-start">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={editedEvent?.title || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* Event Description */}
      <div className="p-6 bg-gray-50">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={editedEvent?.description || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* Event Details Grid */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <MapPin size={18} className="mr-2 text-indigo-500" />
              <input
                type="text"
                name="location"
                id="location"
                value={editedEvent?.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Deadline</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Clock size={18} className="mr-2 text-indigo-500" />
              <input
                type="date"
                name="date"
                id="date"
                value={editedEvent?.registrationDeadline.split("T")[0] || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Points</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Award size={18} className="mr-2 text-indigo-500" />
              <input
                      type="number"
                      name="point"
                      id="point"
                      value={editedEvent?.point || 0}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-indigo-500" />
              <span className=" text-sm font-medium py-1 rounded-full">
                <select
                  name="category"
                  id="category"
                  value={editedEvent?.category || ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="meeting">Meeting</option>
                  <option value="academic">Academic</option>
                  <option value="technology">Technology</option>
                  <option value="art">Art</option>
                  <option value="sport">Sport</option>
                  <option value="other">Other</option>
                </select>
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div className='grid grid-cols-2 '>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Start Time</h3>
            <div className="flex items-center text-gray-800 font-medium">
              {/* <Calendar size={18} className="mr-2 text-indigo-500" /> */}
              <input
                type="date"
                name="date"
                id="date"
                value={editedEvent?.startDate.split("T")[0] || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center text-gray-800 font-medium">
              {/* <Calendar size={18} className="mr-2 text-indigo-500" /> */}
              <input
                type="time"
                name="time"
                id="time"
                value={editedEvent?.startTime.slice(0, 5) || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Users size={18} className="mr-2 text-indigo-500" />
              <input
                type="number"
                name="capacity"
                id="capacity"
                value={editedEvent?.capacity || 0}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className={`text-sm font-medium ${isPublished ? 'text-green-700' : 'text-yellow-700'}`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : eventData ? (
        <>
        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Admin Controls</span>
          <div className="h-4 w-px bg-gray-600"></div>
          {eventData.status === "draft" && (
          <button
                onClick={async () => {
                  if (!eventId) return;

                  setIsLoading(true);
                  try {
                    await axiosInstance.post(
                      `/api/events/${eventId}/publish`,
                      {},
                      {
                        headers: { 'Authorization': `Bearer ${authToken}` }
                      }
                    );
                    showSuccessMessage('Event published successfully!');
                    setEventData(prev => ({ ...prev!, status: 'published' }));
                    await generateQRCode(eventId);
                  } catch (error) {
                    console.error('Error publishing event:', error);
                    setErrorMessage('Failed to publish event. Please try again.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Publish Event
          </button>)}
        </div>
        <div>
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
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleEdit}
            className="flex items-center text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Edit size={14} className="mr-1" /> Edit
          </button>
          <button 
            onClick={handleDeleteConfirm}
            className="flex items-center text-sm px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </button>
        </div>
      </div>
      
      {/* Banner Image */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white relative">
        <p className="text-xl font-medium">Event Banner Image</p>
        <button className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
          <Edit size={16} />
        </button>
      </div>
      
      {/* Event Title Section */}
      <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{eventData?.title}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={navigateToParticipants}
            className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100"
          >
            <Users size={16} className="mr-1" />
            View Registrants
          </button>
          <button 
            onClick={navigateToQRCode}
            className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100"
          >
            <QrCode size={16} className="mr-1" />
            QR Code
          </button>
        </div>
      </div>
      
      {/* Event Description */}
      <div className="p-6 bg-gray-50">
        <p className="text-gray-600">
          {eventData?.description}
        </p>
      </div>
      
      {/* Event Details Grid */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <MapPin size={18} className="mr-2 text-indigo-500" />
              {eventData?.location}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Deadline</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Clock size={18} className="mr-2 text-indigo-500" />
              {formatDisplayDate(eventData?.registrationDeadline)} 
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Points</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Award size={18} className="mr-2 text-indigo-500" />
              {eventData?.point}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-indigo-500" />
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {eventData?.category}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date & Time</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Calendar size={18} className="mr-2 text-indigo-500" />
              {formatDisplayDate(eventData?.startDate)} at {eventData?.formattedStartTime}  
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Users size={18} className="mr-2 text-indigo-500" />
              {eventData?.capacity} Participants
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${eventData?.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className={`text-sm font-medium ${eventData?.status === 'published' ? 'text-green-700' : 'text-yellow-700'}`}>
                {eventData?.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Stats</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Eye size={18} className="mr-2 text-indigo-500" />
              {eventData?.registrationCount} Participants
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Event Management Info */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Created:</span> May 10, 2025
        </div>
        <div className="text-sm text-gray-500">
          {(() => {
            if (!eventData?.registrationDeadline) return null;
            const deadline = new Date(eventData.registrationDeadline);
            const now = new Date();
            const diffTime = deadline.getTime() - now.getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            return (
              <span>
                Registration closes in {diffDays} day{diffDays !== 1 ? 's' : ''}
              </span>
            );
          })()}
        </div>
      </div>
      </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading event details...</p>
        </div>
      )}
    </div>
  );
}
