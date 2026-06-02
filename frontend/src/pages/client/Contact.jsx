import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, User as UserIcon, HelpCircle, Star, MoveRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      Swal.fire({
        background: '#0f172a',
        color: '#f8fafc',
        icon: 'error',
        title: t('contact.error_title'),
        text: t('contact.error_msg'),
        confirmButtonColor: '#f59e0b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFCFB] text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans min-h-screen">
      
      {/* 1. HERO BANNER - PARALLAX */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
         <div 
           className="absolute inset-0 z-0"
           style={{ transform: `translateY(${scrollPosition * 0.4}px)` }}
         >
           <img 
             src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2000" 
             alt="Contact Us" 
             className="w-full h-[120%] object-cover scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-[#FDFCFB]"></div>
         </div>
         
         <div className="relative z-10 text-center px-6 mt-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-6 block drop-shadow-md">
              {t('contact.butler_service')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-serif text-white tracking-tight leading-tight">
              {t('contact.connect')} <span className="italic text-amber-400 font-light">{t('contact.dedicated')}</span>
            </h1>
            <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed font-medium">
              {t('contact.hero_desc')}
            </p>
         </div>
      </section>

      <section className="py-24 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto relative z-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* INFO COLUMN */}
          <div className="lg:col-span-5 space-y-16 animate-in fade-in slide-in-from-left-10 duration-1000 mt-4">
             <div className="space-y-6">
                 <div className="flex items-center gap-4 text-amber-500 mb-4">
                     <div className="w-12 h-[1px] bg-amber-500"></div>
                     <span className="text-[10px] uppercase tracking-[0.2em] font-black font-sans">Reach Out</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                   {t('contact.contact_info')} <span className="italic text-amber-600">{t('contact.contact_info_highlight')}</span>
                 </h2>
                 <p className="text-slate-500 leading-loose text-sm font-medium">
                   {t('contact.contact_desc')}
                 </p>
             </div>

             <div className="space-y-10 pt-8 border-t border-slate-100">
                 {[
                   { icon: MapPin, title: t('contact.location'), desc: t('contact.location_desc') },
                   { icon: Phone, title: t('contact.hotline'), desc: t('contact.hotline_desc') },
                   { icon: Mail, title: t('contact.exclusive_email'), desc: "contact@uynam.com" },
                   { icon: Clock, title: t('contact.status'), desc: t('contact.status_desc') }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-500 shrink-0 shadow-sm mt-1">
                         <item.icon size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans group-hover:text-amber-500 transition-colors duration-300">{item.title}</h4>
                         <p className="text-slate-900 font-medium text-sm lg:text-base leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
             </div>
          </div>

          {/* CONTACT FORM - LUXURY DARK CARD */}
          <div className="lg:col-span-7 bg-slate-900 p-8 md:p-14 lg:p-16 rounded-[2.5rem] shadow-[0_30px_60px_rgba(15,23,42,0.15)] relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
             
             {/* Decorative background glows */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             {success ? (
               <div className="h-full flex flex-col items-center justify-center text-center py-24 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-8">
                     <CheckCircle size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-serif text-white mb-4">{t('contact.mail_sent')}</h3>
                  <p className="text-slate-400 font-medium mb-12 text-sm">{t('contact.mail_sent_desc')}</p>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="border border-white/20 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all rounded-full"
                  >
                    {t('contact.send_another')}
                  </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="mb-12">
                     <h3 className="text-3xl font-serif text-white mb-3 flex items-center gap-3">
                       {t('contact.leave_message')} <Star size={18} className="text-amber-500" />
                     </h3>
                     <p className="text-xs text-slate-400 uppercase tracking-widest">{t('contact.leave_message_desc')}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 md:gap-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                        <UserIcon size={16} />
                      </div>
                      <input 
                         required type="text"
                         value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-2 focus:outline-none focus:border-amber-500 transition-all text-sm text-white placeholder-slate-600 font-sans"
                         placeholder={t('contact.placeholder_name')}
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                        <Phone size={16} />
                      </div>
                      <input 
                         required type="tel"
                         value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-2 focus:outline-none focus:border-amber-500 transition-all text-sm text-white placeholder-slate-600 font-sans"
                         placeholder={t('contact.placeholder_phone')}
                      />
                    </div>
                  </div>

                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                       <Mail size={16} />
                     </div>
                     <input 
                        required type="email"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-2 focus:outline-none focus:border-amber-500 transition-all text-sm text-white placeholder-slate-600 font-sans"
                        placeholder={t('contact.placeholder_email')}
                     />
                  </div>

                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                       <HelpCircle size={16} />
                     </div>
                     <input 
                        required type="text"
                        value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-2 focus:outline-none focus:border-amber-500 transition-all text-sm text-white placeholder-slate-600 font-sans"
                        placeholder={t('contact.placeholder_subject')}
                     />
                  </div>

                  <div className="relative group pt-2">
                     <div className="absolute top-3 left-0 pl-1 flex items-start pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                       <MessageSquare size={16} />
                     </div>
                     <textarea 
                        required rows={3}
                        value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-8 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-sm text-white placeholder-slate-600 resize-none font-sans"
                        placeholder={t('contact.placeholder_message')}
                     />
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={loading}
                      type="submit"
                      className="group relative flex items-center justify-center gap-4 bg-amber-500 text-slate-900 w-full md:w-auto px-10 py-4 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-70"
                    >
                       <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                       {loading ? (
                         <span className="relative z-10 text-[10px] font-black uppercase tracking-widest">{t('contact.sending')}</span>
                       ) : (
                         <>
                           <span className="relative z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300">
                             {t('contact.submit_btn')}
                           </span>
                           <MoveRight size={14} className="relative z-10 -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500" />
                         </>
                       )}
                    </button>
                  </div>
               </form>
             )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
