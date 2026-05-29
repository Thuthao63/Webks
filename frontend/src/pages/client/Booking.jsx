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

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value));
    } catch {
      return `${Number(value).toLocaleString()} đ`;
    }
  };

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
        console.error(err);
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
  }, [startDate, endDate, room, activeDiscounts]);

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
      console.error(err);
      Swal.fire('Lỗi', 'Đặt phòng thất bại, Thảo kiểm tra lại nhé!', 'error');
    }
  };

  if (loading) return (
    <div className="h-screen bg-paper flex items-center justify-center">
      <Loader2 className="animate-spin text-amber-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-paper text-gray-900 pt-32 pb-20 px-6 font-sans">
      {/* CSS CUSTOM CHO DATEPICKER SANG TRỌNG - GIAO DIỆN SÁNG */}
      <style>{`
        .react-datepicker { background-color: #fff; border: 1px solid #eee; color: #1a1a1a; font-family: inherit; border-radius: 1rem; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .react-datepicker__header { background-color: #fafafa; border-bottom: 1px solid #f1f1f1; padding-top: 0.75rem; }
        .react-datepicker__current-month, .react-datepicker__day-name { color: #1a1a1a !important; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.06em; }
        .react-datepicker__day { color: #444 !important; }
        .react-datepicker__day:hover { background-color: #D97706 !important; color: #fff !important; border-radius: 0.5rem; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background-color: #D97706 !important; color: white !important; border-radius: 0.5rem; }
        .react-datepicker__day--disabled { color: #ddd !important; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-all mb-10 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* TRÁI: INFO PHÒNG */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600 uppercase tracking-wider text-sm font-semibold">
                <Star size={14} fill="currentColor" /> Hạng phòng thượng lưu
              </div>
              <h1 className="text-2xl md:text-4xl font-serif italic text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Phòng <span className="text-amber-600 not-italic">{room?.roomNumber}</span>
              </h1>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
              <img
                src={`/Hinh anh/Hinh${(room?.id % 20) + 1}.png`}
                srcSet={
                  `/Hinh anh/Hinh${(room?.id % 20) + 1}.png 1x, /Hinh anh/Hinh${(room?.id % 20) + 1}.png 2x`
                }
                loading="lazy"
                className="w-full h-72 md:h-96 object-cover group-hover:scale-102 transition-transform duration-700"
                alt={`Hình phòng ${room?.roomNumber}`}
              />
            </div>

            <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <p className="text-gray-600 leading-loose italic font-sans">"{room?.roomType?.description || 'Tận hưởng không gian sang trọng và tiện nghi bậc nhất.'}"</p>
            </div>
          </div>

          {/* PHẢI: FORM CHỌN NGÀY */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl md:rounded-[2rem] md:sticky md:top-28 shadow-sm">
              <h3 className="text-xl md:text-2xl font-serif italic mb-6 text-center text-gray-900">Lịch trình của bạn</h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-4 font-sans">Ngày nhận & trả phòng</label>
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
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm focus:border-amber-600 focus:bg-white outline-none transition-all cursor-pointer text-gray-900 font-sans"
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
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm focus:border-amber-600 focus:bg-white outline-none transition-all cursor-pointer text-gray-900 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-3">
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">
                    <span>Thời gian</span>
                    <span className="text-gray-900">{days} đêm</span>
                  </div>
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">
                    <span>Đơn giá</span>
                    <span className="text-gray-900">{formatCurrency(room?.roomType?.price || 0)} / đêm</span>
                  </div>
                  {activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)) && (
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-rose-500 font-bold font-sans">
                      <span>Ưu đãi áp dụng</span>
                      <span>-{Math.floor(activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)).discountPercent)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-3">
                    <div>
                      <div className="text-xs font-black uppercase text-amber-600 tracking-wider">Tổng giá trị</div>
                      <div className="text-sm text-gray-500">{days} đêm • {formatCurrency(room?.roomType?.price || 0)} / đêm</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-serif text-gray-900 italic">{formatCurrency(totalPrice)}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  aria-label="Xác nhận đặt phòng"
                  className="w-full bg-amber-600 hover:opacity-95 text-white py-3 md:py-4 rounded-lg font-semibold uppercase text-sm tracking-wider transition-shadow flex items-center justify-center gap-3 shadow-soft active:scale-95"
                >
                  Xác nhận đặt ngay <CreditCard size={18} />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-3">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="font-medium">Bảo mật & Xác nhận tức thì</span>
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

