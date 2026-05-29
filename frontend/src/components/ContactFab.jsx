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
      // SỬA LỖI: Endpoint đúng là /contacts thay vì /auth/contact
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
        className="fixed bottom-8 right-8 z-50 rounded-full p-3 bg-[#0a0a0a] text-amber-500 shadow-soft hover:translate-y-[-2px] transition-transform"
      >
        <MessageSquare size={24} />
      </button>

      {/* --- MODAL CHAT SANG TRỌNG --- */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)}></div>

          <div className="relative bg-white w-full max-w-md rounded-xl shadow-soft overflow-hidden z-10">
            <div className="p-6">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500">
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-slate-900 mb-1">{t('contact_fab.send_message')}</h3>
                <p className="text-sm text-slate-500">{t('contact_fab.leave_info')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-black ml-4">{t('contact_fab.your_name')}</label>
                    <input name="name" type="text" placeholder={t('contact_fab.placeholder_name')} required className="w-full border border-gray-200 p-3 rounded-md text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-black ml-4">{t('contact_fab.phone')}</label>
                    <input name="phone" type="tel" placeholder={t('contact_fab.placeholder_phone')} className="w-full border border-gray-200 p-3 rounded-md text-sm outline-none focus:border-amber-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-gray-600 uppercase tracking-widest font-medium ml-1">{t('contact_fab.email_address')}</label>
                  <input name="email" type="email" placeholder={t('contact_fab.placeholder_email')} required className="w-full border border-gray-200 p-3 rounded-md text-sm outline-none focus:border-amber-500" />
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-gray-600 uppercase tracking-widest font-medium ml-1">{t('contact_fab.consult_content')}</label>
                  <textarea name="message" rows="4" placeholder={t('contact_fab.placeholder_message')} required className="w-full border border-gray-200 p-3 rounded-md text-sm outline-none focus:border-amber-500 resize-none"></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold">
                  {loading ? t('contact_fab.connecting') : t('contact_fab.send_to_butler')}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                <div className="mb-2">090 123 456</div>
                <div>Concierge@uynam.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactFab;
