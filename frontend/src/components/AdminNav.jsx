import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bed, CalendarCheck, MessageSquare, LogOut, Users, Star, Coffee, Sparkles } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navs = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
    { name: 'Phòng', path: '/admin/rooms', icon: <Bed size={16} strokeWidth={1.5} /> },
    { name: 'Dịch vụ', path: '/admin/services', icon: <Coffee size={16} strokeWidth={1.5} /> },
    { name: 'Đơn hàng', path: '/admin/bookings', icon: <CalendarCheck size={16} strokeWidth={1.5} /> },
    { name: 'Đánh giá', path: '/admin/reviews', icon: <Star size={16} strokeWidth={1.5} /> },
    { name: 'Hộp thư', path: '/admin/contacts', icon: <MessageSquare size={16} strokeWidth={1.5} /> },
    { name: 'Hội viên', path: '/admin/users', icon: <Users size={16} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex justify-center mb-12 relative z-50">
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0a]/80 backdrop-blur-3xl p-2 rounded-full border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Glow indicator phía sau */}
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full -z-10 animate-pulse"></div>

        {navs.map(nav => {
          const isActive = location.pathname.startsWith(nav.path);
          return (
            <Link
              key={nav.path}
              to={nav.path}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden ${
                isActive
                  ? 'text-black'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Nền Vàng Kim khi Active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-200 rounded-full z-0 shadow-[0_0_20px_rgba(217,119,6,0.4)] animate-in fade-in duration-500">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite] pointer-events-none"></div>
                </div>
              )}
              
              <div className="relative z-10 flex items-center gap-2">
                <span className={`${isActive ? 'text-black' : 'group-hover:text-amber-500 transition-colors'}`}>
                  {nav.icon}
                </span>
                <span className="hidden lg:block">{nav.name}</span>
                {isActive && <Sparkles size={10} className="animate-pulse hidden md:block" />}
              </div>
            </Link>
          );
        })}

        <div className="w-[1px] h-5 bg-white/5 mx-2 hidden md:block"></div>

        {/* NÚT ĐĂNG XUẤT SLIM */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] text-rose-500/80 hover:bg-rose-500 hover:text-white transition-all duration-500 group"
        >
          <LogOut size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block">Rời khỏi</span>
        </button>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminNav;