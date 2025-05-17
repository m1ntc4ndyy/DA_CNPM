import { useState } from 'react';
import { Calendar, QrCode, Users, Clock, MapPin, Award, Tag } from 'lucide-react';

export default function EventCard() {
  const [isPublished, setIsPublished] = useState(true);
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {/* Banner Image */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white">
        <p className="text-xl font-medium">Event Banner Image</p>
      </div>
      
      {/* Event Title Section */}
      <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Event Title Goes Here</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium">
            <Users size={16} className="mr-1" />
            View Registrants
          </button>
          <button className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium">
            <QrCode size={16} className="mr-1" />
            QR Code
          </button>
        </div>
      </div>
      
      {/* Event Description */}
      <div className="p-6 bg-gray-50">
        <p className="text-gray-600">
          Event description goes here. This section provides detailed information about the event, 
          its purpose, and what participants can expect.
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
              123 Main Street, City
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Deadline</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Clock size={18} className="mr-2 text-indigo-500" />
              June 15, 2025
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Points</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Award size={18} className="mr-2 text-indigo-500" />
              50
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-indigo-500" />
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                Workshop
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
              June 22, 2025, 10:00 AM
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
            <div className="flex items-center text-gray-800 font-medium">
              <Users size={18} className="mr-2 text-indigo-500" />
              100 Participants
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
      
      {/* Footer with Register Button */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow-sm transition-colors">
          Register
        </button>
        <p className="text-sm text-gray-500">Registration closes in 8 days</p>
      </div>
    </div>
  );
}