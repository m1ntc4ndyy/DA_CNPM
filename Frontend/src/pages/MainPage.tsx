import { useState, useEffect, useRef } from 'react';
import { Bell, Calendar, Search, User, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import axiosInstance from '../utils/axiosInstance';
import { Event } from '../types';

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  // Sample data - would come from your backend in a real app
  // const events = [
  //   {
  //     id: 1,
  //     title: "Annual Science Fair",
  //     date: "April 15, 2025",
  //     time: "9:00 AM - 3:00 PM",
  //     location: "Main Hall",
  //     category: "Academic",
  //     description: "Showcase your scientific discoveries and innovations.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     image: "/api/placeholder/400/200",
  //     status: "Open"
  //   },
  //   {
  //     id: 2,
  //     title: "Basketball Tournament",
  //     date: "April 20, 2025",
  //     time: "4:00 PM - 7:00 PM",
  //     location: "School Gym",
  //     category: "Sports",
  //     description: "Inter-class basketball championship finals.",
  //     image: "/api/placeholder/400/200",
  //     status: "Closing Soon"
  //   },
  //   {
  //     id: 3,
  //     title: "Spring Concert",
  //     date: "May 5, 2025",
  //     time: "6:00 PM - 8:00 PM",
  //     location: "Auditorium",
  //     category: "Arts",
  //     description: "Annual spring concert featuring choir and band.",
  //     image: "/api/placeholder/400/200",
  //     status: "Open"
  //   },
  //   {
  //     id: 4,
  //     title: "Parent-Teacher Conference",
  //     date: "May 10, 2025",
  //     time: "1:00 PM - 6:00 PM",
  //     location: "Classrooms",
  //     category: "Meeting",
  //     description: "Discuss student progress with teachers.",
  //     image: "/api/placeholder/400/200",
  //     status: "Open"
  //   }
  // ];
  const { currentUser, authToken, isAdmin, isStudent } = useAuth();

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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  const categories = ['All', 'Academic', 'Sports', 'Arts', 'Meeting', 'Other'];

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-500';
      case 'Closing Soon': return 'bg-yellow-500';
      case 'Full': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  const myRef = useRef<HTMLElement | null>(null);
  const scrollTo = () => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover School Events</h2>
          <p className="text-xl mb-8">Easy registration and management for all school activities</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-all">
              All Events
            </button>
            <button className="bg-white hover:bg-gray-100 text-blue-800 font-bold py-3 px-6 rounded-lg shadow-lg transition-all">
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg p-4 -mt-10 flex flex-col md:flex-row justify-between items-center">
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <input 
              type="text" 
              placeholder="Search Events..." 
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section ref={myRef} className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10">
          {filteredEvents.map(event => (
            <div key={event.id} className="flex flex-col justify-between bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:border-1 hover:text-blue-500 transition-shadow">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {event.category}
                  </span>
                  <span className={`inline-block text-white text-xs px-2 py-1 rounded ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1 transition hover:scale-110 origin-top-left hover:underline hover:cursor-pointer">{event.title}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {event.startDate == event.endDate ? (
                    <p>•{event.startDate} <br /> •{event.startTime} - {event.endTime}</p>
                  ) : (
                    <p>•{event.startDate} - {event.endDate}  <br /> • {event.startTime} - {event.endTime}</p>
                  )}
                  <div className='flex items-center mt-1'>
                    <MapPin/>
                    <p>{event.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2 ">{event.description}</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="inline-flex items-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded">
            View All Events
            <Calendar className="ml-2 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Stay Informed</h3>
              <p className="text-gray-600 mb-4">Never miss an important school event. Sign up for notifications.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Community Engagement</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">56</p>
                  <p className="text-gray-600">Events This Year</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">2,500+</p>
                  <p className="text-gray-600">Participants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">98%</p>
                  <p className="text-gray-600">Satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">24</p>
                  <p className="text-gray-600">Clubs Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <p className="text-gray-600">Browse events from the calendar</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <p className="text-gray-600">Create an account or login</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <p className="text-gray-600">Register for your chosen events</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <p className="text-gray-600">Receive updates and reminders</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Community Says</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 italic mb-4">"The event management system has made signing up for school activities so much easier. I love getting reminders before events!"</p>
            <p className="font-medium text-gray-800">- Sarah Johnson, Parent</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 italic mb-4">"As a club leader, I can now manage our events efficiently. The attendance tracking is particularly helpful."</p>
            <p className="font-medium text-gray-800">- Jason Adams, Math Club President</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-600 italic mb-4">"This system has transformed how we organize school events. The analytics help us improve our offerings each year."</p>
            <p className="font-medium text-gray-800">- Ms. Garcia, Event Coordinator</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Westview Academy</h3>
              <p className="text-gray-300">123 Education Lane</p>
              <p className="text-gray-300">Westview, CA 90210</p>
              <p className="text-gray-300">(555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Events Calendar</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                © 2025 Westview Academy.<br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;