import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import { Plus, Trash2, Tag, Calendar, Loader2, X, Percent, AlertCircle, CheckCircle } from "lucide-react";
import Swal from 'sweetalert2';

const ManageDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        roomTypeId: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const luxurySwal = Swal.mixin({
        background: '#ffffff',
        color: '#0f172a',
        backdrop: 'rgba(15,23,42,0.4)',
        customClass: {
            popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
            title: 'font-sans text-amber-500 text-2xl',
            htmlContainer: 'text-slate-400 text-sm',
            confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
            cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold  tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
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
            setFormData({ code: '', roomTypeId: '', discountPercent: '', startDate: '', endDate: '', description: '' });
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
            <p className="text-slate-500 text-[10px] tracking-[0.3em]  font-bold animate-pulse">Đang truy xuất dữ liệu ưu đãi...</p>
        </div>
    );

    return (
        <AdminLayout title="Quản lý Giảm giá" subtitle="Thiết lập các chương trình ưu đãi đặc quyền theo thời điểm">
            <div className="space-y-8 pb-10">

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Percent size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold  tracking-widest">Chiến dịch hiện hữu</p>
                            <p className="text-base font-medium font-sans text-slate-900 leading-none mt-1">{discounts.length} chương trình</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Thiết lập giảm giá
                    </button>
                </div>

                {/* Discounts Table */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto admin-scrollbar">
                        <table className="w-full text-left">
                            <thead className="text-[10px] text-slate-500  font-medium tracking-[0.2em] border-b border-slate-100 bg-slate-50/50 font-sans">
                                <tr>
                                    <th className="px-8 py-6">Mã Khuyến Mãi</th>
                                    <th className="px-6 py-6">Hạng phòng áp dụng</th>
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
                                        <tr key={discount.id} className="group hover:bg-slate-50/50 font-sans transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-black text-xs uppercase tracking-widest whitespace-nowrap shadow-sm">
                                                        {discount.code}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-slate-700 font-medium text-sm font-sans line-clamp-2">{discount.description || 'Chương trình khuyến mãi'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={14} className="text-slate-400" />
                                                    <p className="text-slate-700 font-medium text-sm font-sans">{discount.roomType?.name || 'Tất cả phòng'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-medium font-sans text-amber-500">
                                                        -{Math.floor(discount.discountPercent)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[11px] text-slate-900 font-medium flex items-center gap-2">
                                                        <Calendar size={12} className="text-slate-500" />
                                                        {new Date(discount.startDate).toLocaleDateString('vi-VN')} → {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black  tracking-widest border ${
                                                    isExpired 
                                                    ? 'text-slate-500 border-slate-100 bg-slate-50' 
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
                    <div className="py-20 text-center border border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 font-sans">
                        <Tag size={40} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] ">Chưa có chương trình ưu đãi nào</p>
                    </div>
                )}

                {/* Modal Form */}
                {showModal && createPortal(
                    <div className="fixed inset-0 z-[100]">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
                            <div className="flex min-h-full items-start justify-center p-4 pt-16 pb-20">
                                <form onSubmit={handleSubmit} className="relative bg-white border border-slate-200 w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] shadow-luxury z-10 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                                <X size={16} />
                            </button>

                            <h2 className="text-lg font-medium font-sans text-slate-900 mb-1">
                                Thiết lập <span className="text-amber-500">Giảm giá</span>
                            </h2>
                            <p className="text-[9px] text-slate-500  tracking-[0.2em] font-bold mb-6">Tạo chương trình khuyến mãi mới cho loại phòng</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                                <div className="space-y-1.5 md:col-span-2 relative">
                                    <label className="text-[9px] text-slate-500 font-black tracking-widest ml-1">Mã Khuyến Mãi</label>
                                    <div className="relative">
                                        <input 
                                            type="text" placeholder="VD: SUMMER2024" required
                                            className="w-full bg-slate-50 border border-slate-200 text-amber-600 uppercase p-3 pr-28 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-black tracking-widest text-sm"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({ ...formData, code: 'KSUN' + Math.floor(Math.random() * 9000 + 1000) })}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-amber-200 transition-colors"
                                        >
                                            Sinh mã ngẫu nhiên
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[9px] text-slate-500  font-black tracking-widest ml-1">Hạng phòng áp dụng</label>
                                    <select 
                                        required 
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold appearance-none cursor-pointer text-sm"
                                        value={formData.roomTypeId}
                                        onChange={e => setFormData({ ...formData, roomTypeId: e.target.value })}
                                    >
                                        <option value="" className="bg-white">Chọn hạng phòng...</option>
                                        {roomTypes.map(type => (
                                            <option key={type.id} value={type.id} className="bg-white">
                                                {type.name} - ({Number(type.price).toLocaleString()}đ)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-slate-500  font-black tracking-widest ml-1">Mức giảm (%)</label>
                                    <input 
                                        type="number" placeholder="20" required min="1" max="90"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold text-amber-500 text-sm"
                                        value={formData.discountPercent}
                                        onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-slate-500  font-black tracking-widest ml-1">Mô tả ngắn</label>
                                    <input 
                                        type="text" placeholder="Ưu đãi mùa hè" required
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold text-sm"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-slate-500  font-black tracking-widest ml-1">Ngày bắt đầu</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold text-sm"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-slate-500  font-black tracking-widest ml-1">Ngày kết thúc</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all font-bold text-sm"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] hover:bg-slate-800 active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin mx-auto" size={18} />
                                ) : (
                                    <>
                                        <CheckCircle size={14} className="text-amber-500" />
                                        KÍCH HOẠT CHƯƠNG TRÌNH
                                    </>
                                )}
                            </button>
                        </form>
                            </div>
                        </div>
                    </div>,
                    document.body
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
import { ArrowUpRight } from "lucide-react";

export default ManageDiscounts;
