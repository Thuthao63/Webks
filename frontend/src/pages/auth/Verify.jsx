import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import AuthLayout from './AuthLayout';
import registerBg from '../../assets/auth/register-bg.png';

const Verify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "Email của bạn";

  // Focus ô đầu tiên khi load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Chỉ nhận số
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý nút Backspace để quay lại ô trước
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;

    setLoading(true);
    try {
      await axiosClient.post('/auth/verify', { email, otp: otpCode });
      Swal.fire({ 
        icon: 'success', 
        title: 'Xác thực thành công!', 
        text: 'Chào mừng bạn đến với Uy Nam Luxury.', 
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#d97706',
        timer: 2000 
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn.',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      // Giả sử backend dùng chung Route register để gửi lại OTP
      await axiosClient.post('/auth/register', { email, resendOnly: true }); 
      Swal.fire({
         icon: 'success',
         title: 'Đã gửi lại mã',
         text: 'Vui lòng kiểm tra hộp thư đến của bạn.',
         background: '#0a0a0a',
         color: '#fff',
         confirmButtonColor: '#d97706',
      });
    } catch (err) {
      // Xử lý lỗi nếu cần
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Xác Thực Danh Tính"
      subtitle={`Một mã OTP 6 chữ số đã được gửi tới ${email}`}
      image={registerBg}
      imageAlt="Luxury Hotel Registration"
    >
      <form onSubmit={handleVerify} className="space-y-10">
        <div className="flex justify-between gap-2 md:gap-4">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.4 }}
              className="flex-1 max-w-[60px]"
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                maxLength={1}
                className="w-full h-16 bg-white/5 border border-white/10 text-center text-2xl font-bold text-amber-500 rounded-xl focus:border-amber-500/50 focus:bg-white/10 outline-none transition-all shadow-inner"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-6"
        >
            <button 
                type="submit" 
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-black font-bold py-4 rounded-lg transition-all duration-300 uppercase text-[12px] tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-amber-600/10"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><ShieldCheck size={18} /> Kích hoạt đặc quyền</>}
            </button>

            <div className="text-center space-y-4">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                    Không nhận được mã? 
                    <button 
                        type="button" 
                        onClick={handleResend}
                        disabled={resending}
                        className="text-amber-500 hover:text-amber-400 ml-2 transition-colors inline-flex items-center gap-1"
                    >
                        {resending ? <RefreshCw className="animate-spin" size={12} /> : "Gửi lại ngay"}
                    </button>
                </p>
                <Link to="/register" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider font-bold">
                    <ArrowLeft size={14} /> Thay đổi Email
                </Link>
            </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Verify;