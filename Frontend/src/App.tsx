// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider  from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import EventFeed from './pages/EventFeed';
import EventManagement from './pages/EventManagement';
import Navbar from './components/Navbar';
import EventDetails from './pages/EventDetails';
import SchoolEventManagement from './pages/MainPage';
import EventManagementPage from './pages/EventManagementPage';
import Test from './pages/Test';
import EventDetailsPage from './pages/event-details-page';
import EventUpdate from './pages/EventUpdate';

const UnauthorizedPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
  </div>
);

const event = {
  title: "Tech Innovators Meetup 2025",
  description: "Join us for a gathering of the brightest minds in technology...",
  image: "https://via.placeholder.com/800x400",
  startDate: "2025-06-12",
  startTime: "14:00",
  location: "Tech Hall, San Francisco",
  maxParticipants: 100,
  currentParticipants: 45,
  attendanceScore: 5,
  onRegister: () => alert("Registered!"),
}


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          {/* <Route path="/test" element={<SchoolEventManagement />} /> */}
          {/* <Route path="/test2" element={<EventManagementPage />} /> */}
          {/* <Route path="/test3" element={<Test/>} /> */}
          {/* <Route path="/test4" element={<EventDetailsPage />} /> */}
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            } 
          />
          {/* Admin-only route */}
          <Route 
            path="/manage" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EventManagementPage />
                {/* <div>EVENT LIST</div> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/update/:eventId" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EventUpdate />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;