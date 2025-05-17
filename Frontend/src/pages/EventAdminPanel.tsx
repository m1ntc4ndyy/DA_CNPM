import { useState } from 'react';
import { Calendar, QrCode, Users, Clock, MapPin, Award, Tag, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export default function EventAdminPanel() {
  const [isPublished, setIsPublished] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock data for the event (in a real app, this would come from props or API)
  const [eventData, setEventData] = useState({
    title: "Event Title Goes Hereaaaaaaaaaaaaaaaaaaaaaaaa adsdad sdadasd asdasdas",
    description: "Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.Event description goes here. This section provides detailed information about the event, its purpose, and what participants can expect.",
    location: "123 Main Street, City",
    registrationDeadline: "June 15, 2025",
    points: 50,
    category: "Workshop",
    startDateTime: "June 22, 2025, 10:00 AM",
    capacity: 100,
    remainingDays: 8
  });
  
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
  
  const handleDeleteEvent = () => {
    // In a real application, this would make an API call to delete the event
    alert("Event would be deleted in a real application");
    setShowDeleteConfirm(false);
  };
  
  const navigateToRegistrants = () => {
    // In a real application, this would navigate to the registrants page
    alert("Navigating to registrants page");
  };
  
  const navigateToQRCode = () => {
    // In a real application, this would navigate to the QR code page
    alert("Navigating to QR code page");
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {/* Admin Control Bar */}
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Admin Controls</span>
          <div className="h-4 w-px bg-gray-600"></div>
          <button 
            onClick={handleTogglePublish}
            className="flex items-center text-sm px-2 py-1 rounded hover:bg-gray-700"
          >
            {isPublished ? (
              <>
                <ToggleRight size={16} className="mr-1 text-green-400" />
                <span>Published</span>
              </>
            ) : (
              <>
                <ToggleLeft size={16} className="mr-1 text-yellow-400" />
                <span>Draft</span>
              </>
            )}
          </button>
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
        <h1 className="text-2xl font-bold text-gray-800">{eventData.title}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={navigateToRegistrants}
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
          {eventData.description}
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
              {eventData.location}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Deadline</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Clock size={18} className="mr-2 text-indigo-500" />
              {eventData.registrationDeadline}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Points</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Award size={18} className="mr-2 text-indigo-500" />
              {eventData.points}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-indigo-500" />
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {eventData.category}
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
              {eventData.startDateTime}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Users size={18} className="mr-2 text-indigo-500" />
              {eventData.capacity} Participants
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
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Stats</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Eye size={18} className="mr-2 text-indigo-500" />
              0 Registered
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
          Registration closes in {eventData.remainingDays} days
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
      
      {/* Edit Modal would go here */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Event</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* This would be a form with fields for each event property */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.location}
                    onChange={(e) => setEventData({...eventData, location: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.category}
                    onChange={(e) => setEventData({...eventData, category: e.target.value})}
                  >
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Conference</option>
                    <option>Meeting</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.startDateTime}
                    onChange={(e) => setEventData({...eventData, startDateTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.registrationDeadline}
                    onChange={(e) => setEventData({...eventData, registrationDeadline: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.capacity}
                    onChange={(e) => setEventData({...eventData, capacity: parseInt(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={eventData.points}
                    onChange={(e) => setEventData({...eventData, points: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Save changes logic would go here
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
