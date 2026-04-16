import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Check, X, Clock, CheckCircle, XCircle, Package, Bed, Calendar, Loader2, RefreshCw } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    axiosClient.get('/bookings')
      .then(res => {
        // Sắp xếp đơn mới nhất lên đầu
        const sorted = res.data.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setBookings(sorted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  // Cấu hình SweetAlert2 Glassmorphism
  const luxurySwal = Swal.mixin({
    background: '#0a0a0ae6',
    color: '#fff',
    backdrop: 'rgba(0,0,0,0.8)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(217,119,6,0.15)] backdrop-blur-2xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-gray-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/10 transition-colors'
    }
  });

  // Hàm xử lý Xác nhận / Hủy / Trả phòng
  const updateStatus = async (id, status) => {
    let actionText = '';
    let descriptionText = 'Hành động này sẽ cập nhật trạng thái đơn đặt phòng của khách lưu trú.';
    
    if (status === 'confirmed') actionText = 'Xác nhận';
    else if (status === 'cancelled') actionText = 'Hủy bỏ';
    else if (status === 'completed') {
        actionText = 'Trả phòng';
        descriptionText = 'Hành động này xác nhận khách đã thanh toán đầy đủ và hoàn tất kỳ nghỉ.';
    }

    const result = await luxurySwal.fire({
      title: `${actionText} yêu cầu?`,
      text: descriptionText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Đồng ý ${actionText}`,
      cancelButtonText: 'Quay lại'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/bookings/${id}`, { status });
        luxurySwal.fire({
          icon: 'success',
          title: 'Đã thực thi!',
          text: `Đơn đã chuyển sang trạng thái: ${status}`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchBookings(); // Tải lại danh sách
      } catch (err) { 
        luxurySwal.fire('Lỗi hệ thống', 'Quá trình cập nhật thất bại, vui lòng thử lại', 'error'); 
      }
    }
  };

  // Hàm xử lý Gia hạn phòng
  const extendBooking = async (booking) => {
    const currentOutDate = new Date(booking.checkOutDate).toISOString().split('T')[0];

    const { value: newDate } = await luxurySwal.fire({
      title: 'Gia hạn lưu trú',
      html: `
        <div class="bg-black/30 p-4 border border-white/5 rounded-2xl mb-4 text-left">
          <p class="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1">Khách hàng</p>
          <p class="text-white font-bold text-lg">${booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}</p>
        </div>
        <p class="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">Xin hãy chọn ngày gia hạn mới</p>
      `,
      input: 'date',
      inputValue: currentOutDate,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận gia hạn',
      cancelButtonText: 'Hủy'
    });

    if (newDate) {
      if (new Date(newDate) <= new Date(booking.checkOutDate)) {
        return luxurySwal.fire('Thao tác lỗi', 'Ngày gia hạn bắt buộc phải nằm sau ngày trả phòng hiện tại!', 'error');
      }

      try {
        await axiosClient.put(`/bookings/${booking.id}`, { checkOutDate: newDate });
        
        luxurySwal.fire({
          icon: 'success',
          title: 'Gia hạn thành công!',
          text: `Đã dời định mức lưu trú sang ${new Date(newDate).toLocaleDateString('vi-VN')}`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchBookings(); 
      } catch (err) {
        luxurySwal.fire('Sự cố', 'Đường truyền API gián đoạn. Xin thử lại!', 'error');
      }
    }
  };

  // Hàm tính toán số ngày còn lại (Bộ đếm ngược)
  const getRemainingTime = (checkOutDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const outDate = new Date(checkOutDate);
    outDate.setHours(0, 0, 0, 0);

    const diffTime = outDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return <span className="inline-flex items-center text-emerald-400 font-black border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)] px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest">Dư {diffDays} ngày</span>;
    } else if (diffDays === 1) {
      return <span className="inline-flex items-center text-amber-400 font-black border border-amber-500/20 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.1)] px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest animate-pulse">Mai checkout</span>;
    } else if (diffDays === 0) {
      return <span className="inline-flex items-center text-rose-400 font-black border border-rose-500/20 bg-rose-500/20 shadow-[0_0_10px_rgba(251,113,133,0.2)] px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest animate-bounce">Tới hạn</span>;
    } else {
      return <span className="inline-flex items-center text-red-500 font-black border border-red-500/30 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)] px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest relative overflow-hidden"><span className="absolute inset-0 bg-red-500/20 animate-ping"></span>Lố {Math.abs(diffDays)} ngày</span>;
    }
  };

  // Hàm render Badge
  const renderStatus = (status) => {
    const config = {
      pending: { color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.1)]', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
      confirmed: { color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)]', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
      cancelled: { color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.1)]', icon: <XCircle size={12}/>, text: 'Đã hủy' },
      completed: { color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(96,165,250,0.1)]', icon: <Package size={12}/>, text: 'Hoàn thành' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center justify-center min-w-[110px] gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Truy xuất Booking</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background glow toàn trang */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* THANH ĐIỀU HƯỚNG Admin */}
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Lưu trú</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Kiểm duyệt, theo dõi thời hạn & hoàn tất thanh toán</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl">
            <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md">{bookings.length}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Dữ liệu tổng</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 border-none"><RefreshCw size={10} className="animate-spin-slow" /> Đồng bộ</span>
            </div>
          </div>
        </div>
        
        {/* TABLE CONTAINER - GLASSMORPHISM */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          <div className="overflow-x-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse border-spacing-y-3" style={{borderCollapse: 'separate'}}>
              <thead className="text-gray-400 uppercase text-[9px] font-black tracking-[0.2em]">
                <tr>
                  <th className="p-6 whitespace-nowrap pl-10">Khách hàng</th>
                  <th className="p-6 whitespace-nowrap">Định mức & Giá trị</th>
                  <th className="p-6 whitespace-nowrap">Thời lượng</th>
                  <th className="p-6 text-center whitespace-nowrap">Trạng thái</th>
                  <th className="p-6 text-center whitespace-nowrap pr-10">Thao tác</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {bookings.length > 0 ? bookings.map(booking => (
                  <tr key={booking.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01]">
                    
                    {/* KHÁCH HÀNG */}
                    <td className="p-5 pl-8 rounded-l-[2rem] border-y border-l border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(217,119,6,0.3)] relative overflow-hidden group-hover:scale-110 transition-transform">
                          <div className="absolute inset-0 bg-white/20 blur-sm"></div>
                          <span className="relative z-10">{(booking.user?.fullName || booking.customer?.fullName || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-black text-white text-base tracking-wide group-hover:text-amber-400 transition-colors drop-shadow-sm">
                            {booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}
                          </p>
                          <p className="text-[10px] tracking-wider text-gray-500 mt-1 font-medium">
                            {booking.user?.email || booking.customer?.email || 'Hồ sơ thiếu email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PHÒNG */}
                    <td className="p-5 border-y border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-2.5 text-white bg-white/5 border border-white/5 w-fit px-3 py-1.5 rounded-xl font-bold text-sm shadow-inner group-hover:border-amber-500/30 transition-colors">
                        <Bed size={16} className="text-amber-500" />
                        P. {booking.room?.roomNumber || booking.roomDetails?.roomNumber || '---'}
                      </div>
                      <p className="text-[11px] text-amber-500 uppercase tracking-[0.2em] mt-2.5 font-black drop-shadow-sm">
                        {Number(booking.totalPrice || 0).toLocaleString()} <span className="text-[9px] text-gray-500">VNĐ</span>
                      </p>
                    </td>

                    {/* THỜI GIAN & BỘ ĐẾM NGƯỢC */}
                    <td className="p-5 border-y border-white/5 group-hover:border-white/10">
                      <div className="flex flex-col gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-500 opacity-80"/> 
                          {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-rose-500 opacity-80"/> 
                          {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                        </span>
                        
                        {/* Chỉ hiện đếm ngược khi phòng Đang thuê (Đã xác nhận) */}
                        {booking.status === 'confirmed' && (
                          <div className="mt-1.5 flex transition-all">
                            {getRemainingTime(booking.checkOutDate)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="p-5 text-center border-y border-white/5 group-hover:border-white/10">
                      {renderStatus(booking.status)}
                    </td>

                    {/* THAO TÁC THEO LUỒNG LOGIC */}
                    <td className="p-5 pr-8 rounded-r-[2rem] border-y border-r border-white/5 group-hover:border-white/10">
                      <div className="flex items-center justify-center gap-2.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        
                        {/* 1. Đang chờ duyệt -> Hiện nút XÁC NHẬN và HỦY */}
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(booking.id, 'confirmed')} 
                              className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-300"
                              title="Duyệt đơn"
                            >
                              <Check size={18} strokeWidth={3}/>
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, 'cancelled')} 
                              className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl hover:bg-rose-500 hover:text-black hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] transition-all duration-300"
                              title="Từ chối đơn"
                            >
                              <X size={18} strokeWidth={3}/>
                            </button>
                          </>
                        )}

                        {/* 2. Đã xác nhận (Đang ở) -> Hiện nút GIA HẠN và TRẢ PHÒNG */}
                        {booking.status === 'confirmed' && (
                          <>
                            <button 
                              onClick={() => extendBooking(booking)} 
                              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-2xl hover:bg-amber-500 hover:text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300 text-[9px] font-black uppercase tracking-[0.2em]"
                              title="Dời ngày đi"
                            >
                              <Calendar size={14} /> Kéo dài
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, 'completed')} 
                              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-2xl hover:bg-blue-500 hover:text-black hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] transition-all duration-300 text-[9px] font-black uppercase tracking-[0.2em]"
                              title="Checkout cho khách"
                            >
                              <Package size={14} /> Checkout
                            </button>
                          </>
                        )}

                        {/* 3. Đã hủy hoặc Đã hoàn thành -> Ẩn xử lý tĩnh */}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                           <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Đã khép luồng</span>
                           </div>
                        )}

                      </div>
                    </td>

                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                      <div className="flex flex-col items-center opacity-50">
                        <Loader2 size={32} className="text-gray-400 mb-4 animate-spin-slow" />
                        <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Không tìm thấy yêu cầu đặt phòng</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageBookings;