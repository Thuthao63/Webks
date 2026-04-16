import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      Swal.fire({
        background: '#0a0a0ae6',
        color: '#fff',
        icon: 'success',
        title: 'Thành công!',
        text: 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất.',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        background: '#0a0a0ae6',
        color: '#fff',
        icon: 'error',
        title: 'Thất bại',
        text: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" 
             alt="Contact Us" 
             className="w-full h-full object-cover opacity-50"
           />
         </div>
         <div className="relative z-20 text-center px-6 mt-16 animate-in fade-in zoom-in duration-1000">
           <h1 className="text-5xl md:text-7xl mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
             Kết nối <span className="text-amber-500 font-bold not-italic">Với chúng tôi</span>
           </h1>
           <p className="text-gray-300 text-[10px] md:text-xs uppercase tracking-[0.4em] max-w-xl mx-auto">
             Chúng tôi luôn sẵn sàng lắng nghe mọi yêu cầu của bạn.
           </p>
         </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* INFO & MAP */}
          <div className="space-y-12">
             <div className="space-y-6">
                 <h2 className="text-3xl font-serif italic text-amber-500" style={{ fontFamily: "'Playfair Display', serif" }}>Thông tin liên hệ</h2>
                 <p className="text-gray-400 leading-loose text-sm">
                   Dù bạn cần giải đáp thắc mắc về dịch vụ, hay muốn gửi yêu cầu đặc biệt cho kỳ nghỉ sắp tới, đội ngũ Chăm sóc khách hàng của Uy Nam Luxury luôn trực 24/7.
                 </p>
             </div>

             <div className="space-y-8">
                 <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-amber-500 bg-white/5">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Địa chỉ</h4>
                        <p className="text-gray-400 text-sm">123 Đường Bờ Biển, Quận Sơn Trà, TP. Đà Nẵng</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-amber-500 bg-white/5">
                        <Phone size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Hotline</h4>
                        <p className="text-gray-400 text-sm">0123 456 789 (Hỗ trợ 24/7)</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-amber-500 bg-white/5">
                        <Mail size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Email</h4>
                        <p className="text-gray-400 text-sm">support@uynamluxury.com</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-amber-500 bg-white/5">
                        <Clock size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Giờ làm việc</h4>
                        <p className="text-gray-400 text-sm">Liên tục các ngày trong tuần</p>
                     </div>
                 </div>
             </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -z-10"></div>
             
             {success ? (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <CheckCircle size={80} className="text-emerald-500 mb-6" />
                  <h3 className="text-3xl font-serif italic mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Đã gửi thành công!</h3>
                  <p className="text-gray-400 text-sm mb-8">Xin cảm ơn bạn đã liên hệ. Bộ phận CSKH sẽ phản hồi trong thời gian sớm nhất.</p>
                  <button onClick={() => setSuccess(false)} className="px-8 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full text-xs font-bold uppercase tracking-widest transition-all">Gửi thư khác</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <h3 className="text-2xl font-serif italic mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Gửi tin nhắn</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Họ và tên</label>
                      <input 
                         required type="text"
                         value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm"
                         placeholder="VD: Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Số điện thoại</label>
                      <input 
                         required type="tel"
                         value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm"
                         placeholder="VD: 09..."
                      />
                    </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Email</label>
                     <input 
                        required type="email"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm"
                        placeholder="VD: email@domain.com"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Vấn đề cần hỗ trợ</label>
                     <input 
                        required type="text"
                        value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm"
                        placeholder="Chủ đề..."
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-2">Nội dung</label>
                     <textarea 
                        required rows={4}
                        value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm resize-none"
                        placeholder="Chi tiết câu hỏi của bạn..."
                     />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 mt-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                     {loading ? 'Đang gửi...' : <><Send size={16} /> Gửi yêu cầu</>}
                  </button>
               </form>
             )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
