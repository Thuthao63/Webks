import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Loader2, Gem, Sparkles, PhoneCall, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axiosClient.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error("Lỗi lấy danh sách dịch vụ:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
        <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Đang tải Dịch vụ</p>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Spa & Services" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="relative z-20 text-center px-6 mt-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
           <div className="flex justify-center mb-6">
              <Gem size={32} className="text-amber-500 opacity-80" strokeWidth={1} />
           </div>
           <h1 className="text-5xl md:text-7xl mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
             Trải nghiệm <br/> <span className="text-amber-500 font-bold not-italic">Đặc quyền</span>
           </h1>
           <p className="text-gray-300 text-[10px] md:text-xs uppercase tracking-[0.4em] max-w-xl mx-auto leading-loose">
             Chuỗi dịch vụ chăm sóc cao cấp mang đến sự thư giãn tuyệt đối cho tâm hồn và thể chất.
           </p>
        </div>
      </section>

      {/* 2. DỊCH VỤ LIST */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[150px] -z-10"></div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="group relative bg-[#0a0a0a] border border-white/5 hover:border-amber-500/30 p-8 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(217,119,6,0.1)] transition-all duration-500 flex flex-col justify-between"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                      <Sparkles size={60} className="text-amber-500" />
                   </div>

                   <div>
                       <div className="flex items-center gap-2 mb-6">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className="text-amber-500" fill="currentColor" />
                           ))}
                       </div>
                       <h3 className="text-2xl font-serif italic mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {service.name}
                       </h3>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Dịch vụ cao cấp được thiết kế riêng biệt nhằm đáp ứng nhu cầu hoàn hảo nhất trải nghiệm lưu trú của quý khách.
                       </p>
                   </div>
                   
                   <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                       <div className="flex flex-col">
                           <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Mức phí</span>
                           <span className="text-amber-500 font-black text-xl">
                              {Number(service.price).toLocaleString()} <span className="text-xs uppercase">vnđ</span>
                           </span>
                       </div>
                   </div>
                </div>
            ))}
         </div>

         {services.length === 0 && (
            <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-3xl">
               <p className="text-gray-400 font-serif italic text-xl">Hiện chưa có dịch vụ nào được cấu hình.</p>
            </div>
         )}
      </section>

      {/* 3. CTA */}
      <section className="py-32 px-6 border-t border-white/5 text-center">
         <h2 className="text-3xl md:text-5xl font-serif italic mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sẵn sàng tận hưởng dịch vụ?
         </h2>
         <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-sm">
            Để quá trình phục vụ được chu đáo nhất, quý khách có thể liên hệ Lễ tân qua hotline ngay tại phòng nghỉ hoặc để lại lời nhắn.
         </p>
         <button 
           onClick={() => navigate('/contact')} 
           className="inline-flex items-center gap-3 bg-amber-600 hover:bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-full"
         >
            <PhoneCall size={16} /> Liên hệ Tư vấn
         </button>
      </section>

    </div>
  );
};

export default Services;
