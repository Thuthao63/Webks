import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, User as UserIcon, HelpCircle } from 'lucide-react';

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
    <div className="bg-cream text-slate-900 selection:bg-slate-200 font-sans min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-cream z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" 
             alt="Contact Us" 
             className="w-full h-full object-cover scale-105"
           />
         </div>
         <div className="relative z-20 text-center px-6 mt-20 animate-in fade-in zoom-in duration-1000 max-w-4xl">
            <span className="text-amber-500 text-sm font-black uppercase tracking-[0.15em] mb-8 block">Dịch vụ Butler 24/7</span>
            <h1 className="text-6xl md:text-[7rem] mb-6 italic text-slate-100 drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên kết <span className="text-amber-500 font-bold not-italic">Tận tâm</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-xs uppercase tracking-[0.15em] max-w-xl mx-auto leading-loose bg-black/10 backdrop-blur-md py-4 px-10 rounded-full border border-white/5">
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
                 <p className="text-slate-500 leading-relaxed text-base font-medium italic font-sans">
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
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center text-amber-500 group-hover:bg-slate-900 group-hover:text-amber-500 transition-luxury shrink-0">
                         <item.icon size={28} strokeWidth={1} />
                      </div>
                      <div>
                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 font-sans">{item.title}</h4>
                         <p className="text-slate-900 font-bold text-sm tracking-wide font-sans">{item.desc}</p>
                      </div>
                   </div>
                 ))}
             </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-12 md:p-16 lg:p-24 rounded-[3rem] shadow-soft relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
             
             {success ? (
               <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 rounded-full border border-amber-500 flex items-center justify-center text-amber-500 mb-10 shadow-lg shadow-amber-500/10">
                     <CheckCircle size={40} strokeWidth={1} />
                  </div>
                  <h3 className="text-4xl font-serif italic mb-4 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Thư đã được gửi</h3>
                  <p className="text-slate-500 font-medium italic mb-12 font-sans">Quản gia của chúng tôi sẽ hồi đáp qua email trong vòng 24 giờ.</p>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="border border-slate-900 text-slate-900 px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-luxury font-sans"
                  >
                    Gửi thêm yêu cầu
                  </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="mb-10 text-center">
                     <h3 className="text-3xl font-serif italic text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Để lại lời nhắn</h3>
                     <p className="text-sm text-slate-500 font-sans">Chúng tôi sẽ hồi đáp qua email hoặc điện thoại trong thời gian sớm nhất.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                        <UserIcon size={18} />
                      </div>
                      <input 
                         required type="text"
                         value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 font-sans shadow-sm"
                         placeholder="Họ và tên quý khách"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input 
                         required type="tel"
                         value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 font-sans shadow-sm"
                         placeholder="Số điện thoại liên lạc"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                       <Mail size={18} />
                     </div>
                     <input 
                        required type="email"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 font-sans shadow-sm"
                        placeholder="Địa chỉ Email"
                     />
                  </div>

                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                       <HelpCircle size={18} />
                     </div>
                     <input 
                        required type="text"
                        value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 font-sans shadow-sm"
                        placeholder="Chủ đề quan tâm (VD: Đặt tiệc, Hủy phòng...)"
                     />
                  </div>

                  <div className="relative group">
                     <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                       <MessageSquare size={18} />
                     </div>
                     <textarea 
                        required rows={4}
                        value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 resize-none font-sans shadow-sm"
                        placeholder="Chi tiết lời nhắn của quý khách..."
                     />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 mt-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30 flex items-center justify-center gap-3 disabled:opacity-50 font-sans active:scale-[0.98]"
                  >
                     {loading ? 'Đang truyền tin...' : <><Send size={16} className="group-hover:translate-x-1 transition-transform" /> Gửi yêu cầu tư vấn</>}
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



