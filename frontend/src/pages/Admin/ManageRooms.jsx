import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Bed, X, Loader2, Calendar, Image as ImageIcon } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ManageRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewType, setIsNewType] = useState(false);
  const [formData, setFormData] = useState({ roomNumber: '', typeId: '', name: '', price: '', status: 'Available', description: '', image: null });

  const selectedType = roomTypes.find(t => String(t.id) === String(formData.typeId));

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        axiosClient.get('/rooms'),
        axiosClient.get('/rooms/types')
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
      if (typesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, typeId: typesRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const luxurySwal = Swal.mixin({
    background: '#ffffff',
    color: '#0f172a',
    backdrop: 'rgba(15,23,42,0.4)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-slate-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold  tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('roomNumber', formData.roomNumber);
    data.append('status', formData.status);
    
    if (isNewType) {
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      if (formData.image) data.append('image', formData.image);
    } else {
      data.append('typeId', formData.typeId);
    }

    try {
      await axiosClient.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      luxurySwal.fire({ icon: 'success', title: 'Hoàn tất quy trình', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setFormData({ roomNumber: '', typeId: roomTypes[0]?.id || '', name: '', price: '', status: 'Available', description: '', image: null });
      fetchRooms();
    } catch (err) {
      luxurySwal.fire('Thất bại', 'Khởi tạo phòng bị lỗi.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const bookingsRes = await axiosClient.get('/bookings');
      const hasActiveBookings = bookingsRes.data.some(b => b.roomId === id && ['pending', 'confirmed', 'checked_in'].includes(b.status));
      if (hasActiveBookings) {
        return luxurySwal.fire('Từ chối', 'Phòng này đang có đơn đặt đang chờ hoặc đang lưu trú. Vui lòng hoàn tất hoặc hủy đơn trước khi xóa.', 'error');
      }
    } catch(e) {}

    const result = await luxurySwal.fire({
      title: 'Hủy dữ liệu phòng?',
      text: 'Lưu ý: Mọi lịch sử lưu trú của phòng này sẽ bị mất.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/rooms/${id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã gỡ bỏ', timer: 1500, showConfirmButton: false });
        fetchRooms();
      } catch (err) {
        luxurySwal.fire('Lỗi', 'Không thể xóa phòng này', 'error');
      }
    }
  };

  const handleViewBookings = async (room) => {
    try {
      Swal.fire({ title: 'Đang tải lịch đặt...', didOpen: () => Swal.showLoading() });
      const res = await axiosClient.get('/bookings');
      
      const roomBookings = res.data.filter(b => b.roomId === room.id && ['pending', 'confirmed', 'checked_in'].includes(b.status));
      
      if (roomBookings.length === 0) {
        return luxurySwal.fire('Trống', `Phòng ${room.roomNumber} hiện không có lịch đặt trước nào.`, 'info');
      }

      const htmlContent = `
        <div class="text-left font-sans max-h-80 overflow-y-auto admin-scrollbar">
          ${roomBookings.sort((a,b) => new Date(a.checkInDate) - new Date(b.checkInDate)).map(b => `
            <div class="booking-card mb-4 p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${b.status === 'checked_in' ? 'border-amber-200 bg-amber-50' : 'border-emerald-100 bg-emerald-50/30'}" data-id="${b.id}">
              <div class="flex justify-between items-center mb-2">
                 <p class="text-sm font-bold text-slate-800">Đơn #${b.id}</p>
                 <span class="text-[9px] font-black tracking-widest px-2 py-1 rounded border ${b.status === 'checked_in' ? 'border-amber-300 text-amber-600' : 'border-emerald-300 text-emerald-600'}">
                   ${b.status === 'checked_in' ? 'ĐANG Ở' : (b.status === 'confirmed' ? 'ĐÃ CỌC' : 'CHỜ DUYỆT')}
                 </span>
              </div>
              <p class="text-xs text-slate-600 font-bold mb-1">Khách: ${b.user?.fullName || b.customer?.fullName || 'Khách vãng lai'}</p>
              <p class="text-[10px] text-slate-500 font-bold flex items-center gap-1"><Calendar size="10"/> ${new Date(b.checkInDate).toLocaleDateString('vi-VN')} - ${new Date(b.checkOutDate).toLocaleDateString('vi-VN')}</p>
            </div>
          `).join('')}
        </div>
      `;

      luxurySwal.fire({
        title: `Lịch Phòng ${room.roomNumber}`,
        html: htmlContent,
        confirmButtonText: 'Đóng lại',
        customClass: { popup: 'rounded-[2rem] border border-slate-100 shadow-xl' },
        didOpen: () => {
          document.querySelectorAll('.booking-card').forEach(card => {
            card.addEventListener('click', function() {
              const bId = this.getAttribute('data-id');
              Swal.close();
              navigate(`/admin/bookings?bookingId=${bId}`);
            });
          });
        }
      });

    } catch (err) {
      luxurySwal.fire('Lỗi', 'Không thể lấy dữ liệu lịch đặt', 'error');
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-slate-500 text-[10px] tracking-[0.3em]  font-bold animate-pulse">Đang liệt kê kho phòng...</p>
    </div>
  );

  return (
    <AdminLayout title="Quản lý phòng" subtitle="Hệ thống kiểm kê và thiết lập thông số phòng lưu trú">
      <div className="space-y-8 pb-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Bed size={20} />
             </div>
             <div>
                <p className="text-[10px] text-slate-500 font-bold  tracking-widest">Tình trạng kho</p>
                <p className="text-lg font-serif italic text-slate-900 leading-none mt-1">{rooms.length} phòng định danh</p>
             </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Thêm phòng mới
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500  font-bold tracking-[0.2em] border-b border-slate-100 bg-slate-50/50 font-sans">
                <tr>
                  <th className="px-8 py-6">Mã Số Phòng</th>
                  <th className="px-6 py-6">Định dạng / Hạng phòng</th>
                  <th className="px-6 py-6">Khung Giá / Đêm</th>
                  <th className="px-6 py-6">Trạng thái</th>
                  <th className="px-8 py-6 text-right">Tuỳ biến</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rooms.map(room => (
                  <tr key={room.id} className="group hover:bg-slate-50/50 font-sans transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group-hover:border-amber-500/30 transition-all duration-500">
                          <img
                            src={`/Hinh anh/Hinh${((room.id || 1) % 20) + 1}.png`}
                            alt={`Phong ${room.roomNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] text-white font-black tracking-widest font-sans">
                            P.{room.roomNumber}
                          </span>
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-sm group-hover:text-amber-400 transition-colors">#{room.id}</p>
                          <p className="text-[9px] text-slate-500 font-bold  tracking-widest">Room ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-slate-700 font-bold text-sm font-sans group-hover:text-amber-500 transition-colors">
                         {room.roomType?.typeName || room.typeDetails?.name || room.name || '---'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-slate-900 font-black text-sm tracking-wider font-sans">
                         {Number(room.roomType?.price || room.typeDetails?.price || room.price || 0).toLocaleString()} <span className="text-[10px] text-slate-500 ">vnđ</span>
                       </p>
                    </td>
                    <td className="px-6 py-5 cursor-pointer" onClick={() => handleViewBookings(room)} title="Nhấn để xem lịch đặt phòng">
                       <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black hover:scale-105 tracking-widest border transition-all ${room.status === 'Available' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : room.status === 'Occupied' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-400' : room.status === 'Occupied' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                          {room.status === 'Available' ? 'Trống' : room.status === 'Occupied' ? 'Có khách' : room.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(room.id)} className="p-2.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rooms.length === 0 && (
          <div className="py-20 text-center border border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 font-sans">
            <Bed size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] ">Kho lưu trữ rỗng</p>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0" onClick={() => setShowModal(false)} />
            <form onSubmit={handleSubmit} className="relative bg-white border border-slate-200 w-full max-w-xl p-10 rounded-[3.5rem] shadow-luxury z-10 animate-in zoom-in-95 duration-300">
               <button type="button" onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-slate-900 bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
               </button>

               <h2 className="text-3xl font-serif italic text-slate-900 mb-2">
                  Thêm <span className="text-amber-500">Phòng Mới</span>
               </h2>
               <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-10">Cung cấp các thông số định danh thiết yếu</p>

               <div className="flex gap-4 mb-8 p-1.5 bg-slate-100 rounded-2xl w-fit">
                  <button type="button" onClick={() => setIsNewType(false)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${!isNewType ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>CHỌN HẠNG CÓ SẴN</button>
                  <button type="button" onClick={() => setIsNewType(true)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${isNewType ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>TẠO HẠNG MỚI</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  <div className="space-y-2">
                     <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Số phòng <span className="text-rose-500">*</span></label>
                     <input type="text" placeholder="101" required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                        onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} value={formData.roomNumber} />
                  </div>

                  {!isNewType ? (
                    <>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Thuộc Hạng phòng <span className="text-rose-500">*</span></label>
                         <div className="relative">
                           <select 
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold appearance-none cursor-pointer"
                              onChange={e => setFormData({ ...formData, typeId: e.target.value })} value={formData.typeId}
                           >
                              {roomTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.typeName || t.name}</option>
                              ))}
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                           </div>
                         </div>
                      </div>

                      {selectedType && (
                        <>
                           <div className="space-y-2">
                              <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Mức giá tham chiếu</label>
                              <div className="w-full bg-slate-50/50 border border-slate-200 text-slate-500 p-4 rounded-2xl font-bold flex items-center justify-between cursor-not-allowed">
                                 <span className="text-amber-600 font-sans font-semibold">{Number(selectedType.price).toLocaleString()}</span>
                                 <span className="text-[9px] bg-slate-200/50 px-2 py-1 rounded text-slate-500 font-black tracking-widest">VNĐ / ĐÊM</span>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Ảnh đại diện hạng</label>
                              <div className="w-full h-[58px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative">
                                 <img src={selectedType.image ? `http://localhost:5000/uploads/${selectedType.image}` : `/Hinh anh/Hinh${((selectedType.id || 1) % 20) + 1}.png`} className="w-full h-full object-cover" alt="Preview" onError={(e) => { e.target.src = '/Hinh anh/Hinh1.png'; }} />
                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-2.5">
                                    <span className="text-[9px] text-white font-black tracking-widest uppercase truncate">{selectedType.typeName || selectedType.name}</span>
                                 </div>
                              </div>
                           </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Tên Hạng mới <span className="text-rose-500">*</span></label>
                         <input type="text" placeholder="Vd: President Suite" required={isNewType}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                            onChange={e => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Giá mỗi đêm <span className="text-rose-500">*</span></label>
                         <input type="number" placeholder="2500000" required={isNewType}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold text-amber-500"
                            onChange={e => setFormData({ ...formData, price: e.target.value })} value={formData.price} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Hình đại diện hạng phòng</label>
                         <label className="w-full bg-slate-50 border border-dashed border-slate-300 text-slate-500 p-4 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                            <ImageIcon size={18} />
                            <span className="text-[10px] font-bold truncate max-w-[120px]">{formData.image ? formData.image.name : 'Chọn ảnh'}</span>
                            <input type="file" className="hidden" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                         </label>
                      </div>
                    </>
                  )}
               </div>

               <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] hover:bg-slate-800 active:scale-100 transition-all flex items-center justify-center gap-2">
                  <Check size={16} className="text-amber-500" />
                  XÁC NHẬN THÊM PHÒNG
               </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageRooms;
