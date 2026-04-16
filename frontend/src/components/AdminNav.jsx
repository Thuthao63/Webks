import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bed, CalendarCheck, MessageSquare, LogOut } from 'lucide-react';
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
    { name: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Phòng', path: '/admin/rooms', icon: <Bed size={18} /> },
    { name: 'Đặt phòng', path: '/admin/bookings', icon: <CalendarCheck size={18} /> },
    { name: 'Hộp thư', path: '/admin/contacts', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="flex justify-center mb-10 relative z-50">
      <div className="flex flex-wrap items-center gap-2 bg-black/40 backdrop-blur-xl p-2.5 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {navs.map(nav => {
          const isActive = location.pathname.startsWith(nav.path);
          return (
            <Link
              key={nav.path}
              to={nav.path}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? 'text-black shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                  : 'text-gray-400 hover:text-amber-400 hover:bg-white/5'
              }`}
            >
              {/* Nền Gradient khi Active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full z-0"></div>
              )}
              <div className="relative z-10 flex items-center gap-2">
                <span className={`${isActive ? 'text-black' : 'group-hover:scale-110 transition-transform duration-300'}`}>
                  {nav.icon}
                </span>
                <span className="hidden sm:block">{nav.name}</span>
              </div>
            </Link>
          );
        })}

        {/* VẠCH NGĂN CÁCH TÍCH HỢP ĐỀU NHAU */}
        <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block"></div>

        {/* NÚT ĐĂNG XUẤT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-300 group shadow-lg"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:block">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNav;