import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { 
  Check, X, Clock, CheckCircle, XCircle, Package, Bed, 
  Calendar, Loader2, RefreshCw, Printer, User, Wallet, MoreVertical, Plus
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
    background: '#ffffff',
    color: '#0f172a',
    backdrop: 'rgba(15,23,42,0.4)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-sans font-bold text-amber-500 text-2xl',
      htmlContainer: 'text-slate-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
    }
  });

  const updateStatus = async (id, status, bookingData = null) => {
    let actionText = status === 'confirmed' ? 'Xác nhận' : (status === 'cancelled' ? 'Hủy bỏ' : 'Hoàn tất');
    
    // Nếu là Trả phòng (completed), xử lý logic thông minh
    if (status === 'completed' && bookingData) {
      const now = new Date();
      const scheduledOut = new Date(bookingData.checkOutDate);
      const isLate = now > scheduledOut;
      const hoursLate = isLate ? Math.ceil((now - scheduledOut) / (1000 * 60 * 60)) : 0;
      
      let finalPrice = Number(bookingData.totalPrice);
      let surchargeText = "Khách trả phòng đúng hạn.";

      if (isLate) {
        surchargeText = `Khách trả phòng muộn ${hoursLate} giờ. Bạn có muốn thêm phụ phí không?`;
        
        const { value: surchargeChoice } = await luxurySwal.fire({
          title: 'Xử lý trả phòng muộn',
          text: surchargeText,
          icon: 'clock',
          showCancelButton: true,
          confirmButtonText: 'Có, tính phụ phí',
          cancelButtonText: 'Không, giữ nguyên giá',
          input: 'select',
          inputOptions: {
            '0': 'Giữ nguyên giá gốc',
            '30': 'Phụ phí 30% giá phòng',
            '50': 'Phụ phí 50% giá phòng',
            '100': 'Phụ phí 100% (Thêm 1 ngày)',
            'custom': 'Nhập số tiền tùy chỉnh'
          },
          inputPlaceholder: 'Chọn mức phụ phí'
        });

        if (surchargeChoice === 'custom') {
          const { value: customAmountRaw } = await luxurySwal.fire({
            title: 'Nhập số tiền phụ phí',
            input: 'text',
            inputLabel: 'Số tiền (VNĐ)',
            placeholder: 'Ví dụ: 100.000',
            showCancelButton: true,
            didOpen: () => {
              const input = Swal.getInput();
              input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                e.target.value = new Intl.NumberFormat('de-DE').format(val);
              });
            },
            preConfirm: (value) => {
              if (!value) return Swal.showValidationMessage('Vui lòng nhập số tiền');
              return value.replace(/\./g, ''); // Trả về số nguyên để tính toán
            }
          });
          if (customAmountRaw) finalPrice += Number(customAmountRaw);
        } else if (surchargeChoice && surchargeChoice !== '0') {
          // Tính phụ phí dựa trên giá phòng 1 ngày (ước tính từ tổng price / số ngày nếu có thể, hoặc dùng giá gốc)
          // Ở đây đơn giản là tính % trên tổng đơn để Admin dễ kiểm soát
          const percent = Number(surchargeChoice) / 100;
          finalPrice += (finalPrice * percent);
        }
      } else {
        const confirmEarly = await luxurySwal.fire({
          title: 'Xác nhận trả phòng sớm',
          text: "Khách trả phòng trước thời hạn. Bạn có muốn giảm trừ tiền không?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Giảm trừ tiền',
          cancelButtonText: 'Giữ nguyên giá'
        });

        if (confirmEarly.isConfirmed) {
          const { value: reductionRaw } = await luxurySwal.fire({
            title: 'Nhập số tiền giảm trừ',
            input: 'text',
            inputLabel: 'Số tiền (VNĐ)',
            placeholder: 'Ví dụ: 200.000',
            showCancelButton: true,
            didOpen: () => {
              const input = Swal.getInput();
              input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                e.target.value = new Intl.NumberFormat('de-DE').format(val);
              });
            },
            preConfirm: (value) => {
              if (!value) return Swal.showValidationMessage('Vui lòng nhập số tiền');
              return value.replace(/\./g, '');
            }
          });
          if (reductionRaw) finalPrice -= Number(reductionRaw);
        }
      }

      // Cuối cùng gửi request cập nhật
      const finalConfirm = await luxurySwal.fire({
        title: 'Chốt hóa đơn',
        text: `Tổng tiền cuối cùng: ${finalPrice.toLocaleString()} VNĐ. Xác nhận hoàn tất lưu trú?`,
        icon: 'success',
        showCancelButton: true
      });

      if (finalConfirm.isConfirmed) {
        try {
          await axiosClient.put(`/bookings/${id}`, { status: 'completed', totalPrice: finalPrice });
          luxurySwal.fire({ icon: 'success', title: 'Đã hoàn tất lưu trú', timer: 1500, showConfirmButton: false });
          fetchBookings();
        } catch (err) {
          luxurySwal.fire('Lỗi', 'Không thể cập nhật hồ sơ', 'error');
        }
      }
      return;
    }

    // Luồng mặc định cho Xác nhận/Hủy
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

  const handleExtendBooking = async (booking) => {
    // Tính giá tiền 1 ngày dựa trên đơn gốc
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    let oldDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (oldDays <= 0) oldDays = 1;
    const pricePerDay = Math.round(Number(booking.totalPrice) / oldDays);

    const { value: formValues } = await luxurySwal.fire({
      title: 'Gia hạn phòng',
      html: `
        <div class="text-left space-y-4 mt-4 font-sans">
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-slate-400">Ngày trả phòng hiện tại</label>
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl mt-1 text-slate-700 font-bold">${checkOut.toLocaleDateString('vi-VN')}</div>
          </div>
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-slate-400">Ngày trả phòng mới</label>
            <input type="date" id="new-date" min="${checkOut.toISOString().split('T')[0]}" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900 font-bold cursor-pointer transition-colors hover:border-amber-300" />
          </div>
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-slate-400">Phụ thu tự động (${pricePerDay.toLocaleString('vi-VN')} đ/đêm)</label>
            <input type="text" id="extra-price-display" readonly value="0 VNĐ" class="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-amber-600 font-black italic text-xl outline-none cursor-not-allowed" />
            <input type="hidden" id="extra-price-value" value="0" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Ghi nhận',
      cancelButtonText: 'Hủy',
      didOpen: () => {
        const dateInput = document.getElementById('new-date');
        const displayInput = document.getElementById('extra-price-display');
        const valueInput = document.getElementById('extra-price-value');
        
        dateInput.addEventListener('change', (e) => {
           const newDate = new Date(e.target.value);
           const diffTime = newDate - checkOut;
           const extraDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           
           if (extraDays > 0) {
              const extraCost = extraDays * pricePerDay;
              displayInput.value = '+' + extraCost.toLocaleString('vi-VN') + ' VNĐ';
              valueInput.value = extraCost;
           } else {
              displayInput.value = '0 VNĐ';
              valueInput.value = 0;
           }
        });
      },
      preConfirm: () => {
        const newDate = document.getElementById('new-date').value;
        const extraPrice = document.getElementById('extra-price-value').value;
        if (!newDate) {
          Swal.showValidationMessage('Vui lòng chọn ngày trả phòng mới');
          return false;
        }
        return { newDate, extraPrice: Number(extraPrice) };
      }
    });

    if (formValues) {
      try {
        const newTotalPrice = Number(booking.totalPrice) + formValues.extraPrice;
        await axiosClient.put(`/bookings/${booking.id}`, { 
          checkOutDate: formValues.newDate,
          totalPrice: newTotalPrice
        });
        luxurySwal.fire({ icon: 'success', title: 'Gia hạn thành công!', timer: 1500, showConfirmButton: false });
        fetchBookings();
      } catch (err) {
        luxurySwal.fire('Lỗi', 'Không thể gia hạn phòng', 'error');
      }
    }
  };

  const handlePrintInvoice = (booking) => {
    setPrintingBooking(booking);
    setTimeout(() => { window.print(); }, 500);
  };

  const handleWalkInBooking = async () => {
    try {
      Swal.fire({ title: 'Đang tải danh sách phòng...', didOpen: () => Swal.showLoading() });
      const roomsRes = await axiosClient.get('/rooms');
      const availableRooms = roomsRes.data.filter(r => r.status === 'Available');
      Swal.close();

      if (availableRooms.length === 0) {
        return luxurySwal.fire('Hết phòng', 'Hiện tại không còn phòng trống nào.', 'warning');
      }

      let roomOptionsHtml = availableRooms.map(r => `<option value="${r.id}" data-price="${r.price || r.roomType?.price || 0}">Phòng ${r.roomNumber} - ${Number(r.price || r.roomType?.price || 0).toLocaleString()} đ/đêm</option>`).join('');

      const { value: formValues } = await luxurySwal.fire({
        title: 'Tạo đơn tại quầy',
        html: `
          <div class="text-left space-y-4 mt-4 font-sans">
            <div>
              <label class="text-xs font-black uppercase tracking-widest text-slate-400">Tên Khách Hàng</label>
              <input type="text" id="walkin-name" placeholder="Ví dụ: Khách vãng lai" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Số Điện Thoại *</label>
                <input type="text" id="walkin-phone" placeholder="Bắt buộc" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900" />
              </div>
              <div>
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Email *</label>
                <input type="email" id="walkin-email" placeholder="Bắt buộc" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900" />
              </div>
            </div>
            <div>
              <label class="text-xs font-black uppercase tracking-widest text-slate-400">Chọn Phòng Trống</label>
              <select id="walkin-room" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900 cursor-pointer">
                <option value="">-- Chọn phòng --</option>
                ${roomOptionsHtml}
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Ngày Check-in</label>
                <input type="date" id="walkin-checkin" value="${new Date().toISOString().split('T')[0]}" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900 cursor-pointer" />
              </div>
              <div>
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Ngày Check-out</label>
                <input type="date" id="walkin-checkout" min="${new Date().toISOString().split('T')[0]}" class="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-bold text-slate-900 cursor-pointer" />
              </div>
            </div>
            <div>
              <label class="text-xs font-black uppercase tracking-widest text-slate-400">Tổng Tiền (Dự tính)</label>
              <input type="text" id="walkin-total-display" readonly value="0 VNĐ" class="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-amber-600 font-black italic text-xl outline-none cursor-not-allowed" />
              <input type="hidden" id="walkin-total-value" value="0" />
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Chốt đơn ngay',
        cancelButtonText: 'Hủy',
        didOpen: () => {
          const roomSelect = document.getElementById('walkin-room');
          const checkinInput = document.getElementById('walkin-checkin');
          const checkoutInput = document.getElementById('walkin-checkout');
          const displayInput = document.getElementById('walkin-total-display');
          const valueInput = document.getElementById('walkin-total-value');
          
          const calculateTotal = () => {
             const roomOpt = roomSelect.options[roomSelect.selectedIndex];
             if(!roomOpt || !roomOpt.value || !checkinInput.value || !checkoutInput.value) {
                displayInput.value = '0 VNĐ'; valueInput.value = 0; return;
             }
             const price = Number(roomOpt.getAttribute('data-price') || 0);
             const checkIn = new Date(checkinInput.value);
             const checkOut = new Date(checkoutInput.value);
             let days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
             if (days <= 0) days = 1; // Mặc định ít nhất 1 ngày nếu chọn cùng ngày
             const total = days * price;
             displayInput.value = total.toLocaleString('vi-VN') + ' VNĐ';
             valueInput.value = total;
          };

          roomSelect.addEventListener('change', calculateTotal);
          checkinInput.addEventListener('change', calculateTotal);
          checkoutInput.addEventListener('change', calculateTotal);
        },
        preConfirm: () => {
          const guestName = document.getElementById('walkin-name').value || 'Khách vãng lai';
          const guestPhone = document.getElementById('walkin-phone').value;
          const guestEmail = document.getElementById('walkin-email').value;
          const roomId = document.getElementById('walkin-room').value;
          const checkInDate = document.getElementById('walkin-checkin').value;
          const checkOutDate = document.getElementById('walkin-checkout').value;
          const totalPrice = document.getElementById('walkin-total-value').value;
          
          if (!guestPhone || !guestEmail) {
            Swal.showValidationMessage('Vui lòng nhập SĐT và Email để liên lạc/gửi hóa đơn');
            return false;
          }
          if (!roomId || !checkInDate || !checkOutDate) {
            Swal.showValidationMessage('Vui lòng chọn phòng và ngày check-out hợp lệ');
            return false;
          }
          if (new Date(checkOutDate) < new Date(checkInDate)) {
            Swal.showValidationMessage('Ngày check-out không được trước ngày check-in');
            return false;
          }
          return { guestName, guestPhone, guestEmail, roomId, checkInDate, checkOutDate, totalPrice: Number(totalPrice) };
        }
      });

      if (formValues) {
        Swal.fire({ title: 'Đang khởi tạo đơn...', didOpen: () => Swal.showLoading() });
        const res = await axiosClient.post('/bookings/walk-in', formValues);
        
        // Hỏi in hóa đơn
        const printConfirm = await luxurySwal.fire({
          icon: 'success',
          title: 'Tạo đơn thành công!',
          text: 'Bạn có muốn in phiếu xác nhận cho khách ngay không?',
          showCancelButton: true,
          confirmButtonText: 'In Hóa Đơn',
          cancelButtonText: 'Không cần',
          confirmButtonColor: '#0f172a'
        });

        fetchBookings(); // Reload data

        if (printConfirm.isConfirmed) {
          // Lấy thông tin chi tiết booking vừa tạo để in
          const newBookingDetailRes = await axiosClient.get('/bookings');
          const newBooking = newBookingDetailRes.data.find(b => b.id === res.data.id);
          if (newBooking) {
             setPrintingBooking(newBooking);
             setTimeout(() => window.print(), 500);
          }
        }
      }
    } catch (err) {
      console.error(err);
      luxurySwal.fire('Lỗi', err.response?.data?.message || 'Không thể tạo đơn.', 'error');
    }
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
      <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang đồng bộ giao dịch...</p>
    </div>
  );

  return (
    <>
      <AdminLayout title="Quản lý lưu trú" subtitle="Kiểm duyệt đơn đặt, theo dõi doanh thu & lịch trình khách hàng">
        <div className="space-y-8 pb-10">
          
          {/* Header Action */}
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
             <div className="text-xs text-slate-500 font-bold uppercase tracking-widest pl-2 font-sans flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Đồng bộ tự động
             </div>
             <button 
                onClick={handleWalkInBooking}
                className="px-6 py-3 bg-amber-500 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-luxury hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
             >
                <Plus size={16} strokeWidth={3} />
                Đặt Phòng Tại Quầy
             </button>
          </div>

          {/* Summary Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Tổng đơn hàng', value: bookings.length, icon: <Package size={20}/>, color: 'blue' },
              { label: 'Đang lưu trú', value: bookings.filter(b => b.status === 'confirmed').length, icon: <Bed size={20}/>, color: 'emerald' },
              { label: 'Đang chờ duyệt', value: bookings.filter(b => b.status === 'pending').length, icon: <Clock size={20}/>, color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-serif italic text-slate-900 leading-none mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400`}>
                   {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto admin-scrollbar">
              <table className="w-full text-left">
                <thead className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] border-b border-slate-100 bg-slate-50/50 font-sans">
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
                    <tr key={booking.id} className="group hover:bg-slate-50/50 font-sans transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-slate-900 font-black text-xs border border-slate-200">
                            {(booking.user?.fullName || booking.customer?.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-slate-900 group-hover:text-amber-500 transition-colors uppercase tracking-wide">
                              {booking.user?.fullName || booking.customer?.fullName || 'Khách vãng lai'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">{booking.user?.email || booking.customer?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* Room Image Thumbnail */}
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group-hover:border-amber-500/30 transition-colors">
                            <img
                              src={`/Hinh anh/Hinh${((booking.room?.id || 1) % 20) + 1}.png`}
                              alt={`Phong ${booking.room?.roomNumber}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={e => { e.target.style.display='none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>
                          {/* Room Info */}
                          <div>
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[12px] group-hover:text-amber-400 transition-colors">
                              <Bed size={12} className="text-amber-500" />
                              P. {booking.room?.roomNumber || '---'}
                            </div>
                            <p className="text-[11px] font-black text-amber-500/80 mt-1 tracking-widest">
                              {Number(booking.totalPrice || 0).toLocaleString()} <span className="text-[9px] text-slate-400 uppercase font-bold">VND</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
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
                        <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all whitespace-nowrap">
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
                            <>
                              <button onClick={() => handleExtendBooking(booking)} className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all mr-2">
                                Gia hạn
                              </button>
                              <button onClick={() => updateStatus(booking.id, 'completed', booking)} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:shadow-luxury">
                                Trả phòng
                              </button>
                            </>
                          )}
                          {(booking.status === 'completed') && (
                            <button onClick={() => handlePrintInvoice(booking)} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                              <Printer size={16} />
                            </button>
                          )}
                          <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
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
                 <p className="text-xs text-slate-500">#{String(printingBooking.id).substring(0,8).toUpperCase()}</p>
               </div>
             </div>
             <div className="mb-10 flex justify-between">
                <div>
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Khách hàng</p>
                   <p className="font-bold text-slate-300">{printingBooking.user?.fullName || printingBooking.customer?.fullName}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ngày lưu trú</p>
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
                   <div className="flex justify-between py-2 border-b text-slate-500">
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