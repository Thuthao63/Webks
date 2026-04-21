import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import { Plus, Trash2, Sparkles, Calendar, Tag, Loader2, X, Percent, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        roomTypeId: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        description: ''
    });

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const [discountsRes, typesRes] = await Promise.all([
                axiosClient.get('/discounts'),
                axiosClient.get('/rooms/types')
            ]);
            setDiscounts(discountsRes.data);
            setRoomTypes(typesRes.data);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
            luxurySwal.fire('Lỗi', 'Không thể kết nối máy chủ.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post('/discounts', formData);
            luxurySwal.fire({ icon: 'success', title: 'Thiết lập thành công', timer: 1500, showConfirmButton: false });
            setShowModal(false);
            setFormData({ roomTypeId: '', discountPercent: '', startDate: '', endDate: '', description: '' });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể tạo chương trình giảm giá.';
            luxurySwal.fire('Thất bại', msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await luxurySwal.fire({
            title: 'Hủy chương trình?',
            text: "Ưu đãi này sẽ không còn hiệu lực ngay lập tức.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý hủy',
        });

        if (result.isConfirmed) {
            try {
                await axiosClient.delete(`/discounts/${id}`);
                luxurySwal.fire({ icon: 'success', title: 'Đã hủy ưu đãi', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (err) {
                luxurySwal.fire('Lỗi', 'Không thể xóa ưu đãi lúc này.', 'error');
            }
        }
    };

    if (loading) return (
        <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-amber-500" size={40} />
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang truy xuất dữ liệu ưu đãi...</p>
        </div>
    );

    return (
        <AdminLayout title="Quản lý Giảm giá" subtitle="Thiết lập các chương trình ưu đãi đặc quyền theo thời điểm">
            <div className="space-y-8 pb-10">

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Percent size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Chiến dịch hiện hữu</p>
                            <p className="text-lg font-serif italic text-white leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{discounts.length} chương trình</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Thiết lập giảm giá
                    </button>
                </div>

                {/* Discounts Table */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto admin-scrollbar">
                        <table className="w-full text-left">
                            <thead className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                                <tr>
                                    <th className="px-8 py-6">Đối tượng / Hạng phòng</th>
                                    <th className="px-6 py-6">Mức giảm</th>
                                    <th className="px-6 py-6">Thời gian áp dụng</th>
                                    <th className="px-6 py-6">Trạng thái</th>
                                    <th className="px-8 py-6 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {discounts.map(discount => {
                                    const isExpired = new Date(discount.endDate) < new Date();
                                    const isUpcoming = new Date(discount.startDate) > new Date();
                                    
                                    return (
                                        <tr key={discount.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:border-amber-500/30 transition-all">
                                                        <Tag size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm tracking-wide">{discount.roomType?.name || 'Tất cả phòng'}</p>
                                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{discount.description || 'Chương trình khuyến mãi'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-serif italic text-amber-500" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                        -{Math.floor(discount.discountPercent)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[11px] text-white font-medium flex items-center gap-2">
                                                        <Calendar size={12} className="text-gray-500" />
                                                        {new Date(discount.startDate).toLocaleDateString('vi-VN')} → {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                    isExpired 
                                                    ? 'text-gray-500 border-white/5 bg-white/5' 
                                                    : isUpcoming 
                                                    ? 'text-sky-400 border-sky-500/20 bg-sky-500/5'
                                                    : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        isExpired ? 'bg-gray-500' : isUpcoming ? 'bg-sky-400' : 'bg-emerald-400'
                                                    }`} />
                                                    {isExpired ? 'Hết hạn' : isUpcoming ? 'Sắp diễn ra' : 'Đang chạy'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => handleDelete(discount.id)}
                                                    className="p-2.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all opacity-30 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {discounts.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                        <Sparkles size={40} className="mx-auto mb-4 text-gray-800" />
                        <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Chưa có chương trình ưu đãi nào</p>
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
                                Thiết lập <span className="text-amber-500">Giảm giá</span>
                            </h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-10">Tạo chương trình khuyến mãi mới cho loại phòng</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Hạng phòng áp dụng</label>
                                    <select 
                                        required 
                                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-bold appearance-none cursor-pointer"
                                        value={formData.roomTypeId}
                                        onChange={e => setFormData({ ...formData, roomTypeId: e.target.value })}
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Chọn hạng phòng...</option>
                                        {roomTypes.map(type => (
                                            <option key={type.id} value={type.id} className="bg-[#0a0a0a]">
                                                {type.name} - ({Number(type.price).toLocaleString()}đ)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Mức giảm (%)</label>
                                    <input 
                                        type="number" placeholder="20" required min="1" max="90"
                                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-bold text-amber-500"
                                        value={formData.discountPercent}
                                        onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Mô tả ngắn</label>
                                    <input 
                                        type="text" placeholder="Ưu đãi mùa hè" required
                                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-bold"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Ngày bắt đầu</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-bold"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Ngày kết thúc</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-bold"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-luxury hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin mx-auto" size={18} />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Kích hoạt chương trình <ArrowUpRight size={16} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            
            {/* Tái định nghĩa ArrowUpRight vì chưa import */}
            <style>{`
                @keyframes bounce-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    70% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-in { animation: bounce-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            `}</style>
        </AdminLayout>
    );
};

// Import thiếu icon
import { ArrowUpRight } from 'lucide-react';

export default ManageDiscounts;
