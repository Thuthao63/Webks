import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
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

  // Cấu hình SweetAlert2 chuẩn Luxury
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axiosClient.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      luxurySwal.fire({ icon: 'success', title: 'Thành công', text: 'Đã thêm phòng mới vào hệ thống', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setFormData({ roomNumber: '', name: '', price: '', status: 'Available', description: '', image: null }); // Reset form
      fetchRooms();
    } catch (err) { 
      luxurySwal.fire('Lỗi', 'Không thể tạo phòng lúc này', 'error'); 
    }
  };

  const handleDelete = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Xóa phòng này?',
      text: "Bạn không thể hoàn tác sau khi xóa!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/rooms/${id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Phòng đã được gỡ khỏi hệ thống.', timer: 1500, showConfirmButton: false });
        fetchRooms();
      } catch (err) {
        luxurySwal.fire('Lỗi', 'Không thể xóa phòng đang có đơn đặt', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang tải danh sách phòng</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 pt-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <AdminNav />
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="text-amber-500 not-italic font-sans font-black uppercase text-2xl ml-2 tracking-wider">Danh sách phòng</span>
            </h2>
            <p className="text-gray-500 text-xs mt-3 tracking-[0.3em] uppercase font-bold">Uy Nam Hotel Inventory</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="group relative px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
            <span className="relative flex items-center gap-2"><Plus size={16} /> Thêm phòng mới</span>
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.02] border-b border-white/5 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="p-6">Số Phòng</th>
                  <th className="p-6">Loại Phòng</th>
                  <th className="p-6">Giá Niêm Yết</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rooms.length > 0 ? rooms.map(room => (
                  <tr key={room.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                          <Bed size={18} />
                        </div>
                        <span className="font-bold text-lg text-white">#{room.roomNumber}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-300 font-medium">
                       {room.roomType?.typeName || room.typeDetails?.name || room.name || '---'}
                    </td>
                    <td className="p-6">
                      <span className="text-amber-500 font-bold tracking-wider">
                        {Number(room.roomType?.price || room.typeDetails?.price || room.price || 0).toLocaleString()}đ
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${
                        room.status === 'Available' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 
                        room.status === 'Occupied' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' : 
                        'text-amber-500 border-amber-500/30 bg-amber-500/10'
                      }`}>
                        {room.status === 'Available' ? 'Trống' : room.status === 'Occupied' ? 'Đang thuê' : room.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all" title="Chỉnh sửa">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all" title="Xóa phòng">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500 text-sm italic">Hệ thống chưa có dữ liệu phòng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL THÊM PHÒNG LUXURY --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
            
            <form onSubmit={handleSubmit} className="relative bg-[#0a0a0a] border border-amber-500/20 w-full max-w-lg p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 scale-in-center">
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-amber-500 transition-colors">
                <X size={24} />
              </button>

              <h3 className="text-2xl font-serif italic text-amber-500 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Thiết lập phòng mới</h3>
              
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Tag size={16} /></div>
                  <input type="text" placeholder="Số phòng (VD: 101)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-11 p-3.5 rounded-xl outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-gray-600 text-sm"
                    onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Bed size={16} /></div>
                  <input type="text" placeholder="Tên loại phòng (VD: Deluxe Ocean)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-11 p-3.5 rounded-xl outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-gray-600 text-sm"
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><DollarSign size={16} /></div>
                  <input type="number" placeholder="Giá phòng/đêm (VNĐ)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-11 p-3.5 rounded-xl outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-gray-600 text-sm"
                    onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>

                <div className="bg-amber-500/5 p-4 rounded-xl border border-dashed border-amber-500/30 hover:bg-amber-500/10 transition-colors group">
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={28} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Tải ảnh minh họa lên</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                  </label>
                  {formData.image && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 py-1.5 rounded-full px-3 w-fit mx-auto">
                      <AlertCircle size={12}/> {formData.image.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors border border-white/10">Hủy bỏ</button>
                <button type="submit" className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors shadow-[0_0_15px_rgba(217,119,6,0.3)]">Lưu thông tin</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageRooms;