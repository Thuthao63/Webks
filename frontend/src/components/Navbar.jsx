import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu, X, Bed, ChevronDown, Settings, ShoppingBag, Bell, Star } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Nếu là trang Auth hoặc Admin, không render bất cứ thứ gì
  if (isAuthPage || isAdminPage) return null;

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/about' },
    { name: 'Phòng nghỉ', path: '/rooms' },
    { name: 'Dịch vụ', path: '/services' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <>
      {/* Overlay Gradient phía trên cùng */}
      <div className={`fixed top-0 w-full h-40 z-[990] pointer-events-none transition-opacity duration-700 ${
        isScrolled ? 'opacity-0' : 'opacity-100 bg-gradient-to-b from-black/90 via-black/40 to-transparent'
      }`}></div>

      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-[#050505]/80 backdrop-blur-2xl py-3 border-b border-white/5 shadow-2xl' 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 border border-amber-500/30 rounded-full flex items-center justify-center group-hover:border-amber-500 transition-all duration-700 group-hover:rotate-[360deg]">
                <Bed size={24} className="text-amber-500 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full blur-[2px] animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-[0.3em] text-white uppercase leading-none italic" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
              <span className="text-[8px] tracking-[0.5em] text-amber-500 uppercase font-black mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">Private Collection</span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 relative group py-2 ${
                  location.pathname === link.path ? 'text-amber-500' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-amber-500 transition-all duration-500 shadow-[0_0_10px_#f59e0b] ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* --- RIGHT ACTIONS --- */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hidden sm:block relative">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full border border-black animate-bounce"></span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                    className="flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all duration-500 group shadow-inner"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-black font-black text-xs shadow-lg group-hover:shadow-amber-500/20">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                      <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest opacity-70">Member</span>
                      <span className="text-[11px] text-white font-bold">{user.fullName}</span>
                    </div>
                    <ChevronDown size={14} className={`text-amber-500 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-6 w-80 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-b border-white/5 relative">
                          <Star className="absolute top-6 right-6 text-amber-500/20" size={40} />
                          <p className="text-[9px] text-amber-500 uppercase font-black tracking-[0.3em] mb-2">Hội viên đặc quyền</p>
                          <p className="text-white font-serif text-xl italic leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{user.fullName}</p>
                          <p className="text-[10px] text-gray-500 mt-2 tracking-wide font-medium">{user.email}</p>
                        </div>
                        
                        <div className="p-4 space-y-1">
                          {user.role?.toLowerCase() === 'admin' && (
                            <button onClick={() => { navigate('/admin/dashboard'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-4 px-5 py-4 text-amber-500 hover:bg-amber-500/5 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em]">
                              <Settings size={18} className="opacity-70" /> Quản trị hệ thống
                            </button>
                          )}
                          <button onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-4 px-5 py-4 text-gray-300 hover:bg-white/5 rounded-2xl transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.1em]">
                            <User size={18} className="opacity-50" /> Hồ sơ cá nhân
                          </button>
                        </div>

                        <div className="p-4 bg-white/5 mt-2">
                          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em]">
                            <LogOut size={18} /> Rời khỏi hệ thống
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
                className="relative group px-10 py-3.5 overflow-hidden rounded-full transition-all duration-500"
              >
                <div className="absolute inset-0 bg-amber-500 group-hover:bg-white transition-colors duration-500"></div>
                <span className="relative z-10 text-black text-[10px] font-black uppercase tracking-[0.3em]">
                  Truy cập ngay
                </span>
                <div className="absolute -inset-1 bg-amber-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            )}

            <button 
              className="md:hidden p-2 text-amber-500 hover:scale-110 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;