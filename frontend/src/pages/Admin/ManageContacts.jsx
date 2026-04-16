import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Mail, Phone, Clock, CheckCircle, Check, Loader2, MessageSquare, Quote } from 'lucide-react';

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
      popup: 'border border-amber-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(217,119,6,0.15)] backdrop-blur-2xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-gray-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/10 transition-colors'
    }
  });

  const updateStatus = async (id) => {
    const result = await luxurySwal.fire({
      title: 'Kết thúc xử lý?',
      text: "Bạn xác nhận bộ phận CSKH đã thực hiện liên hệ qua số điện thoại hoặc email phản hồi.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đã hoàn tất',
      cancelButtonText: 'Khoan'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/contacts/${id}`, { status: 'Resolved' }); // 'Resolved' là Đã xử lý
        luxurySwal.fire({ icon: 'success', title: 'Thuận lợi!', text: 'Phiên hỗ trợ đã được đóng.', timer: 1500, showConfirmButton: false });
        fetchContacts();
      } catch (err) { 
        luxurySwal.fire('Quá trình lỗi', 'Máy chủ nội bộ chối bỏ kết nối', 'error'); 
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Kết nối cơ sở thư tín</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên hệ <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">& CSKH</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Hộp thư hỗ trợ lưu trữ ý kiến khán giả</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
            <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md relative z-10">{contacts.filter(c => c.status === 'Pending').length}</span>
            <div className="flex flex-col relative z-10">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Phiên hỗ trợ chót</span>
              <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={10} className="animate-pulse" /> Đang đợi</span>
            </div>
          </div>
        </div>
        
        {/* THƯ TÍN LIST */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative p-4 md:p-8">
          <div className="space-y-6 relative z-10">
            {contacts.length > 0 ? contacts.map(contact => (
              <div key={contact.id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8">
                
                {/* Glow nhẹ khi hover */}
                <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* INFO */}
                <div className="md:w-1/4 flex flex-col gap-4 relative z-10 border-b border-white/5 md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 font-black text-xl shadow-lg relative shrink-0">
                      {(contact.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg tracking-wide">{contact.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">Gửi lúc {new Date(contact.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="text-[10px] tracking-widest text-gray-400 flex items-center gap-2 font-bold"><Phone size={12} className="text-amber-500"/> {contact.phone}</span>
                    <span className="text-[10px] tracking-widest text-gray-400 flex items-center gap-2 font-bold break-all"><Mail size={12} className="text-emerald-400"/> {contact.email}</span>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="md:w-2/4 relative z-10 flex flex-col">
                  {contact.subject && <p className="text-sm font-bold text-amber-500 mb-3 tracking-wide">{contact.subject}</p>}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 relative flex-1 text-gray-300 text-sm leading-relaxed italic">
                    <Quote size={20} className="text-amber-500/20 absolute -top-2 -left-2" />
                    "{contact.message}"
                  </div>
                </div>

                {/* STATUS & ACTIONS */}
                <div className="md:w-1/4 relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-white/5 md:border-t-0 pt-6 md:pt-0 gap-4">
                  
                  {contact.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                      <Clock size={12}/> Đang chờ xử lý
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                      <CheckCircle size={12}/> Đã kết thúc
                    </span>
                  )}

                  <div className="mt-4">
                    {contact.status === 'Pending' ? (
                      <button 
                        onClick={() => updateStatus(contact.id)} 
                        className="flex items-center gap-2 px-5 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-500 hover:text-black transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] group/btn"
                      >
                        <Check size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" /> Chốt xử lý
                      </button>
                    ) : (
                      <div className="px-4 py-2 opacity-50">
                        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Hoàn mãn</span>
                      </div>
                    )}
                  </div>
                  
                </div>

              </div>
            )) : (
              <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
                <MessageSquare size={40} className="mx-auto mb-4 text-white/20" />
                <p className="text-gray-400 text-[11px] font-bold tracking-[0.2em] uppercase">Không có thư từ mới</p>
                <p className="text-gray-600 text-[10px] mt-2">Hộp thư hỗ trợ hoàn toàn trống trải.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageContacts;