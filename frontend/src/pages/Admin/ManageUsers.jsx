import React, { useState, useEffect, useContext } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Shield, Trash2, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext); // Lấy admin đang đăng nhập để không cho tự xóa

  const fetchUsers = () => {
    setLoading(true);
    axiosClient.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const luxurySwal = Swal.mixin({
    background: '#0a0a0ae6',
    color: '#fff',
    backdrop: 'rgba(0,0,0,0.8)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(217,119,6,0.15)] backdrop-blur-2xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-gray-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/10 transition-colors'
    }
  });

  const handleChangeRole = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;
    try {
      await axiosClient.put(`/users/${userId}/role`, { role: newRole });
      luxurySwal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: `Đã thay đổi bộ phận thành: ${newRole}`,
        timer: 1500,
        showConfirmButton: false
      });
      fetchUsers();
    } catch (err) {
      luxurySwal.fire('Lỗi hệ thống', err.response?.data?.message || 'Quá trình cập nhật thất bại', 'error');
    }
  };

  const handleDeleteUser = async (userTarget) => {
    if (currentUser?.id === userTarget.id) {
       return luxurySwal.fire('Cảnh báo', 'Bạn không thể tự xóa chính mình!', 'warning');
    }

    const result = await luxurySwal.fire({
      title: `Xóa hồ sơ: ${userTarget.fullName}?`,
      text: 'Nếu đã có dữ liệu đặt phòng, hệ thống sẽ ngăn chặn thao tác này.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Quay lại'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/users/${userTarget.id}`);
        luxurySwal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: `Đã xóa hồ sơ: ${userTarget.fullName}`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchUsers();
      } catch (err) {
        luxurySwal.fire('Thao tác từ chối', err.response?.data?.message || 'Không thể xóa hồ sơ này!', 'error');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Tải Dữ Liệu</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background glow toàn trang */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* THANH ĐIỀU HƯỚNG Admin */}
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Tài khoản</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Phân quyền, kiểm duyệt & quản trị hồ sơ lưu trú</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl">
            <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md">{users.length}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Tổng hồ sơ</span>
              <span onClick={fetchUsers} className="cursor-pointer hover:text-amber-400 transition-colors text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 border-none"><RefreshCw size={10} className="hover:animate-spin" /> Đồng bộ</span>
            </div>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="overflow-x-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse border-spacing-y-3" style={{borderCollapse: 'separate'}}>
              <thead className="text-gray-400 uppercase text-[9px] font-black tracking-[0.2em]">
                <tr>
                  <th className="p-6 whitespace-nowrap pl-10">Tài khoản & Liên hệ</th>
                  <th className="p-6 text-center whitespace-nowrap">Chức vụ</th>
                  <th className="p-6 text-center whitespace-nowrap">Trạng thái xác minh</th>
                  <th className="p-6 text-center whitespace-nowrap pr-10">Thao tác</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {users.length > 0 ? users.map(userItem => (
                  <tr key={userItem.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01]">
                    
                    {/* INFO */}
                    <td className="p-5 pl-8 rounded-l-[2rem] border-y border-l border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(217,119,6,0.3)] relative overflow-hidden group-hover:scale-110 transition-transform">
                          <div className="absolute inset-0 bg-white/20 blur-sm"></div>
                          <span className="relative z-10">{(userItem.fullName || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-black text-white text-base tracking-wide group-hover:text-amber-400 transition-colors drop-shadow-sm flex items-center gap-2">
                            {userItem.fullName}
                            {currentUser?.id === userItem.id && <span className="text-[8px] bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Bạn</span>}
                          </p>
                          <div className="flex items-center gap-4 mt-1.5 opacity-60">
                            <span className="flex items-center gap-1.5 text-[10px] text-gray-300 tracking-wider">
                               <Mail size={10} /> {userItem.email}
                            </span>
                            {userItem.phone && (
                                <span className="flex items-center gap-1.5 text-[10px] text-gray-300 tracking-wider">
                                   <Phone size={10} /> {userItem.phone}
                                </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE SELECTOR */}
                    <td className="p-5 text-center border-y border-white/5 group-hover:border-white/10">
                       <select 
                          className={`bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] uppercase font-bold tracking-widest outline-none cursor-pointer hover:bg-white/10 transition-colors ${userItem.role === 'Admin' ? 'text-rose-400' : userItem.role === 'Receptionist' ? 'text-amber-400' : 'text-emerald-400'}`}
                          value={userItem.role}
                          onChange={(e) => handleChangeRole(userItem.id, e.target.value, userItem.role)}
                          disabled={currentUser?.id === userItem.id}
                       >
                           <option className="bg-black text-emerald-400" value="Customer">Khách hàng</option>
                           <option className="bg-black text-amber-400" value="Receptionist">Lễ tân</option>
                           <option className="bg-black text-rose-400" value="Admin">Quản trị viên</option>
                       </select>
                    </td>

                    {/* STATUS VERIFIED */}
                    <td className="p-5 text-center border-y border-white/5 group-hover:border-white/10">
                       {userItem.isVerified ? (
                          <span className="inline-flex items-center justify-center gap-1.5 text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                             <CheckCircle size={12} /> Đã chuẩn hóa
                          </span>
                       ) : (
                          <span className="inline-flex items-center justify-center gap-1.5 text-rose-400 border border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.1)] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                             <XCircle size={12} /> Chờ Email
                          </span>
                       )}
                    </td>

                    {/* ACTION THAO TÁC */}
                    <td className="p-5 pr-8 text-center rounded-r-[2rem] border-y border-r border-white/5 group-hover:border-white/10">
                      <div className="flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                         <button 
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={currentUser?.id === userItem.id}
                            className={`w-10 h-10 flex items-center justify-center border rounded-2xl transition-all duration-300 ${currentUser?.id === userItem.id ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/10 text-gray-500' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-black hover:shadow-[0_0_15px_rgba(251,113,133,0.4)]'}`}
                            title="Xóa hồ sơ"
                         >
                            <Trash2 size={18} strokeWidth={2}/>
                         </button>
                      </div>
                    </td>

                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                      <div className="flex flex-col items-center opacity-50">
                        <Loader2 size={32} className="text-gray-400 mb-4 animate-spin-slow" />
                        <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Chưa có dữ liệu khởi tạo</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
