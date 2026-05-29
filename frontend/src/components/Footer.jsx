import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bed, Globe, Send, } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cream text-slate-900 pt-20 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12 mb-32">

          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-10 h-10 border border-amber-500/20 rounded-full flex items-center justify-center group-hover:border-amber-500 transition-all duration-700">
                <Bed size={20} className="text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif tracking-widest uppercase italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
                <span className="text-[10px] tracking-[0.1em] text-amber-500 uppercase font-black">Luxury Collection</span>
              </div>
            </Link>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-sm font-medium italic">
              "Nơi mỗi khoảnh khắc đều trở thành một kiệt tác của sự tĩnh lặng và nghệ thuật phục vụ tận tâm."
            </p>
            <div className="flex gap-3 pt-3">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 bg-white/50">
                   <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Explore */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500">Khám phá</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">Câu chuyện</FooterLink>
              <FooterLink to="/rooms">Phòng & Suite</FooterLink>
              <FooterLink to="/services">Dịch vụ</FooterLink>
              <FooterLink to="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500">Thông tin</h4>
            <div className="space-y-5 text-slate-600">
              <div className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={16} className="text-amber-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm leading-relaxed tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">123 Võ Nguyên Giáp, <br />Phước Mỹ, Đà Nẵng</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Phone size={16} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">0123.456.789</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Mail size={16} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm tracking-widest uppercase font-bold group-hover:text-slate-900 transition-colors">contact@uynam.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">Đặc quyền Email</h4>
            <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-widest font-bold">Nhận thông tin về các combo ưu đãi và sự kiện đặc biệt tại Uy Nam.</p>
            <div className="relative group max-w-md">
              <input
                type="email"
                placeholder="EMAIL CỦA BẠN"
                className="w-full bg-white border border-slate-200 rounded-md py-3 px-4 text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-slate-900 placeholder-slate-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center text-white hover:opacity-90 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm text-slate-400 uppercase tracking-widest font-black">
              © {currentYear} UY NAM LUXURY HOTEL
            </p>
            <div className="w-1 h-1 bg-amber-500/30 rounded-full hidden md:block"></div>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold italic">
              Designed with passion
            </p>
          </div>

          <div className="flex gap-10 text-sm text-slate-400 uppercase tracking-[0.1em] font-bold">
            <Link to="/terms" className="hover:text-amber-500 cursor-pointer transition-all hover:-translate-y-0.5">Quy định</Link>
            <Link to="/privacy" className="hover:text-amber-500 cursor-pointer transition-all hover:-translate-y-0.5">Bảo mật</Link>
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
      className="text-sm text-slate-500 uppercase tracking-wider font-bold hover:text-amber-500 transition-all flex items-center gap-2 group"
    >
      <div className="w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-4"></div>
      {children}
    </Link>
  </li>
);

export default Footer;


