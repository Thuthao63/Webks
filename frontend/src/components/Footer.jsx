import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bed, Globe, Send, Share2, Heart, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-10 h-10 border border-amber-500/30 rounded-full flex items-center justify-center group-hover:border-amber-500 transition-all duration-700">
                <Bed size={20} className="text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif tracking-[0.2em] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
                <span className="text-[7px] tracking-[0.4em] text-amber-500 uppercase font-black">Private Collection</span>
              </div>
            </Link>
            <p className="text-gray-500 text-xs leading-loose max-w-sm font-medium tracking-wide italic">
              "Nơi mỗi khoảnh khắc đều trở thành một kiệt tác của sự tĩnh lặng và nghệ thuật phục vụ tận tâm."
            </p>
            <div className="flex gap-5">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Quick Explore */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Khám phá</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">Câu chuyện</FooterLink>
              <FooterLink to="/rooms">Phòng & Suite</FooterLink>
              <FooterLink to="/services">Dịch vụ</FooterLink>
              <FooterLink to="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Thông tin</h4>
            <div className="space-y-5 text-gray-400">
              <div className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={16} className="text-amber-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] leading-relaxed tracking-widest uppercase font-bold group-hover:text-white transition-colors">123 Võ Nguyên Giáp, <br/>Phước Mỹ, Đà Nẵng</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Phone size={16} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] tracking-widest uppercase font-bold group-hover:text-white transition-colors">0123.456.789</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <Mail size={16} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] tracking-widest uppercase font-bold group-hover:text-white transition-colors">contact@uynam.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Đặc quyền Email</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">Nhận thông tin về các combo ưu đãi và sự kiện đặc biệt.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="ĐỊA CHỈ EMAIL CỦA BẠN" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-[10px] outline-none focus:border-amber-500 focus:bg-white/10 transition-all uppercase tracking-[0.2em] text-white placeholder-gray-600"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-white hover:scale-110 transition-all">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">
               © {currentYear} UY NAM LUXURY HOTEL
             </p>
             <div className="w-1 h-1 bg-amber-500/30 rounded-full hidden md:block"></div>
             <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold italic">
               Designed with passion by Thu Thao
             </p>
          </div>
          
          <div className="flex gap-10 text-[9px] text-gray-600 uppercase tracking-[0.4em] font-bold">
            <Link to="/faq" className="hover:text-amber-500 cursor-pointer transition-all hover:-translate-y-0.5">Quy định</Link>
            <Link to="/faq" className="hover:text-amber-500 cursor-pointer transition-all hover:-translate-y-0.5">Bảo mật</Link>
            <span className="hover:text-amber-500 cursor-pointer transition-all hover:-translate-y-0.5">Cookies</span>
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
      className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold hover:text-amber-500 transition-all flex items-center gap-2 group"
    >
      <div className="w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-4"></div>
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon }) => (
  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-amber-500 hover:border-amber-500 transition-all duration-500 cursor-pointer shadow-inner">
     {icon}
  </div>
);

export default Footer;