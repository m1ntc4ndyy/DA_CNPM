import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
import { Event } from '../types';


interface ExtendedEvent extends Event {
  organizer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  isRegistered: boolean;
  hasAttendec: boolean;
}


import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Share2, 
  Heart, 
  ChevronLeft, 
  Star, 
  Bookmark, 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';



interface RelatedEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
}


// Sample related events
const relatedEvents: RelatedEvent[] = [
  {
    id: 2,
    title: "Jazz in the Park",
    date: "June 22, 2025",
    location: "Central Park",
    category: "Music",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Rock Concert Series",
    date: "June 28, 2025",
    location: "Madison Square Garden",
    category: "Music",
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "Electronic Music Night",
    date: "July 5, 2025",
    location: "Warehouse Club",
    category: "Music",
    image: "/api/placeholder/400/250"
  }
];

export default function EventDetailsPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
  const { authToken } = useAuth();
  const [eventData, setEventData] = useState<ExtendedEvent | null>(null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosInstance.get(`/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
  
        });
        setEventData(res.data.data.event);
      } catch (error) {
        console.error(error);
      } 
    }
    fetchEvent();
  }, []);

  
  
  // const displayedSchedule = showAllSchedule 
  //   ? eventData.schedule 
  //   : eventData.schedule.slice(0, 4);
  if (!eventData) return <div className="text-center text-gray-500">Event not found.</div>;

  const toggleRegistration = async (eventId: string) => {
    try {
      if (eventData.isRegistered) {
      const res = await axiosInstance.delete(`/api/registrations/${eventId}/unregister`, {
        headers: {
        'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.status === 200) {
        setEventData((prev) => 
        prev ? { 
          ...prev, 
          isRegistered: false, 
          registrationCount: prev.registrationCount - 1 
        } : prev
        );
      } else {
        throw new Error('Failed to cancel registration for event');
      }
      } else {
      const res = await axiosInstance.post(`/api/registrations/${eventId}/register`, {}, {
        headers: {
        'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.status === 201) {
        setEventData((prev) => 
        prev ? { 
          ...prev, 
          isRegistered: true, 
          registrationCount: prev.registrationCount + 1 
        } : prev
        );
      } else {
        throw new Error('Failed to register for event');
      }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (date:string) => {
    return new Date(`${date}`).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      // hour: 'numeric',
      // minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Content - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="relative">
                <img 
                  src={eventData.image || 'https://placehold.co/600x400'} 
                  alt={eventData.title} 
                  className="w-full h-80 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-full font-medium">
                    {eventData.category}
                  </span>
                </div>
              </div>


              {/* Event Title and Essential Info */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 flex-1">{eventData.title}</h1>
                  <div className="flex items-center ml-4">
                    {/* <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full mr-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">5</span>
                      <span className="text-gray-500 text-sm ml-1">({eventData.reviews})</span>
                    </div> */}
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-full ${isBookmarked ? 'text-indigo-500 bg-indigo-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap mt-4">
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mr-3 mb-3">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium">{formatDateTime(eventData.startDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mr-3 mb-3">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Registration Deadline</div>
                      <div className="font-medium">{formatDateTime(eventData.registrationDeadline)}</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mr-3 mb-3">
                    <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-medium">{eventData.startTime.slice(0,5)}</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mr-3 mb-3">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{eventData.location}</div>
                    </div>
                  </div>
                  <div className='w-full'></div>
                  
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Action Buttons */}
              <div className="px-6 py-4 flex flex-wrap justify-end">
                <button className={` px-6 py-3 rounded-md  transition font-medium mr-3 mb-2 flex-grow sm:flex-grow-0
                  ${eventData.isRegistered ? 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  onClick={() => {
                    toggleRegistration(eventData.id);
                    
                  }}

                >
                  {eventData.isRegistered ? 'Unregister' : 'Register'}
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition flex items-center mb-2">
                  <Share2 className="h-5 w-5 mr-2" /> Share
                </button>
              </div>
            </div>

            {/* Tabs - Description, Schedule, Reviews, etc. */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  <button className="px-3 py-2 text-indigo-600 font-medium border-b-2 border-indigo-600">
                    About
                  </button>
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-800">
                    Schedule
                  </button>
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-800">
                    Location
                  </button>
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-800">
                    Reviews
                  </button>
                </div>
              </div>
              
              {/* Description */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold mb-4">About This Event</h2>
                <div className="prose max-w-none text-gray-700">
                  {eventData.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                {/* <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap">
                    {eventData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div> */}

                {/* Schedule */}
                {/* <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
                  <div className="space-y-4">
                    {displayedSchedule.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-medium w-24 text-center flex-shrink-0">
                          {item.time}
                        </div>
                        <div className="ml-4 pt-1">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                  
                  {eventData.schedule.length > 4 && (
                    <button 
                      className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                      onClick={() => setShowAllSchedule(!showAllSchedule)}
                    >
                      {showAllSchedule ? 'Show Less' : 'Show Full Schedule'}
                      <ChevronLeft className={`h-4 w-4 ml-1 transform ${showAllSchedule ? 'rotate-90' : '-rotate-90'}`} />
                    </button>
                  )}
                </div> */}
              </div>
            </div>

            {/* Related Events */}
            {/* <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold mb-4">Similar Events You May Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {event.category}
                        </span>
                        <h3 className="font-medium mt-2 text-sm line-clamp-2">{event.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>

          {/* Sidebar - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            {/* Event Location */}
            {/* Organizer */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold mb-4">Organizer</h2>
                <div className="flex items-start">
                  <img 
                    src={eventData.organizer.logo} 
                    alt={eventData.organizer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{eventData.organizer.name}</h3>
                    <p className="text-gray-600 mt-1">{eventData.organizer.description}</p>
                    <div className="mt-3 flex flex-wrap">
                      <a href={`mailto:${eventData.organizer.email}`} className="flex items-center text-indigo-600 mr-4 mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{eventData.organizer.email}</span>
                      </a>
                      <a href={`tel:${eventData.organizer.phone}`} className="flex items-center text-indigo-600 mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{eventData.organizer.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Attendees</h2>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {/* Placeholders for attendee avatars */}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                        <Users className="h-4 w-4 text-indigo-400" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold">{eventData.registrationCount} Going</div>
                    <div className="text-sm text-gray-500">
                      out of {eventData.capacity} spots
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${(eventData.registrationCount / eventData.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span>{eventData.registrationCount} confirmed</span>
                  <span>{eventData.capacity - eventData.registrationCount} spots left</span>
                </div>
              </div>
            </div>

            {/* Get Tickets */}
            {/* <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg shadow-md mb-6 text-white">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Get Your Tickets Now</h2>
                <p className="mb-4 opacity-90">
                  Secure your spot at {eventData.title}. Limited availability!
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg">Price</span>
                  <span className="font-bold text-2xl">{eventData.price}</span>
                </div>
                <button className="w-full bg-white text-indigo-700 py-3 rounded-md hover:bg-indigo-50 transition font-bold">
                  Buy Tickets
                </button>
                <div className="mt-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm opacity-90">
                    Tickets are non-refundable and non-transferable.
                  </span>
                </div>
              </div>
            </div> */}

            {/* Ask Question */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Have Questions?
                </h2>
                <div>
                  <textarea
                    placeholder="Ask the organizer anything about this event..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                  ></textarea>
                  <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    onClick={() => window.alert('Function not available!')}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Explorer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}