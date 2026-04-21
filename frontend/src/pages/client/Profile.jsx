import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import {
    User, Package, Calendar, CreditCard, ChevronRight, Clock,
    CheckCircle, XCircle, MapPin, Edit2, LogOut, Shield,
    Star, Award, Bell, Settings, Heart, History, LayoutDashboard,
    ArrowUpRight, Sparkles
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
                <div class="flex flex-col gap-6 text-left mt-8 pb-4">
                    <div class="space-y-2">
                        <label class="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] pl-1">Họ và tên quý khách</label>
                        <input id="swal-edit-name" type="text" value="${user?.fullName || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-[#B59A6D] transition-all font-medium text-sm">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] pl-1">Số liên lạc</label>
                        <input id="swal-edit-phone" type="text" value="${user?.phone || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-[#B59A6D] transition-all font-medium text-sm">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] pl-1">Địa chỉ thường trú</label>
                        <input id="swal-edit-address" type="text" value="${user?.address || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-[#B59A6D] transition-all font-medium text-sm">
                    </div>
                </div>
            `,
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: 'Lưu thay đổi',
            cancelButtonText: 'Quay lại',
            customClass: {
                popup: 'rounded-[3rem] border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-12',
                title: 'font-sans font-bold text-slate-900 text-3xl',
                confirmButton: 'bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#B59A6D] transition-all shadow-xl shadow-slate-900/10',
                cancelButton: 'bg-slate-50 text-slate-400 px-10 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors'
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
                Swal.fire({ title: 'Đang xử lý...', didOpen: () => Swal.showLoading() });
                const res = await axiosClient.put(`/auth/${user.id}`, formValues);
                updateUserContext(res.data.user);
                Swal.fire({ icon: 'success', title: 'Hoàn tất', text: 'Thông tin của bạn đã được đồng bộ.', confirmButtonColor: '#B59A6D' });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Không thể cập nhật thông tin lúc này.', confirmButtonColor: '#slate-900' });
            }
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Hành trình kết thúc?',
            text: "Cảm ơn quý khách đã đồng hành cùng Uy Nam Luxury.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#B59A6D',
            cancelButtonColor: '#slate-900',
            confirmButtonText: 'Xác nhận đi',
            cancelButtonText: 'Ở lại cùng chúng tôi'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/');
            }
        });
    };

    const renderStatusBadge = (status) => {
        const configs = {
            'pending': { color: 'text-amber-600 bg-amber-50 border-amber-100', text: 'Đang chờ', icon: Clock },
            'confirmed': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', text: 'Đã duyệt', icon: CheckCircle },
            'cancelled': { color: 'text-rose-600 bg-rose-50 border-rose-100', text: 'Đã hủy', icon: XCircle },
            'completed': { color: 'text-blue-600 bg-blue-50 border-blue-100', text: 'Đã xong', icon: Award }
        };
        const config = configs[status] || configs['pending'];
        const Icon = config.icon;
        return (
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${config.color}`}>
                <Icon size={10} /> {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[#B59A6D]/20 border-t-[#B59A6D] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F8F6] text-slate-900 font-sans pb-32">
            
            {/* HERO BANNER - MINIMAL */}
            <div className="relative h-[40vh] w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9F8F6] z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover opacity-60 contrast-110 scale-105"
                    alt="Cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-[#B59A6D]/5 z-5"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* LEFT PANEL: PROFILE SUMMARY */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-premium text-center">
                            <div className="relative inline-block group mb-8">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-[#B59A6D] to-[#D4C3A3] p-1 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-full h-full bg-white rounded-[2.3rem] flex items-center justify-center text-[#B59A6D]">
                                        <User size={64} strokeWidth={1} />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleEditProfile}
                                    className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl hover:bg-[#B59A6D] transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            
                            <h1 className="text-4xl font-serif italic text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {user?.fullName}
                            </h1>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-8 italic">Private Collection • Since 2024</p>
                            
                            <div className="flex justify-center gap-3">
                                <span className="bg-[#B59A6D]/10 text-[#B59A6D] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#B59A6D]/20 flex items-center gap-2">
                                    <Sparkles size={10} /> Platinum Elite
                                </span>
                            </div>
                        </div>

                        {/* MINI NAVIGATION */}
                        <div className="bg-white/60 p-4 rounded-[2.5rem] border border-white/50 shadow-sm space-y-1">
                            {[
                                { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
                                { id: 'bookings', label: 'Chuyến đi', icon: History },
                                { id: 'settings', label: 'Cài đặt', icon: Settings },
                                { id: 'membership', label: 'Đặc quyền', icon: Award },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-5 px-8 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]'
                                            : 'text-slate-400 hover:bg-white hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon size={16} strokeWidth={2} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT PANEL: CONTENT */}
                    <div className="lg:w-2/3 animate-in fade-in slide-in-from-right-4 duration-700">
                        
                        {activeTab === 'dashboard' && (
                            <div className="space-y-12">
                                {/* STATS - MINIMALIST */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Yêu dấu', value: myBookings.length, icon: Heart, color: 'text-rose-500 bg-rose-50' },
                                        { label: 'Dự định', value: myBookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'text-[#B59A6D] bg-amber-50' },
                                        { label: 'Tích lũy', value: '12,4k', icon: Award, color: 'text-blue-500 bg-blue-50' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-luxury group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-110 transition-transform`}>
                                                    <stat.icon size={20} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                                                    <p className="text-3xl font-serif italic text-slate-900 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* LATEST ACTIVITY */}
                                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-premium relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                                        <h3 className="text-2xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Kỳ nghỉ mới nhất</h3>
                                        <button onClick={() => setActiveTab('bookings')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B59A6D] hover:text-slate-900 transition-colors">
                                            Xem tất cả <ArrowUpRight size={14} />
                                        </button>
                                    </div>

                                    {myBookings.length > 0 ? (
                                        <div className="flex flex-col md:flex-row gap-10 items-center">
                                            <div className="w-full md:w-56 h-40 rounded-[2rem] overflow-hidden shadow-xl border border-slate-50 relative group">
                                                <img
                                                    src={`/Hinh anh/Hinh${(myBookings[0].roomId % 20) + 1}.png`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                    alt="Recent"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-slate-900 mb-1">Luxury Suite #{myBookings[0].room?.roomNumber}</h4>
                                                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black italic">Collection de Uy Nam • Signature Stay</p>
                                                    </div>
                                                    {renderStatusBadge(myBookings[0].status)}
                                                </div>
                                                <div className="flex gap-8 text-[11px] text-slate-500 font-medium pt-2">
                                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-[#B59A6D]" /> {new Date(myBookings[0].checkInDate).toLocaleDateString('vi-VN')}</div>
                                                    <div className="flex items-center gap-2"><CreditCard size={14} className="text-[#B59A6D]" /> {Number(myBookings[0].totalPrice).toLocaleString()} đ</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-slate-300 italic font-medium text-sm">Chưa có hành trình nào được ghi lại.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-end border-b border-slate-100 pb-10">
                                    <h3 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Lịch sử lưu trú</h3>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">{myBookings.length} yêu cầu</span>
                                </div>

                                <div className="grid gap-6">
                                    {myBookings.map((booking) => (
                                        <div key={booking.id} className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] hover:shadow-2xl transition-luxury flex flex-col md:flex-row gap-8 items-center">
                                            <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden border border-slate-50 shrink-0">
                                                <img src={`/Hinh anh/Hinh${(booking.roomId % 20) + 1}.png`} className="w-full h-full object-cover" alt="Room" />
                                            </div>
                                            <div className="flex-1 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                                                <div className="text-center md:text-left">
                                                    <h4 className="text-lg font-bold text-slate-900">Phòng {booking.room?.roomNumber}</h4>
                                                    <p className="text-[10px] text-slate-400 font-medium italic">Ngày nhận: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-sm font-black text-[#B59A6D]">{Number(booking.totalPrice).toLocaleString()}đ</span>
                                                    {renderStatusBadge(booking.status)}
                                                    <button onClick={() => navigate(`/room/${booking.roomId}`)} className="p-3 bg-slate-50 text-slate-400 hover:bg-[#B59A6D] hover:text-white rounded-xl transition-all">
                                                        <ArrowUpRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {myBookings.length === 0 && (
                                        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                                            <p className="text-slate-400 font-serif italic text-xl">Hành trình mới đang chờ đợi bạn...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-12">
                                <div className="border-b border-slate-100 pb-10">
                                    <h3 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Thiết lập</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Quản lý nhận diện cá nhân của quý khách</p>
                                </div>

                                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-premium grid md:grid-cols-2 gap-16 relative overflow-hidden">
                                    <div className="space-y-10 relative z-10">
                                        {[
                                            { label: 'Định danh', value: user?.fullName },
                                            { label: 'Liên lạc', value: user?.phone || 'Chưa cung cấp' },
                                            { label: 'Email', value: user?.email },
                                            { label: 'Thường trú', value: user?.address || 'Chưa cung cấp' }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-1">
                                                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">{item.label}</p>
                                                <p className="text-base font-bold text-slate-800">{item.value}</p>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={handleEditProfile}
                                            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B59A6D] transition-luxury shadow-xl shadow-slate-900/10"
                                        >
                                            Chỉnh sửa hồ sơ
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-10 relative z-10 border-l border-slate-50 pl-16 hidden md:block">
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><Shield size={16} className="text-rose-500" /> Bảo mật</h5>
                                            <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white transition-all">Đổi mật khẩu</button>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><Bell size={16} className="text-blue-500" /> Thông báo</h5>
                                            <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white transition-all">Quản lý kênh</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'membership' && (
                            <div className="space-y-12">
                                <div className="border-b border-slate-100 pb-10">
                                    <h3 className="text-4xl font-serif italic text-[#B59A6D]" style={{ fontFamily: "'Playfair Display', serif" }}>Thẻ Tài khoản Elite</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    {/* FROSTED GOLD CARD */}
                                    <div className="relative group perspective-1000">
                                        <div className="w-full h-80 rounded-[3rem] bg-gradient-to-br from-[#B59A6D] via-[#D4C3A3] to-[#B59A6D] p-0.5 shadow-[0_30px_70px_rgba(181,154,109,0.3)]">
                                            <div className="w-full h-full bg-white/10 backdrop-blur-xl rounded-[2.9rem] p-10 flex flex-col justify-between overflow-hidden relative border border-white/20">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[60px] -mr-32 -mt-32"></div>
                                                <div className="flex justify-between items-start relative z-10 text-white">
                                                    <span className="text-2xl font-serif italic">Uy Nam</span>
                                                    <Sparkles size={24} className="animate-pulse" />
                                                </div>
                                                <div className="relative z-10 text-white">
                                                    <p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-60 mb-2">Member Identity</p>
                                                    <p className="text-2xl font-serif leading-none tracking-widest">{user?.fullName}</p>
                                                    <div className="flex justify-between items-end mt-12">
                                                        <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Platinum Elite</p>
                                                        <div className="text-right">
                                                            <p className="text-[8px] uppercase font-black opacity-50">Points Value</p>
                                                            <p className="text-lg font-serif">12,450 XP</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10 bg-white p-10 rounded-[4rem] border border-slate-100">
                                        <div className="space-y-4">
                                            <h4 className="text-2xl font-serif italic text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Đặc quyền hạng Elite</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed italic">Nâng tầm trải nghiệm lưu trú của bạn với những đặc quyền dành cho khách hàng thân thiết nhất.</p>
                                        </div>
                                        <div className="space-y-6">
                                            {[
                                                { icon: Sparkles, title: "Ưu tiên nâng hạng phòng" },
                                                { icon: Clock, title: "Linh hoạt trả phòng trễ" },
                                                { icon: Award, title: "Tích lũy 50% điểm thưởng" }
                                            ].map((perk, i) => (
                                                <div key={i} className="flex items-center gap-5">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#B59A6D]">
                                                        <perk.icon size={16} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{perk.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EXIT BUTTON */}
            <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
                <button 
                    onClick={handleLogout}
                    className="group inline-flex items-center gap-3 text-slate-300 hover:text-rose-500 transition-all text-[10px] font-black uppercase tracking-[0.5em]"
                >
                    <LogOut size={16} className="group-hover:-translate-x-2 transition-transform" /> Rời khỏi khu vực đặc quyền
                </button>
            </div>
        </div>
    );
};

export default Profile;