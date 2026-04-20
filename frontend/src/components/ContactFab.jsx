import React, { useState } from 'react';
import { X, Send, Phone, Mail, UserCheck, MessageSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';

const ContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // SỬA LỖI: Endpoint đúng là /contacts thay vì /auth/contact
      await axiosClient.post('/contacts', data);

      Swal.fire({
        background: '#0a0a0ae6',
        color: '#fff',
        icon: 'success',
        title: 'Đã tiếp nhận yêu cầu',
        text: 'Đội ngũ quản gia sẽ phản hồi quý khách sớm nhất qua Email/SĐT.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'border border-amber-500/20 rounded-[2rem] shadow-2xl backdrop-blur-3xl'
        }
      });
      setIsOpen(false);
      e.target.reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Hiện tại hệ thống chối bỏ kết nối. Vui lòng thử lại sau.',
        background: '#0a0a0ae6',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- NÚT BẤM DẠNG CONCIERGE --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-12 z-[999] group active:scale-90 transition-transform duration-300"
      >
        <div className="absolute -inset-6 bg-amber-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
        <div className="relative bg-[#0a0a0ae6] backdrop-blur-xl border border-white/10 hover:border-amber-500/50 text-amber-500 p-6 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-700 hover:-translate-y-3 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageSquare size={32} className="group-hover:rotate-12 transition-transform duration-500 stroke-[1.5px]" />

          {/* Tooltip */}
          <div className="absolute right-full mr-8 py-3 px-6 bg-black/90 backdrop-blur-2xl border border-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-6 group-hover:translate-x-0 shadow-2xl">
            <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.4em] whitespace-nowrap">Trợ lý quản gia</p>
          </div>
        </div>
      </button>

      {/* --- MODAL CHAT SANG TRỌNG --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          <div className="relative bg-[#050505] border border-white/15 w-full max-w-xl rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header decor */}
            <div className="h-2.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700"></div>

            <div className="p-12 md:p-16 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-10 right-10 text-gray-500 hover:text-amber-500 transition-all hover:rotate-90 duration-500"
              >
                <X size={28} />
              </button>

              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-full flex items-center justify-center text-amber-500 mb-8 font-serif italic text-3xl shadow-2xl relative group/logo">
                  <span className="relative z-10 transition-transform group-hover/logo:scale-110 duration-700">U</span>
                  <div className="absolute inset-2 border border-amber-500/20 rounded-full"></div>
                </div>
                <h3 className="text-5xl font-serif italic text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Gửi lời nhắn</h3>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-6"></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-black opacity-60">Thượng khách vui lòng để lại thông tin</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-4">Quý danh</label>
                    <input name="name" type="text" placeholder="Nguyễn Văn A" required className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] text-[14px] outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-gray-800 font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-4">Số điện thoại</label>
                    <input name="phone" type="tel" placeholder="090..." className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] text-[14px] outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-gray-800 font-medium" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-4">Địa chỉ Email</label>
                  <input name="email" type="email" placeholder="email@gmail.com" required className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] text-[14px] outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-gray-800 font-medium" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-4">Nội dung tư vấn</label>
                  <textarea name="message" rows="4" placeholder="Quý khách cần hỗ trợ điều gì?" required className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] text-[14px] outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-gray-800 font-medium resize-none"></textarea>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-white hover:to-white text-black font-black py-6 rounded-[2rem] transition-all uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl hover:shadow-amber-500/20 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? 'Đang kết nối...' : <><Send size={18} /> Gửi cho Quản Gia</>}
                </button>
              </form>

              <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-10 opacity-60">
                <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors cursor-pointer group/item">
                  <Phone size={16} className="text-amber-500 group-hover/item:animate-bounce" /> 090 123 456
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors cursor-pointer group/item">
                  <Mail size={16} className="text-amber-500 group-hover/item:animate-bounce" /> Concierge@uynam.com
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactFab;