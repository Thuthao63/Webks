import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { 
  Check, X, Clock, CheckCircle, XCircle, Package, Bed, 
  Calendar, Loader2, RefreshCw, Printer, User, Wallet, MoreVertical
} from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printingBooking, setPrintingBooking] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    axiosClient.get('/bookings')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setBookings(sorted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const luxurySwal = Swal.mixin({
    background: '#0a0a0ae6',
    color: '#fff',
    backdrop: 'rgba(0,0,0,0.8)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-gray-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors'
    }
  });

  const updateStatus = async (id, status) => {
    let actionText = status === 'confirmed' ? 'Xác nhận' : (status === 'cancelled' ? 'Hủy bỏ' : 'Hoàn tất');
    const result = await luxurySwal.fire({
      title: `${actionText} yêu cầu?`,
      text: "Hành động này sẽ cập nhật trạng thái đơn đặt phòng trên toàn hệ thống.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Đồng ý ${actionText}`,
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/bookings/${id}`, { status });
        luxurySwal.fire({ icon: 'success', title: 'Thực thi thành công', timer: 1500, showConfirmButton: false });
        fetchBookings();
      } catch (err) { 
        luxurySwal.fire('Lỗi hệ thống', 'Quá trình cập nhật thất bại', 'error'); 
      }
    }
  };

  const handlePrintInvoice = (booking) => {
    setPrintingBooking(booking);
    setTimeout(() => { window.print(); }, 500);
  };

  const renderStatus = (status) => {
    const config = {
      pending: { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: <Clock size={12}/>, text: 'Đang chờ' },
      confirmed: { color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: <CheckCircle size={12}/>, text: 'Đã duyệt' },
      cancelled: { color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', icon: <XCircle size={12}/>, text: 'Đã hủy' },
      completed: { color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', icon: <Package size={12}/>, text: 'Hoàn tất' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang đồng bộ giao dịch...</p>
    </div>
  );

  return (
    <>
      <AdminLayout title="Quản lý lưu trú" subtitle="Kiểm duyệt đơn đặt, theo dõi doanh thu & lịch trình khách hàng">
        <div className="space-y-8 pb-10">
          
          {/* Summary Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Tổng đơn hàng', value: bookings.length, icon: <Package size={20}/>, color: 'blue' },
              { label: 'Đang lưu trú', value: bookings.filter(b => b.status === 'confirmed').length, icon: <Bed size={20}/>, color: 'emerald' },
              { label: 'Đang chờ duyệt', value: bookings.filter(b => b.status === 'pending').length, icon: <Clock size={20}/>, color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-serif italic text-white leading-none mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400`}>
                   {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto admin-scrollbar">
              <table className="w-full text-left">
                <thead className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                  <tr>
                    <th className="px-8 py-6 whitespace-nowrap">Khách hàng</th>
                    <th className="px-6 py-6 whitespace-nowrap">Không gian</th>
                    <th className="px-6 py-6 whitespace-nowrap">Thời hạn</th>
                    <th className="px-6 py-6 whitespace-nowrap">Trạng thái</th>
                    <th className="px-8 py-6 text-right whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="group hover:bg-white/[0.01] transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-white font-black text-xs border border-white/10">
                            {(booking.user?.fullName || booking.customer?.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-wide">
                              {booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}
                            </p>
                            <p className="text-[10px] text-gray-600 font-medium">{booking.user?.email || booking.customer?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-white bg-white/5 border border-white/5 w-fit px-3 py-1.5 rounded-xl font-bold text-[12px] group-hover:border-amber-500/20 transition-colors">
                          <Bed size={14} className="text-amber-500" />
                          P. {booking.room?.roomNumber || '---'}
                        </div>
                        <p className="text-[11px] font-black text-amber-500/80 mt-2 tracking-widest">
                          {Number(booking.totalPrice || 0).toLocaleString()} <span className="text-[9px] text-gray-700 uppercase font-bold">VNĐ</span>
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                            <Calendar size={12} className="text-emerald-500/50"/> 
                            {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar size={12} className="text-rose-500/50"/> 
                            {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        {renderStatus(booking.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(booking.id, 'confirmed')} className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all">
                                <Check size={16} strokeWidth={3} />
                              </button>
                              <button onClick={() => updateStatus(booking.id, 'cancelled')} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-black transition-all">
                                <X size={16} strokeWidth={3} />
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button onClick={() => updateStatus(booking.id, 'completed')} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:shadow-luxury">
                              Trả phòng
                            </button>
                          )}
                          {(booking.status === 'completed') && (
                            <button onClick={() => handlePrintInvoice(booking)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                              <Printer size={16} />
                            </button>
                          )}
                          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                             <MoreVertical size={16} />
                          </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   </tbody>
               </table>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* Invoice Modal for Printing */}
      {printingBooking && (
        <div className="hidden print:block fixed inset-0 bg-white text-black z-[9999] p-10 font-sans">
          <div className="max-w-3xl mx-auto border border-gray-300 p-12 rounded-xl">
             <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
               <h1 className="text-3xl font-serif italic text-amber-600">Uy Nam Luxury Hotel</h1>
               <div className="text-right">
                 <h2 className="text-2xl font-black uppercase tracking-widest">Hóa Đơn</h2>
                 <p className="text-xs text-gray-500">#{String(printingBooking.id).substring(0,8).toUpperCase()}</p>
               </div>
             </div>
             <div className="mb-10 flex justify-between">
                <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Khách hàng</p>
                   <p className="font-bold text-gray-800">{printingBooking.user?.fullName || printingBooking.customer?.fullName}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Ngày lưu trú</p>
                   <p className="text-sm">{new Date(printingBooking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(printingBooking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                </div>
             </div>
             <table className="w-full text-left mb-10">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase">Diễn giải</th>
                    <th className="p-4 text-xs font-bold uppercase text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-sm font-bold">Phòng {printingBooking.room?.roomNumber || '---'} (Tiêu chuẩn Luxury)</td>
                    <td className="p-4 text-sm text-right font-black">{Number(printingBooking.totalPrice).toLocaleString()} VNĐ</td>
                  </tr>
                </tbody>
             </table>
             <div className="flex justify-end pt-4">
                <div className="w-1/2">
                   <div className="flex justify-between py-2 border-b text-gray-600">
                      <span>Tạm tính</span>
                      <span>{Number(printingBooking.totalPrice).toLocaleString()} đ</span>
                   </div>
                   <div className="flex justify-between py-3 font-black text-lg text-amber-600">
                      <span>Tổng cộng</span>
                      <span>{Number(printingBooking.totalPrice).toLocaleString()} đ</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageBookings;