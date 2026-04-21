import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import AuthLayout from './AuthLayout';
import loginBg from '../../assets/auth/login-bg.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
        title: 'Đăng nhập thành công',
        text: `Chào mừng ${res.data.user.fullName} quay trở lại!`,
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
        title: 'Lỗi đăng nhập',
        text: err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.',
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
      title="Chào Mừng Trở Lại"
      subtitle="Đăng nhập để trải nghiệm không gian nghỉ dưỡng đẳng cấp bậc nhất."
      image={loginBg}
      imageAlt="Luxury Hotel Lobby"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
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
              placeholder="email@luxury.com"
              autoComplete="username"
              className="w-full bg-white/[0.02] border border-white/10 p-3.5 pl-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
        </motion.div>

        {/* Mật khẩu */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-1.5"
        >
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold">Mật khẩu</label>
            <Link to="/forgot-password" global="true" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-amber-500 transition-colors">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
            <input 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-white/[0.02] border border-white/10 p-3.5 pl-12 pr-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit" 
          disabled={loading} 
          className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-lg mt-4 flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-amber-600/10 uppercase text-[12px] tracking-wider"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} 
          Đăng Nhập
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-10"
      >
        <p className="text-gray-500 text-[11px] uppercase tracking-wider">
          Nếu chưa có tài khoản? 
          <Link to="/register" className="text-amber-500 hover:text-amber-400 ml-2 transition-colors font-black uppercase text-[12px]">Khám phá & Đăng ký</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;