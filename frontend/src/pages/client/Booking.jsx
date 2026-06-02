import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Calendar, CreditCard, ArrowLeft, Loader2, Info, CheckCircle2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({}); // { serviceId: quantity }
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  
  // Payment States
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [searchParams] = useSearchParams();
  const queryCheckIn = searchParams.get('checkInDate');
  const queryCheckOut = searchParams.get('checkOutDate');

  // Quản lý ngày bằng đối tượng Date để DatePicker hoạt động mượt mà
  const [startDate, setStartDate] = useState(queryCheckIn ? new Date(queryCheckIn) : new Date());
  const [endDate, setEndDate] = useState(queryCheckOut ? new Date(queryCheckOut) : new Date(Date.now() + 86400000));
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(1);

  const depositAmount = totalPrice * 0.5;

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value));
    } catch {
      return `${Number(value).toLocaleString()} đ`;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [roomRes, discountRes, serviceRes] = await Promise.all([
          axiosClient.get(`/rooms/${roomId}`),
          axiosClient.get('/discounts/active'),
          axiosClient.get('/services')
        ]);
        setRoom(roomRes.data);
        setActiveDiscounts(discountRes.data || []);
        setAvailableServices(serviceRes.data || []);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: t('booking.error'), text: t('booking.room_not_found') });
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
        
        const roomTotal = Math.round(diffDays * price * discountFactor);
        
        // Tính tổng tiền dịch vụ cộng thêm
        const servicesTotal = Object.entries(selectedServices).reduce((sum, [serviceId, quantity]) => {
            const service = availableServices.find(s => s.id === Number(serviceId));
            return sum + (service ? Number(service.price) * quantity : 0);
        }, 0);
        
        setTotalPrice(roomTotal + servicesTotal);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, room, activeDiscounts, selectedServices, availableServices]);

  const updateServiceQuantity = (serviceId, delta) => {
    setSelectedServices(prev => {
      const currentQty = prev[serviceId] || 0;
      const newQty = currentQty + delta;
      
      if (newQty <= 0) {
        const newState = { ...prev };
        delete newState[serviceId];
        return newState;
      }
      return { ...prev, [serviceId]: newQty };
    });
  };

  const handleBooking = async () => {
    if (totalPrice <= 0) {
      return Swal.fire(t('booking.notice'), t('booking.invalid_dates'), 'warning');
    }

    try {
      Swal.fire({ title: t('booking.preparing_invoice'), didOpen: () => Swal.showLoading() });
      const res = await axiosClient.post('/bookings', {
        roomId: roomId,
        checkInDate: startDate.toISOString().split('T')[0],
        checkOutDate: endDate.toISOString().split('T')[0],
        totalPrice: totalPrice,
        services: Object.entries(selectedServices).map(([serviceId, quantity]) => ({
            serviceId: Number(serviceId),
            quantity
        }))
      });
      
      Swal.close();
      
      // Mở Modal Thanh toán
      setPendingBookingId(res.data.id);
      setShowPayment(true);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || t('booking.booking_failed');
      Swal.fire(t('booking.error'), errorMsg, 'error');
    }
  };

  const handleProcessPayment = async (method) => {
    setProcessingPayment(true);
    
    // Giả lập thời gian kết nối với Cổng thanh toán (VNPay/MoMo/Bank)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Gọi API cập nhật trạng thái đơn hàng thành confirmed
      await axiosClient.put(`/bookings/${pendingBookingId}`, { status: 'confirmed' });
      
      setShowPayment(false);
      setProcessingPayment(false);
      
      Swal.fire({
        icon: 'success',
        title: t('booking.payment_success'),
        html: `${t('booking.payment_success_msg')} <b>${method}</b>.<br/>${t('booking.room_secured')}`,
        confirmButtonColor: '#d97706',
        borderRadius: '2rem'
      }).then(() => navigate('/profile'));
      
    } catch (err) {
      setProcessingPayment(false);
      Swal.fire(t('booking.error'), t('booking.payment_failed'), 'error');
    }
  };

  const handleVNPay = async () => {
    setProcessingPayment(true);
    try {
      const res = await axiosClient.post('/payments/create_payment_url', {
        bookingId: pendingBookingId,
        amount: depositAmount
      });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      setProcessingPayment(false);
      Swal.fire(t('booking.error'), "Lỗi kết nối VNPay", 'error');
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
          <ArrowLeft size={16} /> {t('booking.go_back')}
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* TRÁI: INFO PHÒNG */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600 uppercase tracking-wider text-sm font-semibold">
                <Star size={14} fill="currentColor" /> {t('booking.premium_room')}
              </div>
              <h1 className="text-2xl md:text-3xl font-medium font-sans text-gray-900">
                {t('booking.room_title')} <span className="text-amber-600 not-italic">{room?.roomNumber}</span>
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

            {/* DỊCH VỤ ĐI KÈM */}
            <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <h3 className="text-lg font-medium font-sans text-gray-900 mb-6">{t('booking.services_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.map(service => {
                  const qty = selectedServices[service.id] || 0;
                  const isSelected = qty > 0;
                  return (
                  <div 
                    key={service.id} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-50/50' 
                        : 'border-gray-100 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 cursor-pointer" onClick={() => updateServiceQuantity(service.id, isSelected ? -qty : 1)}>
                        <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'}`}>
                          {isSelected && <CheckCircle2 size={14} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 font-sans">{service.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                          <p className="text-sm font-semibold text-amber-600 mt-2">{formatCurrency(service.price)} <span className="text-[10px] text-gray-400 font-normal">/ {service.unit || 'khách'}</span></p>
                        </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-between border-t border-amber-200/50 pt-3 mt-1">
                         <span className="text-xs font-black uppercase tracking-widest text-amber-700/60">Số lượng:</span>
                         <div className="flex items-center gap-3 bg-white rounded-lg border border-amber-200 p-1">
                            <button onClick={(e) => { e.stopPropagation(); updateServiceQuantity(service.id, -1); }} className="w-6 h-6 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-200 transition-colors">-</button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button onClick={(e) => { e.stopPropagation(); updateServiceQuantity(service.id, 1); }} className="w-6 h-6 flex items-center justify-center rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">+</button>
                         </div>
                      </div>
                    )}
                  </div>
                )})}
                {availableServices.length === 0 && (
                  <p className="text-sm text-gray-400 italic">{t('booking.no_services')}</p>
                )}
              </div>
            </div>
          </div>

          {/* PHẢI: FORM CHỌN NGÀY */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl md:rounded-[2rem] md:sticky md:top-28 shadow-sm">
              <h3 className="text-xl md:text-xl font-medium font-sans mb-6 text-center text-gray-900">{t('booking.your_schedule')}</h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-4 font-sans">{t('booking.dates_label')}</label>
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
                        placeholderText={t('booking.check_in')}
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
                        placeholderText={t('booking.check_out')}
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm focus:border-amber-600 focus:bg-white outline-none transition-all cursor-pointer text-gray-900 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-3">
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">
                    <span>{t('booking.duration')}</span>
                    <span className="text-gray-900">{days} {t('booking.nights')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">
                    <span>{t('booking.unit_price')}</span>
                    <span className="text-gray-900">{formatCurrency(room?.roomType?.price || 0)} {t('booking.per_night')}</span>
                  </div>
                  {activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)) && (
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-rose-500 font-bold font-sans">
                      <span>{t('booking.discount_applied')}</span>
                      <span>-{Math.floor(activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)).discountPercent)}%</span>
                    </div>
                  )}
                  {Object.keys(selectedServices).length > 0 && (
                    <div className="flex justify-between items-start text-xs uppercase tracking-widest text-amber-600 font-bold font-sans">
                      <span className="flex flex-col gap-1">{t('booking.included_services')}</span>
                      <span className="text-right">
                        +{formatCurrency(Object.entries(selectedServices).reduce((sum, [id, qty]) => {
                          const s = availableServices.find(x => x.id === Number(id));
                          return sum + (s ? Number(s.price) * qty : 0);
                        }, 0))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-3">
                    <div>
                      <div className="text-xs font-black uppercase text-amber-600 tracking-wider">{t('booking.total_value')}</div>
                      <div className="text-sm text-gray-500">{days} {t('booking.night')} • {formatCurrency(room?.roomType?.price || 0)} {t('booking.per_night')}</div>
                    </div>
                     <div className="text-right">
                      {activeDiscounts.find(d => d.roomTypeId === (room?.roomType?.id || room?.typeId)) && (
                         <div className="text-sm text-gray-400 line-through mb-0.5">
                            {formatCurrency((days * (room?.roomType?.price || room?.typeDetails?.price || 0)) + Object.entries(selectedServices).reduce((sum, [id, qty]) => {
                               const s = availableServices.find(x => x.id === Number(id));
                               return sum + (s ? Number(s.price) * qty : 0);
                            }, 0))}
                         </div>
                      )}
                      <div className="text-xl md:text-xl font-medium font-sans font-semibold tracking-tight text-gray-900">{formatCurrency(totalPrice)}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  aria-label="Xác nhận đặt phòng"
                  className="w-full bg-amber-600 hover:opacity-95 text-white py-3 md:py-4 rounded-lg font-semibold uppercase text-sm tracking-wider transition-shadow flex items-center justify-center gap-3 shadow-soft active:scale-95"
                >
                  {t('booking.confirm_booking')} <CreditCard size={18} />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-3">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="font-medium">{t('booking.secure_confirm')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIRTUAL PAYMENT GATEWAY MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !processingPayment && setShowPayment(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-slate-50 p-8 text-center border-b border-slate-100 relative">
              <h3 className="text-xl font-medium font-sans text-slate-900">{t('booking.secure_payment')}</h3>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-2">{t('booking.deposit_amount')} <span className="text-amber-600">{formatCurrency(depositAmount)}</span></p>
            </div>
            
            {/* Body */}
            <div className="p-8 space-y-4">
              {processingPayment ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm font-bold text-slate-600 animate-pulse uppercase tracking-widest">{t('booking.connecting_bank')}</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="inline-block p-2 md:p-4 bg-white border-2 border-amber-500 rounded-3xl shadow-lg relative">
                      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">{t('booking.scan_qr')}</div>
                      <img 
                        src={`https://img.vietqr.io/image/vietcombank-1022103170-compact2.png?amount=${depositAmount}&addInfo=Thanh toan phong ${pendingBookingId}&accountName=UY NAM`} 
                        alt="VietQR" 
                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                      />
                    </div>
                    <div className="mt-6 space-y-1 mb-6">
                      <p className="text-sm font-bold text-slate-900">{t('booking.bank_name')}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('booking.account_number')} <span className="text-amber-600">1022103170</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => handleProcessPayment('VietQR')} className="w-full bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all">
                        {t('booking.payment_done')}
                    </button>
                    <button onClick={handleVNPay} className="w-full bg-[#005BAA] hover:bg-[#004A8A] text-white p-3 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all">
                        Thanh toán VNPay
                    </button>
                  </div>
                  
                  <button onClick={() => { setShowPayment(false); navigate('/profile'); }} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 p-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all">
                    {t('booking.pay_later')}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-xs text-rose-500 font-medium italic">
                      * {t('booking.deposit_note').replace('{amount}', formatCurrency(totalPrice - depositAmount))}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
               <p className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
                 <CheckCircle2 size={12} className="text-emerald-500" />
                 {t('booking.ssl_secure')}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
