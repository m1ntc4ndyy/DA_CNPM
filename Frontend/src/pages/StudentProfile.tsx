import { useState, useEffect } from 'react';
import { User, Award, Calendar, CheckCircle, Clock, ChevronRight, Mail, Phone, School } from 'lucide-react';
import axiosInstance  from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
const StudentProfile = () => {
  const { authToken, currentUser} = useAuth();

  const [registeredEvents, setRegisteredEvents] = useState<Array<{
    id: string;
    userId: string;
    title: string;
    registrationDate: string;
    event: {
      id: string;
      title: string;
      point: number;
    }
  }>>([]);
  const [attendedEvents, setAttendedEvents] = useState<Array<{
    id: string;
    userId: string;
    checkInTime: string;
    event: {
      id: string;
      title: string;
      point: number;
    }
  }>>([]);



  const [student, setStudent] = useState({
    id: '',
    studentId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    point: 0,
    profileImage: null
  });
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/profile',{
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setStudent(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
    fetchProfileData();
    const fetchRegisteredEvents = async () => {
      try {
        const res = await axiosInstance.get('/api/registrations/my-registrations?withAttended=false', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setRegisteredEvents(res.data.data.registrations);
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents();

    const fetchAttendedEvents = async () => {
      try {
        const res = await axiosInstance.get('/api/attendances/my-history', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
          
        });
        setAttendedEvents(res.data.data.attendances);
      } catch (error) {
        console.error('Error fetching attended events:', error);
      }
    }
    fetchAttendedEvents();

  }, [authToken]);
  
  const [activeTab, setActiveTab] = useState('registedEvents');
  
  // Calculate stats
  const completedEvents = attendedEvents.length;
  const pointsEarned = attendedEvents.reduce((sum, event) => sum + event.event.point, 0);
  const upcomingEvents = registeredEvents.length;
  
  // State for change password modal and form
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [isPwdUpdating, setIsPwdUpdating] = useState(false);

  // Handle change password form changes
  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
    setPwdError('');
    setPwdSuccess('');
  };

  // Change password function
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError('New password and confirm password do not match.');
      return;
    }
    setIsPwdUpdating(true);
    try {
      await axiosInstance.put('/api/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setPwdSuccess('Password changed successfully.');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setIsChangePwdOpen(false), 1200);
    } catch (error: any) {
      setPwdError(error?.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsPwdUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-indigo-600 p-6 h-32"></div>
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 -mt-16 md:-mt-20">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-500">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.name} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 md:h-16 md:w-16" />
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-600">{student.department} - {student.year}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-medium text-indigo-600">{student.point} Total Points</span>
                {/* Change Password Button */}
                <button
                  className="ml-4 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  onClick={() => setIsChangePwdOpen(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{student.email}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{student.phone}</span>
              </div>
              {currentUser?.role == 'student' && (
                <div className="flex items-center text-gray-600">
                  <School className="h-4 w-4 mr-2" />
                  <span>Student ID: {student.studentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Events</p>
            <p className="text-2xl font-bold text-gray-900">{completedEvents}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Points Earned</p>
            <p className="text-2xl font-bold text-gray-900">{pointsEarned}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingEvents}</p>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('registedEvents')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === 'registedEvents' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Registered Events
            </button>
            
            <button
              onClick={() => setActiveTab('attendedEvents')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === 'attendedEvents' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="h-4 w-4 mr-2" />
              Attended Events
            </button>
          </div>
        </div>
        
        {/* Events Tab */}
        {activeTab === 'registedEvents' && (
          <div className="p-4">
            {registeredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No events yet</h3>
                <p className="mt-1 text-sm text-gray-500">Register for events to see them here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {registeredEvents.map((event) => (
                  <div key={event.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{event.event.title}</h4>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(event.registrationDate).toLocaleDateString()} - {new Date(event.registrationDate).toLocaleTimeString()}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className={`text-xs text-purple-600`}>
                            Registed
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                    
                        <div className="mr-4 flex items-center text-purple-600">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">{event.event.point} points</span>
                        </div>
                     
                      
                      <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-500">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'attendedEvents' && (
          <div className="p-4">
            {attendedEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No events yet</h3>
                <p className="mt-1 text-sm text-gray-500">Register for events to see them here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {attendedEvents.map((event) => (
                  <div key={event.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-green-100 text-green-600`}>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{event.event.title}</h4>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(event.checkInTime).toLocaleDateString() + ' - ' + new Date(event.checkInTime).toLocaleTimeString()}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className={`text-xs text-green-600`}>
                            Attended
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                    
                        <div className="mr-4 flex items-center text-green-600">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+{event.event.point} points</span>
                        </div>
                     
                      
                      <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-500">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {isChangePwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={pwdForm.currentPassword}
                  onChange={handlePwdChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={pwdForm.newPassword}
                  onChange={handlePwdChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={pwdForm.confirmPassword}
                  onChange={handlePwdChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              {pwdError && <div className="text-red-600 text-sm">{pwdError}</div>}
              {pwdSuccess && <div className="text-green-600 text-sm">{pwdSuccess}</div>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsChangePwdOpen(false)}
                  disabled={isPwdUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={isPwdUpdating}
                >
                  {isPwdUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;