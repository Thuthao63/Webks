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
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-1.5"
        >
          <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Địa chỉ Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
            <input 
              name="email"
              type="email" 
              required 
              placeholder="guest@luxury.com"
              autoComplete="email"
              className="w-full bg-white/[0.02] border border-white/10 p-4 pl-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-lg transition-all duration-300 uppercase text-[12px] tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-amber-600/10"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Gửi yêu cầu</>}
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-12"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider font-bold">
          <ArrowLeft size={14} /> Quay lại trang đăng nhập
        </Link>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;