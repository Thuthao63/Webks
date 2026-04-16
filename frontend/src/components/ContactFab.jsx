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
        className="fixed bottom-10 right-10 z-[999] group"
      >
        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-amber-600 hover:bg-white text-black p-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-700 hover:-translate-y-2 flex items-center justify-center">
           <UserCheck size={28} className="group-hover:rotate-12 transition-transform duration-500" />
           
           {/* Tooltip */}
           <div className="absolute right-full mr-6 py-2 px-5 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0">
              <p className="text-[10px] text-white font-black uppercase tracking-[0.3em] whitespace-nowrap">Trợ lý quản gia</p>
           </div>
        </div>
      </button>

      {/* --- MODAL CHAT SANG TRỌNG --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-[#050505] border border-white/10 w-full max-w-lg rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header decor */}
            <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
            
            <div className="p-10 md:p-12 relative">
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="absolute top-8 right-8 text-gray-500 hover:text-amber-500 transition-colors"
               >
                 <X size={24} />
               </button>

               <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-amber-500 mb-6 font-serif italic text-2xl shadow-inner">
                     U
                  </div>
                  <h3 className="text-4xl font-serif italic text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Gửi lời nhắn</h3>
                  <div className="w-10 h-[1px] bg-amber-500 mb-4"></div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold">Quản gia Uy Nam sẽ phản hồi ngay lập tức</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <label className="text-[9px] text-gray-600 uppercase tracking-widest font-black ml-2">Quý danh</label>
                        <input name="name" type="text" placeholder="Nguyễn Văn A" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[13px] outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-gray-700 font-medium" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] text-gray-600 uppercase tracking-widest font-black ml-2">Số điện thoại</label>
                        <input name="phone" type="tel" placeholder="090..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[13px] outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-gray-700 font-medium" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest font-black ml-2">Địa chỉ Email</label>
                    <input name="email" type="email" placeholder="email@gmail.com" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[13px] outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-gray-700 font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest font-black ml-2">Nội dung tư vấn</label>
                    <textarea name="message" rows="3" placeholder="Quý khách cần hỗ trợ điều gì?" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[13px] outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-gray-700 font-medium resize-none"></textarea>
                  </div>
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-white hover:to-white text-black font-black py-5 rounded-2xl transition-all uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:shadow-amber-500/20 disabled:opacity-50"
                  >
                    {loading ? 'Đang kết nối...' : <><Send size={16} /> Gửi cho Quản Gia</>}
                  </button>
               </form>
               
               <div className="mt-8 flex justify-center gap-8">
                  <div className="flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                     <Phone size={14} className="text-amber-500" /> 090 123 456
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                     <Mail size={14} className="text-amber-500" /> Concierge@uynam.com
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