import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Shield, Trash2, Mail, Phone, CheckCircle, XCircle, User, MoreVertical, History, Package } from 'lucide-react';
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
    background: '#ffffff',
    color: '#0f172a',
    backdrop: 'rgba(15,23,42,0.4)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-slate-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold  tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
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

  const handleViewHistory = async (userTarget) => {
    try {
      Swal.fire({ title: 'Đang tải dữ liệu...', didOpen: () => Swal.showLoading() });
      const res = await axiosClient.get(`/bookings/user/${userTarget.id}`);
      const history = res.data;
      
      if (!history || history.length === 0) {
        return luxurySwal.fire('Chưa có lịch sử', `${userTarget.fullName} chưa thực hiện bất kỳ giao dịch đặt phòng nào.`, 'info');
      }

      // Xây dựng giao diện danh sách
      const historyHtml = `
        <div class="max-h-80 overflow-y-auto mt-4 text-left font-sans admin-scrollbar">
          ${history.map(b => `
            <div class="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <div class="flex justify-between items-start mb-2">
                 <p class="text-sm font-black text-slate-800">Đơn #${b.id}</p>
                 <span class="text-[9px] font-bold  tracking-widest px-2 py-1 rounded-md ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}">
                   ${b.status === 'completed' ? 'Hoàn tất' : b.status === 'cancelled' ? 'Đã hủy' : b.status === 'confirmed' ? 'Đã cọc' : 'Chờ duyệt'}
                 </span>
              </div>
              <p class="text-xs font-bold text-slate-700">Phòng ${b.room?.roomNumber || '---'} (Tiêu chuẩn Luxury)</p>
              <p class="text-[10px] text-slate-500 mt-1">Từ ${new Date(b.checkInDate).toLocaleDateString('vi-VN')} đến ${new Date(b.checkOutDate).toLocaleDateString('vi-VN')}</p>
              <p class="text-[11px] font-black text-amber-600 mt-2">${Number(b.totalPrice).toLocaleString()} VNĐ</p>
            </div>
          `).join('')}
        </div>
      `;

      luxurySwal.fire({
        title: `Lịch sử đặt phòng`,
        html: historyHtml,
        showConfirmButton: true,
        confirmButtonText: 'Đóng lại',
        customClass: { popup: 'rounded-[2rem] border border-slate-100 shadow-xl' }
      });

    } catch (err) {
      luxurySwal.fire('Lỗi', 'Không thể lấy dữ liệu lịch sử đặt phòng', 'error');
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-slate-500 text-[10px] tracking-[0.3em]  font-bold animate-pulse">Đang liệt kê hồ sơ...</p>
    </div>
  );

  return (
    <AdminLayout title="Quản trị tài khoản" subtitle="Phân quyền hệ thống, quản lý thông tin khách hàng & nhân sự">
      <div className="space-y-8 pb-10">
        
        {/* User Stats/Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-6 pl-2">
             <div className="flex -space-x-3">
                {users.slice(0, 5).map((u, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[10px] font-black  text-slate-900">
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
                <p className="text-[10px] text-slate-500 font-bold  tracking-widest">Tổng hồ sơ định danh</p>
                <p className="text-lg font-serif italic text-slate-900 leading-none mt-1">{users.length} tài khoản người dùng</p>
             </div>
          </div>
          
          <button onClick={fetchUsers} className="w-full sm:w-auto px-6 py-3 bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold  tracking-widest">
            <RefreshCw size={14} className="hover:animate-spin" />
            Làm mới danh sách
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500  font-bold tracking-[0.2em] border-b border-slate-100 bg-slate-50/50 font-sans">
                <tr>
                  <th className="px-8 py-6">Nhân vật & Liên hệ</th>
                  <th className="px-6 py-6">Bộ phận / Chức vụ</th>
                  <th className="px-6 py-6">Định danh Email</th>
                  <th className="px-8 py-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(userItem => (
                  <tr key={userItem.id} className="group hover:bg-slate-50/50 font-sans transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200 transition-all font-medium text-sm shadow-sm">
                          {(userItem.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                             <span className="font-semibold text-slate-800 text-[15px] group-hover:text-amber-600 transition-colors capitalize">
                               {(userItem.fullName || '').toLowerCase()}
                             </span>
                             {currentUser?.id === userItem.id && <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full  font-bold tracking-widest shadow-sm">Bạn</span>}
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500">
                             <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400"/> {userItem.email}</span>
                             {userItem.phone && <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4"><Phone size={12} className="text-slate-400"/> {userItem.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <select 
                          className={`bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-black  tracking-widest outline-none cursor-pointer hover:bg-slate-100 transition-all ${userItem.role === 'Admin' ? 'text-rose-400' : userItem.role === 'Receptionist' ? 'text-amber-400' : 'text-emerald-400'}`}
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
                          <span className="inline-flex items-center gap-2 text-emerald-400 text-[9px] font-black  tracking-widest">
                             <CheckCircle size={12} /> <span className="opacity-60">Đã xác thực</span>
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-2 text-rose-400 text-[9px] font-black  tracking-widest animate-pulse">
                             <XCircle size={12} /> <span className="opacity-60">Chưa xác thực</span>
                          </span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => handleViewHistory(userItem)}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all"
                            title="Lịch sử đặt phòng"
                         >
                            <History size={16} />
                         </button>
                         <button 
                            disabled={currentUser?.id === userItem.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                         >
                            <Shield size={16} />
                         </button>
                         <button 
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={currentUser?.id === userItem.id}
                            className={`p-2.5 rounded-xl border transition-all ${currentUser?.id === userItem.id ? 'opacity-20 bg-slate-50 border-slate-100 text-slate-500' : 'bg-rose-500/5 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-black'}`}
                         >
                            <Trash2 size={16} />
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
