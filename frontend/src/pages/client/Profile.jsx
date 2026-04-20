import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import {
    User, Package, Calendar, CreditCard, ChevronRight, Clock,
    CheckCircle, XCircle, MapPin, Edit2, LogOut, Shield,
    Star, Award, Bell, Settings, Heart, History, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUserContext, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axiosClient.get(`/bookings/user/${user.id}`);
                setMyBookings(res.data);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu cá nhân:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleEditProfile = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Cập nhật danh tính',
            html: `
                <div class="flex flex-col gap-5 text-left mt-6 pb-4">
                    <div class="space-y-2">
                        <label class="text-[10px] text-[#B59A6D] font-black uppercase tracking-[0.3em] pl-1">Họ và tên</label>
                        <input id="swal-edit-name" type="text" value="${user?.fullName || ''}" class="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-[#B59A6D]/50 transition-all font-medium text-sm">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] text-[#B59A6D] font-black uppercase tracking-[0.3em] pl-1">Số điện thoại</label>
                        <input id="swal-edit-phone" type="text" value="${user?.phone || ''}" class="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-[#B59A6D]/50 transition-all font-medium text-sm">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] text-[#B59A6D] font-black uppercase tracking-[0.3em] pl-1">Địa chỉ thường trú</label>
                        <input id="swal-edit-address" type="text" value="${user?.address || ''}" class="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-[#B59A6D]/50 transition-all font-medium text-sm">
                    </div>
                </div>
            `,
            background: '#0d0d0df2',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Lưu thay đổi',
            cancelButtonText: 'Hủy bỏ',
            customClass: {
                popup: 'rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-10',
                title: 'font-serif italic text-[#B59A6D] text-3xl',
                confirmButton: 'bg-gradient-to-r from-[#B59A6D] to-[#8E7955] text-black px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#B59A6D]/20',
                cancelButton: 'bg-white/5 text-gray-400 px-10 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-colors'
            },
            preConfirm: () => {
                return {
                    fullName: document.getElementById('swal-edit-name').value,
                    phone: document.getElementById('swal-edit-phone').value,
                    address: document.getElementById('swal-edit-address').value,
                };
            }
        });

        if (formValues) {
            try {
                Swal.fire({ title: 'Đang đồng bộ...', background: '#0d0d0df2', color: '#fff', didOpen: () => Swal.showLoading() });
                const res = await axiosClient.put(`/auth/${user.id}`, formValues);
                updateUserContext(res.data.user);
                Swal.fire({ icon: 'success', title: 'Thành công', text: 'Hồ sơ đã được cập nhật.', background: '#0d0d0df2', color: '#fff' });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Không thể cập nhật hồ sơ.', background: '#0d0d0df2', color: '#fff' });
            }
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Xác nhận đăng xuất?',
            text: "Hẹn gặp lại Thượng khách trong thời gian sớm nhất.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#B59A6D',
            cancelButtonColor: '#1f2937',
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Ở lại',
            background: '#0d0d0df2',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/');
            }
        });
    };

    const renderStatusBadge = (status) => {
        const configs = {
            'pending': { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', text: 'Chờ duyệt', icon: Clock },
            'confirmed': { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', text: 'Đã xác nhận', icon: CheckCircle },
            'cancelled': { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', text: 'Đã hủy', icon: XCircle },
            'completed': { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', text: 'Đã lưu trú', icon: Award }
        };
        const config = configs[status] || configs['pending'];
        const Icon = config.icon;
        return (
            <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                <Icon size={12} /> {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-[#B59A6D]/20 border-t-[#B59A6D] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="text-[#B59A6D] animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#B59A6D] selection:text-black font-sans pb-32">

            {/* HERO BANNER SECTION */}
            <div className="relative h-[45vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover opacity-50 contrast-125 scale-110"
                    alt="Cover"
                />

                <div className="absolute bottom-0 left-0 w-full px-6 md:px-20 pb-12 z-20">
                    <div className="flex flex-col md:flex-row items-end gap-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] border-4 border-[#050505] bg-gradient-to-tr from-[#B59A6D] to-[#8E7955] flex items-center justify-center shadow-2xl shadow-black overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                                <User size={80} className="text-[#050505]" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer" onClick={handleEditProfile}>
                                    <Edit2 size={32} className="text-[#B59A6D]" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-[#050505] shadow-lg" title="Thành viên hạng kim cương"></div>
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <h1 className="text-3xl md:text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {user?.fullName}
                                </h1>
                                <span className="bg-[#B59A6D]/10 border border-[#B59A6D]/20 px-6 py-2 rounded-full text-[#B59A6D] text-[10px] font-black uppercase tracking-[0.3em]">
                                    Platinum Elite
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm tracking-[0.4em] uppercase font-bold italic">Khách hàng đặc quyền tại Uy Nam Luxury</p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleLogout} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-xl group">
                                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 mt-16 flex flex-col lg:flex-row gap-12">

                {/* SIDEBAR NAVIGATION */}
                <aside className="lg:w-1/4 space-y-4">
                    <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2.5rem] shadow-premium">
                        {[
                            { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
                            { id: 'bookings', label: 'Chuyến đi của tôi', icon: History },
                            { id: 'settings', label: 'Cài đặt tài khoản', icon: Settings },
                            { id: 'membership', label: 'Đặc quyền Tài khoản', icon: Award },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-5 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-[#B59A6D] to-[#8E7955] text-black shadow-[0_10px_30px_rgba(181,154,109,0.2)]'
                                        : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-gradient-to-br from-[#B59A6D]/10 to-transparent border border-[#B59A6D]/20 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <Award className="absolute -right-8 -bottom-8 text-[#B59A6D]/10 rotate-12" size={150} />
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#B59A6D]">Hạng mức Tài khoản</h4>
                        <div className="space-y-1">
                            <p className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>12,450</p>
                            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Điểm tích lũy hiện có</p>
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Đổi ưu đãi</button>
                    </div>
                </aside>

                {/* DYNAMIC CONTENT AREA */}
                <main className="lg:w-3/4 animate-in fade-in slide-in-from-right-4 duration-500">

                    {activeTab === 'dashboard' && (
                        <div className="space-y-12">
                            {/* STATS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] shadow-premium hover:border-[#B59A6D]/20 transition-all group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-amber-500/10 text-[#B59A6D] rounded-2xl group-hover:scale-110 transition-transform">
                                            <Package size={24} strokeWidth={1} />
                                        </div>
                                        <ChevronRight size={16} className="text-gray-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-4xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{myBookings.length}</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tổng lịch sử lưu trú</p>
                                    </div>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] shadow-premium hover:border-emerald-500/20 transition-all group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                                            <Calendar size={24} strokeWidth={1} />
                                        </div>
                                        <ChevronRight size={16} className="text-gray-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-5xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {myBookings.filter(b => b.status === 'confirmed').length}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Kỳ nghỉ sắp tới</p>
                                    </div>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] shadow-premium hover:border-blue-500/20 transition-all group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                                            <Heart size={24} strokeWidth={1} />
                                        </div>
                                        <ChevronRight size={16} className="text-gray-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-5xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>12</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Dịch vụ yêu mến</p>
                                    </div>
                                </div>
                            </div>

                            {/* RECENT BOOKING TEASER */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B59A6D]/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>

                                <div className="flex justify-between items-center relative z-10">
                                    <h3 className="text-2xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Hoạt động gần đây</h3>
                                    <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-black uppercase tracking-widest text-[#B59A6D] hover:text-white transition-colors">Xem toàn bộ lịch sử</button>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {myBookings.slice(0, 1).map((booking) => (
                                        <div key={booking.id} className="flex gap-10 items-center bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all">
                                            <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                                                <img
                                                    src={`/Hinh anh/Hinh${(booking.roomId % 20) + 1}.png`}
                                                    className="w-full h-full object-cover"
                                                    alt="Room"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-white mb-1">Luxury Suite #{booking.room?.roomNumber}</h4>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">Signature Stay</p>
                                                    </div>
                                                    {renderStatusBadge(booking.status)}
                                                </div>
                                                <div className="flex gap-8 text-[11px] text-gray-400 font-medium">
                                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-[#B59A6D]" /> {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</div>
                                                    <div className="flex items-center gap-2"><CreditCard size={14} className="text-[#B59A6D]" /> {Number(booking.totalPrice).toLocaleString()} VNĐ</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {myBookings.length === 0 && (
                                        <div className="text-center py-20 opacity-30">
                                            <Clock size={48} className="mx-auto mb-6" strokeWidth={1} />
                                            <p className="text-sm font-medium italic">Chưa có lịch sử hoạt động ghi nhận.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                <h3 className="text-3xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Đơn đặt của tôi</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic flex items-center gap-3">
                                    <History size={14} className="text-[#B59A6D]" /> Tổng số: {myBookings.length} yêu cầu
                                </p>
                            </div>

                            <div className="grid gap-8">
                                {myBookings.map((booking) => (
                                    <div key={booking.id} className="group flex flex-col md:flex-row gap-10 bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] hover:border-[#B59A6D]/30 transition-all duration-700 shadow-premium hover:shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B59A6D]/5 rounded-full blur-[80px] pointer-events-none"></div>

                                        <div className="md:w-64 h-48 rounded-[2rem] overflow-hidden border border-white/5 shrink-0 shadow-2xl relative">
                                            <img
                                                src={`/Hinh anh/Hinh${(booking.roomId % 20) + 1}.png`}
                                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                                alt="Room"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 text-[10px] font-black uppercase text-white tracking-widest bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                                                Phòng {booking.room?.roomNumber}
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-2 space-y-10 relative z-10">
                                            <div className="space-y-6">
                                                <div className="flex flex-wrap justify-between items-center gap-6">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Suite Heritage</h4>
                                                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-black italic">Collection de Uy Nam</p>
                                                    </div>
                                                    {renderStatusBadge(booking.status)}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/[0.03]">
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block">Ngày nhận</span>
                                                        <span className="text-xs font-bold text-gray-200">{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block">Ngày trả</span>
                                                        <span className="text-xs font-bold text-gray-200">{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block">Thanh toán</span>
                                                        <span className="text-xs font-black text-[#B59A6D]">{Number(booking.totalPrice).toLocaleString()} VNĐ</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block">Dịch vụ Butler</span>
                                                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit block">Kích hoạt</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => navigate(`/room/${booking.roomId}`)}
                                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                                                >
                                                    Chi tiết căn phòng
                                                </button>
                                                {booking.status === 'completed' && (
                                                    <button className="flex-[2] py-4 bg-gradient-to-r from-[#B59A6D] to-[#8E7955] text-black text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#B59A6D]/20 hover:scale-105 transition-all">
                                                        Gửi đánh giá trải nghiệm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {myBookings.length === 0 && (
                                    <div className="py-40 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] shadow-premium">
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 group hover:bg-[#B59A6D] transition-luxury">
                                            <Package size={40} className="text-gray-700 group-hover:text-black transition-colors" />
                                        </div>
                                        <h4 className="text-3xl font-serif italic text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Hành trình của bạn còn trống</h4>
                                        <p className="text-gray-500 max-w-sm mx-auto text-sm italic font-medium mb-12">Hãy để Uy Nam cùng bạn tạo nên những kỷ niệm khó quên giữa lòng đại dương.</p>
                                        <button onClick={() => navigate('/rooms')} className="bg-[#B59A6D] text-black px-12 py-5 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-[#B59A6D]/10">Khám phá các Đặt phòng</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-10">
                            <div className="border-b border-white/5 pb-8">
                                <h3 className="text-3xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Thiết lập tài khoản</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Quản lý định danh và bảo mật</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] space-y-10 shadow-premium relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B59A6D]/5 rounded-full blur-[80px] pointer-events-none"></div>

                                    <div className="space-y-3">
                                        <h4 className="text-xl font-bold flex items-center gap-4"><User className="text-[#B59A6D]" size={20} /> Thông tin cá nhân</h4>
                                        <p className="text-xs text-gray-500">Các thông tin được sử dụng cho việc đặt phòng và liên hệ.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-1 shrink-0">
                                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-600">Họ và tên</p>
                                            <p className="text-base font-bold text-gray-100">{user?.fullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-600">Địa chỉ Email</p>
                                            <p className="text-base font-bold text-gray-100">{user?.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-600">Số điện thoại</p>
                                            <p className="text-base font-bold text-gray-100">{user?.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-600">Địa chỉ thường trú</p>
                                            <p className="text-base font-bold text-gray-100">{user?.address || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleEditProfile}
                                        className="w-full py-5 bg-[#B59A6D] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#B59A6D]/10 hover:bg-white transition-all transform hover:-translate-y-1"
                                    >
                                        Chỉnh sửa hồ sơ
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] space-y-6 shadow-premium relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                                        <h4 className="text-xl font-bold flex items-center gap-4"><Shield className="text-rose-500" size={20} /> Bảo mật tài khoản</h4>
                                        <p className="text-xs text-gray-500">Chúng tôi khuyến cáo đổi mật khẩu định kỳ 6 tháng một lần.</p>
                                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">Thay đổi mật khẩu</button>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 p-12 rounded-[3.5rem] space-y-6 shadow-premium relative overflow-hidden group">
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                                        <h4 className="text-xl font-bold flex items-center gap-4"><Bell className="text-blue-500" size={20} /> Thông báo & Ưu đãi</h4>
                                        <p className="text-xs text-gray-500">Nhận thông báo về các ưu đãi Tài khoản và quản lý yêu cầu qua Email.</p>
                                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all">Thiết lập thông báo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'membership' && (
                        <div className="space-y-12">
                            <div className="border-b border-white/5 pb-8">
                                <h3 className="text-3xl font-serif italic text-[#B59A6D]" style={{ fontFamily: "'Playfair Display', serif" }}>Thẻ Tài khoản Elite</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 italic">Dành riêng cho những chủ nhân đáng kính</p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="bg-gradient-to-br from-slate-900 to-[#050505] p-12 rounded-[4rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
                                    <div className="absolute top-12 left-12 opacity-20"><Shield size={100} strokeWidth={0.5} /></div>
                                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#B59A6D]/20 to-transparent rounded-full blur-[100px] -mr-48 -mb-48"></div>

                                    <div className="flex justify-between items-start relative z-10 leading-none">
                                        <span className="text-3xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury</span>
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/20 px-4 py-2 rounded-xl backdrop-blur-md bg-black/40 shadow-xl">Platinum Elite Members</span>
                                    </div>

                                    <div className="space-y-6 relative z-10 pt-20">
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Identified as</p>
                                        <p className="text-2xl font-serif text-[#B59A6D] uppercase tracking-widest">{user?.fullName}</p>
                                        <div className="flex justify-between items-end pt-10">
                                            <div className="space-y-1">
                                                <p className="text-[9px] uppercase font-black text-gray-600">Member since</p>
                                                <p className="text-xs font-bold text-gray-400">APRIL 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-black text-gray-600">Point status</p>
                                                <p className="text-base font-bold text-white">12,450 XP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Đặc quyền hạng Platinum</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed italic font-medium">Trải nghiệm những dịch vụ cao cấp nhất được thiết kế riêng cho hạng thành viên đặc quyền.</p>
                                    </div>

                                    <div className="grid gap-6">
                                        {[
                                            { icon: Star, title: "Nâng hạng phòng miễn phí", desc: "Luôn được ưu tiên nâng hạng phòng tùy vào tình trạng trống." },
                                            { icon: Clock, title: "Trả phòng trễ đến 16:00", desc: "Thoải mái tận hưởng kỳ nghỉ mà không lo lắng về thời gian." },
                                            { icon: Award, title: "Tích lũy 50% điểm thưởng", desc: "Gia tăng điểm thưởng nhanh hơn cho mỗi lần lưu trú." },
                                            { icon: User, title: "Butler cá nhân riêng biệt", desc: "Hỗ trợ chuẩn bị mọi yêu cầu trước khi bạn đến." }
                                        ].map((perk, i) => (
                                            <div key={i} className="flex gap-6 items-start group">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#B59A6D] group-hover:bg-[#B59A6D] group-hover:text-black transition-all shrink-0">
                                                    <perk.icon size={20} strokeWidth={1} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="text-[11px] font-black uppercase tracking-widest text-[#B59A6D]">{perk.title}</h5>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{perk.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;