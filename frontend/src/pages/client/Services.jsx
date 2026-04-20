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
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B59A6D]/5 rounded-full blur-[100px]"></div>
        <Loader2 className="animate-spin text-[#B59A6D] relative z-10" size={48} />
        <p className="text-[#B59A6D] text-[10px] tracking-[0.5em] font-black uppercase animate-pulse relative z-10">Đang chuẩn bị dịch vụ</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] text-slate-900 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-[#F9F8F6] z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Spa & Services" 
            className="w-full h-full object-cover scale-105 hover:scale-100 transition-luxury duration-[3000ms]"
          />
        </div>

        <div className="relative z-20 text-center px-6 mt-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
           <div className="flex justify-center mb-10 transition-luxury hover:scale-110">
              <Gem size={40} className="text-[#B59A6D] drop-shadow-lg" strokeWidth={1} />
           </div>
           <h1 className="text-5xl md:text-8xl mb-6 italic text-slate-100 drop-shadow-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
             Trải nghiệm <br/> <span className="text-[#B59A6D] font-bold not-italic">Đặc quyền</span>
           </h1>
           <p className="text-slate-300 text-[10px] md:text-xs uppercase tracking-[0.6em] max-w-xl mx-auto leading-loose bg-black/10 backdrop-blur-sm py-4 px-8 rounded-full border border-white/5">
             Chuỗi dịch vụ chăm sóc cao cấp cho tâm hồn và thể chất.
           </p>
        </div>
      </section>

      {/* 2. DỊCH VỤ LIST */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#B59A6D]/5 rounded-full blur-[200px] -z-10 -mr-96 -mt-96"></div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="group relative bg-white border border-slate-100 hover:border-[#B59A6D]/30 p-12 rounded-[3rem] shadow-premium hover:shadow-2xl transition-luxury flex flex-col justify-between"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                   <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 group-hover:scale-[1.5] transition-luxury">
                      <Sparkles size={100} className="text-[#B59A6D]" />
                   </div>

                   <div className="space-y-8">
                       <div className="flex items-center gap-2">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className="text-[#B59A6D]" fill="currentColor" />
                           ))}
                       </div>
                       <div>
                          <h3 className="text-3xl font-serif italic mb-4 text-slate-900 group-hover:text-[#B59A6D] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {service.name}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                              "{service.description || 'Dịch vụ cao cấp được thiết kế riêng biệt để đáp ứng kỳ vọng khắt khe nhất của quý khách.'}"
                          </p>
                       </div>
                   </div>
                   
                   <div className="pt-10 mt-10 border-t border-slate-50 flex justify-between items-center text-right">
                       <div className="flex flex-col w-full">
                           <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black mb-2 italic">Phí dịch vụ ưu đãi</span>
                           <span className="text-[#B59A6D] font-serif italic text-3xl">
                              {Number(service.price).toLocaleString()} <span className="text-[10px] not-italic uppercase font-sans font-black tracking-widest text-slate-300 ml-2">VNĐ</span>
                           </span>
                       </div>
                   </div>
                </div>
            ))}
         </div>

          {services.length === 0 && (
            <div className="text-center py-40 border border-slate-100 bg-white rounded-[4rem] shadow-premium max-w-2xl mx-auto">
               <Loader2 size={40} className="text-[#B59A6D]/20 mx-auto mb-8" />
               <p className="text-slate-500 font-serif italic text-2xl">Đang chuẩn bị các dịch vụ đặc biệt dành cho quý khách.</p>
            </div>
          )}
      </section>

      {/* 3. CTA */}
      <section className="py-56 px-6 border-t border-slate-50 text-center relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B59A6D]/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
               Khám phá <span className="text-[#B59A6D] not-italic font-bold">Thế giới Đặc quyền</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base italic leading-relaxed font-medium">
               Mọi yêu cầu của quý khách đều được chúng tôi trân trọng và thực hiện với tâm thế chuyên nghiệp nhất. Để thuận tiện, quý khách có thể liên hệ lễ tân bất cứ lúc nào.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/contact')} 
                className="group inline-flex items-center gap-6 bg-slate-900 hover:bg-[#B59A6D] text-white px-14 py-6 text-[11px] font-black uppercase tracking-[0.4em] transition-luxury rounded-full shadow-2xl shadow-slate-900/10 active:scale-95"
              >
                 <PhoneCall size={18} className="group-hover:rotate-12 transition-transform duration-500" /> Liên hệ Tư vấn
              </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Services;

