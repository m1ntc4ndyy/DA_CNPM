import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '../types';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await axiosInstance.get(`/api/event/${eventId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }

      });
      setEvent(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  fetchEvent();
}, []);

  if (loading) return <div className="text-center text-gray-500">Loading event details...</div>;
  if (!event) return <div className="text-center text-gray-500">Event not found.</div>;
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
