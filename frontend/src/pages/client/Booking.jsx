import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Calendar, CreditCard, ArrowLeft, Loader2, Info, CheckCircle2, Star } from 'lucide-react';

// Import DatePicker và CSS của nó
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quản lý ngày bằng đối tượng Date để DatePicker hoạt động mượt mà
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, discountRes] = await Promise.all([
          axiosClient.get(`/rooms/${roomId}`),
          axiosClient.get('/discounts/active')
        ]);
        setRoom(roomRes.data);
        setActiveDiscounts(discountRes.data || []);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không tìm thấy thông tin phòng!' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  // Logic tính tiền tự động
  useEffect(() => {
    const price = room?.roomType?.price || room?.typeDetails?.price || 0;
    if (price > 0 && startDate && endDate) {
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setDays(diffDays);
        
        // Tính giảm giá
        const activeDiscount = activeDiscounts.find(d => d.roomTypeId === (room.roomType?.id || room.typeId));
        const discountFactor = activeDiscount ? (1 - Number(activeDiscount.discountPercent) / 100) : 1;
        
        setTotalPrice(Math.round(diffDays * price * discountFactor));
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
    <div className="h-screen bg-[#FDFBF7] flex items-center justify-center">
      <Loader2 className="animate-spin text-amber-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pt-32 pb-20 px-6 font-sans">
      {/* CSS CUSTOM CHO DATEPICKER SANG TRỌNG - GIAO DIỆN SÁNG */}
      <style>{`
        .react-datepicker { background-color: #fff; border: 1px solid #eee; color: #1a1a1a; font-family: inherit; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
        .react-datepicker__header { background-color: #f9f9f9; border-bottom: 1px solid #eee; padding-top: 1rem; }
        .react-datepicker__current-month, .react-datepicker__day-name { color: #1a1a1a !important; font-weight: 800; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em; }
        .react-datepicker__day { color: #444 !important; }
        .react-datepicker__day:hover { background-color: #amber-600 !important; color: white !important; border-radius: 0.5rem; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background-color: #D97706 !important; color: white !important; border-radius: 0.5rem; }
        .react-datepicker__day--disabled { color: #ddd !important; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* TRÁI: INFO PHÒNG */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 uppercase tracking-[0.4em] text-[10px] font-bold">
                <Star size={14} fill="currentColor" /> Hạng phòng thượng lưu
              </div>
              <h1 className="text-6xl font-serif italic text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Phòng <span className="text-amber-600 not-italic">{room?.roomNumber}</span>
              </h1>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl relative group">
              <img
                src={`/Hinh anh/Hinh${(room?.id % 20) + 1}.png`}
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Room"
              />
            </div>

            <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <p className="text-gray-600 leading-loose italic">"{room?.roomType?.description || 'Tận hưởng không gian sang trọng và tiện nghi bậc nhất.'}"</p>
            </div>
          </div>

          {/* PHẢI: FORM CHỌN NGÀY */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-10 rounded-[3rem] sticky top-32 shadow-2xl">
              <h3 className="text-2xl font-serif italic mb-8 text-center text-gray-900">Lịch trình của bạn</h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-4">Ngày nhận & trả phòng</label>
                  <div className="relative grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 z-10" size={16} />
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
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm focus:border-amber-600 focus:bg-white outline-none transition-all cursor-pointer text-gray-900"
                      />
                    </div>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 z-10" size={16} />
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
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm focus:border-amber-600 focus:bg-white outline-none transition-all cursor-pointer text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <span>Thời gian</span>
                    <span className="text-gray-900">{days} đêm</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <span>Đơn giá</span>
                    <span className="text-gray-900">{(room?.roomType?.price || 0).toLocaleString()}đ / đêm</span>
                  </div>
                  {activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)) && (
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-rose-500 font-bold">
                      <span>Ưu đãi áp dụng</span>
                      <span>-{Math.floor(activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)).discountPercent)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em]">Tổng giá trị</span>
                    <span className="text-4xl font-serif text-gray-900 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {totalPrice.toLocaleString()}<span className="text-xs ml-1 not-italic text-amber-600 font-sans">VNĐ</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-amber-600 hover:bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-3 shadow-xl shadow-amber-600/10 active:scale-95"
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