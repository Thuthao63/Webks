import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import { Loader2, Printer, Search, User, MapPin, Calendar, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';

const GuestStats = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [printingBooking, setPrintingBooking] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosClient.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', 'Không thể lấy dữ liệu khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Nhóm booking theo Khách hàng
  const groupedBookings = bookings.reduce((acc, booking) => {
    const customerName = booking.user?.fullName || booking.customer?.fullName || 'Khách Vãng Lai';
    const email = booking.user?.email || booking.customer?.email || 'N/A';
    const phone = booking.user?.phone || booking.customer?.phone || 'N/A';
    
    // Dùng email làm ID duy nhất hoặc ghép tên + SĐT nếu ko có email
    const id = email !== 'N/A' ? email : `${customerName}-${phone}`;

    if (!acc[id]) {
      acc[id] = {
        id,
        name: customerName,
        email,
        phone,
        totalSpent: 0,
        bookings: []
      };
    }
    
    acc[id].bookings.push(booking);
    // Tính tổng tiền dựa trên status (chỉ tính đơn đã xác nhận hoặc hoàn tất)
    if (booking.status === 'completed' || booking.status === 'confirmed') {
      acc[id].totalSpent += Number(booking.totalPrice || 0);
    }

    return acc;
  }, {});

  const customersList = Object.values(groupedBookings)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.totalSpent - a.totalSpent); // Xếp khách VIP lên đầu

  const handlePrint = (booking) => {
    setPrintingBooking(booking);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getStatusBadge = (booking) => {
    const status = booking.status;
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const now = new Date();
    now.setHours(0,0,0,0);
    checkInDate.setHours(0,0,0,0);
    checkOutDate.setHours(0,0,0,0);

    let badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
    let label = status;

    if (status === 'pending') {
      badgeClass = 'bg-amber-100 text-amber-600 border-amber-200';
      label = 'Đang chờ';
    } else if (status === 'cancelled') {
      badgeClass = 'bg-rose-100 text-rose-600 border-rose-200';
      label = 'Đã hủy';
    } else if (status === 'completed') {
      badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
      label = 'Đã trả phòng';
    } else if (status === 'checked_in') {
      badgeClass = 'bg-emerald-100 text-emerald-600 border-emerald-200';
      label = 'Đang lưu trú';
    } else if (status === 'confirmed') {
      if (now < checkInDate) {
        badgeClass = 'bg-blue-100 text-blue-600 border-blue-200';
        label = 'Đã cọc (Sắp tới)';
      } else if (now >= checkInDate && now <= checkOutDate) {
        badgeClass = 'bg-emerald-100 text-emerald-600 border-emerald-200';
        label = 'Đang lưu trú'; // Cập nhật sau
      } else {
        badgeClass = 'bg-emerald-100 text-emerald-600 border-emerald-200';
        label = 'Chờ hoàn tất';
      }
    }

    return (
      <span className={`px-2 py-1 border rounded-md text-[9px] font-black tracking-widest ${badgeClass}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Thống Kê Lưu Trú" subtitle="Dữ liệu khách hàng">
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout title="Hồ Sơ Khách Hàng & Hóa Đơn" subtitle="Tra cứu lịch sử lưu trú và xuất hóa đơn chi tiết">
        <div className="space-y-6 pb-10">
          
          {/* Thanh tìm kiếm */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
             <Search size={18} className="text-slate-400 ml-2" />
             <input 
                type="text" 
                placeholder="Tìm tên khách hàng hoặc email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-sans text-sm text-slate-900 placeholder:text-slate-400"
             />
          </div>

          {/* Danh sách Khách Hàng */}
          <div className="grid grid-cols-1 gap-4">
            {customersList.map((customer) => (
              <div key={customer.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Header Khách hàng */}
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  onClick={() => setExpandedUser(expandedUser === customer.id ? null : customer.id)}
                >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl border border-amber-100">
                        {customer.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-900 font-sans">{customer.name}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-0.5">{customer.email !== 'N/A' ? customer.email : customer.phone}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <p className="text-[10px]  font-black tracking-widest text-slate-400">Tổng chi tiêu</p>
                       <p className="text-lg font-black text-emerald-600 font-sans">
                         {customer.totalSpent.toLocaleString('vi-VN')} <span className="text-xs">VNĐ</span>
                       </p>
                    </div>
                    <div className="text-slate-300">
                      {expandedUser === customer.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Danh sách các phòng đã đặt (Mở rộng) */}
                {expandedUser === customer.id && (
                  <div className="bg-slate-50 border-t border-slate-100 p-6">
                    <h4 className="text-[10px]  font-black tracking-widest text-slate-500 mb-4">Lịch sử {customer.bookings.length} lần đặt phòng</h4>
                    <div className="space-y-3">
                      {customer.bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(booking => (
                        <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          
                          <div className="flex items-center gap-4 flex-1">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
                               <p className="text-[8px] font-black  text-slate-400">Phòng</p>
                               <p className="text-sm font-black text-slate-900">{booking.room?.roomNumber || '---'}</p>
                             </div>
                             <div>
                               <div className="flex items-center gap-2">
                                 <p className="text-xs font-bold text-slate-800">Mã đơn: #{booking.id}</p>
                                 {getStatusBadge(booking)}
                               </div>
                               <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1.5">
                                 <Calendar size={12}/>
                                 {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                               </p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-900">
                                {Number(booking.totalPrice).toLocaleString('vi-VN')} VNĐ
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 mt-0.5 tracking-widest uppercase">Tổng đơn (100%)</p>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handlePrint(booking); }}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-amber-500 transition-colors"
                            >
                              <Printer size={14} />
                              In Hóa Đơn
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {customersList.length === 0 && (
              <div className="py-20 text-center font-sans text-slate-500">
                 Không tìm thấy khách hàng nào.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>

      {/* 🖨️ INVOICE TEMPLATE (Chỉ hiển thị khi in) */}
      {printingBooking && (
        <div className="hidden print:block fixed inset-0 bg-white text-black z-[9999] p-12 font-sans">
          <div className="max-w-4xl mx-auto border border-gray-200 p-12 rounded-xl">
             
             {/* Invoice Header */}
             <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
               <div>
                 <h1 className="text-3xl font-medium font-sans text-slate-900 mb-2">Uy Nam <span className="text-amber-600">Luxury</span></h1>
                 <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> 123 Đường Ngọc Trai, Vinpearl, Việt Nam</p>
               </div>
               <div className="text-right">
                 <h2 className="text-3xl font-black  tracking-widest text-slate-200">INVOICE</h2>
                 <p className="text-sm text-slate-600 font-bold mt-2">Mã Hóa Đơn: #{String(printingBooking.id).toUpperCase()}</p>
                 <p className="text-xs text-slate-500 mt-1">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
               </div>
             </div>

             {/* Customer & Booking Info */}
             <div className="flex justify-between mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl w-[45%]">
                   <p className="text-[10px]  font-black tracking-widest text-slate-400 mb-2">Thông tin khách hàng</p>
                   <p className="font-bold text-slate-900 text-lg">{printingBooking.user?.fullName || printingBooking.customer?.fullName || 'Khách vãng lai'}</p>
                   <p className="text-sm text-slate-600 mt-1">{printingBooking.user?.email || printingBooking.customer?.email}</p>
                   <p className="text-sm text-slate-600">{printingBooking.user?.phone || printingBooking.customer?.phone}</p>
                </div>
                <div className="bg-amber-50/50 p-6 rounded-2xl w-[45%] text-right">
                   <p className="text-[10px]  font-black tracking-widest text-amber-500 mb-2">Chi tiết lưu trú</p>
                   <p className="font-bold text-slate-900 text-lg">Phòng {printingBooking.room?.roomNumber || '---'}</p>
                   <p className="text-sm text-slate-600 mt-1">Check-in: {new Date(printingBooking.checkInDate).toLocaleDateString('vi-VN')}</p>
                   <p className="text-sm text-slate-600">Check-out: {new Date(printingBooking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                </div>
             </div>

             {/* Table */}
             <table className="w-full text-left mb-12">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-xs font-black  tracking-widest text-slate-900">Diễn giải dịch vụ</th>
                    <th className="py-4 text-xs font-black  tracking-widest text-slate-900 text-right w-1/4">Đơn giá</th>
                    <th className="py-4 text-xs font-black  tracking-widest text-slate-900 text-right w-1/4">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-6">
                      <p className="text-sm font-bold text-slate-900">Tiền phòng hạng Sang (Room {printingBooking.room?.roomNumber})</p>
                      <p className="text-xs text-slate-500 mt-1">Bao gồm bữa sáng tự chọn & tiện ích bể bơi.</p>
                    </td>
                    <td className="py-6 text-right text-sm font-medium">Theo khung giá niêm yết</td>
                    <td className="py-6 text-right text-sm font-black">{Number(printingBooking.totalPrice).toLocaleString('vi-VN')} đ</td>
                  </tr>
                </tbody>
             </table>

             {/* Total & Signature */}
             <div className="flex justify-between items-end">
                <div className="w-1/2">
                  <div className="w-40 h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center mb-2">
                     <p className="text-slate-300 font-sans transform -rotate-12">Dấu đã thu tiền</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">Cảm ơn quý khách đã lựa chọn Uy Nam Luxury!</p>
                </div>

                <div className="w-1/3">
                   <div className="flex justify-between py-3 border-b border-slate-200 text-slate-600">
                      <span className="font-bold">Tạm tính</span>
                      <span>{Number(printingBooking.totalPrice).toLocaleString('vi-VN')} đ</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-slate-200 text-slate-600">
                      <span className="font-bold">VAT (10%)</span>
                      <span>Đã bao gồm</span>
                   </div>
                   <div className="flex justify-between py-4 text-amber-600">
                      <span className="font-black  tracking-widest text-lg">Tổng Thanh Toán</span>
                      <span className="font-black text-2xl">{Number(printingBooking.totalPrice).toLocaleString('vi-VN')} đ</span>
                   </div>
                </div>
             </div>

          </div>
        </div>
      )}
    </>
  );
};

export default GuestStats;
