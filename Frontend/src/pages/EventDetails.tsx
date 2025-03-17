import React from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '../types';

const sampleEvents: Event[] = [
  {
    id: 1,
    title: 'Web Development Workshop',
    description: 'Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.Learn React and Tailwind CSS.',
    location: 'Tech Hub, Downtown',
    date: '2025-03-25',
    time: '10:00 AM - 2:00 PM',
    image: '/api/placeholder/600/400',
    status: 'ongoing',
    attendees: 24,
    maxAttendees: 40,
    registeredUsers: []
  },
  // Add other sample events...
];

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = sampleEvents.find(e => e.id === Number(eventId));

  if (!event) {
    return <div className="text-center text-gray-500">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {event.image && <img className="w-full h-64 object-cover rounded-lg" src={event.image} alt={event.title} />}
        <h1 className="text-2xl font-bold mt-4">{event.title}</h1>
        <p className="text-gray-500 mt-2">{event.description}</p>
        <p className="mt-4"><strong>Location:</strong> {event.location}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Attendees:</strong> {event.attendees}/{event.maxAttendees}</p>
      </div>
    </div>
  );
};

export default EventDetails;
