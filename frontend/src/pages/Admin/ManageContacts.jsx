import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Mail, Phone, Clock, CheckCircle, Check, Loader2, MessageSquare, Quote, MoreVertical } from 'lucide-react';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = () => {
    setLoading(true);
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

  const updateStatus = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Xác nhận xử lý?',
      text: "Bạn xác nhận bộ phận CSKH đã phản hồi và giải quyết yêu cầu này.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đã hoàn tất',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/contacts/${id}`, { status: 'Resolved' });
        luxurySwal.fire({ icon: 'success', title: 'Thành công', timer: 1500, showConfirmButton: false });
        fetchContacts();
      } catch (err) { 
        luxurySwal.fire('Thất bại', 'Máy chủ không phản hồi yêu cầu cập nhật.', 'error'); 
      }
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang đồng bộ hộp thư tin nhắn...</p>
    </div>
  );

  return (
    <AdminLayout title="Hộp thư & Hỗ trợ" subtitle="Trung tâm tiếp nhận ý kiến, yêu cầu hỗ trợ và khiếu nại từ khách hàng">
      <div className="space-y-8 pb-10">
        
        {/* Header Stats Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl">
          <div className="flex items-center gap-6 pl-2">
             <div className="flex items-center gap-2">
                <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {contacts.filter(c => c.status === 'Pending').length}
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Tin mới</span>
                  <span className="text-[8px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={8} /> Chờ xử lý</span>
                </div>
             </div>
             <div className="h-8 w-px bg-white/5" />
             <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tổng lưu trữ</p>
                <p className="text-lg font-serif italic text-white leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{contacts.length} hội thoại</p>
             </div>
          </div>
          <button onClick={fetchContacts} className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
            <RefreshCw size={14} /> Làm mới hộp thư
          </button>
        </div>

        {/* Message List */}
        <div className="space-y-6">
          {contacts.length > 0 ? contacts.map(contact => (
            <div key={contact.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-xl hover:border-white/10 transition-all duration-500 flex flex-col lg:flex-row gap-8 overflow-hidden">
               
               {/* Contact Profiling */}
               <div className="lg:w-1/4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 font-black text-xl group-hover:scale-110 transition-transform duration-500">
                      {(contact.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-white text-lg tracking-tight group-hover:text-amber-500 transition-colors uppercase">{contact.name}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">ID #{contact.id.toString().slice(-4)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                     <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold bg-white/5 p-2 rounded-xl border border-white/5 group-hover:border-amber-500/10 transition-colors">
                        <Phone size={12} className="text-amber-600" /> {contact.phone}
                     </div>
                     <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold bg-white/5 p-2 rounded-xl border border-white/5 group-hover:border-emerald-500/10 transition-colors break-all">
                        <Mail size={12} className="text-emerald-600" /> {contact.email}
                     </div>
                  </div>
               </div>

               {/* Message Body */}
               <div className="lg:w-2/4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Hạng mục hỗ trợ</p>
                     <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">{new Date(contact.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  {contact.subject && <h4 className="text-lg font-black text-white group-hover:text-amber-500 transition-colors line-clamp-1">{contact.subject}</h4>}
                  <div className="relative bg-white/[0.01] border border-white/5 p-6 rounded-3xl italic text-gray-400 text-sm leading-relaxed group-hover:bg-white/[0.02] transition-colors flex-1">
                     <Quote size={24} className="text-amber-500/5 absolute -top-2 -left-2" />
                     "{contact.message}"
                  </div>
               </div>

               {/* Actions & Status */}
               <div className="lg:w-1/4 flex flex-col items-center lg:items-end justify-center gap-6">
                  {contact.status === 'Pending' ? (
                    <div className="flex flex-col items-center lg:items-end gap-6">
                       <span className="px-4 py-2 bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                          Chờ tiếp nhận
                       </span>
                       <button 
                         onClick={() => updateStatus(contact.id)}
                         className="flex items-center gap-2 px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20"
                       >
                          <Check size={16} strokeWidth={3} /> Chốt hồ sơ
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center lg:items-end gap-4 opacity-50">
                       <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                          Đã hoàn mãn
                       </span>
                       <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                          <CheckCircle size={24} className="text-gray-800" />
                       </div>
                    </div>
                  )}
                  <button className="hidden lg:block p-2 text-gray-800 hover:text-white transition-colors">
                     <MoreVertical size={20} />
                  </button>
               </div>

            </div>
          )) : (
            <div className="py-24 flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 border-dashed rounded-[3rem]">
              <MessageSquare size={48} className="text-gray-800 mb-4" />
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Hộp thư hiện đang trống trải</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageContacts;