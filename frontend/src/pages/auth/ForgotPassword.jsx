import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend cần có Route: router.post('/forgot-password', authController.forgotPassword);
      await axiosClient.post('/auth/forgot-password', { email });
      Swal.fire('Thành công', 'Vui lòng kiểm tra Email để nhận liên kết đặt lại mật khẩu!', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Lỗi', 'Email không tồn tại trong hệ thống', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md bg-[#111] p-10 rounded-2xl border border-amber-900/20 text-center">
        <h2 className="text-3xl font-serif italic text-white mb-4">Quên Mật Khẩu</h2>
        <p className="text-gray-500 text-sm mb-8">Nhập email của bạn, chúng tôi sẽ giúp bạn lấy lại quyền truy cập.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Địa chỉ Email" required className="w-full bg-black border border-amber-900/20 p-4 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
            onChange={(e) => setEmail(e.target.value)} />
          
          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-white transition-all">
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;