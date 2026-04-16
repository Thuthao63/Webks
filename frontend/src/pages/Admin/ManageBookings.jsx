import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Check, X, Clock, CheckCircle, XCircle, Package, Bed, Calendar, Loader2 } from 'lucide-react';

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

  // Cấu hình SweetAlert2 
  const luxurySwal = Swal.mixin({
    background: '#0a0a0a',
    color: '#fff',
    customClass: {
      popup: 'border border-amber-500/20 rounded-3xl',
      title: 'font-serif italic text-amber-500',
      confirmButton: 'bg-amber-500 text-black font-bold uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-amber-400 transition-colors',
      cancelButton: 'bg-white/10 text-white font-bold uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-white/20 transition-colors'
    }
  });

  // Hàm xử lý Xác nhận / Hủy / Trả phòng
  const updateStatus = async (id, status) => {
    let actionText = '';
    let descriptionText = 'Hành động này sẽ cập nhật trạng thái đơn đặt phòng.';
    
    if (status === 'confirmed') actionText = 'Xác nhận';
    else if (status === 'cancelled') actionText = 'Hủy';
    else if (status === 'completed') {
        actionText = 'Trả phòng';
        descriptionText = 'Xác nhận khách đã thanh toán và trả lại phòng.';
    }

    const result = await luxurySwal.fire({
      title: `${actionText} đơn này?`,
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
          title: 'Thành công!',
          text: `Đơn hàng đã được chuyển sang: ${status}`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchBookings(); // Tải lại danh sách
      } catch (err) { 
        luxurySwal.fire('Lỗi', 'Cập nhật thất bại, vui lòng thử lại', 'error'); 
      }
    }
  };

  // Hàm xử lý Gia hạn phòng
  const extendBooking = async (booking) => {
    const currentOutDate = new Date(booking.checkOutDate).toISOString().split('T')[0];

    const { value: newDate } = await luxurySwal.fire({
      title: 'Gia hạn lưu trú',
      html: `
        <p class="text-sm text-gray-400 mb-4">Khách hàng: <span class="text-white font-bold">${booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}</span></p>
        <p class="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Chọn ngày trả phòng mới</p>
      `,
      input: 'date',
      inputValue: currentOutDate,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận gia hạn',
      cancelButtonText: 'Hủy'
    });

    if (newDate) {
      if (new Date(newDate) <= new Date(booking.checkOutDate)) {
        return luxurySwal.fire('Lỗi', 'Ngày gia hạn phải nằm sau ngày trả phòng hiện tại!', 'error');
      }

      try {
        // Gửi API cập nhật ngày trả phòng
        await axiosClient.put(`/bookings/${booking.id}`, { checkOutDate: newDate });
        
        luxurySwal.fire({
          icon: 'success',
          title: 'Gia hạn thành công!',
          text: `Đã dời ngày trả phòng sang ${new Date(newDate).toLocaleDateString('vi-VN')}`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchBookings(); 
      } catch (err) {
        luxurySwal.fire('Lỗi', 'Không thể cập nhật ngày lúc này. Vui lòng thử lại!', 'error');
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
      return <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">Còn {diffDays} ngày</span>;
    } else if (diffDays === 1) {
      return <span className="text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px] animate-pulse">Ngày mai trả phòng</span>;
    } else if (diffDays === 0) {
      return <span className="text-rose-500 font-black bg-rose-500/10 px-2 py-0.5 rounded-md text-[10px] animate-bounce">TRẢ PHÒNG HÔM NAY</span>;
    } else {
      return <span className="text-rose-700 font-black bg-rose-500/20 px-2 py-0.5 rounded-md text-[10px]">Quá hạn {Math.abs(diffDays)} ngày!</span>;
    }
  };

  // Hàm render Badge trạng thái đồng bộ với Dashboard
  const renderStatus = (status) => {
    const config = {
      pending: { color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
      confirmed: { color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
      cancelled: { color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', icon: <XCircle size={12}/>, text: 'Đã hủy' },
      completed: { color: 'text-blue-500 border-blue-500/30 bg-blue-500/10', icon: <Package size={12}/>, text: 'Hoàn thành' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang tải danh sách đơn</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 pt-32 relative overflow-hidden">
      {/* Background glow toàn trang */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* THANH ĐIỀU HƯỚNG Admin */}
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="text-amber-500 not-italic font-sans font-black uppercase text-2xl ml-2 tracking-wider">Đơn đặt phòng</span>
            </h2>
            <p className="text-gray-500 text-xs mt-3 tracking-[0.3em] uppercase font-bold">Kiểm duyệt, theo dõi và trả phòng</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="text-3xl font-serif italic text-amber-500 leading-none">{bookings.length}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tổng đơn</span>
          </div>
        </div>
        
        {/* TABLE CONTAINER */}
        <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.02] border-b border-white/5 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="p-6 whitespace-nowrap">Khách hàng</th>
                  <th className="p-6 whitespace-nowrap">Thông tin phòng</th>
                  <th className="p-6 whitespace-nowrap">Thời gian lưu trú</th>
                  <th className="p-6 text-center whitespace-nowrap">Trạng thái</th>
                  <th className="p-6 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length > 0 ? bookings.map(booking => (
                  <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    
                    {/* KHÁCH HÀNG */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-black shadow-lg">
                          {(booking.user?.fullName || booking.customer?.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-amber-500 transition-colors">
                            {booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}
                          </p>
                          <p className="text-[10px] tracking-wider text-gray-500 mt-0.5">
                            {booking.user?.email || booking.customer?.email || 'Chưa cập nhật email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PHÒNG */}
                    <td className="p-6 font-medium">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Bed size={16} className="text-amber-500" />
                        <span>Phòng {booking.room?.roomNumber || booking.roomDetails?.roomNumber || '---'}</span>
                      </div>
                      <p className="text-[10px] text-amber-500/70 uppercase tracking-widest mt-1 font-bold">
                        {Number(booking.totalPrice || 0).toLocaleString()} VNĐ
                      </p>
                    </td>

                    {/* THỜI GIAN & BỘ ĐẾM NGƯỢC */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5 text-[11px] text-gray-400 font-medium">
                        <span className="flex items-center gap-2">
                          <Calendar size={12} className="text-emerald-500"/> 
                          In: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={12} className="text-rose-500"/> 
                          Out: {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                        </span>
                        
                        {/* Chỉ hiện đếm ngược khi phòng Đang thuê (Đã xác nhận) */}
                        {booking.status === 'confirmed' && (
                          <div className="mt-1">
                            {getRemainingTime(booking.checkOutDate)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="p-6 text-center">
                      {renderStatus(booking.status)}
                    </td>

                    {/* THAO TÁC THEO LUỒNG LOGIC */}
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        
                        {/* 1. Đang chờ duyệt -> Hiện nút XÁC NHẬN và HỦY */}
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(booking.id, 'confirmed')} 
                              className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-black transition-all duration-300"
                              title="Xác nhận đơn"
                            >
                              <Check size={16} strokeWidth={3}/>
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, 'cancelled')} 
                              className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-black transition-all duration-300"
                              title="Hủy đơn"
                            >
                              <X size={16} strokeWidth={3}/>
                            </button>
                          </>
                        )}

                        {/* 2. Đã xác nhận (Đang ở) -> Hiện nút GIA HẠN và TRẢ PHÒNG */}
                        {booking.status === 'confirmed' && (
                          <>
                            <button 
                              onClick={() => extendBooking(booking)} 
                              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-black transition-all duration-300 text-[9px] font-black uppercase tracking-widest"
                              title="Gia hạn ngày lưu trú"
                            >
                              <Calendar size={14} /> Gia hạn
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, 'completed')} 
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 text-[9px] font-black uppercase tracking-widest"
                              title="Xác nhận khách trả phòng"
                            >
                              <Package size={14} /> Trả phòng
                            </button>
                          </>
                        )}

                        {/* 3. Đã hủy hoặc Đã hoàn thành -> Ẩn nút, báo Không khả dụng */}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                           <span className="text-[10px] text-gray-600 italic">Không khả dụng</span>
                        )}

                      </div>
                    </td>

                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500 text-sm italic border-t border-white/5">
                      Chưa có dữ liệu đặt phòng nào trong hệ thống.
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