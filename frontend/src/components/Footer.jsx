import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bed, Globe, Send, } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F9F8F6] text-slate-900 pt-40 pb-16 border-t border-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#B59A6D]/20 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B59A6D]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#B59A6D]/5 rounded-full blur-[180px] pointer-events-none translate-y-1/2 translate-x-1/4"></div>
 
      <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12 mb-32">

          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-10 h-10 border border-[#B59A6D]/20 rounded-full flex items-center justify-center group-hover:border-[#B59A6D] transition-all duration-700">
                <Bed size={20} className="text-[#B59A6D]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif tracking-widest uppercase italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
                <span className="text-[7px] tracking-[0.4em] text-[#B59A6D] uppercase font-black">Luxury Collection</span>
              </div>
            </Link>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-sm font-medium italic">
              "Nơi mỗi khoảnh khắc đều trở thành một kiệt tác của sự tĩnh lặng và nghệ thuật phục vụ tận tâm."
            </p>
            <div className="flex gap-4 pt-4">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#B59A6D] hover:border-[#B59A6D]/50 transition-all cursor-pointer group/icon bg-white">
                   <Icon size={16} className="group-hover/icon:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Explore */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B59A6D]">Khám phá</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">Câu chuyện</FooterLink>
              <FooterLink to="/rooms">Phòng & Suite</FooterLink>
              <FooterLink to="/services">Dịch vụ</FooterLink>
              <FooterLink to="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B59A6D]">Thông tin</h4>
            <div className="space-y-5 text-slate-600">
              <div className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={16} className="text-[#B59A6D] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] leading-relaxed tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">123 Võ Nguyên Giáp, <br />Phước Mỹ, Đà Nẵng</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Phone size={16} className="text-[#B59A6D] shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">0123.456.789</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Mail size={16} className="text-[#B59A6D] shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">contact@uynam.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#B59A6D]">Đặc quyền Email</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-[0.3em] font-bold">Nhận thông tin về các combo ưu đãi và sự kiện đặc biệt tại Uy Nam.</p>
            <div className="relative group max-w-md">
              <input
                type="email"
                placeholder="EMAIL CỦA BẠN"
                className="w-full bg-white border border-slate-100 rounded-2xl py-5 px-6 text-[10px] outline-none focus:border-[#B59A6D]/50 focus:ring-1 focus:ring-[#B59A6D]/30 transition-all uppercase tracking-[0.3em] text-slate-900 placeholder-slate-300 font-bold shadow-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-[#B59A6D] transition-all shadow-lg active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">
              © {currentYear} UY NAM LUXURY HOTEL
            </p>
            <div className="w-1 h-1 bg-[#B59A6D]/30 rounded-full hidden md:block"></div>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold italic">
              Designed with passion
            </p>
          </div>

          <div className="flex gap-10 text-[9px] text-slate-400 uppercase tracking-[0.4em] font-bold">
            <Link to="/" className="hover:text-[#B59A6D] cursor-pointer transition-all hover:-translate-y-0.5">Quy định</Link>
            <Link to="/" className="hover:text-[#B59A6D] cursor-pointer transition-all hover:-translate-y-0.5">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-[11px] text-slate-500 uppercase tracking-[0.2em] font-bold hover:text-[#B59A6D] transition-all flex items-center gap-2 group"
    >
      <div className="w-0 h-[1px] bg-[#B59A6D] transition-all duration-300 group-hover:w-4"></div>
      {children}
    </Link>
  </li>
);

export default Footer;