import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import { Menu, User, Bell, Search, LogOut, Home, Settings, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

const AdminLayout = ({ children, title = "Dashboard", subtitle = "Luxury Hotel Management" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosClient.get('/bookings');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const targetBookings = res.data.filter(b => {
            if (b.status === 'pending') return true;
            if (b.status === 'confirmed' && b.checkInDate) {
                const checkInDate = new Date(b.checkInDate);
                checkInDate.setHours(0, 0, 0, 0);
                if (checkInDate.getTime() <= today.getTime()) return true;
            }
            return false;
        });
        targetBookings.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setNotifications(targetBookings.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();

    // Kết nối Socket.io
    const socket = io('http://localhost:5000');
    
    socket.on('newBooking', (newBooking) => {
        setNotifications(prev => {
            const updated = [newBooking, ...prev];
            return updated.slice(0, 5); // Giữ tối đa 5 thông báo
        });
        
        // Hiện toast
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'info',
            title: `Đơn mới từ ${newBooking.customerName || 'Khách'}!`,
            text: `Phòng ${newBooking.roomNumber}`,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
        });
    });

    return () => socket.disconnect();
  }, []);

  // Effect cho tính năng Tìm kiếm Global (Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== '') {
        setIsSearching(true);
        try {
          const res = await axiosClient.get(`/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setShowSearchDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowSearchDropdown(false);
      }
    }, 500); // Đợi 500ms sau khi ngừng gõ mới gọi API

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to format relative time
  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return "Vài giây trước";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">

      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] transition-transform duration-500 ease-luxury
        lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminNav isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-amber-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-xl lg:text-2xl font-serif text-slate-800">
                {title}
              </h1>
              <p className="text-[11px] text-slate-500  tracking-widest font-medium hidden sm:block mt-0.5 font-sans">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6 relative">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 gap-3 focus-within:border-amber-500/50 focus-within:bg-white transition-all shadow-sm relative">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mọi thứ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchQuery.trim() !== '') setShowSearchDropdown(true); }}
                className="bg-transparent border-none outline-none text-xs w-56 placeholder:text-slate-400 font-sans font-medium text-slate-900"
              />
              {isSearching && <Loader2 size={14} className="animate-spin text-amber-500 absolute right-4" />}
              
              {/* Dropdown Kết quả tìm kiếm */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-luxury overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {/* Kết quả Bookings */}
                    {searchResults?.bookings?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-black  tracking-widest text-slate-400 px-3 py-1">Đơn đặt phòng</p>
                        {searchResults.bookings.map(b => (
                          <div key={`b-${b.id}`} onClick={() => { setShowSearchDropdown(false); navigate('/admin/bookings'); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                            <p className="text-xs font-bold text-slate-800">Mã đơn #{b.id}</p>
                            <p className="text-[10px] text-slate-500">Khách: {b.user?.fullName} • Phòng: {b.room?.roomNumber}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Kết quả Users */}
                    {searchResults?.users?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-black  tracking-widest text-slate-400 px-3 py-1">Khách hàng</p>
                        {searchResults.users.map(u => (
                          <div key={`u-${u.id}`} onClick={() => { setShowSearchDropdown(false); navigate('/admin/users'); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                            <p className="text-xs font-bold text-slate-800">{u.fullName}</p>
                            <p className="text-[10px] text-slate-500">{u.email}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Kết quả Rooms */}
                    {searchResults?.rooms?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-black  tracking-widest text-slate-400 px-3 py-1">Phòng</p>
                        {searchResults.rooms.map(r => (
                          <div key={`r-${r.id}`} onClick={() => { setShowSearchDropdown(false); navigate('/admin/rooms'); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                            <p className="text-xs font-bold text-slate-800">Phòng {r.roomNumber}</p>
                            <p className="text-[10px] text-amber-500">{r.status}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!searchResults?.bookings?.length && !searchResults?.users?.length && !searchResults?.rooms?.length && !isSearching) && (
                      <div className="p-4 text-center text-slate-400 text-xs italic">
                        Không tìm thấy kết quả nào.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Notification */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
                  className="p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-amber-500 hover:border-amber-500/30 transition-all relative shadow-sm"
                >
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                {/* Dropdown Notif */}
                {showNotifMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-luxury overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black  tracking-widest text-slate-500">Thông báo mới</span>
                      <span className="text-[10px] text-amber-600 cursor-pointer" onClick={() => setNotifications([])}>Đánh dấu đã đọc</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                              setShowNotifMenu(false);
                              Swal.fire({
                                title: `Đơn Đặt Phòng #${notif.id}`,
                                html: `
                                  <div class="text-left space-y-4 mt-4 font-sans">
                                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <p class="text-[10px]  font-black tracking-widest text-slate-400 mb-1">Khách Hàng</p>
                                      <p class="font-bold text-slate-900 text-lg">${notif.customerName || notif.user?.fullName || 'Khách'}</p>
                                    </div>
                                    <div class="flex gap-4">
                                      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                                        <p class="text-[10px]  font-black tracking-widest text-slate-400 mb-1">Số Phòng</p>
                                        <p class="font-bold text-slate-900 text-lg">${notif.roomNumber || notif.room?.roomNumber || 'N/A'}</p>
                                      </div>
                                      <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex-1">
                                        <p class="text-[10px]  font-black tracking-widest text-emerald-600 mb-1">Đã Cọc (50%)</p>
                                        <p class="font-bold text-emerald-700 text-lg">${Number(notif.prepaidAmount || (notif.totalPrice ? notif.totalPrice/2 : 0)).toLocaleString()} đ</p>
                                      </div>
                                    </div>
                                  </div>
                                `,
                                showCancelButton: true,
                                confirmButtonText: notif.status === 'confirmed' ? 'Xử lý nhận phòng' : 'Quản Lý Đơn Ngay',
                                cancelButtonText: 'Đóng',
                                confirmButtonColor: '#d97706',
                                borderRadius: '2rem'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate(`/admin/bookings?bookingId=${notif.id}`);
                                }
                              });
                          }}
                          className={`p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors ${notif.status === 'confirmed' ? 'bg-amber-50/30 border-amber-100' : 'border-slate-50'}`}
                        >
                          <p className={`text-sm font-bold ${notif.status === 'confirmed' ? 'text-amber-700' : 'text-slate-800'}`}>
                             {notif.status === 'confirmed' ? `🛎️ Khách tới nhận phòng #${notif.id}` : `✨ Đơn đặt phòng mới #${notif.id}`}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                             {notif.status === 'confirmed' 
                               ? <span>Khách <span className="font-bold text-slate-700">{notif.customerName || notif.user?.fullName || 'ẩn danh'}</span> có lịch nhận phòng {notif.roomNumber || notif.room?.roomNumber} hôm nay.</span>
                               : <span>Khách <span className="font-bold text-slate-700">{notif.customerName || notif.user?.fullName || 'ẩn danh'}</span> vừa chốt phòng {notif.roomNumber || notif.room?.roomNumber}.</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2">{notif.createdAt ? timeSince(notif.createdAt) : 'Vừa xong'}</p>
                        </div>
                      )) : (
                        <div className="p-6 text-center text-slate-400 text-xs italic">
                          Không có thông báo mới nào.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="relative">
                <div
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-[2px] shadow-md shadow-amber-500/20 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-amber-500 overflow-hidden">
                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <User size={18} />}
                  </div>
                </div>

                {/* Dropdown User */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-luxury overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || 'Quản trị viên'}</p>
                      <p className="text-[10px] font-black  tracking-widest text-amber-500 mt-1">{user?.role || 'Admin'}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
                        <Home size={16} /> Trang chủ Client
                      </Link>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
                        <Settings size={16} /> Cài đặt hệ thống
                      </button>
                      <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-bold">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden admin-scrollbar p-6 lg:p-10 relative z-10" onClick={() => { setShowUserMenu(false); setShowNotifMenu(false); }}>
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
