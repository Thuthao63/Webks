import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { Loader2, RefreshCw, Star, Trash2, Bed, Search, User, MoreVertical, MessageSquareQuote } from 'lucide-react';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    axiosClient.get('/reviews')
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const luxurySwal = Swal.mixin({
    background: '#ffffff',
    color: '#0f172a',
    backdrop: 'rgba(15,23,42,0.4)',
    customClass: {
      popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
      title: 'font-serif italic text-amber-500 text-2xl',
      htmlContainer: 'text-slate-400 text-sm',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all',
      cancelButton: 'bg-slate-50 border border-slate-200 text-slate-900 font-bold uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
    }
  });

  const handleDeleteReview = async (reviewTarget) => {
    const result = await luxurySwal.fire({
      title: `G? b? dánh giá?`,
      text: 'Ðánh giá này s? bi?n m?t vinh vi?n kh?i danh sách công khai.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ð?ng ý xóa',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/reviews/${reviewTarget.id}`);
        luxurySwal.fire({ icon: 'success', title: 'Ðã xóa', timer: 1500, showConfirmButton: false });
        fetchReviews();
      } catch (err) { console.error(err); luxurySwal.fire('Th?t b?i', 'Không th? g? b? dánh giá này', 'error');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={10} strokeWidth={3} className={i < rating ? "text-amber-500 fill-amber-500" : "text-slate-900/10"} />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-slate-500 text-xs tracking-widest uppercase font-bold animate-pulse">Ðang thu th?p ph?n h?i...</p>
    </div>
  );

  return (
    <AdminLayout title="Ðánh giá & Ph?n h?i" subtitle="Ki?m duy?t ch?t lu?ng d?ch v? qua lang kính c?a khách hàng">
      <div className="space-y-8 pb-10">
        
        {/* Header/Stats Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Star size={20} />
             </div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Feedback tích luy</p>
                <p className="text-lg font-serif italic text-slate-900 leading-none mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{reviews.length} dánh giá t? khách luu trú</p>
             </div>
          </div>
          <button onClick={fetchReviews} className="w-full sm:w-auto px-6 py-3 bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={14} /> Làm m?i
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl hover:border-amber-500/10 transition-all duration-500 flex flex-col md:flex-row gap-6 items-start md:items-center">
               
               {/* User Info */}
               <div className="flex items-center gap-4 min-w-[200px]">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-all">
                   <User size={20} />
                 </div>
                 <div>
                   <p className="font-black text-slate-900 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                     {review.reviewer?.fullName || 'Khách vãng lai'}
                   </p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                     {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                   </p>
                 </div>
               </div>

               {/* Room & Rating */}
               <div className="flex flex-col gap-2 min-w-[120px]">
                  <div className="flex items-center gap-2 text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-widest group-hover:border-amber-500/20 transition-colors">
                    <Bed size={14} className="text-amber-500" />
                    P. {review.room?.roomNumber || '---'}
                  </div>
                  <div className="px-3">
                    {renderStars(review.rating)}
                  </div>
               </div>

               {/* Comment */}
               <div className="flex-1 relative">
                  <div className="text-slate-400 text-sm leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "{review.comment}"
                  </div>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-all ml-auto">
                 <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                    <MoreVertical size={16} />
                 </button>
                 <button
                   onClick={() => handleDeleteReview(review)}
                   className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          )) : (
            <div className="py-24 flex flex-col items-center justify-center bg-white border border-slate-100 border-dashed rounded-[3rem]">
              <Search size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">H? th?ng chua ghi nh?n ph?n h?i nào</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageReviews;





