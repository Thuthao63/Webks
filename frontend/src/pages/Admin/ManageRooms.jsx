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
    axiosClient.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
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
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-50 border border-slate-200 text-slate-900 font-bold uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
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
    } catch (err) { console.error(err); luxurySwal.fire('Thất bại', 'Khởi tạo phòng bị lỗi.', 'error');
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
      } catch (err) { console.error(err); luxurySwal.fire('Lỗi ràng buộc', 'Không thể xoá phòng đang có khách.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-slate-500 text-xs tracking-widest uppercase font-bold animate-pulse">Đang liệt kê kho phòng...</p>
    </div>
  );

  return (
    <AdminLayout title="Quản lý phòng" subtitle="Hệ thống kiểm kê và thiết lập thông số phòng lưu trú">
      <div className="space-y-8 pb-10">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Bed size={20} />
             </div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tình trạng kho</p>
                <p className="text-lg font-serif italic text-slate-900 leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{rooms.length} phòng định danh</p>
             </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Khai báo phòng mới
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left">
              <thead className="text-xs text-slate-400 uppercase font-black tracking-widest border-b border-slate-100 bg-slate-50/50 font-sans">
                <tr>
                  <th className="px-8 py-6">Mã Số Phòng</th>
                  <th className="px-6 py-6">Hạng phòng</th>
                  <th className="px-6 py-6">Khung Giá / Đêm</th>
                  <th className="px-6 py-6">Trạng thái</th>
                  <th className="px-8 py-6 text-right">Tuỳ biến</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rooms.map(room => (
                  <tr key={room.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="relative w-20 h-14 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 group-hover:border-amber-200 transition-all duration-500 shadow-sm">
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
                          <p className="text-slate-900 font-bold text-sm group-hover:text-amber-500 transition-colors font-sans">#{room.id}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 font-sans">Room ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-slate-700 font-bold text-sm group-hover:text-slate-900 transition-colors font-sans">
                         {room.roomType?.typeName || room.typeDetails?.name || room.name || '---'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-slate-900 font-black text-sm tracking-wider font-sans">
                         {Number(room.roomType?.price || room.typeDetails?.price || room.price || 0).toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">vnđ</span>
                       </p>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${room.status === 'Available' ? 'text-emerald-600 border-emerald-500/20 bg-emerald-50' : room.status === 'Occupied' ? 'text-rose-600 border-rose-500/20 bg-rose-50' : 'text-amber-600 border-amber-500/20 bg-amber-50'} font-sans`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-500' : room.status === 'Occupied' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          {room.status === 'Available' ? 'Trống' : room.status === 'Occupied' ? 'Có khách' : room.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(room.id)} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
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
          <div className="py-20 text-center border border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
            <Bed size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Kho lưu trữ rỗng</p>
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

               <h2 className="text-3xl font-serif italic text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Khai báo <span className="text-amber-500">Phòng Mới</span>
               </h2>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-10">Cung cấp các thông số định danh thiết yếu</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase font-black tracking-widest ml-1">Số phòng</label>
                     <input type="text" placeholder="101" required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                        onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase font-black tracking-widest ml-1">Hạng phòng</label>
                     <input type="text" placeholder="Deluxe Ocean" required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase font-black tracking-widest ml-1">Giá mỗi đêm</label>
                     <input type="number" placeholder="2500000" required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold text-amber-500"
                        onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase font-black tracking-widest ml-1">Hình ảnh đính kèm</label>
                     <label className="w-full bg-slate-50 border border-dashed border-slate-300 text-slate-500 p-4 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                        <ImageIcon size={18} />
                        <span className="text-xs font-bold uppercase truncate max-w-[120px]">{formData.image ? formData.image.name : 'Chọn ảnh'}</span>
                        <input type="file" className="hidden" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                     </label>
                  </div>
               </div>

               <button type="submit" className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-luxury hover:scale-[1.02] active:scale-100 transition-all">
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




