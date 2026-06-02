import React, { useState } from 'react';
import { X, Send, Phone, Mail, UserCheck, MessageSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const ContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await axiosClient.post('/contacts', data);

      Swal.fire({
        background: '#0a0a0ae6',
        color: '#fff',
        icon: 'success',
        title: t('contact_fab.success_title'),
        text: t('contact_fab.success_msg'),
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'border border-amber-500/20 rounded-[2rem] shadow-2xl backdrop-blur-3xl'
        }
      });
      setIsOpen(false);
      e.target.reset();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: t('contact_fab.error_title'),
        text: t('contact_fab.error_msg'),
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
        aria-label={t('contact_fab.open_assistant')}
        className="fixed bottom-8 right-8 z-[9999] rounded-full p-4 bg-slate-900 text-amber-500 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-slate-800"
      >
        <MessageSquare size={24} />
      </button>

      {/* --- MODAL CHAT SANG TRỌNG --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsOpen(false)}></div>

          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-20 bg-slate-50 p-2 rounded-full">
              <X size={20} />
            </button>

            <div className="overflow-y-auto custom-scrollbar p-8 sm:p-10">
              <div className="text-center mb-8 relative">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                   <MessageSquare className="text-amber-500" size={28} />
                </div>
                <h3 className="text-xl font-medium font-sans text-slate-900 mb-2">{t('contact_fab.send_message')}</h3>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t('contact_fab.leave_info')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black ml-2 group-focus-within:text-amber-600 transition-colors">{t('contact_fab.your_name')}</label>
                    <input name="name" type="text" placeholder={t('contact_fab.placeholder_name')} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900 font-medium placeholder-slate-300" />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black ml-2 group-focus-within:text-amber-600 transition-colors">{t('contact_fab.phone')}</label>
                    <input name="phone" type="tel" placeholder={t('contact_fab.placeholder_phone')} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900 font-medium placeholder-slate-300" />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black ml-2 group-focus-within:text-amber-600 transition-colors">{t('contact_fab.email_address')}</label>
                  <input name="email" type="email" placeholder={t('contact_fab.placeholder_email')} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900 font-medium placeholder-slate-300" />
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black ml-2 group-focus-within:text-amber-600 transition-colors">{t('contact_fab.consult_content')}</label>
                  <textarea name="message" rows="3" placeholder={t('contact_fab.placeholder_message')} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-all resize-none text-slate-900 font-medium placeholder-slate-300"></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2">
                  {loading ? t('contact_fab.connecting') : t('contact_fab.send_to_butler')} <Send size={14} />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center items-center gap-8 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-2 hover:text-amber-600 transition-colors cursor-pointer"><Phone size={14} /> 090 123 456</div>
                <div className="flex items-center gap-2 hover:text-amber-600 transition-colors cursor-pointer"><Mail size={14} /> Concierge@uynam.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactFab;
