import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bed, CalendarCheck, MessageSquare,
  LogOut, Users, Star, Coffee, Sparkles, X, ChevronRight,
  Settings, ShieldCheck, FileText
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import Swal from 'sweetalert2';

const AdminNav = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navs = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Phòng', path: '/admin/rooms', icon: <Bed size={18} /> },
    { name: 'Dịch vụ', path: '/admin/services', icon: <Coffee size={18} /> },
    { name: 'Đơn hàng', path: '/admin/bookings', icon: <CalendarCheck size={18} /> },
    { name: 'Đánh giá', path: '/admin/reviews', icon: <Star size={18} /> },
    { name: 'Bài viết', path: '/admin/blogs', icon: <FileText size={18} /> },
    { name: 'Giảm giá', path: '/admin/discounts', icon: <Sparkles size={18} /> },
    { name: 'Hộp thư', path: '/admin/contacts', icon: <MessageSquare size={18} /> },
    { name: 'Khách hàng', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Hóa đơn', path: '/admin/guest-stats', icon: <FileText size={18} /> },
  ];

  return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col relative z-50">

      {/* Header / Logo */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 bg-white">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-lg">U</span>
          </div>
          <span className="text-lg font-medium font-sans text-slate-900 tracking-widest">UY NAM</span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 admin-scrollbar bg-white">
        <p className="text-[10px] text-slate-400  font-black tracking-widest px-4 mb-4 font-sans">Danh mục</p>

        {navs.map(nav => {
          const isActive = location.pathname.startsWith(nav.path);
          return (
            <Link
              key={nav.path}
              to={nav.path}
              className={`
                flex items-center justify-between px-4 py-3.5 rounded-xl transition-luxury group relative overflow-hidden font-sans
                ${isActive
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full shadow-[4px_0_15px_rgba(245,158,11,0.5)]" />
              )}

              <div className="flex items-center gap-4 relative z-10 font-bold text-xs tracking-wide">
                <span className={`${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-500 transition-colors'}`}>
                  {nav.icon}
                </span>
                <span>{nav.name}</span>
              </div>

              {isActive ? (
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                </div>
              ) : (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-300" />
              )}
            </Link>
          );
        })}

        <div className="pt-8 mt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-black tracking-widest px-4 mb-4 font-sans">Hệ thống</p>
          <button 
             onClick={() => Swal.fire({ title: 'Đang phát triển', text: 'Tính năng Cài đặt chung đang được hoàn thiện và sẽ ra mắt trong bản cập nhật tới!', icon: 'info' })}
             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-luxury font-bold text-xs tracking-wide font-sans group"
          >
            <Settings size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
            <span>Cài đặt chung</span>
          </button>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 mb-4 group shadow-sm cursor-default">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 relative overflow-hidden font-black">
             {(user?.fullName || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate font-sans">{user?.fullName || 'Admin User'}</p>
            <div className="flex items-center gap-1 mt-0.5">
               <ShieldCheck size={10} className="text-emerald-500" />
               <p className="text-[9px] text-slate-400  font-black tracking-widest">Quyền Quản Trị</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-rose-600 transition-luxury text-[11px] font-black  tracking-widest shadow-lg shadow-slate-900/10 font-sans"
        >
          <LogOut size={14} />
          Đăng xuất
        </button>
      </div>

    </div>
  );
};

export default AdminNav;
