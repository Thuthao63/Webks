import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';

const ContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await axiosClient.post('/auth/contact', data);
      Swal.fire({
        icon: 'success',
        title: 'Gửi thành công',
        text: 'Uy Nam sẽ liên hệ Thảo sớm nhất!',
        confirmButtonColor: '#d97706'
      });
      setIsOpen(false);
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể gửi yêu cầu lúc này', 'error');
    }
  };

  return (
    <>
      {/* --- NÚT BẤM TRÔI NỔI (FAB) --- */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[999] bg-amber-600 hover:bg-white text-black p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 bg-black/80 text-white text-[10px] py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase font-bold border border-white/10">
          Liên hệ tư vấn
        </span>
      </button>

      {/* --- MODAL FORM LIÊN HỆ --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Lớp nền mờ */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          {/* Cửa sổ Form */}
          <div className="relative bg-[#111] border border-amber-900/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif italic text-white mb-2">Gửi lời nhắn</h3>
                <p className="text-[10px] text-amber-500 uppercase tracking-[0.3em]">Hỗ trợ quý khách 24/7</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="HỌ TÊN" required className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-amber-500 transition-all uppercase tracking-widest text-white" />
                  <input name="phone" type="text" placeholder="SỐ ĐIỆN THOẠI" className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-amber-500 transition-all uppercase tracking-widest text-white" />
                </div>
                <input name="email" type="email" placeholder="ĐỊA CHỈ EMAIL" required className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-amber-500 transition-all uppercase tracking-widest text-white" />
                <textarea name="message" rows="4" placeholder="NỘI DUNG TƯ VẤN..." required className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-amber-500 transition-all uppercase tracking-widest text-white resize-none"></textarea>
                
                <button type="submit" className="w-full bg-amber-600 hover:bg-white text-black font-black py-4 rounded-xl transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
                  Gửi yêu cầu ngay <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactFab;