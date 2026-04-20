import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, Trash2, Image as ImageIcon, Bed, DollarSign, Tag, Loader2, X, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ roomNumber: '', name: '', price: '', status: 'Available', description: '', image: null });

  const fetchRooms = () => {
    setLoading(true);
    axiosClient.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axiosClient.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      luxurySwal.fire({ icon: 'success', title: 'Hoàn tất quy trình', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setFormData({ roomNumber: '', name: '', price: '', status: 'Available', description: '', image: null });
      fetchRooms();
    } catch (err) {
      luxurySwal.fire('Thất bại', 'Khởi tạo phòng bị lỗi.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Xoá mã phòng?',
      text: "Thao tác này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/rooms/${id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã thanh trừng!', timer: 1500, showConfirmButton: false });
        fetchRooms();
      } catch (err) {
        luxurySwal.fire('Lỗi ràng buộc', 'Không thể xoá phòng đang có khách.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang liệt kê kho phòng...</p>
    </div>
  );

  return (
    <AdminLayout title="Quản lý phòng" subtitle="Hệ thống kiểm kê và thiết lập thông số phòng lưu trú">
      <div className="space-y-8 pb-10">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Bed size={20} />
             </div>
             <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tình trạng kho</p>
                <p className="text-lg font-serif italic text-white leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{rooms.length} phòng định danh</p>
             </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Khai báo phòng mới
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
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
                  <tr key={room.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-amber-500/30 transition-all duration-500">
                          <img
                            src={`/Hinh anh/Hinh${((room.id || 1) % 20) + 1}.png`}
                            alt={`Phong ${room.roomNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/90 font-black tracking-widest">
                            P.{room.roomNumber}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-black text-sm group-hover:text-amber-400 transition-colors">#{room.id}</p>
                          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Room ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-white font-bold text-sm tracking-wide group-hover:text-amber-500 transition-colors">
                         {room.roomType?.typeName || room.typeDetails?.name || room.name || '---'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-amber-500 font-black text-lg tracking-wider">
                         {Number(room.roomType?.price || room.typeDetails?.price || room.price || 0).toLocaleString()} <span className="text-[10px] text-gray-600 uppercase">vnđ</span>
                       </p>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${room.status === 'Available' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : room.status === 'Occupied' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-400' : room.status === 'Occupied' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                          {room.status === 'Available' ? 'Trống' : room.status === 'Occupied' ? 'Có khách' : room.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
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
          <div className="py-20 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
            <Bed size={40} className="mx-auto mb-4 text-gray-800" />
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Kho lưu trữ rỗng</p>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0" onClick={() => setShowModal(false)} />
            <form onSubmit={handleSubmit} className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-xl p-10 rounded-[3.5rem] shadow-luxury z-10 animate-in zoom-in-95 duration-300">
               <button type="button" onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white bg-white/5 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
               </button>

               <h2 className="text-3xl font-serif italic text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Khai báo <span className="text-amber-500">Phòng Mới</span>
               </h2>
               <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-10">Cung cấp các thông số định danh thiết yếu</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  <div className="space-y-2">
                     <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Số phòng</label>
                     <input type="text" placeholder="101" required
                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-bold"
                        onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Hạng phòng</label>
                     <input type="text" placeholder="Deluxe Ocean" required
                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-bold"
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Giá mỗi đêm</label>
                     <input type="number" placeholder="2500000" required
                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-bold text-amber-500"
                        onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Hình ảnh đính kèm</label>
                     <label className="w-full bg-white/5 border border-dashed border-white/20 text-gray-500 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        <ImageIcon size={18} />
                        <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{formData.image ? formData.image.name : 'Chọn ảnh'}</span>
                        <input type="file" className="hidden" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                     </label>
                  </div>
               </div>

               <button type="submit" className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-luxury hover:scale-[1.02] active:scale-100 transition-all">
                  Hoàn thiện khởi tạo
               </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageRooms;