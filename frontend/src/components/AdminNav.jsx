import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bed, CalendarCheck, MessageSquare, LogOut, Home } from 'lucide-react';
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
    { name: 'Quản lý phòng', path: '/admin/rooms', icon: <Bed size={18} /> },
    { name: 'Quản lý đơn đặt', path: '/admin/bookings', icon: <CalendarCheck size={18} /> },
    { name: 'Hộp thư', path: '/admin/contacts', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5 w-fit shadow-xl relative z-20">
      {/* 1. CÁC NÚT ĐIỀU HƯỚNG CHÍNH */}
      {navs.map(nav => {
        const isActive = location.pathname === nav.path;
        return (
          <Link
            key={nav.path}
            to={nav.path}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
              isActive
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                : 'text-gray-400 hover:text-amber-500 hover:bg-white/5'
            }`}
          >
            {nav.icon}
            <span className="hidden sm:block">{nav.name}</span>
          </Link>
        );
      })}

      {/* VẠCH NGĂN CÁCH NHỎ */}
      <div className="w-[1px] h-8 bg-white/10 mx-2 hidden md:block"></div>

      {/* 2. NÚT VỀ TRANG CHỦ */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white transition-all duration-300 text-[10px] font-bold uppercase tracking-widest"
      >
        <Home size={18} />
        <span className="hidden lg:block">Trang chủ</span>
      </button>

      {/* 3. NÚT ĐĂNG XUẤT*/}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 group"
      >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:block">Đăng xuất</span>
      </button>
    </div>
  );
};

export default AdminNav;