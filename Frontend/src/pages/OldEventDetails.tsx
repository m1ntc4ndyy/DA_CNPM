import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '../types';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthProvider';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await axiosInstance.get(`/api/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }

      });
      setEvent(res.data.data.event);
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
    // <div classNameName="max-w-[70%] min-h-screen mx-auto bg-gray-50 p-8">

    //   <div classNameName="max-w-3xl w-[67%] mx-auto flex flex-col bg-white shadow-lg rounded-lg p-6">
    //     {event.image && <img classNameName="w-full h-64 object-cover rounded-lg" src={event.image} alt={event.title} />}
    //     <h1 classNameName="text-2xl font-bold mt-4">{event.title}</h1>
    //     <p classNameName="text-gray-500 mt-2">{event.description}</p>
    //     <p classNameName="mt-4"><strong>Location:</strong> {event.location}</p>
    //     <p><strong>Start date:</strong> {event.startDate.split("T")[0]}</p>
    //     <p><strong>End date:</strong> {event.endDate.split("T")[0]}</p>


    //     <p><strong>Time:</strong> {event.time}</p>
    //     <p><strong>Attendees:</strong> {event.registrationCount}/{event.capacity}</p>
    //   </div>
      
    // </div>
    <>
   
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
   {/* <!-- Main job card --> */}
   <section aria-label="Job posting main information" className="bg-white rounded-lg p-6 md:p-8 shadow-sm relative">
    <div className="flex items-start justify-between">
     <h1 className="text-[#111827] font-semibold text-lg md:text-xl leading-tight max-w-[90%]">
      {event.title}
      <i aria-label="Verified" className="fas fa-check-circle text-[#10B981] ml-1" title="Verified">
      </i>
     </h1>
     <img alt="Green lightning bolt icon" className="w-10 h-12 object-contain" height="48" loading="lazy" src="https://storage.googleapis.com/a1aa/image/c12c66a0-9db7-4f36-3e6b-2eabac797f00.jpg" width="40"/>
    </div>
    <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4 text-[#374151] text-sm md:text-base">
     <div className="flex items-center gap-3 min-w-[140px]">
      <div aria-hidden="true" className="bg-[#10B981] text-white p-2 rounded-full flex items-center justify-center">
       <i className="fas fa-map-marker-alt text-base">
       </i>
      </div>
      <div>
       <p className="font-semibold text-[#374151]">
        Địa điểm
       </p>
       <p className="font-normal text-[#111827]">
        {event.location}
       </p>
      </div>
     </div>
     <div className="flex items-center gap-3 min-w-[140px]">
      <div aria-hidden="true" className="bg-[#10B981] text-white p-2 rounded-full flex items-center justify-center">
       <i className="fas fa-hourglass-half text-base">
       </i>
      </div>
      <div>
       <p className="font-semibold text-[#374151]">
        Thời gian
       </p>
       <p className="font-normal text-[#111827]">
        {event.startDate}
       </p>
       
      </div>
     </div>
    </div>
    <p className="mt-4 inline-flex items-center gap-2 text-[#6B7280] text-xs md:text-sm bg-[#E5E7EB] rounded px-3 py-1 select-none">
     <i className="far fa-clock">
     </i>
     Hạn nộp hồ sơ: {event.registrationDeadline}
    </p>
    <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-[480px]">
     <button className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0f9e6e] text-white font-semibold rounded-md px-5 py-3 w-full sm:w-auto transition" type="button">
      <i className="fas fa-paper-plane">
      </i>
      Đăng ký ngay
     </button>
    </div>
   </section>
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* <!-- Left content --> */}
    <section aria-label="Job details" className="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 shadow-sm space-y-6">
     <div className="flex justify-between items-center">
      <h2 className="text-[#111827] font-semibold text-lg md:text-xl border-l-4 border-[#10B981] pl-3">
       Chi tiết tin tuyển dụng
      </h2>
      <button className="flex items-center gap-2 border border-[#10B981] text-[#10B981] rounded-md px-4 py-2 text-sm md:text-base hover:bg-[#d1fae5] transition" type="button">
       <i className="far fa-bell">
       </i>
       Gửi tôi việc làm tương tự!
      </button>
     </div>
     <div className="flex flex-wrap gap-2">
      <span className="bg-[#F3F4F6] text-[#374151] text-xs md:text-sm rounded-full px-3 py-1">
       Chuyên môn Chăm sóc khách hàng
      </span>
      <span className="bg-[#F3F4F6] text-[#374151] text-xs md:text-sm rounded-full px-3 py-1">
       Ngân hàng
      </span>
      <span className="bg-[#F3F4F6] text-[#374151] text-xs md:text-sm rounded-full px-3 py-1">
       Du lịch
      </span>
      <span className="bg-[#F3F4F6] text-[#374151] text-xs md:text-sm rounded-full px-3 py-1">
       Nhà hàng / Khách sạn
      </span>
      <span className="bg-[#F3F4F6] text-[#374151] text-xs md:text-sm rounded-full px-3 py-1">
       Tuổi 18 - 35
      </span>
     </div>
     <div className="space-y-4 text-[#111827] text-sm md:text-base">
      <div>
       <p className="font-semibold mb-2">
        Mô tả công việc
       </p>
       <ul className="list-disc list-inside space-y-1">
        {/* <li>
         Chăm sóc khách hàng App Du Lịch: Hỗ trợ khách hàng quốc tế về các
                dịch vụ du lịch, lưu trú, thay đổi/hủy dịch vụ, và phản hồi thắc
                mắc liên quan.
        </li>
        <li>
         Chăm sóc khách hàng Ngân Hàng: Cung cấp giải đáp về các dịch vụ
                ngân hàng quốc tế, hỗ trợ khách hàng trong các giao dịch tài chính
                và thắc mắc về tài khoản, dịch vụ ngân hàng.
        </li>
        <li>
         Cung cấp thông tin chính xác và đầy đủ bằng các công cụ và quy
                trình chuyên nghiệp.
        </li>
        <li>
         Đảm bảo mỗi khách hàng đều có trải nghiệm tuyệt vời và hài lòng
                khi sử dụng dịch vụ.
        </li> */}
        {event.description.split('\n').map((item, index) => (
          <li key={index}>
           {item}
          </li>
        ))}
       </ul>
      </div>
      <div>
       <p className="font-semibold mb-2">
        Yêu cầu ứng viên
       </p>
       <ul className="list-disc list-inside space-y-1">
        <li>
         Thành thạo tiếng Anh, tự tin làm việc 100% bằng tiếng Anh với khách
                nước ngoài.
        </li>
        <li>
         Có trách nhiệm cao, tận tâm trong công việc và luôn hướng đến sự
                chuyên nghiệp.
        </li>
        <li>
         Bắt buộc xoay ca (phụ cấp 30% lương khi làm ca đêm).
        </li>
       </ul>
      </div>
     </div>
    </section>
    {/* <!-- Right content --> */}
    <aside className="space-y-6">
     {/* <!-- Company card --> */}
     <section aria-label="Company information" className="bg-white rounded-lg p-6 md:p-8 shadow-sm space-y-4 max-w-[320px]">
      <div className="flex items-center gap-4">
       <img alt="Logo of company TPC with orange background and black text TPC" className="w-16 h-16 object-contain rounded" height="64" loading="lazy" src="https://storage.googleapis.com/a1aa/image/7b647b62-0868-4593-134f-ed1f19f1e78a.jpg" width="64"/>
       <h3 className="text-[#111827] font-semibold text-base md:text-lg leading-tight">
        CÔNG TY TNHH TƯ VẤN GIẢI PHÁP DOANH NGHIỆP TPC
       </h3>
      </div>
      <dl className="text-[#6B7280] text-sm md:text-base space-y-3">
       <div className="flex items-center gap-2">
        <dt className="flex-shrink-0 font-semibold w-[80px]">
         Quy mô:
        </dt>
        <dd className="flex items-center gap-2 text-[#374151]">
         <i className="fas fa-users">
         </i>
         25-99 nhân viên
        </dd>
       </div>
       <div className="flex items-center gap-2">
        <dt className="flex-shrink-0 font-semibold w-[80px]">
         Lĩnh vực:
        </dt>
        <dd className="flex items-center gap-2 text-[#374151]">
         <i className="fas fa-cube">
         </i>
         Nhân sự
        </dd>
       </div>
       <div className="flex items-start gap-2">
        <dt className="flex-shrink-0 font-semibold w-[80px]">
         Địa điểm:
        </dt>
        <dd className="flex-1 text-[#374151] text-sm md:text-base leading-snug">
         <i className="fas fa-map-marker-alt mt-[3px]">
         </i>
         The District Tower, 159C Đường Đề Thám, Phường Cô Giang, Quận 1,
                Thành phố Hồ Chí Minh
        </dd>
       </div>
      </dl>
      <a className="text-[#10B981] font-semibold text-sm md:text-base flex items-center gap-1 hover:underline" href="#">
       Xem trang công ty
       <i className="fas fa-external-link-alt text-xs">
       </i>
      </a>
     </section>
     {/* <!-- General info --> */}
     {/* <section aria-label="General information" className="bg-white rounded-lg p-6 md:p-8 shadow-sm max-w-[320px]">
      <h2 className="text-[#111827] font-semibold text-lg md:text-xl mb-4">
       Thông tin chung
      </h2>
      <dl className="space-y-6 text-sm md:text-base text-[#374151]">
       <div className="flex items-center gap-3">
        <div aria-hidden="true" className="bg-[#10B981] text-white p-3 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
         <i className="fas fa-shield-alt text-lg">
         </i>
        </div>
        <div>
         <dt className="font-semibold text-[#374151]">
          Cấp bậc
         </dt>
         <dd className="font-bold text-[#111827]">
          Nhân viên
         </dd>
        </div>
       </div>
       <div className="flex items-center gap-3">
        <div aria-hidden="true" className="bg-[#10B981] text-white p-3 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
         <i className="fas fa-graduation-cap text-lg">
         </i>
        </div>
        <div>
         <dt className="font-semibold text-[#374151]">
          Học vấn
         </dt>
         <dd className="font-bold text-[#111827]">
          Trung học phổ thông (Cấp 3) trở lên
         </dd>
        </div>
       </div>
       <div className="flex items-center gap-3">
        <div aria-hidden="true" className="bg-[#10B981] text-white p-3 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
         <i className="fas fa-users text-lg">
         </i>
        </div>
        <div>
         <dt className="font-semibold text-[#374151]">
          Số lượng tuyển
         </dt>
         <dd className="font-bold text-[#111827]">
          30 người
         </dd>
        </div>
       </div>
       <div className="flex items-center gap-3">
        <div aria-hidden="true" className="bg-[#10B981] text-white p-3 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
         <i className="fas fa-briefcase text-lg">
         </i>
        </div>
        <div>
         <dt className="font-semibold text-[#374151]">
          Hình thức làm việc
         </dt>
         <dd className="font-bold text-[#111827]">
          Toàn thời gian
         </dd>
        </div>
       </div>
      </dl>
     </section> */}
    </aside>
   </div>
  </div>
  {/* // <!-- Social floating vertical buttons left --> */}
  <nav aria-label="Social media share" className="fixed top-1/2 left-0 -translate-y-1/2 flex flex-col space-y-3 bg-white rounded-r-md shadow-md p-1 z-50">
   <a aria-label="Share on Facebook" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition" href="#" title="Share on Facebook">
    <i className="fab fa-facebook-f text-[#3b5998]">
    </i>
   </a>
   <a aria-label="Share on Twitter" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition" href="#" title="Share on Twitter">
    <i className="fab fa-twitter text-[#1da1f2]">
    </i>
   </a>
   <a aria-label="Share on LinkedIn" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition" href="#" title="Share on LinkedIn">
    <i className="fab fa-linkedin-in text-[#0077b5]">
    </i>
   </a>
   <a aria-label="Share on another platform" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition" href="#" title="Share on another platform">
    <i className="fas fa-link text-gray-600">
    </i>
   </a>
   </nav>
   </>
  );
};

export default EventDetails;
