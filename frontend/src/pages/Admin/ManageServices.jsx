import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Coffee, MoreVertical, Trash2, X, Banknote, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const luxurySwal = Swal.mixin({
    background: '#ffffff',
    color: '#0f172a',
    backdrop: 'rgba(15,23,42,0.4)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-sans text-amber-500 text-2xl',
      htmlContainer: 'text-slate-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/services/${editingId}`, formData);
      } else {
        await axiosClient.post('/services', formData);
      }
      luxurySwal.fire({ icon: 'success', title: 'Hoàn tất', timer: 1500, showConfirmButton: false });
      setIsFormOpen(false);
      fetchServices();
    } catch (err) {
      luxurySwal.fire('Thất bại', 'Không thể lưu trữ thông tin dịch vụ', 'error');
    }
  };

  const handleDeleteService = async (serviceTarget) => {
    const result = await luxurySwal.fire({
      title: `Gỡ bỏ dịch vụ?`,
      text: `Dịch vụ "${serviceTarget.name}" sẽ bị xóa khỏi menu niêm yết.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy bỏ',
      confirmButtonText: 'Xác nhận xóa'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/services/${serviceTarget.id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã xóa', timer: 1500, showConfirmButton: false });
        fetchServices();
      } catch (err) {
        luxurySwal.fire('Lỗi ràng buộc', 'Dịch vụ này đang được sử dụng trong các đơn đặt hàng.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold animate-pulse">Đang tải danh mục tiện ích...</p>
    </div>
  );

  return (
    <AdminLayout title="Danh mục dịch vụ" subtitle="Quản lý menu tiện ích, bảng giá & thông số dịch vụ đi kèm">
      <div className="space-y-8 pb-10">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Coffee size={20} />
             </div>
             <div>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest">Sản phẩm hiện có</p>
                <p className="text-base font-medium font-sans text-slate-900 leading-none mt-1">{services.length} hạng mục dịch vụ</p>
             </div>
          </div>
          
          <button 
            onClick={() => handleOpenForm(null)} 
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Thêm dịch vụ mới
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {services.map(service => (
               <div key={service.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl hover:border-amber-500/20 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all duration-500">
                       <Coffee size={24} />
                    </div>
                    <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                       <MoreVertical size={20} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 group-hover:text-amber-500 transition-colors tracking-tight mb-2">{service.name}</h3>
                  <div className="flex items-baseline gap-2 mb-8">
                     <span className="text-xl font-medium font-sans text-slate-900">{Number(service.price).toLocaleString()}</span>
                     <span className="text-[10px] text-slate-500 font-black tracking-widest text-glow-amber">VNĐ</span>
                  </div>

                  <div className="flex gap-2 pt-6 border-t border-slate-100">
                     <button onClick={() => handleOpenForm(service)} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl text-[10px] font-bold tracking-widest transition-all">
                        Chỉnh sửa
                     </button>
                     <button onClick={() => handleDeleteService(service)} className="px-4 py-3 bg-slate-50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
           ))}
        </div>

        {/* Status Messages */}
        {services.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2.5rem]">
               <Coffee size={48} className="text-slate-300 mb-4" />
               <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em]">Danh mục đang trống trải</p>
           </div>
        )}

      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
            <form onSubmit={handleSubmit} className="relative bg-white border border-slate-200 w-full max-w-md p-10 rounded-[3.5rem] shadow-luxury z-10 animate-in zoom-in-95 duration-300">
                <button type="button" onClick={() => setIsFormOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-slate-900 bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-medium font-sans text-slate-900 mb-2">
                   {editingId ? 'Cập nhật' : 'Thêm'} <span className="text-amber-500">Dịch vụ</span>
                </h2>
                <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-10">Thiết lập tham số cho hạng mục tiện ích</p>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Tên gọi dịch vụ</label>
                        <input type="text" placeholder="VD: Giặt ủi cao cấp" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black tracking-widest ml-1">Đơn giá niêm yết</label>
                        <div className="relative">
                            <input type="number" placeholder="250000" required
                                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pr-12 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-black text-sm" />
                            <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-12">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl font-bold tracking-widest text-[10px] transition-all border border-slate-100">Hủy</button>
                    <button type="submit" className="py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-2xl font-black tracking-widest text-[10px] transition-all shadow-luxury">Lưu thay đổi</button>
                </div>
            </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageServices;
