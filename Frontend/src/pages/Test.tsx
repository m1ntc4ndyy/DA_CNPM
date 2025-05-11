import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
import { Calendar, Clock, MapPin, Filter, Search, ChevronRight, Heart, Share2, Star } from 'lucide-react';
import { Event } from '../types';
import { Link} from 'react-router-dom';


interface CategoryFilter {
  id: string;
  name: string;
  count: number;
}



const categories: CategoryFilter[] = [
  { id: "all", name: "All Events", count: 5 },
  { id: "academic", name: "Academic", count: 1 },
  { id: "technology", name: "Technology", count: 1 },
  { id: "meeting", name: "Meeting", count: 1 },
  { id: "arts", name: "Arts", count: 1 },
  { id: "sports", name: "Sports", count: 1 },
  { id: "other", name: "Other", count: 1 }, 
];

export default function Test() {
  const {authToken } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params:{
            status: 'published',
          }
        });
        console.log(response.data.data)
        setEvents(response.data.data.events as Event[]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);





  // Filter events based on selected category and search query
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured events

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and sort */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Events List */}
            <h2 className="text-2xl font-bold mb-4">All Events</h2>
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No events found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
                    <div className="relative">
                      <img
                        src={event.image || "https://placehold.co/600x400"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded inline-block">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <Link to={`/events/${event.id}`} className="text-lg font-bold hover:text-indigo-600 hover:scale-110 origin-top-left">{event.title}</Link>
                      <div className="flex flex-wrap text-gray-600 text-sm mt-2">
                        <div className="flex items-center mr-3 mb-1">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{event.startDate}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3 flex-1">{event.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <Link to={`/events/${event.id}`} className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-700 transition flex items-center">
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-500 hover:text-red-500 transition">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-blue-500 transition">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 border rounded-md bg-indigo-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">3</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                  Next
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                      selectedCategory === category.id
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Subscribe</h2>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest events in your area.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Promote Your Event</h2>
              <p className="mb-4 opacity-90">
                Reach thousands of people and boost attendance for your next event.
              </p>
              <button className="bg-white text-indigo-600 w-full py-2 rounded-md hover:bg-gray-100 transition font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Event Explorer</h3>
              <p className="text-gray-400">
                Discover and attend the best events in your city.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Create Event</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(1).map((category) => (
                  <li key={`footer-${category.id}`}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                  {/* Social Icon Placeholder */}
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </a>
                <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                  {/* Social Icon Placeholder */}
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </a>
                <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                  {/* Social Icon Placeholder */}
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </a>
              </div>
              <p className="text-gray-400">support@eventexplorer.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Event Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}