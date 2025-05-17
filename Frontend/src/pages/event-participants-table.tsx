import { useEffect, useState } from 'react';
import { Users, Calendar, CheckSquare, Bell } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';

// Function to format date to a readable string
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function EventParticipantsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const { eventId } = useParams<{ eventId: string }>();
  type EventData = {
    data: {
      registrations: any[];
      attendances: any[];
      stats: {
        totalRegistrations: number;
        totalAttendees: number;
        attendanceRate: number;
      };
    };
  };
  const [eventData, setEventData] = useState<EventData | null>(null); 

  const { authToken } = useAuth();
  useEffect(() => {
  const fetchEventData = async () => {
    try {
      const response = await axiosInstance.get(`api/events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setEventData(response.data);
    } catch (err) {
      console.error("Error fetching event data:", err);
    } 
  };

  fetchEventData();
}, [eventId, authToken]);


  if (!eventData) return <p className="p-6">Loading...</p>;

  const { registrations, attendances, stats } = eventData.data;
  

  // Create a combined view of all participants
  const allParticipants = [...registrations].map(reg => {
    // Find if this registered user also has attendance data
    const attendance = attendances.find((att: any) => att.userId === reg.userId);

    return {
      id: reg.userId,
      name: reg.user.name,
      email: reg.user.email,
      phone: reg.user.phone || "N/A",
      studentId: reg.user.studentId || "N/A",
      department: reg.user.department || "N/A",
      registrationDate: reg.registrationDate,
      checkedIn: !!attendance,
      checkInTime: attendance ? attendance.checkInTime : null,
    };
  });

  const renderParticipantsTable = () => {
    
    let displayData = allParticipants;
    
    if (activeTab === 'registered') {
      displayData = allParticipants;
    } else if (activeTab === 'attended') {
      displayData = allParticipants.filter(p => p.checkedIn);
    }
    
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Email</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Phone</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Student ID</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Department</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Registration</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Check In</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((participant) => (
                <tr key={participant.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{participant.name}</td>
                  <td className="py-3 px-4">{participant.email}</td>
                  <td className="py-3 px-4">{participant.phone}</td>
                  <td className="py-3 px-4">{participant.studentId}</td>
                  <td className="py-3 px-4">{participant.department}</td>
                  <td className="py-3 px-4">{formatDate(participant.registrationDate)}</td>
                  <td className="py-3 px-4">
                    {participant.checkInTime ? (
                      <span className="flex items-center">
                        <CheckSquare className="w-4 h-4 text-green-500 mr-1" />
                        {formatDate(participant.checkInTime)}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not checked in</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No participants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Event Participants Dashboard</h1>
          <div className="bg-white rounded-lg shadow px-4 py-3 flex space-x-4 items-center">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Registered</p>
                <p className="font-bold">{stats.totalRegistrations}</p>
              </div>
            </div>
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Attended</p>
                <p className="font-bold">{stats.totalAttendees}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="font-bold">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Participants
              </button>
              <button
                onClick={() => setActiveTab('registered')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'registered'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registered
              </button>
              <button
                onClick={() => setActiveTab('attended')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'attended'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Attended
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {renderParticipantsTable()}
          </div>
        </div>
      </div>
    </div>
  );
}