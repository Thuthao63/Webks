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

  // Cấu hình SweetAlert2 Glassmorphism chuẩn Luxury
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axiosClient.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      luxurySwal.fire({ icon: 'success', title: 'Hoàn tất quy trình', text: 'Kho phòng đã được cập nhật thành công.', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setFormData({ roomNumber: '', name: '', price: '', status: 'Available', description: '', image: null }); // Reset form
      fetchRooms();
    } catch (err) { 
      luxurySwal.fire('Thất bại', 'Khởi tạo phòng bị huỷ do lỗi tham chiếu.', 'error'); 
    }
  };

  const handleDelete = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Xoá mã phòng?',
      text: "Bạn đang gỡ bỏ một đối tượng khỏi kho, không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý tháo gỡ',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/rooms/${id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã thanh trừng!', text: 'Đơn vị phòng định danh đã xoá.', timer: 1500, showConfirmButton: false });
        fetchRooms();
      } catch (err) {
        luxurySwal.fire('Lỗi ràng buộc', 'Không thể xoá phòng đang bị khoá bởi đơn đặt!', 'error');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Kết nối cơ sở Dữ Liệu</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Danh sách <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Phòng trống</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Uy Nam Hotel Inventory System</p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)} 
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-full overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:shadow-[0_0_40px_rgba(217,119,6,0.6)] hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
              <Plus size={16} />
            </div>
            <span>Thiết lập phòng</span>
          </button>
        </div>

        {/* TABLE CONTAINER - GLASSMORPHISM */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="overflow-x-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse border-spacing-y-3" style={{borderCollapse: 'separate'}}>
              <thead className="text-gray-400 uppercase text-[9px] font-black tracking-[0.2em]">
                <tr>
                  <th className="p-6 whitespace-nowrap pl-10">Mã Số Phòng</th>
                  <th className="p-6 whitespace-nowrap">Định dạng Phòng</th>
                  <th className="p-6 whitespace-nowrap">Khung Giá / Đêm</th>
                  <th className="p-6 whitespace-nowrap">Trạng thái Live</th>
                  <th className="p-6 text-center whitespace-nowrap pr-10">Tùy biến</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {rooms.length > 0 ? rooms.map(room => (
                  <tr key={room.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 rounded-[2rem] shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01]">
                    
                    {/* NUMBER */}
                    <td className="p-5 pl-8 rounded-l-[2.5rem] border-y border-l border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black shadow-lg transition-colors duration-500">
                          <Bed size={20} />
                        </div>
                        <span className="font-black text-2xl text-white tracking-widest drop-shadow-md">#{room.roomNumber}</span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="p-5 border-y border-white/5 group-hover:border-white/10">
                       <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-gray-300 font-bold text-sm shadow-inner block w-fit">
                         {room.roomType?.typeName || room.typeDetails?.name || room.name || 'Hạng mục chưa rõ'}
                       </span>
                    </td>

                    {/* PRICE */}
                    <td className="p-5 border-y border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-500"><DollarSign size={14} /></div>
                        <span className="text-amber-500 font-black text-lg tracking-wider drop-shadow-sm">
                          {Number(room.roomType?.price || room.typeDetails?.price || room.price || 0).toLocaleString()} <span className="text-[10px] text-gray-500">VNĐ</span>
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-5 border-y border-white/5 group-hover:border-white/10">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                        room.status === 'Available' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 
                        room.status === 'Occupied' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_rgba(251,113,133,0.15)]' : 
                        'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-400' : room.status === 'Occupied' ? 'bg-rose-400' : 'bg-amber-400'}`}></div>
                        {room.status === 'Available' ? 'Trống (Ready)' : room.status === 'Occupied' ? 'Đang có khách' : room.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 pr-8 rounded-r-[2.5rem] border-y border-r border-white/5 group-hover:border-white/10 text-center">
                      <div className="flex items-center justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-2xl hover:bg-blue-500 hover:text-black hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] transition-all" title="Thiết lập tham số">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl hover:bg-rose-500 hover:text-black hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] transition-all" title="Gỡ bỏ hoàn toàn">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                      <div className="flex flex-col items-center opacity-50">
                        <Bed size={32} className="text-gray-400 mb-4" />
                        <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Kho lưu trữ rỗng</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL THÊM PHÒNG GLASSMORPHISM CỰC CHẤT --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
            <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
            
            <form onSubmit={handleSubmit} className="relative bg-[#050505]/80 backdrop-blur-3xl border border-white/10 w-full max-w-xl p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10 scale-in-center">
              
              {/* Vòng sáng chìm */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-amber-500 bg-white/5 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20 shadow-md">
                <X size={20} />
              </button>

              <h3 className="text-3xl font-serif italic text-white mb-2 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                Khai báo <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600">Phòng Mới</span>
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-8 relative z-10">Hệ thống đồng bộ trực tiếp</p>
              
              <div className="space-y-6 relative z-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors"><Tag size={18} /></div>
                  <input type="text" placeholder="Gắn Mã Phòng (VD: 101)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-14 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium text-sm shadow-inner"
                    onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors"><Bed size={18} /></div>
                  <input type="text" placeholder="Phân Lớp Hạng Phòng (VD: Deluxe Ocean)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-14 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium text-sm shadow-inner"
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors"><DollarSign size={18} /></div>
                  <input type="number" placeholder="Điền Khung Giá (VNĐ / Đêm)" required
                    className="w-full bg-white/5 border border-white/10 text-white pl-14 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold text-sm shadow-inner"
                    onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>

                <div className="bg-gradient-to-r from-amber-500/5 to-transparent p-6 rounded-2xl border border-dashed border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all group relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-3 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                      <ImageIcon size={24} />
                    </div>
                    <span className="text-amber-400 font-bold text-[11px] uppercase tracking-widest drop-shadow-md">Chọn Ảnh Đính Kèm</span>
                    <span className="text-[10px] text-gray-500">Đuôi .jpg, .png hoặc .webp</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                  </label>
                  {formData.image && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 py-2 rounded-xl px-4 w-fit mx-auto border border-emerald-500/20 backdrop-blur-sm relative z-10">
                      <AlertCircle size={12}/> Đã nhúng: <span className="font-bold text-white max-w-[150px] truncate">{formData.image.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-10 relative z-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-colors border border-white/10">Bỏ qua</button>
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-colors shadow-[0_0_20px_rgba(217,119,6,0.4)]">Xuất bản</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageRooms;