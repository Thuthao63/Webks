import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import { User, Package, Calendar, CreditCard, ChevronRight, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            axiosClient.get(`/bookings/user/${user.id}`)
                .then(res => {
                    setMyBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    // Hàm render Badge trạng thái cho chuyên nghiệp
    const renderStatus = (status) => {
        const config = {
            pending: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
            confirmed: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
            cancelled: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <XCircle size={12}/>, text: 'Đã hủy' },
            completed: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Package size={12}/>, text: 'Hoàn thành' }
        };
        const s = config[status] || config.pending;
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
                {s.icon} {s.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* HEADER: THÔNG TIN CÁ NHÂN SANG TRỌNG */}
                <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-xl shadow-amber-600/20">
                            <User size={40} className="text-black" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Xin chào, <span className="text-amber-500 not-italic font-sans font-bold">{user?.fullName}</span>
                            </h2>
                            <p className="text-gray-500 text-sm tracking-widest uppercase font-medium">Hội viên đặc quyền của Uy Nam Luxury</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                <span className="text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-400">{user?.email}</span>
                                <span className="text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-400">{user?.phone || 'Chưa cập nhật SĐT'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THỐNG KÊ NHANH */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Tổng số đơn" value={myBookings.length} icon={<Package className="text-amber-500" />} />
                    <StatCard title="Phòng sắp nhận" value={myBookings.filter(b => b.status === 'confirmed').length} icon={<Calendar className="text-amber-500" />} />
                    <StatCard title="Điểm tích lũy" value="1,250" icon={<Star className="text-amber-500" />} />
                </div>

                {/* LỊCH SỬ ĐẶT PHÒNG */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xl font-serif italic text-amber-500" style={{ fontFamily: "'Playfair Display', serif" }}>Lịch sử lưu trú</h3>
                        <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">Dữ liệu cập nhật thời gian thực</span>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="py-20 text-center text-gray-600">Đang tải lịch sử...</div>
                        ) : myBookings.length > 0 ? (
                            myBookings.map((b) => (
                                <div key={b.id} className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-amber-500/30 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:bg-amber-500/10 transition-colors">
                                            <span className="text-[10px] text-gray-500 uppercase font-black">Phòng</span>
                                            <span className="text-xl font-bold text-white">{b.room?.roomNumber || '---'}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white group-hover:text-amber-500 transition-colors">Premium Ocean Suite</h4>
                                            <div className="flex items-center gap-4 text-[11px] text-gray-500 italic">
                                                <div className="flex items-center gap-1"><Calendar size={12}/> {new Date(b.checkInDate).toLocaleDateString('vi-VN')}</div>
                                                <ChevronRight size={10} />
                                                <div className="flex items-center gap-1">{new Date(b.checkOutDate).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-amber-500 font-bold text-lg">{Number(b.totalPrice).toLocaleString()}đ</p>
                                            <p className="text-[9px] text-gray-600 uppercase tracking-tighter">Tổng thanh toán</p>
                                        </div>
                                        {renderStatus(b.status)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-600 italic text-sm">Thảo chưa có đơn đặt phòng nào. Khám phá các phòng nghỉ ngay!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component cho các thẻ thống kê
const StatCard = ({ title, value, icon }) => (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.02] transition-all">
        <div className="space-y-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{title}</p>
            <p className="text-3xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
    </div>
);

const Star = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default Profile;