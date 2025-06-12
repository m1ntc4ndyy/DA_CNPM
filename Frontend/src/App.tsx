// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider  from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import EventManagementPage from './pages/EventManagementPage';
import EventDetailsPage from './pages/EventDetailPage';
import CreateEvent from './pages/CreateEvent';
import StudentProfile from './pages/StudentProfile';
import MainPage from './pages/MainPage';
import EventCard from './pages/Temp'; // Adjust the import based on your actual file structure
import EventAdminPanel from './pages/EventAdminPanel';
import EventParticipantsDashboard from './pages/event-participants-table';
import CheckInPage from './pages/CheckInPage';
import QRPage from './pages/QRPage';


const UnauthorizedPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
  </div>
);



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
          <Route path="/temp" element={<EventCard />} />
          <Route path="/temp2" element={<EventAdminPanel />} />



          <Route path="/events/participant/:eventId" element={
            <ProtectedRoute requiredRole={["admin", "organizer"]}>
              <EventParticipantsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/attendances/check-in/:qrcode" element={
            <ProtectedRoute requiredRole="student">
              <CheckInPage />
            </ProtectedRoute>
          } />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } 
          />
          {/* Admin-only route */}
          <Route 
            path="/manage" 
            element={
              <ProtectedRoute requiredRole={["admin", "organizer"]}>
                <EventManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/update/:eventId" 
            element={
              <ProtectedRoute requiredRole={["admin", "organizer"]}>
                {/* <EventUpdate /> */}
                <EventAdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/create" 
            element={
              <ProtectedRoute requiredRole={["admin", "organizer"]}>
                <CreateEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/qr-code/:eventId" 
            element={
              <ProtectedRoute requiredRole={["admin", "organizer"]}>
                <QRPage />
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
