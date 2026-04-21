import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Mail, Lock, Phone, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import AuthLayout from './AuthLayout';
import registerBg from '../../assets/auth/register-bg.png';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Mật khẩu không khớp',
        text: 'Vui lòng kiểm tra lại mật khẩu xác nhận.',
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
        title: 'Đăng ký thành công',
        text: 'Mã xác thực OTP đã được gửi đến Email của bạn.',
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
        title: 'Lỗi đăng ký',
        text: err.response?.data?.message || 'Không thể tạo tài khoản lúc này.',
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
      title="Gia Nhập Đặc Quyền"
      subtitle="Trở thành thành viên để nhận những ưu đãi và dịch vụ thượng lưu nhất."
      image={registerBg}
      imageAlt="Luxury Hotel Exterior"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name & Phone - Grid on larger mobile, stacked on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Họ và tên</label>
            <InputGroup 
              name="fullName"
              icon={<User size={16}/>} 
              placeholder="Nguyễn Văn A" 
              autoComplete="name"
              onChange={(val) => setFormData({...formData, fullName: val})} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Số điện thoại</label>
            <InputGroup 
              name="phone"
              icon={<Phone size={16}/>} 
              placeholder="0901234567" 
              autoComplete="tel"
              onChange={(val) => setFormData({...formData, phone: val})} 
            />
          </motion.div>
        </div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Địa chỉ Email</label>
          <InputGroup 
            name="email"
            icon={<Mail size={16}/>} 
            type="email" 
            placeholder="guest@luxury.com" 
            autoComplete="email"
            onChange={(val) => setFormData({...formData, email: val})} 
          />
        </motion.div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
              <input 
                name="password"
                type={showPass ? "text" : "password"} 
                placeholder="••••••••" 
                autoComplete="new-password"
                className="w-full bg-white/[0.02] border border-white/10 p-3.5 pl-12 pr-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-amber-500/70 font-bold ml-1">Xác nhận</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
              <input 
                name="confirmPassword"
                type={showConfirmPass ? "text" : "password"} 
                placeholder="••••••••" 
                autoComplete="new-password"
                className="w-full bg-white/[0.02] border border-white/10 p-3.5 pl-12 pr-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors">
                {showConfirmPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.button 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-lg mt-6 transition-all duration-300 uppercase text-[12px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-amber-600/10"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Khởi tạo tài khoản <ArrowRight size={16}/></>}
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.9 }}
        className="text-center mt-10"
      >
        <p className="text-gray-500 text-[11px] uppercase tracking-wider">
          Đã có tài khoản thành viên? 
          <Link to="/login" className="text-amber-500 hover:text-amber-400 ml-2 transition-colors font-black text-[12px] uppercase">Đăng nhập</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

const InputGroup = ({ icon, type = "text", placeholder, name, autoComplete, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors">
      {icon}
    </div>
    <input 
      name={name}
      type={type} 
      placeholder={placeholder} 
      autoComplete={autoComplete}
      className="w-full bg-white/[0.02] border border-white/10 p-3.5 pl-12 rounded-lg text-sm text-white focus:border-amber-500/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700"
      onChange={(e) => onChange(e.target.value)} 
      required 
    />
  </div>
);

export default Register;