import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Mail, Lock, Phone, User, Eye, EyeOff, ArrowRight, Bed, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

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
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-12">
      {/* Hiệu ứng ánh sáng nền mờ đồng bộ với trang Login */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(180,130,50,0.05),transparent_60%)]"></div>

      {/* Độ rộng chuẩn 480px để bằng với khung Login */}
      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber-500/30 mb-6">
              <Bed className="text-amber-500 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-2 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đăng Ký
            </h2>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-[0.4em] font-bold">Tạo tài khoản Uy Nam Luxury Hotel</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Họ và tên */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Họ và tên</label>
              <InputGroup 
                icon={<User size={18}/>} 
                placeholder="Nhập họ và tên" 
                onChange={(val) => setFormData({...formData, fullName: val})} 
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Số điện thoại</label>
              <InputGroup 
                icon={<Phone size={18}/>} 
                placeholder="Nhập số điện thoại" 
                onChange={(val) => setFormData({...formData, phone: val})} 
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Địa chỉ Email</label>
              <InputGroup 
                icon={<Mail size={18}/>} 
                type="email" 
                placeholder="email@example.com" 
                onChange={(val) => setFormData({...formData, email: val})} 
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input 
                  type={showPass ? "text" : "password"} 
                  placeholder="Nhập mật khẩu" 
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-xl text-sm text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold ml-1">Xác nhận mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  placeholder="Nhập lại mật khẩu" 
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-xl text-sm text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors">
                  {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-4 rounded-xl mt-6 transition-all duration-300 uppercase text-[12px] tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-amber-600/10"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Đăng Ký Tài Khoản <ArrowRight size={18}/></>}
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              Đã có tài khoản? 
              <Link to="/login" className="text-amber-500 hover:text-amber-400 ml-2 transition-colors font-black">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con hỗ trợ Input
const InputGroup = ({ icon, type = "text", placeholder, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors">
      {icon}
    </div>
    <input 
      type={type} 
      placeholder={placeholder} 
      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-sm text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-gray-600"
      onChange={(e) => onChange(e.target.value)} 
      required 
    />
  </div>
);

export default Register;