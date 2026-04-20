import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

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
        background: '#fff',
        color: '#0f172a',
        icon: 'success',
        title: 'Gửi thành công',
        text: 'Chúng tôi đã tiếp nhận yêu cầu và sẽ phản hồi trong giây lát.',
        confirmButtonColor: '#B59A6D',
        confirmButtonText: 'Đóng',
        borderRadius: '2rem'
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Có lỗi xảy ra. Quý khách vui lòng thử lại sau.',
        confirmButtonColor: '#0f172a',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F8F6] text-slate-900 selection:bg-slate-200 font-sans min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-[#F9F8F6] z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" 
             alt="Contact Us" 
             className="w-full h-full object-cover scale-105"
           />
         </div>
         <div className="relative z-20 text-center px-6 mt-20 animate-in fade-in zoom-in duration-1000 max-w-4xl">
            <span className="text-[#B59A6D] text-[11px] font-black uppercase tracking-[0.5em] mb-8 block">Dịch vụ Butler 24/7</span>
            <h1 className="text-6xl md:text-[7rem] mb-6 italic text-slate-100 drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên kết <span className="text-[#B59A6D] font-bold not-italic">Tận tâm</span>
            </h1>
            <p className="text-slate-200 text-[10px] md:text-xs uppercase tracking-[0.5em] max-w-xl mx-auto leading-loose bg-black/10 backdrop-blur-md py-4 px-10 rounded-full border border-white/5">
              Chúng tôi luôn sẵn sàng lắng nghe mọi yêu cầu thượng hạng của quý khách.
            </p>
         </div>
      </section>

      <section className="py-24 md:py-44 px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-start">
          
          {/* INFO & MAP */}
          <div className="space-y-16 animate-in fade-in slide-in-from-left-10 duration-1000">
             <div className="space-y-8">
                 <h2 className="text-5xl md:text-7xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Thông tin <br/> liên hệ</h2>
                 <p className="text-slate-500 leading-relaxed text-base font-medium italic">
                   Dù bạn cần giải đáp thắc mắc về không gian, hay muốn gửi yêu cầu đặc biệt cho kỳ nghỉ sắp tới, đội ngũ Chăm sóc khách hàng của Uy Nam luôn túc trực để phục vụ.
                 </p>
             </div>

             <div className="grid gap-10">
                 {[
                   { icon: MapPin, title: "Tọa lạc", desc: "123 Võ Nguyên Giáp, Phước Mỹ, Đà Nẵng" },
                   { icon: Phone, title: "Đường dây nóng", desc: "0123.456.789 (Hỗ trợ 24/7)" },
                   { icon: Mail, title: "Email đặc quyền", desc: "contact@uynam.com" },
                   { icon: Clock, title: "Trạng thái", desc: "Hoạt động liên tục cả tuần" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-8 group">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center text-[#B59A6D] group-hover:bg-slate-900 group-hover:text-[#B59A6D] transition-luxury shrink-0">
                         <item.icon size={28} strokeWidth={1} />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{item.title}</h4>
                         <p className="text-slate-900 font-bold text-sm tracking-wide">{item.desc}</p>
                      </div>
                   </div>
                 ))}
             </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-premium relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#B59A6D]/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
             
             {success ? (
               <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-10 shadow-xl">
                     <CheckCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-serif italic mb-6 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Thư Đã Được Gửi!</h3>
                  <p className="text-slate-500 font-medium italic mb-12">Xin cảm ơn sự tin tưởng của quý khách. Bộ phận lễ tân sẽ sớm liên lạc lại.</p>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="bg-slate-900 text-white px-12 py-5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B59A6D] transition-luxury shadow-lg"
                  >
                    Gửi thêm yêu cầu
                  </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-12">
                     <MessageSquare className="text-[#B59A6D]" size={32} strokeWidth={1} />
                     <h3 className="text-3xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Gửi tin nhắn</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Thanh danh</label>
                      <input 
                         required type="text"
                         value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-[#F9F8F6] border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B59A6D]/50 focus:bg-white transition-luxury text-[13px] font-bold text-slate-900 placeholder-slate-300"
                         placeholder="Họ và tên của quý khách"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Số điện thoại</label>
                      <input 
                         required type="tel"
                         value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full bg-[#F9F8F6] border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B59A6D]/50 focus:bg-white transition-luxury text-[13px] font-bold text-slate-900 placeholder-slate-300"
                         placeholder="09..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Địa chỉ Email</label>
                     <input 
                        required type="email"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#F9F8F6] border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B59A6D]/50 focus:bg-white transition-luxury text-[13px] font-bold text-slate-900 placeholder-slate-300"
                        placeholder="email@example.com"
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Chủ đề quan tâm</label>
                     <input 
                        required type="text"
                        value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#F9F8F6] border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B59A6D]/50 focus:bg-white transition-luxury text-[13px] font-bold text-slate-900 placeholder-slate-300"
                        placeholder="Quý khách cần hỗ trợ về..."
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Chi tiết yêu cầu</label>
                     <textarea 
                        required rows={5}
                        value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-[#F9F8F6] border border-slate-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B59A6D]/50 focus:bg-white transition-luxury text-[13px] font-bold text-slate-900 placeholder-slate-300 resize-none"
                        placeholder="Nội dung lời nhắn..."
                     />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-6 mt-6 bg-slate-900 hover:bg-[#B59A6D] text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl shadow-xl shadow-slate-900/10 transition-luxury flex items-center justify-center gap-6 disabled:opacity-50"
                  >
                     {loading ? 'Đang truyền tin...' : <><Send size={18} className="group-hover:rotate-12 transition-transform" /> Gửi Tư vấn</>}
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

