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
    <div className="flex justify-center mb-16 relative z-50">
      <div className="flex flex-wrap items-center gap-2 bg-[#0a0a0af2] backdrop-blur-[40px] p-2.5 rounded-full border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        
        {/* Glow indicator phía sau */}
        <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full -z-10 animate-pulse transition-opacity duration-1000"></div>

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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-200 rounded-full z-0 shadow-[0_10px_30px_rgba(217,119,6,0.3)] animate-in fade-in zoom-in-90 duration-500">
                   <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2.5s_infinite] pointer-events-none opacity-50"></div>
                </div>
              )}
              
              <div className="relative z-10 flex items-center gap-2.5">
                <span className={`${isActive ? 'text-black' : 'group-hover:text-amber-500 transition-all duration-300 group-hover:scale-110'}`}>
                  {nav.icon}
                </span>
                <span className={`hidden lg:block ${isActive ? 'font-black' : 'font-bold'}`}>{nav.name}</span>
                {isActive && <Sparkles size={12} className="animate-pulse hidden md:block text-black/60" />}
              </div>
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-white/10 mx-3 hidden md:block"></div>
 
        {/* NÚT ĐĂNG XUẤT SLIM */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] text-rose-500/90 hover:bg-rose-500 hover:text-white transition-all duration-700 group active:scale-95"
        >
          <LogOut size={16} strokeWidth={2} className="group-hover:-translate-x-1.5 transition-transform duration-500" />
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