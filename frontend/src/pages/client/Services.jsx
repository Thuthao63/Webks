import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Loader2, Gem, PhoneCall, Star, MoveRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// High quality unsplash images for services
const SERVICE_IMAGES = [
  "https://cdn1729.cdn4s4.io.vn/media/tin-tuc/z4141659616501_be154ba334142268050a95d0fd70565d.jpg",
  "https://tiemgiatsheep.com/wp-content/uploads/2023/04/tiem-giat-ui-1.jpg"
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    axiosClient.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error("Lỗi lấy danh sách dịch vụ:", err))
      .finally(() => setLoading(false));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} strokeWidth={1} />
        <p className="text-amber-500 text-[10px] tracking-[0.2em] font-black uppercase animate-pulse relative z-10 font-sans">{t('services_page.preparing')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] text-slate-900 min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">

      {/* 1. HERO BANNER - PARALLAX EFFECT */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollPosition * 0.4}px)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Services Hero"
            className="w-full h-[120%] object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-[#FDFCFB]"></div>
        </div>

        <div className="relative z-10 text-center px-6 mt-24 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm animate-pulse-slow">
              <Gem size={28} className="text-amber-400" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-serif text-white tracking-tight leading-tight">
            {t('services_page.hero_experience')} <span className="italic text-amber-400 font-light">{t('services_page.hero_privilege')}</span>
          </h1>
          <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed font-medium">
            {t('services_page.hero_desc')}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent"></div>
        </div>
      </section>

      {/* 2. ZIG-ZAG SERVICES LIST (EDITORIAL STYLE) */}
      <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto relative z-20">
        <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="space-y-32 md:space-y-40">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            const imageSrc = SERVICE_IMAGES[idx % SERVICE_IMAGES.length];

            return (
              <div
                key={service.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}
              >
                {/* Image Container */}
                <div className="w-full lg:w-1/2 relative overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] aspect-[4/5] lg:aspect-square">
                  <img
                    src={imageSrc}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>

                {/* Text Container */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-8 px-4 lg:px-0">
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-amber-500">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black font-sans">0{idx + 1}</span>
                    <div className="w-12 h-[1px] bg-amber-500"></div>
                    <Star size={14} />
                  </div>

                  <div>
                    <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight group-hover:text-amber-600 transition-colors duration-500">
                      {service.name}
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base leading-loose font-medium max-w-lg mx-auto lg:mx-0">
                      {service.description || t('services_page.default_desc')}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex flex-col items-center lg:items-start gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black font-sans">{t('services_page.fee_label')}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-amber-500 font-serif text-3xl md:text-4xl">
                        {Number(service.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-widest text-slate-300 font-sans">
                        {t('services_page.currency')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-40 border border-slate-100 bg-white rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] max-w-2xl mx-auto">
            <Loader2 size={40} className="text-amber-500/30 mx-auto mb-8 animate-spin" strokeWidth={1} />
            <p className="text-slate-500 font-sans text-xl font-medium">{t('services_page.loading_msg')}</p>
          </div>
        )}
      </section>

      {/* 3. CTA - DARK ELEGANT SECTION */}
      <section className="py-32 px-6 bg-slate-900 text-center relative overflow-hidden mt-12">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
            {t('services_page.cta_explore')} <br />
            <span className="italic font-light text-amber-400">{t('services_page.cta_world')}</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-loose font-medium">
            {t('services_page.cta_desc')}
          </p>
          <div className="flex justify-center pt-8">
            <button
              onClick={() => navigate('/contact')}
              className="group relative flex items-center justify-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-amber-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <PhoneCall size={18} className="relative z-10 group-hover:text-white group-hover:rotate-12 transition-all duration-500" />
              <span className="relative z-10 text-[11px] font-black uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                {t('services_page.contact_consult')}
              </span>
              <MoveRight size={16} className="relative z-10 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 group-hover:text-white transition-all duration-500" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;



