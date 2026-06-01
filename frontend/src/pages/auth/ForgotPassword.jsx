/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import AuthLayout from './AuthLayout';
import loginBg from '../../assets/auth/login-bg.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend Route: router.post('/forgot-password', authController.forgotPassword);
      await axiosClient.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'success',
        title: 'Yêu cầu đã được gửi',
        text: 'Vui lòng kiểm tra Email để nhận liên kết đặt lại mật khẩu!',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#d97706',
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.response?.data?.message || 'Email không tồn tại trong hệ thống',
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
      title="Khôi Phục Mật Khẩu"
      subtitle="Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn để bạn lấy lại quyền truy cập."
      image={loginBg}
      imageAlt="Luxury Hotel Lobby"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-1.5"
        >
          <label className="text-[9px] uppercase tracking-widest text-amber-500/80 font-black ml-1">Địa chỉ Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={14} />
            <input 
              name="email"
              type="email" 
              required 
              placeholder="guest@luxury.com"
              autoComplete="email"
              className="w-full bg-slate-900/60 border border-slate-800 py-3 pl-9 px-4 rounded-xl text-xs text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-slate-600"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black py-3 rounded-xl mt-6 transition-all duration-300 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Gửi yêu cầu</>}
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors text-[10px] uppercase tracking-widest font-bold">
          <ArrowLeft size={12} /> Quay lại trang đăng nhập
        </Link>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;

