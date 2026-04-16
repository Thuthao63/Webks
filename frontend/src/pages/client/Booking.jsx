import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Calendar, CreditCard, ArrowLeft, Loader2, Info, CheckCircle2, Star } from 'lucide-react';

// Import DatePicker và CSS của nó
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Quản lý ngày bằng đối tượng Date để DatePicker hoạt động mượt mà
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axiosClient.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không tìm thấy phòng!' });
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  // Logic tính tiền tự động
  useEffect(() => {
    const price = room?.roomType?.price || room?.typeDetails?.price || 0;
    if (price > 0 && startDate && endDate) {
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDays(diffDays);
        setTotalPrice(diffDays * price);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, room]);

  const handleBooking = async () => {
    if (totalPrice <= 0) {
      return Swal.fire('Thông báo', 'Ngày trả phòng phải sau ngày nhận ít nhất 1 đêm.', 'warning');
    }

    try {
      Swal.fire({ title: 'Đang xử lý...', didOpen: () => Swal.showLoading() });
      await axiosClient.post('/bookings', {
        roomId: roomId,
        checkInDate: startDate.toISOString().split('T')[0],
        checkOutDate: endDate.toISOString().split('T')[0],
        totalPrice: totalPrice
      });

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cảm ơn Thảo, đơn đặt phòng đã được ghi nhận.',
        confirmButtonColor: '#d97706'
      }).then(() => navigate('/profile'));
    } catch (err) {
      Swal.fire('Lỗi', 'Đặt phòng thất bại, Thảo kiểm tra lại nhé!', 'error');
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-amber-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      {/* CSS CUSTOM CHO DATEPICKER SANG TRỌNG */}
      <style>{`
        .react-datepicker { background-color: #111; border: 1px solid #333; color: white; font-family: inherit; }
        .react-datepicker__header { background-color: #1a1a1a; border-bottom: 1px solid #333; }
        .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day { color: white !important; }
        .react-datepicker__day:hover { background-color: #d97706 !important; color: black !important; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background-color: #d97706 !important; color: black !important; }
        .react-datepicker__day--disabled { color: #444 !important; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* TRÁI: INFO PHÒNG */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold">
                <Star size={14} fill="currentColor" /> Hạng phòng thượng lưu
              </div>
              <h1 className="text-6xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Phòng <span className="text-amber-500 not-italic">{room?.roomNumber}</span>
              </h1>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <img 
                src={room?.roomType?.image ? `http://localhost:5000/uploads/${room.roomType.image}` : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop'} 
                className="w-full h-[400px] object-cover" 
                alt="Room" 
              />
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-gray-400 leading-loose italic">{room?.roomType?.description}</p>
            </div>
          </div>

          {/* PHẢI: FORM CHỌN NGÀY */}
          <div className="lg:col-span-5">
            <div className="bg-[#0a0a0a] border border-amber-500/20 p-10 rounded-[2.5rem] sticky top-32 shadow-2xl">
              <h3 className="text-2xl font-serif italic mb-8 text-center">Lịch trình của bạn</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Ngày nhận & trả phòng</label>
                  <div className="relative grid grid-cols-2 gap-2">
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 z-10" size={16} />
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        locale="vi"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Ngày nhận"
                        className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-sm focus:border-amber-500 outline-none transition-all cursor-pointer"
                      />
                    </div>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 z-10" size={16} />
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        locale="vi"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Ngày trả"
                        className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-sm focus:border-amber-500 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
                    <span>Thời gian</span>
                    <span className="text-white font-bold">{days} đêm</span>
                  </div>
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
                    <span>Đơn giá</span>
                    <span className="text-white font-bold">{(room?.roomType?.price || 0).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em]">Tổng tiền</span>
                    <span className="text-4xl font-serif text-white italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {totalPrice.toLocaleString()}<span className="text-xs ml-1 not-italic text-amber-500 font-sans">VNĐ</span>
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleBooking}
                  className="w-full bg-amber-600 hover:bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-amber-600/10"
                >
                  Xác nhận đặt ngay <CreditCard size={18} />
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 uppercase tracking-widest font-bold pt-4">
                  <CheckCircle2 size={12} className="text-green-600" />
                  Bảo mật & Xác nhận tức thì
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;