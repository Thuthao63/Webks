import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "Email của bạn";

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/auth/verify', { email, otp });
      Swal.fire({ icon: 'success', title: 'Xác thực thành công!', text: 'Chào mừng bạn đến với Uy Nam Luxury.', timer: 2000 });
      navigate('/login');
    } catch (err) {
      Swal.fire('Lỗi', 'Mã xác thực không chính xác', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="bg-[#111] p-10 rounded-[2rem] border border-amber-900/20 text-center max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl font-serif text-white mb-2 italic">Xác Thực Tài Khoản</h2>
        <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Gửi đến: <span className="text-amber-500">{email}</span></p>
        
        <form onSubmit={handleVerify}>
          <input type="text" maxLength="6" placeholder="------" className="w-full bg-black border border-amber-900/20 p-5 text-center text-3xl tracking-[0.3em] text-amber-500 rounded-2xl outline-none focus:border-amber-500 mb-8 font-bold"
            onChange={(e) => setOtp(e.target.value)} required />
          
          <button type="submit" className="w-full bg-amber-500 hover:bg-white text-black font-black py-4 rounded-2xl transition-all duration-500 uppercase text-xs tracking-[0.2em]">
            Kích hoạt ngay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;