import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Mail, Phone, Clock, CheckCircle, Check, Loader2, MessageSquare } from 'lucide-react';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = () => {
    setLoading(true);
    // Lưu ý: Sửa lại đường dẫn /contacts cho đúng với API backend của Thảo nhé
    axiosClient.get('/contacts')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setContacts(sorted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, []);

  const luxurySwal = Swal.mixin({
    background: '#0a0a0a',
    color: '#fff',
    customClass: {
      popup: 'border border-amber-500/20 rounded-3xl',
      title: 'font-serif italic text-amber-500',
      confirmButton: 'bg-amber-500 text-black font-bold uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-amber-400 transition-colors',
      cancelButton: 'bg-white/10 text-white font-bold uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-white/20 transition-colors'
    }
  });

  const updateStatus = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Đã xử lý liên hệ?',
      text: "Xác nhận bạn đã gọi điện hoặc phản hồi email cho khách hàng này.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đã phản hồi',
      cancelButtonText: 'Đóng'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/contacts/${id}`, { status: 'Resolved' }); // 'Resolved' là Đã xử lý
        luxurySwal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Liên hệ đã được đánh dấu là Đã xử lý.', timer: 1500, showConfirmButton: false });
        fetchContacts();
      } catch (err) { 
        luxurySwal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error'); 
      }
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang tải hộp thư</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 pt-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <AdminNav />

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="text-amber-500 not-italic font-sans font-black uppercase text-2xl ml-2 tracking-wider">Liên hệ</span>
            </h2>
            <p className="text-gray-500 text-xs mt-3 tracking-[0.3em] uppercase font-bold">Hộp thư hỗ trợ và tư vấn khách hàng</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="text-3xl font-serif italic text-amber-500 leading-none">{contacts.filter(c => c.status === 'Pending').length}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tin nhắn mới</span>
          </div>
        </div>
        
        <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.02] border-b border-white/5 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="p-6 whitespace-nowrap">Khách hàng</th>
                  <th className="p-6 whitespace-nowrap min-w-[250px]">Nội dung tin nhắn</th>
                  <th className="p-6 text-center whitespace-nowrap">Thời gian</th>
                  <th className="p-6 text-center whitespace-nowrap">Trạng thái</th>
                  <th className="p-6 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.length > 0 ? contacts.map(contact => (
                  <tr key={contact.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 font-black shadow-lg">
                          {(contact.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-amber-500 transition-colors">{contact.name}</p>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[10px] tracking-wider text-gray-400 flex items-center gap-1"><Phone size={10}/> {contact.phone}</span>
                            <span className="text-[10px] tracking-wider text-gray-500 flex items-center gap-1"><Mail size={10}/> {contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative">
                        <MessageSquare size={14} className="text-amber-500/50 absolute top-4 right-4" />
                        {contact.subject && <p className="text-xs font-bold text-amber-500 mb-1">{contact.subject}</p>}
                        <p className="text-sm text-gray-300 italic">"{contact.message}"</p>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <p className="text-xs text-gray-400 font-medium">{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</p>
                      <p className="text-[10px] text-gray-500">{new Date(contact.createdAt).toLocaleTimeString('vi-VN')}</p>
                    </td>

                    <td className="p-6 text-center">
                      {contact.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 border-amber-500/30 bg-amber-500/10">
                          <Clock size={12}/> Chờ xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                          <CheckCircle size={12}/> Đã phản hồi
                        </span>
                      )}
                    </td>

                    <td className="p-6">
                      <div className="flex items-center justify-center">
                        {contact.status === 'Pending' ? (
                          <button 
                            onClick={() => updateStatus(contact.id)} 
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-black transition-all duration-300 text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check size={14} strokeWidth={3}/> Phản hồi xong
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-600 italic">Không khả dụng</span>
                        )}
                      </div>
                    </td>

                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500 text-sm italic border-t border-white/5">
                      Hộp thư trống. Chưa có tin nhắn nào từ khách hàng.
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

export default ManageContacts;