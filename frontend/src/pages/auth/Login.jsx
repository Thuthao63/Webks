/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AuthLayout from './AuthLayout';
import loginBg from '../../assets/auth/login-bg.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', formData);
      login(res.data.user, res.data.token);

      Swal.fire({
        icon: 'success',
        title: t('auth.login_success'),
        text: t('auth.welcome_back_user', { name: res.data.user.fullName }),
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#d97706',
        timer: 1500,
        showConfirmButton: false,
      });

      if (res.data.user.role?.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('auth.login_error'),
        text: err.response?.data?.message || t('auth.email_pass_incorrect'),
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
      title={t('auth.welcome_back')}
      subtitle={t('auth.login_subtitle')}
      image={loginBg}
      imageAlt="Luxury Hotel Lobby"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.email_label')}</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={14} />
            <input
              name="email"
              type="email"
              required
              placeholder={t('auth.email_placeholder')}
              autoComplete="username"
              className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 px-4 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </motion.div>

        {/* Mật khẩu */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">{t('auth.password_label')}</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={14} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder={t('auth.password_placeholder')}
              autoComplete="current-password"
              className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 pr-10 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-[9px] uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors font-bold">
              {t('auth.forgot_password')}
            </Link>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black py-3 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] uppercase text-[10px] tracking-widest"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <LogIn size={14} />}
          {t('auth.login_btn')}
        </motion.button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          {t('auth.no_account')}
          <Link to="/register" className="text-amber-500 hover:text-amber-400 ml-1.5 transition-colors font-black uppercase underline decoration-amber-500/30 underline-offset-4">{t('auth.register')}</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;

