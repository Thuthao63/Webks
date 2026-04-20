import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Shield, Trash2, Mail, Phone, CheckCircle, XCircle, User, MoreVertical } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

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
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-gray-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors'
    }
  });

  const handleChangeRole = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;
    try {
      await axiosClient.put(`/users/${userId}/role`, { role: newRole });
      luxurySwal.fire({ icon: 'success', title: 'Cập nhật thành công', timer: 1500, showConfirmButton: false });
      fetchUsers();
    } catch (err) {
      luxurySwal.fire('Thất bại', err.response?.data?.message || 'Không thể thay đổi phân quyền', 'error');
    }
  };

  const handleDeleteUser = async (userTarget) => {
    if (currentUser?.id === userTarget.id) {
       return luxurySwal.fire('Cảnh báo', 'Bạn không thể tự xóa chính mình!', 'warning');
    }

    const result = await luxurySwal.fire({
      title: `Xóa tài khoản?`,
      text: `Bạn đang chuẩn bị gỡ bỏ hồ sơ của ${userTarget.fullName}. Thao tác này không thể hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/users/${userTarget.id}`);
        luxurySwal.fire({ icon: 'success', title: 'Đã gỡ bỏ', timer: 1500, showConfirmButton: false });
        fetchUsers();
      } catch (err) {
        luxurySwal.fire('Bị từ chối', err.response?.data?.message || 'Hồ sơ này có dữ liệu ràng buộc, không thể xóa.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang liệt kê hồ sơ...</p>
    </div>
  );

  return (
    <AdminLayout title="Quản trị tài khoản" subtitle="Phân quyền hệ thống, quản lý thông tin khách hàng & nhân sự">
      <div className="space-y-8 pb-10">
        
        {/* User Stats/Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl">
          <div className="flex items-center gap-6 pl-2">
             <div className="flex -space-x-3">
                {users.slice(0, 5).map((u, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[10px] font-black uppercase text-white">
                    {u.fullName?.charAt(0)}
                  </div>
                ))}
                {users.length > 5 && (
                  <div className="w-9 h-9 rounded-full border-2 border-black bg-amber-500 flex items-center justify-center text-[10px] font-black text-black">
                    +{users.length - 5}
                  </div>
                )}
             </div>
             <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tổng hồ sơ định danh</p>
                <p className="text-lg font-serif italic text-white leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{users.length} tài khoản người dùng</p>
             </div>
          </div>
          
          <button onClick={fetchUsers} className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <RefreshCw size={14} className="hover:animate-spin" />
            Làm mới danh sách
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                <tr>
                  <th className="px-8 py-6">Nhân vật & Liên hệ</th>
                  <th className="px-6 py-6">Bộ phận / Chức vụ</th>
                  <th className="px-6 py-6">Định danh Email</th>
                  <th className="px-8 py-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(userItem => (
                  <tr key={userItem.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-all font-black text-lg">
                          {(userItem.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-wide">
                               {userItem.fullName}
                             </span>
                             {currentUser?.id === userItem.id && <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Bạn</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-600 font-medium">
                             <span className="flex items-center gap-1"><Mail size={10}/> {userItem.email}</span>
                             {userItem.phone && <span className="flex items-center gap-1 border-l border-white/5 pl-3"><Phone size={10}/> {userItem.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <select 
                          className={`bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white/10 transition-all ${userItem.role === 'Admin' ? 'text-rose-400' : userItem.role === 'Receptionist' ? 'text-amber-400' : 'text-emerald-400'}`}
                          value={userItem.role}
                          onChange={(e) => handleChangeRole(userItem.id, e.target.value, userItem.role)}
                          disabled={currentUser?.id === userItem.id}
                       >
                           <option className="bg-black text-emerald-400" value="Customer">Khách hàng</option>
                           <option className="bg-black text-amber-400" value="Receptionist">Lễ tân</option>
                           <option className="bg-black text-rose-400" value="Admin">Quản trị</option>
                       </select>
                    </td>
                    <td className="px-6 py-5">
                       {userItem.isVerified ? (
                          <span className="inline-flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                             <CheckCircle size={12} /> <span className="opacity-60">Đã xác thực</span>
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-2 text-rose-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
                             <XCircle size={12} /> <span className="opacity-60">Chưa xác thực</span>
                          </span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                         <button 
                            disabled={currentUser?.id === userItem.id}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                         >
                            <Shield size={16} />
                         </button>
                         <button 
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={currentUser?.id === userItem.id}
                            className={`p-2.5 rounded-xl border transition-all ${currentUser?.id === userItem.id ? 'opacity-20 bg-white/5 border-white/5 text-gray-500' : 'bg-rose-500/5 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-black'}`}
                         >
                            <Trash2 size={16} />
                         </button>
                         <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                             <MoreVertical size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageUsers;