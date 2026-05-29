import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu, X, Bed, ChevronDown, Settings, Bell, Star, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (user) {
      axiosClient.get('/discounts/active')
        .then(res => {
           const discNotifs = (res.data || []).map((d, index) => ({
               id: `disc-${d.id || index}`,
               title: '🎉 Ưu đãi khuyến mãi mới!',
               message: `Giật deal cực đậm! Nhập mã ${d.code} giảm ngay ${Math.floor(d.discountPercent)}% cho phòng khách sạn.`,
               time: new Date(d.createdAt || Date.now()).toLocaleDateString('vi-VN'),
               read: false
           })).reverse(); // Đảo ngược để ưu đãi mới nhất lên đầu
           
           setNotifications([
               ...discNotifs,
               { id: 'welcome', title: 'Uy Nam xin chào!', message: 'Chào mừng bạn đến với hệ thống đặt phòng thượng lưu.', time: 'Hệ thống', read: true }
           ]);
        })
        .catch(err => console.error("Lỗi lấy thông báo/khuyến mãi:", err));
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const currentPath = location.pathname.toLowerCase();

  const isAuthPage = ['/login', '/register', '/verify', '/forgot-password', '/reset-password']
    .some(path => currentPath.includes(path));

  const isAdminPage = currentPath.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  const toggleLanguage = () => {
      const nextLang = i18n.language === 'en' ? 'vi' : 'en';
      i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.rooms'), path: '/rooms' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <>
      {/* Overlay Gradient */}
      <div className={`fixed top-0 w-full h-48 z-[990] pointer-events-none transition-opacity duration-1000 ${isScrolled ? 'opacity-0' : 'opacity-100 bg-gradient-to-b from-slate-950 via-slate-950/20 to-transparent'
        }`}></div>

      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-1000 ease-in-out ${isScrolled
        ? 'glass-dark py-4 shadow-2xl'
        : 'bg-transparent py-8'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 border border-amber-500/30 rounded-full flex items-center justify-center group-hover:border-amber-500 transition-all duration-1000 group-hover:rotate-[360deg]">
                <Bed size={24} className="text-amber-500 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full blur-[2px] animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-tight text-white uppercase leading-none italic" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
              <span className="text-xs tracking-wider text-amber-500 uppercase font-bold mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">Luxury Collection</span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] uppercase tracking-wider font-semibold transition-all duration-500 relative group py-2 ${location.pathname === link.path ? 'text-amber-500' : 'text-gray-300 hover:text-white'
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-amber-500 transition-all duration-500 shadow-[0_0_10px_#B59A6D] ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            ))}
          </div>

          {/* --- RIGHT ACTIONS --- */}
            <div className="flex items-center gap-6">
              <button 
                  onClick={toggleLanguage} 
                  aria-label="Đổi ngôn ngữ" 
                  className="p-2 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 relative flex items-center gap-2"
              >
                  <Languages size={18} />
                  <span className="text-xs uppercase font-bold text-white">{i18n.language === 'en' ? 'EN' : 'VN'}</span>
              </button>

            {user ? (
              <div className="flex items-center gap-4 relative">
                {/* NOTIFICATION BUTTON */}
                <button 
                  aria-label="Thông báo" 
                  onClick={() => { 
                      setIsNotifMenuOpen(!isNotifMenuOpen); 
                      setIsUserMenuOpen(false); 
                      // Đánh dấu đã đọc khi mở ra
                      if (!isNotifMenuOpen && notifications.some(n => !n.read)) {
                          setNotifications(prev => prev.map(n => ({...n, read: true})));
                      }
                  }}
                  className={`p-2 transition-all duration-300 hover:scale-110 hidden sm:block relative ${notifications.some(n => !n.read) ? 'text-rose-400' : 'text-gray-400 hover:text-amber-500'}`}
                >
                  <Bell size={18} className={notifications.some(n => !n.read) ? 'animate-bounce' : ''} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-[1.5px] border-slate-900 animate-pulse"></span>
                  )}
                </button>

                {/* NOTIFICATION DROPDOWN */}
                {isNotifMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotifMenuOpen(false)}></div>
                      <div className="absolute top-12 right-12 w-80 bg-white/95 backdrop-blur-3xl border border-slate-200/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-500 z-50">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 font-sans">Thông báo</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(notif => (
                                <div key={notif.id} className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${notif.read ? 'opacity-70 bg-transparent' : 'bg-rose-50'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                                        <span className="text-sm text-slate-400">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-sans">{notif.message}</p>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-xs">Chưa có thông báo nào.</div>
                            )}
                        </div>
                        <div className="p-4 text-center border-t border-slate-100 bg-slate-50">
                            <button className="text-xs text-slate-500 font-black uppercase tracking-widest hover:text-amber-500">Xem tất cả thông báo</button>
                        </div>
                      </div>
                    </>
                )}

                <div className="relative">
                  <button
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifMenuOpen(false); }}
                    className="flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all duration-500 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xs shadow-lg group-hover:shadow-amber-500/20">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                      <span className="text-xs text-amber-500 font-bold uppercase tracking-widest opacity-70">Tài khoản</span>
                      <span className="text-[13px] text-white font-semibold">{user.fullName}</span>
                    </div>
                    <ChevronDown size={14} className={`text-amber-500 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-6 w-80 bg-white/90 backdrop-blur-3xl border border-slate-200/60 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                        {/* Member Card Header - Light Version */}
                        <div className="p-8 bg-gradient-to-br from-amber-500/10 to-cream relative overflow-hidden group/header">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-1000"></div>
                          <Star className="absolute top-6 right-6 text-amber-500 opacity-10 group-hover/header:opacity-40 group-hover/header:rotate-12 transition-all duration-700" size={48} strokeWidth={1} />
                          
                          <div className="relative z-10">
                            <span className="text-sm text-amber-500 uppercase font-black tracking-[0.1em] mb-4 block">Thành viên đặc quyền</span>
                            <h4 className="text-slate-900 font-serif text-2xl italic leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{user.fullName}</h4>
                            <p className="text-sm text-slate-500 tracking-wider font-medium flex items-center gap-2">
                              <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 space-y-1 bg-white/50">
                          {user.role?.toLowerCase() === 'admin' && (
                            <button 
                              onClick={() => { navigate('/admin/dashboard'); setIsUserMenuOpen(false); }} 
                              className="w-full flex items-center justify-between px-5 py-4 text-amber-500 hover:bg-amber-50 rounded-2xl transition-all duration-500 group/item border border-transparent hover:border-amber-500/10"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/5 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                  <Settings size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Quản trị hệ thống</p>
                                  <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Toàn quyền kiểm soát</p>
                                </div>
                              </div>
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }} 
                            className="w-full flex items-center justify-between px-5 py-4 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all duration-500 group/item border border-transparent hover:border-slate-100"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                <User size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Hồ sơ cá nhân</p>
                                <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Cài đặt của khách</p>
                              </div>
                            </div>
                          </button>
                        </div>

                        <div className="p-6 bg-slate-50/80 border-t border-slate-100">
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center justify-center gap-3 py-4 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-500 text-xs font-black uppercase tracking-widest relative group/logout overflow-hidden shadow-sm"
                          >
                            <LogOut size={16} className="relative z-10" />
                            <span className="relative z-10">Đăng xuất ngay</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative group px-10 py-3.5 overflow-hidden rounded-full transition-all duration-700"
              >
                <div className="absolute inset-0 bg-amber-500 group-hover:bg-white transition-colors duration-700"></div>
                <span className="relative z-10 text-slate-900 text-[12px] font-bold uppercase tracking-wider group-hover:text-amber-500 transition-colors duration-700">
                  Truy cập
                </span>
                <div className="absolute -inset-1 bg-amber-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            )}

            <button
              aria-label="Mở menu di động"
              className="md:hidden p-2 text-amber-500 hover:scale-110 transition-transform active:scale-95 z-[1001]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-700 md:hidden ${isMobileMenuOpen ? 'visible' : 'invisible'
        }`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`} onClick={() => setIsMobileMenuOpen(false)}></div>

        {/* Content Drawer */}
        <div className={`absolute right-0 top-0 h-full w-[80%] bg-slate-950 border-l border-white/5 shadow-2xl transition-transform duration-700 ease-out p-12 flex flex-col justify-between ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="space-y-12 mt-10">
            <div className="space-y-2 border-b border-white/10 pb-6">
              <p className="text-amber-500 text-[12px] uppercase font-bold tracking-widest">Danh mục</p>
              <h4 className="text-white font-serif italic text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>Menu</h4>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-bold uppercase tracking-widest transition-all duration-500 ${location.pathname === link.path ? 'text-amber-500 translate-x-4' : 'text-gray-400 hover:text-white'
                    }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-white/5">
            <p className="text-xs text-gray-500 tracking-widest uppercase font-bold">Liên hệ đặt phòng</p>
            <p className="text-white font-serif italic text-xl">0123.456.789</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


