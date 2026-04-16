import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Users, Home, Search, ArrowRight } from 'lucide-react';
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);

const BookingBar = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(2);

    const handleSearch = () => {
        // Điều hướng đến danh sách phòng, có thể kèm theo state hoặc đơn giản là chuyển hướng
        navigate('/rooms');
    };

    return (
        <div className="relative z-40 max-w-6xl mx-auto px-6 -mt-16 md:-mt-20">
            {/* CSS Custom cho DatePicker trong BookingBar */}
            <style>{`
                .booking-bar .react-datepicker-wrapper { width: 100%; }
                .booking-bar .react-datepicker { 
                    background-color: #ffffff; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 1.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                    font-family: inherit;
                    overflow: hidden;
                }
                .booking-bar .react-datepicker__header { background-color: #f9fafb; border-bottom: 1px solid #f3f4f6; padding-top: 1.5rem; }
                .booking-bar .react-datepicker__current-month { color: #111827; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }
                .booking-bar .react-datepicker__day-name { color: #9ca3af; font-size: 0.7rem; font-weight: 700; }
                .booking-bar .react-datepicker__day { color: #374151; border-radius: 0.5rem; transition: all 0.2s; }
                .booking-bar .react-datepicker__day:hover { background-color: #d97706 !important; color: white !important; }
                .booking-bar .react-datepicker__day--selected, 
                .booking-bar .react-datepicker__day--in-range { background-color: #d97706 !important; color: white !important; }
            `}</style>

            <div className="booking-bar bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2rem] p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                
                {/* Check In */}
                <div className="relative group px-4 py-2 hover:bg-black/5 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                        <Calendar size={14} className="text-amber-600" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Ngày nhận</span>
                    </div>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        locale="vi"
                        placeholderText="Chọn ngày"
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 outline-none cursor-pointer placeholder:text-gray-300"
                    />
                </div>

                {/* Check Out */}
                <div className="relative group px-4 py-2 hover:bg-black/5 rounded-2xl transition-all duration-300 border-l border-gray-100 hidden md:block">
                    <div className="flex items-center gap-3 mb-1">
                        <Calendar size={14} className="text-amber-600" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Ngày trả</span>
                    </div>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        locale="vi"
                        placeholderText="Chọn ngày"
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 outline-none cursor-pointer placeholder:text-gray-300"
                    />
                </div>

                {/* Guests */}
                <div className="relative group px-4 py-2 hover:bg-black/5 rounded-2xl transition-all duration-300 border-l border-gray-100 hidden md:block">
                    <div className="flex items-center gap-3 mb-1">
                        <Users size={14} className="text-amber-600" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Khách hàng</span>
                    </div>
                    <select 
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 outline-none cursor-pointer appearance-none"
                    >
                        <option value={1}>1 Người lớn</option>
                        <option value={2}>2 Người lớn</option>
                        <option value={3}>3+ Người lớn</option>
                    </select>
                </div>

                {/* Search Button */}
                <button 
                    onClick={handleSearch}
                    className="bg-amber-600 hover:bg-gray-900 text-white h-full py-4 md:py-0 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-amber-600/20 group/btn"
                >
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Tìm phòng ngay</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default BookingBar;
