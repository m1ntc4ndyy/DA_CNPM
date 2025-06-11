import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useAuth} from "../context/AuthProvider"; 
import axiosInstance from "../utils/axiosInstance";
export default function CheckInPage() {
	const {authToken} = useAuth();
	const { qrcode } = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		const checkIn = async () => {
			try {
				const response = await axiosInstance.post(`api/attendances/check-in/${qrcode}`, {}, {
					headers: {
						'Authorization': `Bearer ${authToken}`,
					},
				});
				console.log('Check-in successful:', response.data);
				// Handle successful check-in, e.g., show a success message or redirect
				alert('Check-in successful!');
				// Redirect or perform any other actions after successful check-in
				navigate('/'); // Redirect to home page after check-in

			} catch (error) {
				console.error('Error during check-in:', error);
			}
		};
		checkIn();
	}, []);
	
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Check-In Page</h1>
      <p className="text-lg text-gray-700">This is the check-in page for event participants.</p>
      {/* Add your check-in logic and UI components here */}
    </div>
  );
}