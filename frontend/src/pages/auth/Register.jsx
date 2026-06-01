/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Mail, Lock, Phone, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AuthLayout from './AuthLayout';
import registerBg from '../../assets/auth/register-bg.png';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: t('auth.pass_mismatch'),
        text: t('auth.check_confirm_pass'),
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    }

    setLoading(true);
    try {
      await axiosClient.post('/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: t('auth.register_success'),
        text: t('auth.otp_sent'),
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#d97706',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('auth.register_error'),
        text: err.response?.data?.message || t('auth.cannot_create_account'),
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.join_exclusive')}
      subtitle={t('auth.register_subtitle')}
      image={registerBg}
      imageAlt="Luxury Hotel Exterior"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name & Phone - Grid on larger mobile, stacked on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.fullname_label')}</label>
            <InputGroup 
              name="fullName"
              icon={<User size={14}/>} 
              placeholder={t('auth.fullname_placeholder')} 
              autoComplete="name"
              onChange={(val) => setFormData({...formData, fullName: val})} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.phone_label')}</label>
            <InputGroup 
              name="phone"
              icon={<Phone size={14}/>} 
              placeholder={t('auth.phone_placeholder')} 
              autoComplete="tel"
              onChange={(val) => setFormData({...formData, phone: val})} 
            />
          </motion.div>
        </div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.email_label')}</label>
          <InputGroup 
            name="email"
            icon={<Mail size={14}/>} 
            type="email" 
            placeholder={t('auth.email_placeholder')} 
            autoComplete="email"
            onChange={(val) => setFormData({...formData, email: val})} 
          />
        </motion.div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.password_label')}</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={14} />
              <input 
                name="password"
                type={showPass ? "text" : "password"} 
                placeholder={t('auth.password_placeholder')} 
                autoComplete="new-password"
                className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 pr-10 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors">
                {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.confirm_label')}</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={14} />
              <input 
                name="confirmPassword"
                type={showConfirmPass ? "text" : "password"} 
                placeholder={t('auth.password_placeholder')} 
                autoComplete="new-password"
                className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 pr-10 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors">
                {showConfirmPass ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.button 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black py-3 rounded-xl mt-6 transition-all duration-300 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <>{t('auth.create_account_btn')} <ArrowRight size={14}/></>}
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.9 }}
        className="text-center mt-8"
      >
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          {t('auth.has_account')} 
          <Link to="/login" className="text-amber-500 hover:text-amber-400 ml-1.5 transition-colors font-black uppercase underline decoration-amber-500/30 underline-offset-4">{t('auth.login_btn')}</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

const InputGroup = ({ icon, type = "text", placeholder, name, autoComplete, onChange }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
      {icon}
    </div>
    <input 
      name={name}
      type={type} 
      placeholder={placeholder} 
      autoComplete={autoComplete}
      className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 px-4 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
      onChange={(e) => onChange(e.target.value)} 
      required 
    />
  </div>
);

export default Register;


