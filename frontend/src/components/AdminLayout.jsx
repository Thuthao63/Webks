import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import { Menu, User, Bell, Search, LogOut, Home, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';

const AdminLayout = ({ children, title = "Dashboard", subtitle = "Luxury Hotel Management" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get('/bookings');
            const pendingBookings = res.data.filter(b => b.status === 'pending');
            pendingBookings.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
            setNotifications(pendingBookings.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };
    fetchNotifications();
    
    // Optional: poll every 1 minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        Swal.fire({
            title: 'Đang tìm kiếm...',
            text: `Đang truy vấn "${e.target.value}" trên toàn hệ thống. Tính năng này đang được nâng cấp!`,
            icon: 'info',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#d97706'
        });
        e.target.value = '';
    }
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
              <h1 className="text-xl lg:text-2xl font-serif italic text-slate-900">
                {title}
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold hidden sm:block mt-1 font-sans">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6 relative">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 gap-3 focus-within:border-amber-500/50 focus-within:bg-white transition-all shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh (Enter)..." 
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none text-xs w-56 placeholder:text-slate-400 font-sans font-medium text-slate-900"
              />
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thông báo mới</span>
                            <span className="text-[10px] text-amber-600 cursor-pointer" onClick={() => setNotifications([])}>Đánh dấu đã đọc</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(notif => (
                                <div 
                                    key={notif.id}
                                    onClick={() => { setShowNotifMenu(false); navigate('/admin/bookings'); }}
                                    className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <p className="text-sm font-bold text-slate-800">Đơn đặt phòng mới #{notif.id}</p>
                                    <p className="text-xs text-slate-500 mt-1">Khách hàng {notif.user?.fullName || notif.customer?.fullName || 'ẩn danh'} vừa đặt phòng {notif.room?.roomNumber}.</p>
                                    <p className="text-[10px] text-slate-400 mt-2">{timeSince(notif.createdAt)}</p>
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
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mt-1">{user?.role || 'Admin'}</p>
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
