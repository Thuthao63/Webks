import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, Bed } from 'lucide-react';
import Swal from 'sweetalert2';

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
        text: 'Email hoặc mật khẩu không chính xác.',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Hiệu ứng ánh sáng nền mờ */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(180,130,50,0.05),transparent_50%)]"></div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl">
          
          {/* Logo Khách Sạn */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber-500/30 mb-6">
              <Bed className="text-amber-500 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-2 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đăng Nhập
            </h2>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-[0.4em] font-bold">Uy Nam Luxury Hotel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  required 
                  placeholder="Nhập email của bạn"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-sm text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-xl text-sm text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* QUÊN MẬT KHẨU NẰM DƯỚI Ô INPUT */}
              <div className="flex justify-end pr-1">
                <Link to="/forgot-password" size={16} className="text-[10px] uppercase tracking-widest text-amber-500/50 hover:text-amber-500 transition-colors font-bold">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-4 rounded-xl mt-6 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-amber-600/10 uppercase text-[12px] tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} 
              Đăng Nhập
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              Chưa có tài khoản? 
              <Link to="/register" className="text-amber-500 hover:text-amber-400 ml-2 transition-colors">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;