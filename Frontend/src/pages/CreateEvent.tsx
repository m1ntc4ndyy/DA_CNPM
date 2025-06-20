import { useState } from "react";
import { Save, X } from "lucide-react";
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from "react-router-dom"; 
import { AlertCircle } from "lucide-react";
export default function CreateEvent() {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: "",
        startDate: "",
        startTime: "",
        registrationDeadline: "",
        category: "",
        location: "",
        description: "",
        capacity: 0,
        point: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const generateQRCode = async (eventId : string) => {
        try {
            await axiosInstance.post(`/api/qr/${eventId}/generate`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
        } catch (error) {
            console.error("Error creating QR code:", error);
            alert("Failed to create QR code.");
        }
    }
    const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };
    const handleSave = async () => {
        // Validation
        if (!formData.title.trim()) {
            showErrorMessage("Event title cannot be empty.");
            return;
        }
        if (!formData.startDate) {
            showErrorMessage("Event date cannot be empty.");
            return;
        }
        if (!formData.startTime) {
            showErrorMessage("Event time cannot be empty.");
            return;
        }
        if (!formData.registrationDeadline) {
            showErrorMessage("Registration deadline cannot be empty.");
            return;
        }
        if (!formData.category) {
            showErrorMessage("Please select a category.");
            return;
        }
        if (!formData.location.trim()) {
            showErrorMessage("Location cannot be empty.");
            return;
        }
        if (!formData.description.trim()) {
            showErrorMessage("Description cannot be empty.");
            return;
        }
        if (formData.capacity <= 0) {
            showErrorMessage("Expected attendees must be greater than 0.");
            return;
        }
        if (formData.point < 0) {
            showErrorMessage("Point cannot be negative.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axiosInstance.post("/api/events", {...formData}, 
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }
            );  
            console.log("Event data submitted:", formData);
            alert("Event created successfully!");
            const eventId = res.data?.data?.event?.id;
            if (!eventId) {
                throw new Error("Event ID not returned from server");
            }
            await generateQRCode(eventId);
            navigate("/manage");
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        } finally {
            setIsLoading(false);
        }
        
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {errorMessage && (
                <div className="max-w-4xl mx-auto mt-4 px-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                        <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                                <input
                                    type="date"
                                    name="registrationDeadline"
                                    id="registrationDeadline"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                              <select
                                  name="category"
                                  id="category"
                                  value={formData.category}
                                  onChange={handleChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                  <option value="">Select a category</option>
                                  <option value="Academic">Academic</option>
                                  <option value="Sport">Sport</option>
                                  <option value="Art">Art</option>
                                  <option value="Meeting">Meeting</option>
                                  <option value="Other">Other</option>
                              </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            <div>
                                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Expected Attendees</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    id="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="point" className="block text-sm font-medium text-gray-700">Point</label>
                                <input
                                    type="number"
                                    name="point"
                                    id="point"
                                    value={formData.point}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            
                        </div>

                        <div className="flex justify-end space-x-3 pt-5">
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    title: "",
                                    startDate: "",
                                    startTime: "",
                                    registrationDeadline: "",
                                    category: "",
                                    point: 0,
                                    location: "",
                                    description: "",
                                    capacity: 0,
                                })}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}