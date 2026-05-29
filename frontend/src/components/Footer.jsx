import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bed, Globe, Send, } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-900 pt-20 pb-12 border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-28">

          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-5 group w-fit">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-500 group-hover:-translate-y-0.5">
                <div className="absolute inset-[1.5px] bg-white rounded-[6.5px] flex items-center justify-center overflow-hidden">
                   <span className="text-amber-500 font-serif text-xl tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>UN</span>
                   <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-serif tracking-widest text-slate-900 uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
                <span className="text-[9px] tracking-[0.3em] text-amber-500 uppercase font-black mt-2 opacity-90 group-hover:opacity-100 transition-opacity">Luxury Collection</span>
              </div>
            </Link>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-sm font-medium italic mt-6">
              "Nơi mỗi khoảnh khắc đều trở thành một kiệt tác của sự tĩnh lặng và nghệ thuật phục vụ tận tâm."
            </p>
            <div className="flex gap-3 pt-4">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 bg-white border border-slate-100 hover:text-amber-500 hover:border-amber-200 transition-colors cursor-pointer shadow-sm">
                   <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Explore */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Khám phá</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">Câu chuyện</FooterLink>
              <FooterLink to="/rooms">Phòng & Suite</FooterLink>
              <FooterLink to="/services">Dịch vụ</FooterLink>
              <FooterLink to="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Thông tin</h4>
            <div className="space-y-5 text-slate-600">
              <div className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed font-medium group-hover:text-amber-600 transition-colors">123 Võ Nguyên Giáp, <br />Phước Mỹ, Đà Nẵng</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <p className="text-sm font-medium group-hover:text-amber-600 transition-colors">0123.456.789</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <p className="text-sm font-medium group-hover:text-amber-600 transition-colors">contact@uynam.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Đặc quyền Email</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Đăng ký để nhận thông tin về các gói ưu đãi và sự kiện đặc biệt dành riêng cho bạn.</p>
            <div className="relative group max-w-md">
              <input
                type="email"
                placeholder="Địa chỉ Email..."
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white hover:bg-slate-900 transition-luxury shadow-md">
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-black">
              © {currentYear} UY NAM LUXURY HOTEL
            </p>
            <div className="w-1 h-1 bg-amber-500 rounded-full hidden md:block"></div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold italic">
              Designed with passion
            </p>
          </div>

          <div className="flex gap-8 text-[11px] text-slate-400 uppercase tracking-widest font-black">
            <Link to="/terms" className="hover:text-amber-500 transition-colors">Quy định</Link>
            <Link to="/privacy" className="hover:text-amber-500 transition-colors">Bảo mật</Link>
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
      className="text-sm text-slate-500 font-medium hover:text-amber-500 transition-all flex items-center gap-3 group w-fit"
    >
      <div className="w-0 h-[1.5px] bg-amber-500 transition-all duration-300 group-hover:w-4"></div>
      {children}
    </Link>
  </li>
);

export default Footer;
