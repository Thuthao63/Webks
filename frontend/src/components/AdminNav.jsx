import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bed, CalendarCheck, MessageSquare,
  LogOut, Users, Star, Coffee, Sparkles, X, ChevronRight,
  Settings, ShieldCheck
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

const AdminNav = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navs = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Phòng', path: '/admin/rooms', icon: <Bed size={20} /> },
    { name: 'Dịch vụ', path: '/admin/services', icon: <Coffee size={20} /> },
    { name: 'Đơn hàng', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Đánh giá', path: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Giảm giá', path: '/admin/discounts', icon: <Sparkles size={20} /> },
    { name: 'Hộp thư', path: '/admin/contacts', icon: <MessageSquare size={20} /> },
    { name: 'Tài khoản', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col relative">

      {/* Header / Logo */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
            <span className="text-black font-black text-lg">U</span>
          </div>
          <span className="text-xl font-serif italic text-white tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>UY NAM</span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 admin-scrollbar">
        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] px-4 mb-4">Main Menu</p>

        {navs.map(nav => {
          const isActive = location.pathname.startsWith(nav.path);
          return (
            <Link
              key={nav.path}
              to={nav.path}
              className={`
                flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                ${isActive
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}
              `}
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full shadow-[4px_0_15px_rgba(245,158,11,0.5)]" />
              )}

              <div className="flex items-center gap-4 relative z-10 font-bold text-[13px]">
                <span className={`${isActive ? 'text-amber-500' : 'text-gray-600 group-hover:text-amber-500/70 transition-colors'}`}>
                  {nav.icon}
                </span>
                <span>{nav.name}</span>
              </div>

              {isActive ? (
                <Sparkles size={14} className="animate-pulse opacity-60" />
              ) : (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
              )}
            </Link>
          );
        })}

        <div className="pt-8 mt-8 border-t border-white/5">
          <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] px-4 mb-4">System</p>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-gray-200 transition-all font-bold text-[13px]">
            <Settings size={20} />
            <span>Cài đặt</span>
          </button>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-4 group hover:border-amber-500/20 transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-white truncate uppercase tracking-wider">{user?.fullName || 'Administrator'}</p>
            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">{user?.role || 'Admin'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-rose-500 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>

      <style>{`
        .admin-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};

export default AdminNav;