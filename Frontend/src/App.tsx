// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider  from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import EventManagementPage from './pages/EventManagementPage';
import EventDetailsPage from './pages/EventDetailPage';
import EventUpdate from './pages/EventUpdate';
import CreateEvent from './pages/CreateEvent';
import StudentProfile from './pages/StudentProfile';
import MainPage from './pages/MainPage';
import EventCard from './pages/Temp'; // Adjust the import based on your actual file structure
import EventAdminPanel from './pages/EventAdminPanel';
import EventParticipantsDashboard from './pages/event-participants-table';
import CheckInPage from './pages/CheckInPage';
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
          <Route path="/events/participant/:eventId" element={<EventParticipantsDashboard />} />
          <Route path="/attendances/check-in/:qrcode" element={
            <ProtectedRoute>
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
            element= {
              <ProtectedRoute>
                <StudentProfile/>
              </ProtectedRoute>
            } 
          />
          {/* Admin-only route */}
          <Route 
            path="/manage" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EventManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/update/:eventId" 
            element={
              <ProtectedRoute requiredRole="admin">
                {/* <EventUpdate /> */}
                <EventAdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/create" 
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateEvent />
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

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AuthProvider from './context/AuthProvider';
// import ProtectedRoute from './components/ProtectedRoute';
// import LoginPage from './pages/LoginPage';
// import Sidebar from './components/SideBar';
// import EventManagementPage from './pages/EventManagementPage';
// import EventDetailsPage from './pages/EventDetailPage';
// import EventUpdate from './pages/EventUpdate';
// import CreateEvent from './pages/CreateEvent';
// import StudentProfile from './pages/StudentProfile';
// import MainPage from './pages/MainPage';
// import { useAuth } from './context/AuthProvider'; // Adjust import based on your actual auth hook
// import { useState } from 'react';

// const UnauthorizedPage: React.FC = () => (
//   <div className="flex flex-col items-center justify-center h-screen">
//     <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
//     <p>You don't have permission to access this page.</p>
//   </div>
// );

// // Layout component to wrap sidebar with content
// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { currentUser} = useAuth(); // Adjust based on your auth context structure
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   // Function to toggle sidebar state that can be passed to Sidebar
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };
  
//   return (
//     <div className="flex h-screen">
//       <Sidebar 
//         userRole={currentUser?.role} 
//         // onLogout={logout} 
//         isOpen={sidebarOpen}
//         onToggle={toggleSidebar}
//       />
//       <main 
//         className={`flex-1 transition-all duration-300 ${
//           sidebarOpen ? 'ml-64' : 'ml-20'
//         } bg-gray-50 p-6 overflow-auto`}
//       >
//         <div className="max-w-7xl mx-auto">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes - no sidebar */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
//           {/* Protected routes - with sidebar */}
//           <Route 
//             path="/" 
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <MainPage />
//                 </Layout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/events/:eventId" 
//             element={
//               <Layout>
//                 <EventDetailsPage />
//               </Layout>
//             }
//           />
//           <Route 
//             path="/profile" 
//             element= {
//               <ProtectedRoute>
//                 <Layout>
//                   <StudentProfile/>
//                 </Layout>
//               </ProtectedRoute>
//             } 
//           />
//           {/* Admin-only routes */}
//           <Route 
//             path="/manage" 
//             element={
//               <ProtectedRoute requiredRole="admin">
//                 <Layout>
//                   <EventManagementPage />
//                 </Layout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/events/update/:eventId" 
//             element={
//               <ProtectedRoute requiredRole="admin">
//                 <Layout>
//                   <EventUpdate />
//                 </Layout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/events/create" 
//             element={
//               <ProtectedRoute requiredRole="admin">
//                 <Layout>
//                   <CreateEvent />
//                 </Layout>
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Redirect to home for unknown routes */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;