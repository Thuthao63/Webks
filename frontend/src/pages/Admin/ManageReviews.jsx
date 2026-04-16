import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Star, Trash2, Bed, Search, User } from 'lucide-react';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    axiosClient.get('/reviews')
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

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

  const handleDeleteReview = async (reviewTarget) => {
    const result = await luxurySwal.fire({
      title: `Gỡ bỏ đánh giá?`,
      text: 'Đánh giá này sẽ bị xóa khỏi hệ thống và không hiển thị trên trang chủ phòng nữa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Quay lại'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/reviews/${reviewTarget.id}`);
        luxurySwal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: `Đã xóa đánh giá thành công.`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchReviews();
      } catch (err) {
        luxurySwal.fire('Thao tác từ chối', err.response?.data?.message || 'Không thể xóa đánh giá này!', 'error');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className={i < rating ? "text-amber-400 fill-amber-400" : "text-white/10"} />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
      <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse relative z-10">Đang Tải Đánh Giá</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Background glow toàn trang */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* THANH ĐIỀU HƯỚNG Admin */}
        <AdminNav />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quản lý <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Đánh giá</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold">Kiểm duyệt chất lượng & phản hồi từ khách hàng</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl">
            <span className="text-4xl font-serif italic text-amber-500 leading-none drop-shadow-md">{reviews.length}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Tổng Feedback</span>
              <span onClick={fetchReviews} className="cursor-pointer hover:text-amber-400 transition-colors text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 border-none"><RefreshCw size={10} className="hover:animate-spin" /> Đồng bộ</span>
            </div>
          </div>
        </div>

        {/* BẢNG ĐÁNH GIÁ (Dạng danh sách Card ngang) */}
        <div className="space-y-4">
           {reviews.length > 0 ? reviews.map(review => (
               <div key={review.id} className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg hover:shadow-[0_10px_40px_rgba(217,119,6,0.15)] hover:border-amber-500/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                     
                     {/* THÔNG TIN NGƯỜI ĐÁNH GIÁ */}
                     <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                           <User size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-white text-base group-hover:text-amber-400 transition-colors drop-shadow-sm">
                              {review.reviewer?.fullName || 'Khách ẩn danh'}
                           </p>
                           <span className="flex items-center gap-1.5 text-[10px] text-gray-500 tracking-wider mt-1 uppercase font-bold">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                           </span>
                        </div>
                     </div>

                     {/* THÔNG TIN PHÒNG VÀ SAO */}
                     <div className="flex flex-col items-start gap-2 min-w-[150px]">
                         <div className="flex items-center gap-2 text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-bold text-xs shadow-inner">
                            <Bed size={14} className="text-amber-500" />
                            Phòng {review.room?.roomNumber || '---'}
                         </div>
                         <div className="mt-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                            {renderStars(review.rating)}
                         </div>
                     </div>

                     {/* NỘI DUNG ĐÁNH GIÁ */}
                     <div className="flex-1 text-sm text-gray-300 italic px-4 border-l border-white/10">
                        "{review.comment}"
                     </div>

                     {/* NÚT XÓA */}
                     <div className="ml-auto pl-4 border-l border-white/10">
                        <button 
                           onClick={() => handleDeleteReview(review)}
                           className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl hover:bg-rose-500 hover:text-black hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] transition-all duration-300"
                           title="Xóa đánh giá này"
                        >
                           <Trash2 size={16} strokeWidth={2}/>
                        </button>
                     </div>

                  </div>
               </div>
           )) : (
              <div className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-16">
                  <Search size={40} className="text-gray-500 mb-4 opacity-50" />
                  <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Chưa có đánh giá nào</span>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default ManageReviews;
