import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import {
    User, Calendar, CreditCard, Clock, CheckCircle, XCircle, Edit2, LogOut, Shield,
    Award, Bell, Settings, Heart, History, LayoutDashboard, ArrowUpRight, Sparkles, MapPin, Camera, ChevronRight, Package, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, updateUserContext, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [printingBooking, setPrintingBooking] = useState(null);
    const { t } = useTranslation();

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
            title: t('profile.swal.update_identity'),
            html: `
                <div class="flex flex-col gap-5 text-left mt-6 pb-2">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.full_name_label')}</label>
                        <input id="swal-edit-name" type="text" value="${user?.fullName || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.contact_num_label')}</label>
                        <input id="swal-edit-phone" type="text" value="${user?.phone || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.address_label')}</label>
                        <input id="swal-edit-address" type="text" value="${user?.address || ''}" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                    </div>
                </div>
            `,
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: t('profile.swal.save_changes'),
            cancelButtonText: t('profile.swal.go_back'),
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8',
                title: 'font-serif italic text-slate-900 text-3xl',
                confirmButton: 'bg-slate-900 text-white hover:bg-amber-600 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-md font-sans',
                cancelButton: 'bg-white text-slate-500 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-colors font-sans'
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
                Swal.fire({ title: t('profile.swal.processing'), didOpen: () => Swal.showLoading() });
                const res = await axiosClient.put(`/auth/${user.id}`, formValues);
                updateUserContext(res.data.user);
                Swal.fire({ icon: 'success', title: t('profile.swal.complete'), text: t('profile.swal.info_synced'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100', title: 'font-serif text-2xl italic', confirmButton: 'bg-slate-900 text-white rounded-xl px-8 py-3 font-sans' } });
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: 'error', title: t('profile.swal.failed'), text: t('profile.swal.update_failed'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100' } });
            }
        }
    };

    const handleChangePassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: t('profile.swal.change_password'),
            html: `
                <div class="flex flex-col gap-5 text-left mt-6 pb-2">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.old_password')}</label>
                        <input id="swal-old-password" type="password" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.new_password')}</label>
                        <input id="swal-new-password" type="password" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                    </div>
                </div>
            `,
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: t('profile.swal.confirm_change'),
            cancelButtonText: t('profile.swal.go_back'),
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8',
                title: 'font-serif italic text-slate-900 text-3xl',
                confirmButton: 'bg-slate-900 text-white hover:bg-amber-600 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-md font-sans',
                cancelButton: 'bg-white text-slate-500 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-colors font-sans'
            },
            preConfirm: () => {
                const oldPassword = document.getElementById('swal-old-password').value;
                const newPassword = document.getElementById('swal-new-password').value;
                if (!oldPassword || !newPassword) {
                    Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin');
                    return false;
                }
                return { oldPassword, newPassword };
            }
        });

        if (formValues) {
            try {
                Swal.fire({ title: t('profile.swal.processing'), didOpen: () => Swal.showLoading() });
                await axiosClient.put(`/auth/${user.id}/password`, formValues);
                Swal.fire({ icon: 'success', title: t('profile.swal.success'), text: t('profile.swal.password_changed'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100', title: 'font-serif text-2xl italic', confirmButton: 'bg-slate-900 text-white rounded-xl px-8 py-3 font-sans' } });
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: 'error', title: t('profile.swal.failed'), text: err.response?.data?.message || t('profile.swal.update_failed'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100' } });
            }
        }
    };

    const handleNotificationSettings = async () => {
        const { value: formValues } = await Swal.fire({
            title: t('profile.swal.notif_options'),
            html: `
                <div class="flex flex-col gap-4 text-left mt-6 pb-2">
                    <label class="flex items-center gap-3 p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" id="email-notif" class="w-5 h-5 accent-amber-500" checked>
                        <div>
                            <p class="text-sm font-bold text-slate-900 font-sans">${t('profile.swal.receive_promo_email')}</p>
                            <p class="text-[10px] text-slate-500 mt-0.5">${t('profile.swal.promo_email_desc')}</p>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" id="sms-notif" class="w-5 h-5 accent-amber-500" checked>
                        <div>
                            <p class="text-sm font-bold text-slate-900 font-sans">${t('profile.swal.sms_notif')}</p>
                            <p class="text-[10px] text-slate-500 mt-0.5">${t('profile.swal.sms_notif_desc')}</p>
                        </div>
                    </label>
                </div>
            `,
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: t('profile.swal.save_changes'),
            cancelButtonText: t('profile.swal.go_back'),
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8',
                title: 'font-serif italic text-slate-900 text-3xl',
                confirmButton: 'bg-slate-900 text-white hover:bg-amber-600 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-md font-sans',
                cancelButton: 'bg-white text-slate-500 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-colors font-sans'
            },
            preConfirm: () => {
                return {
                    email: document.getElementById('email-notif').checked,
                    sms: document.getElementById('sms-notif').checked
                };
            }
        });

        if (formValues) {
            Swal.fire({ icon: 'success', title: t('profile.swal.success'), text: t('profile.swal.saved'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100', title: 'font-serif text-2xl italic', confirmButton: 'bg-slate-900 text-white rounded-xl px-8 py-3 font-sans' } });
        }
    };

    const handleLanguageSettings = async () => {
        const { value: formValues } = await Swal.fire({
            title: t('profile.swal.lang_currency'),
            html: `
                <div class="flex flex-col gap-5 text-left mt-6 pb-2">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.display_lang')}</label>
                        <select id="lang-select" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English (US)</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block font-sans">${t('profile.swal.currency_unit')}</label>
                        <select id="currency-select" class="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm font-sans">
                            <option value="vnd">VND - Việt Nam Đồng</option>
                            <option value="usd">USD - US Dollar</option>
                        </select>
                    </div>
                </div>
            `,
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: t('profile.swal.update'),
            cancelButtonText: t('profile.swal.go_back'),
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8',
                title: 'font-serif italic text-slate-900 text-3xl',
                confirmButton: 'bg-slate-900 text-white hover:bg-amber-600 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-md font-sans',
                cancelButton: 'bg-white text-slate-500 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-colors font-sans'
            }
        });

        if (formValues) {
            Swal.fire({ icon: 'success', title: t('profile.swal.saved'), text: t('profile.swal.settings_applied'), confirmButtonColor: '#0f172a', customClass: { popup: 'rounded-[2rem] border border-slate-100', title: 'font-serif text-2xl italic', confirmButton: 'bg-slate-900 text-white rounded-xl px-8 py-3 font-sans' } });
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: t('profile.swal.end_journey'),
            text: t('profile.swal.thank_you'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0f172a',
            cancelButtonColor: '#f8fafc',
            confirmButtonText: t('profile.swal.confirm_leave'),
            cancelButtonText: t('profile.swal.stay_with_us'),
            customClass: {
                popup: 'rounded-[2rem] border border-slate-100 shadow-xl',
                title: 'font-serif italic text-2xl text-slate-900',
                confirmButton: 'rounded-xl px-8 py-3 font-sans text-[11px] uppercase tracking-widest font-bold shadow-md bg-slate-900 text-white hover:bg-rose-600 transition-colors',
                cancelButton: 'rounded-xl px-8 py-3 font-sans text-[11px] uppercase tracking-widest font-bold bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 shadow-sm'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/');
            }
        });
    };

    const renderStatusBadge = (booking) => {
        const status = booking.status;
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);
        const now = new Date();
        now.setHours(0,0,0,0);
        checkInDate.setHours(0,0,0,0);
        checkOutDate.setHours(0,0,0,0);

        let displayText = '';
        let displayColor = '';
        let Icon = CheckCircle;

        if (status === 'pending') {
            displayText = t('profile.status_pending');
            displayColor = 'text-amber-600 bg-amber-50 border-amber-100';
            Icon = Clock;
        } else if (status === 'cancelled') {
            displayText = t('profile.status_cancelled');
            displayColor = 'text-rose-600 bg-rose-50 border-rose-100';
            Icon = XCircle;
        } else if (status === 'completed') {
            displayText = t('profile.status_completed');
            displayColor = 'text-slate-600 bg-slate-50 border-slate-200';
            Icon = Award;
        } else if (status === 'confirmed') {
            if (now < checkInDate) {
                displayText = t('profile.status_booked_upcoming', 'Đã đặt (Sắp tới)');
                displayColor = 'text-blue-600 bg-blue-50 border-blue-100';
            } else if (now >= checkInDate && now <= checkOutDate) {
                displayText = t('profile.status_staying', 'Đang lưu trú');
                displayColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
            } else {
                displayText = t('profile.status_waiting_complete', 'Chờ hoàn tất');
                displayColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
            }
        } else {
            displayText = t('profile.status_pending');
            displayColor = 'text-amber-600 bg-amber-50 border-amber-100';
            Icon = Clock;
        }

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest font-sans ${displayColor}`}>
                <Icon size={12} /> {displayText}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans pb-16">
            
            {/* PANORAMIC HERO HEADER */}
            <div className="relative h-[30vh] w-full overflow-hidden bg-white">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2500')" }}
                ></div>
                {/* Soft Gradient Overlay for text readability at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-[#FDFCFB]"></div>
                
                {/* Top Right Quick Actions (Log out / Edit) on Header */}
                <div className="absolute top-8 right-8 flex gap-4 z-20">
                    <button onClick={handleEditProfile} className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 transition-all shadow-sm">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                        <LogOut size={16} className="-ml-0.5" />
                    </button>
                </div>
            </div>

            {/* PROFILE INFO - CENTERED OVERLAPPING THE HERO */}
            <div className="max-w-5xl mx-auto px-6 relative z-20 -mt-16 text-center flex flex-col items-center">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-xl overflow-hidden relative">
                        <div className="w-full h-full rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                            <User size={32} strokeWidth={1} />
                        </div>
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors border-2 border-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                        <Camera size={14} />
                    </button>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-serif italic text-slate-900 mt-4 mb-1 drop-shadow-sm">
                    {user?.fullName}
                </h1>
                
                <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-sans">Member Since 2024</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-widest text-[10px]">
                        <Sparkles size={12} /> Platinum Elite
                    </span>
                </div>
            </div>

            {/* HORIZONTAL NAVIGATION BAR */}
            <div className="max-w-3xl mx-auto px-6 mt-8 border-b border-slate-200 relative z-30">
                <div className="flex justify-between md:justify-center md:gap-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'dashboard', label: t('profile.overview'), icon: LayoutDashboard },
                        { id: 'bookings', label: t('profile.trips'), icon: History },
                        { id: 'settings', label: t('profile.settings'), icon: Settings },
                        { id: 'membership', label: t('profile.privileges'), icon: Award },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-3 border-b-2 transition-all duration-300 whitespace-nowrap px-2 ${
                                    isActive 
                                    ? 'border-slate-900 text-slate-900' 
                                    : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={`text-[11px] font-bold uppercase tracking-widest font-sans ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MAIN CONTENT AREA - WIDE LAYOUT */}
            <div className="max-w-5xl mx-auto px-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* ----------------- DASHBOARD TAB ----------------- */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-12">
                        {/* WIDE STATS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: t('profile.beloved'), value: myBookings.length, icon: Heart },
                                { label: t('profile.planned'), value: myBookings.filter(b => b.status === 'confirmed').length, icon: Calendar },
                                { label: t('profile.points'), value: '12,450', icon: Award }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500`}>
                                        <stat.icon size={18} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest font-sans mb-1">{stat.label}</p>
                                        <p className="text-2xl font-serif italic text-slate-900 leading-none">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WIDE LATEST ACTIVITY CARD */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                                <h3 className="text-xl font-serif italic text-slate-900">{t('profile.latest_trip')}</h3>
                                <button onClick={() => setActiveTab('bookings')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                                    {t('profile.view_history')} <ArrowUpRight size={14} />
                                </button>
                            </div>

                            {myBookings.length > 0 ? (
                                <div className="flex flex-col lg:flex-row gap-12 items-center">
                                    <div className="w-full lg:w-[400px] h-[250px] rounded-[2rem] overflow-hidden shadow-lg relative group shrink-0">
                                        <img
                                            src={`/Hinh anh/Hinh${(myBookings[0].roomId % 20) + 1}.png`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            alt="Recent"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <p className="text-2xl font-serif italic drop-shadow-md">Uy Nam Retreat</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div>
                                                <h4 className="text-2xl font-bold text-slate-900 mb-2 font-sans">Luxury Suite #{myBookings[0].room?.roomNumber}</h4>
                                                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold font-sans flex items-center gap-2">
                                                    <MapPin size={12} className="text-amber-500" /> {t('profile.danang_vietnam', 'Đà Nẵng, Việt Nam')}
                                                </p>
                                            </div>
                                            {renderStatusBadge(myBookings[0])}
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium font-sans max-w-lg">
                                            {t('profile.trip_desc', 'Một trải nghiệm nghỉ dưỡng hoàn hảo được thiết kế riêng. Không gian riêng tư tuyệt đối hòa quyện cùng thiên nhiên.')}
                                        </p>
                                        <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-50">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{t('profile.check_in_label')}</p>
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Calendar size={16} className="text-amber-500" /> {new Date(myBookings[0].checkInDate).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{t('profile.total_cost')}</p>
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><CreditCard size={16} className="text-amber-500" /> {Number(myBookings[0].totalPrice).toLocaleString()} đ</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                    <Package size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1} />
                                    <p className="text-slate-500 font-serif italic text-xl">{t('profile.no_trips')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ----------------- BOOKINGS TAB ----------------- */}
                {activeTab === 'bookings' && (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-serif italic text-slate-900">{t('profile.stay_history')}</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium">{t('profile.discover_moments')}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full font-sans shadow-sm">{myBookings.length} {t('profile.trips')}</span>
                        </div>

                        <div className="grid gap-4">
                            {myBookings.map((booking) => (
                                <div key={booking.id} className="group bg-white border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(`/room/${booking.roomId}`)}>
                                    <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden relative shrink-0">
                                        <img src={`/Hinh anh/Hinh${(booking.roomId % 20) + 1}.png`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room" />
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                                        <div className="text-center md:text-left space-y-2">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-sans flex items-center justify-center md:justify-start gap-1"><MapPin size={10} /> {t('profile.danang', 'ĐÀ NẴNG')}</p>
                                            <h4 className="text-xl font-bold text-slate-900 font-sans group-hover:text-amber-600 transition-colors">{t('profile.room_prefix', 'Phòng ')}{booking.room?.roomNumber}</h4>
                                            <p className="text-xs text-slate-500 font-medium font-sans">{t('profile.check_in_label')}: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-3">
                                            <span className="text-base font-bold text-slate-900">{Number(booking.totalPrice).toLocaleString()}đ</span>
                                            {renderStatusBadge(booking)}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setPrintingBooking(booking); setTimeout(() => window.print(), 500); }}
                                                className="px-4 py-2 mt-1 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
                                            >
                                                <Printer size={12} />
                                                {t('profile.print_invoice', 'In Phiếu Xác Nhận')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {myBookings.length === 0 && (
                                <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                                    <Package size={48} className="mx-auto text-slate-300 mb-6" strokeWidth={1} />
                                    <p className="text-slate-500 font-serif italic text-2xl">{t('profile.new_journeys')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ----------------- SETTINGS TAB ----------------- */}
                {activeTab === 'settings' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                        <div className="border-b border-slate-100 pb-6 mb-6 text-center">
                            <h3 className="text-2xl font-serif italic text-slate-900">{t('profile.account_settings')}</h3>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 font-sans">{t('profile.manage_identity')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">{t('profile.basic_info')}</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: t('profile.full_name'), value: user?.fullName },
                                        { label: t('profile.contact_num'), value: user?.phone || t('profile.not_provided') },
                                        { label: t('profile.email'), value: user?.email },
                                        { label: t('profile.address'), value: user?.address || t('profile.not_provided') }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-sans mb-1.5">{item.label}</p>
                                            <p className="text-sm font-bold text-slate-900 font-sans">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleEditProfile}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm font-sans mt-4"
                                >
                                    {t('profile.edit_info')}
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">{t('profile.advanced_options')}</h4>
                                <div className="space-y-4">
                                    <div onClick={handleChangePassword} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm"><Shield size={16} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 font-sans">{t('profile.password_security')}</p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t('profile.update_password_desc')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                    
                                    <div onClick={handleNotificationSettings} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm"><Bell size={16} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 font-sans">{t('profile.notification_options')}</p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t('profile.email_sms_settings')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                                    </div>

                                    <div onClick={handleLanguageSettings} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 font-sans">{t('profile.language_currency')}</p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t('profile.vietnamese_vnd')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ----------------- MEMBERSHIP TAB ----------------- */}
                {activeTab === 'membership' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* THE ELITE CARD - CENTERED MASSIVE */}
                        <div className="relative group perspective-1000 max-w-xl mx-auto">
                            <div className="w-full h-64 md:h-72 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e293b] p-0.5 shadow-lg transform transition-transform duration-700 hover:rotate-x-2">
                                <div className="w-full h-full rounded-[1.9rem] p-8 flex flex-col justify-between overflow-hidden relative">
                                    {/* Gold Accents */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/10 blur-[60px] rounded-full pointer-events-none"></div>
                                    
                                    <div className="flex justify-between items-start relative z-10 text-amber-500">
                                        <span className="text-3xl font-serif italic">Uy Nam</span>
                                        <Sparkles size={24} className="animate-pulse" />
                                    </div>
                                    <div className="relative z-10 text-white">
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1 font-sans">{t('profile.member_identity')}</p>
                                        <p className="text-2xl font-serif leading-none tracking-widest drop-shadow-md text-amber-50">{user?.fullName}</p>
                                        
                                        <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent my-6"></div>
                                        
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500 font-sans mb-1">Platinum Elite</p>
                                                <p className="text-[9px] text-slate-400 font-medium">{t('profile.valid_thru')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-bold opacity-60 font-sans mb-1 text-slate-400">{t('profile.total_points')}</p>
                                                <p className="text-xl font-serif text-white">12,450</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PERKS LIST */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { icon: Sparkles, title: t('profile.priority_upgrade'), desc: t('profile.priority_upgrade_desc') },
                                { icon: Clock, title: t('profile.flexible_time'), desc: t('profile.flexible_time_desc') },
                                { icon: Award, title: t('profile.double_points'), desc: t('profile.double_points_desc') }
                            ].map((perk, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-all">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-sm">
                                        <perk.icon size={18} />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900 mb-2 font-sans">{perk.title}</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{perk.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 🖨️ INVOICE TEMPLATE (Chỉ hiển thị khi in) */}
            {printingBooking && (
                <div className="hidden print:block fixed inset-0 bg-white text-black z-[9999] p-12 font-sans overflow-visible">
                    <div className="max-w-4xl mx-auto border border-gray-200 p-12 rounded-xl">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                            <div>
                                <h1 className="text-4xl font-serif italic text-slate-900 mb-2">Uy Nam <span className="text-amber-600">Luxury</span></h1>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> 123 Đường Ngọc Trai, Vinpearl, Việt Nam</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-black uppercase tracking-widest text-slate-200">PHIẾU XÁC NHẬN</h2>
                                <p className="text-sm text-slate-600 font-bold mt-2">Mã Đơn: #{String(printingBooking.id).toUpperCase()}</p>
                                <p className="text-xs text-slate-500 mt-1">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        {/* Customer & Booking Info */}
                        <div className="flex justify-between mb-12">
                            <div className="bg-slate-50 p-6 rounded-2xl w-[45%]">
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Thông tin khách hàng</p>
                                <p className="font-bold text-slate-900 text-lg">{user?.fullName || 'Khách hàng'}</p>
                                <p className="text-sm text-slate-600 mt-1">{user?.email}</p>
                                <p className="text-sm text-slate-600">{user?.phone}</p>
                            </div>
                            <div className="bg-amber-50/50 p-6 rounded-2xl w-[45%] text-right">
                                <p className="text-[10px] uppercase font-black tracking-widest text-amber-500 mb-2">Chi tiết đặt phòng</p>
                                <p className="font-bold text-slate-900 text-lg">Phòng {printingBooking.room?.roomNumber || '---'}</p>
                                <p className="text-sm text-slate-600 mt-1">Check-in: {new Date(printingBooking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                <p className="text-sm text-slate-600">Check-out: {new Date(printingBooking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-left mb-12">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-900">Diễn giải dịch vụ</th>
                                    <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-900 text-right w-1/4">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="py-6">
                                        <p className="text-sm font-bold text-slate-900">Phòng lưu trú hạng Sang (Room {printingBooking.room?.roomNumber})</p>
                                        <p className="text-xs text-slate-500 mt-1">Trạng thái: {printingBooking.status === 'confirmed' ? 'Đã xác nhận' : printingBooking.status === 'pending' ? 'Đang chờ duyệt' : printingBooking.status === 'completed' ? 'Đã hoàn tất' : 'Đã hủy'}</p>
                                    </td>
                                    <td className="py-6 text-right text-sm font-black">{Number(printingBooking.totalPrice).toLocaleString('vi-VN')} đ</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Total & Signature */}
                        <div className="flex justify-between items-end mt-10">
                            <div className="w-1/2">
                                <p className="text-[10px] font-bold text-slate-400">Vui lòng xuất trình phiếu này khi làm thủ tục nhận phòng.</p>
                                <p className="text-[10px] font-bold text-slate-400">Uy Nam Luxury hân hạnh được phục vụ quý khách!</p>
                            </div>
                            <div className="w-1/3">
                                <div className="flex justify-between py-4 text-amber-600">
                                    <span className="font-black uppercase tracking-widest text-lg">Tổng giá trị</span>
                                    <span className="font-black text-2xl">{Number(printingBooking.totalPrice).toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
