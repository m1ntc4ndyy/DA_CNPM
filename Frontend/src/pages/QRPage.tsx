import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthProvider";
export default function QRPage() {
    const navigate = useNavigate();
    const { eventId } = useParams<{ eventId: string }>();
    const { authToken } = useAuth();
    const [qrCodeURL, setQRCodeURL] = useState<string | null>(null);
    useEffect(() => {
        // Check if eventId is valid, if not redirect to home
        if (!eventId) {
            navigate("/");
        }
        const getQRURL = async () => {
            try {
                const res = await axiosInstance.get(`api/qr/${eventId}`,{
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    },
                });
                if (res.status === 200) {
                    // Handle the QR code URL here, e.g., display it or store it
                    console.log("QR Code URL:", res.data.data.qrCodes.dataURL);
                    setQRCodeURL(res.data.data.qrCodes.dataURL);
                } else {
                    console.error("Failed to fetch QR code URL");
                }
            } catch (error) {
                console.error("Error fetching QR code URL:", error);
                navigate("/");
            }
        }
        getQRURL();
    }, [eventId, navigate]);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">QR Code Page</h1>
      <p className="text-gray-700 mb-8">This page is for generating and displaying QR codes for events.</p>
      {/* Placeholder for QR code generation logic */}
      <div className="flex flex-col bg-white p-6 rounded shadow-md">
        <p className="text-lg">QR Code will be displayed here.</p>
        {/* Add QR code component or logic here */}
        <div className="mt-4 mx-auto">
          <img src={qrCodeURL ?? undefined} alt="QR Code" />
        </div>
      </div>
    </div>
  );
}