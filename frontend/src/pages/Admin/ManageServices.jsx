import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Plus, Edit2, Trash2, Coffee, Banknote } from 'lucide-react';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const fetchServices = () => {
    setLoading(true);
    axiosClient.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

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

  const handleOpenForm = (service = null) => {
    if (service) {
        setEditingId(service.id);
        setFormData({ name: service.name, price: service.price });
    } else {
        setEditingId(null);
        setFormData({ name: '', price: '' });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    try {
        if (editingId) {
            await axiosClient.put(`/services/${editingId}`, formData);
            luxurySwal.fire({ icon: 'success', title: 'Thành công', text: 'Đã cập nhật dịch vụ', timer: 1500, showConfirmButton: false });
        } else {
            await axiosClient.post(`/services`, formData);
            luxurySwal.fire({ icon: 'success', title: 'Thành công', text: 'Đã thêm dịch vụ', timer: 1500, showConfirmButton: false });
        }
        handleCloseForm();
        fetchServices();
    } catch (err) {
        luxurySwal.fire('Thất bại', err.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleDeleteService = async (serviceTarget) => {
    const result = await luxurySwal.fire({
      title: `Xóa: ${serviceTarget.name}?`,
      text: 'Nếu dịch vụ này đã xuất hiện trong Đơn đặt phòng, hệ thống sẽ bảo vệ không cho xóa để đảm bảo hóa đơn cũ không bị lỗi.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Quay lại'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/services/${serviceTarget.id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã xóa!', timer: 1500, showConfirmButton: false });
        fetchServices();
      } catch (err) {
        luxurySwal.fire('Thao tác từ chối', err.response?.data?.message || 'Không thể xóa dịch vụ này!', 'error');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Tải Danh Mục</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background glow toàn trang */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Dịch vụ</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Menu dịch vụ, giá món & Tiện ích đi kèm</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <button onClick={() => handleOpenForm(null)} className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transition-all transform hover:scale-105">
                <Plus size={16} /> Thêm Dịch Vụ
             </button>
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[1.5rem] flex items-center gap-6 shadow-2xl">
                <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md">{services.length}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Items</span>
                  <span onClick={fetchServices} className="cursor-pointer hover:text-amber-400 transition-colors text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 border-none"><RefreshCw size={10} className="hover:animate-spin" /> Đồng bộ</span>
                </div>
             </div>
          </div>
        </div>

        {/* BẢNG GRID DỊCH VỤ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {services.length > 0 ? services.map(service => (
               <div key={service.id} className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-lg hover:shadow-[0_10px_40px_rgba(217,119,6,0.15)] hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between">
                  
                  <div className="flex items-start gap-4 mb-6">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600/20 to-amber-300/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner group-hover:bg-amber-500 group-hover:text-black transition-all">
                        <Coffee size={24} />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">{service.name}</h3>
                        <p className="flex items-center gap-1.5 mt-2 text-emerald-400 font-bold text-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl w-fit">
                           {Number(service.price).toLocaleString()} <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">vnđ</span>
                        </p>
                     </div>
                  </div>

                  {/* Hành động */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                     <button 
                         onClick={() => handleOpenForm(service)}
                         className="flex-1 flex justify-center items-center gap-2 bg-white/5 hover:bg-amber-500 text-gray-300 hover:text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                     >
                        <Edit2 size={12} /> Sửa
                     </button>
                     <button 
                         onClick={() => handleDeleteService(service)}
                         className="w-12 h-full flex justify-center items-center bg-white/5 hover:bg-rose-500 text-gray-300 hover:text-black rounded-xl transition-all"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>
           )) : (
               <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl">
                   <Coffee size={40} className="text-gray-500 mb-4 opacity-50" />
                   <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Chưa cấu hình dịch vụ</span>
               </div>
           )}
        </div>

      </div>

      {/* FORM OVERLAY POPUP */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Nền mờ */}
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseForm}></div>
           
           {/* Hộp thoại */}
           <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-amber-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(217,119,6,0.2)]">
               <h3 className="text-2xl font-serif italic text-amber-500 mb-6 flex items-center gap-3">
                  <Coffee /> {editingId ? 'Cập nhật Dịch vụ' : 'Thêm Dịch vụ Mới'}
               </h3>

               <form onSubmit={handleSubmit} className="space-y-5">
                   <div>
                       <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2 pl-2">Tên Dịch vụ</label>
                       <input 
                          type="text" required
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Ví dụ: Giặt ủi quần áo, Vệ sinh phòng..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-medium"
                       />
                   </div>
                   <div>
                       <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2 pl-2">Giá tiền (VNĐ)</label>
                       <div className="relative">
                           <input 
                              type="number" required
                              value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                              placeholder="Nhập số tiền..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-medium"
                           />
                           <Banknote className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                       </div>
                   </div>

                   <div className="flex gap-4 pt-4 mt-6 border-t border-white/10">
                       <button type="button" onClick={handleCloseForm} className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                           Hủy bỏ
                       </button>
                       <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all">
                           {editingId ? 'Cập nhật' : 'Hoàn thành'}
                       </button>
                   </div>
               </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default ManageServices;
