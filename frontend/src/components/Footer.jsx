import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bed, Globe, Send, Share2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- PHẦN TRÊN: BRAND & LINKS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Cột Logo & Slogan */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-amber-500/50 rounded-full flex items-center justify-center">
                <Bed size={16} className="text-amber-500" />
              </div>
              <span className="text-xl font-serif tracking-[0.3em] uppercase">Uy Nam</span>
            </div>
            <p className="text-gray-500 text-[10px] leading-relaxed max-w-xs font-light tracking-[0.2em] uppercase">
              Định nghĩa lại nghệ thuật sống thượng lưu tại tâm điểm của sự sang trọng.
            </p>
          </div>

          {/* Cột Liên kết nhanh */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Khám phá</h4>
            <ul className="space-y-4 text-[11px] text-gray-400 uppercase tracking-widest">
              <li><Link to="/rooms" className="hover:text-amber-500 transition-colors">Phòng & Suite</Link></li>
              <li><span className="hover:text-amber-500 cursor-pointer transition-colors">Dịch vụ Spa</span></li>
              <li><span className="hover:text-amber-500 cursor-pointer transition-colors">Ẩm thực Á-Âu</span></li>
            </ul>
          </div>

          {/* Cột Thông tin */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Thông tin</h4>
            <div className="space-y-4 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
              <p className="flex items-start gap-3"><MapPin size={14} className="text-amber-500 shrink-0" /> 123 Võ Nguyên Giáp, Đà Nẵng</p>
              <p className="flex items-center gap-3"><Phone size={14} className="text-amber-500" /> 0123.456.789</p>
              <p className="flex items-center gap-3"><Mail size={14} className="text-amber-500" /> contact@uynam.com</p>
            </div>
          </div>

          {/* Cột Newsletter */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Newsletter</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="EMAIL CỦA BẠN" 
                className="w-full bg-transparent border-b border-white/10 py-2 text-[10px] outline-none focus:border-amber-500 transition-all uppercase tracking-widest text-white"
              />
              <button className="absolute right-0 top-2 text-amber-500 hover:text-white transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* --- PHẦN DƯỚI: COPYRIGHT & SOCIAL --- */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-medium">
            © 2026 UY NAM LUXURY HOTEL — BY <span className="text-gray-400">THU THAO</span>
          </p>
          
          <div className="flex gap-8 items-center">
            {/* Globe/Share2/Heart */}
            <span className="text-gray-500 hover:text-amber-500 cursor-pointer transition-all"><Globe size={14} /></span>
            <span className="text-gray-500 hover:text-amber-500 transition-all"><Heart size={14} /></span>
            <span className="text-gray-500 hover:text-amber-500 transition-all"><Share2 size={14} /></span>
          </div>

          <div className="flex gap-6 text-[9px] text-gray-600 uppercase tracking-widest font-bold">
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;