import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/auth/reset-password', { token, newPassword });
      Swal.fire('Thành công', 'Mật khẩu đã được thay đổi. Hãy đăng nhập lại!', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Lỗi', 'Liên kết đã hết hạn hoặc không hợp lệ', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form onSubmit={handleReset} className="w-full max-w-md bg-[#111] p-10 rounded-2xl border border-amber-900/20 shadow-2xl">
        <h2 className="text-3xl font-serif italic text-white text-center mb-8">Mật Khẩu Mới</h2>
        <input type="password" placeholder="Nhập mật khẩu mới" required className="w-full bg-black border border-amber-900/20 p-4 rounded-xl text-sm focus:border-amber-500 outline-none mb-6"
          onChange={(e) => setNewPassword(e.target.value)} />
        
        <button type="submit" className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl">
          CẬP NHẬT MẬT KHẨU
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;