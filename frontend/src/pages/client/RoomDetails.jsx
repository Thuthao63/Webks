import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Star, Maximize, Users, Bed, Loader2, ArrowRight, Check, User, Quote, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, reviewRes, discountRes] = await Promise.all([
                    axiosClient.get(`/rooms/${roomId}`),
                    axiosClient.get(`/reviews/${roomId}`),
                    axiosClient.get('/discounts/active')
                ]);
                const roomData = roomRes.data;
                setRoom(roomData);
                setReviews(reviewRes.data);

                // Tìm khuyến mãi cho hạng phòng này
                const activeDiscount = (discountRes.data || []).find(d => 
                    d.roomTypeId === (roomData.roomType?.id || roomData.typeId)
                );
                setDiscount(activeDiscount);
            } catch (err) {
                console.error("Lỗi lấy chi tiết phòng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roomId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error("Vui lòng đăng nhập để đánh giá");
        if (reviewForm.rating === 0) return toast.error("Vui lòng chọn số sao");
        
        setSubmittingReview(true);
        try {
            const res = await axiosClient.post('/reviews', {
                roomId: parseInt(roomId),
                userId: user.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            toast.success(res.data.message || "Đánh giá thành công!");
            
            // Xóa form và cập nhật lại danh sách đánh giá
            setReviewForm({ rating: 0, comment: '' });
            const reviewRes = await axiosClient.get(`/reviews/${roomId}`);
            setReviews(reviewRes.data);
            
        } catch (error) {
            console.error("Lỗi gửi đánh giá:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? "text-amber-500 fill-amber-500" : "text-slate-100"} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]"></div>
                <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center flex-col gap-8">
                <p className="text-slate-900 text-xl font-serif italic font-sans">Không tìm thấy thông tin phòng.</p>
                <button onClick={() => navigate('/rooms')} className="bg-slate-900 text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-luxury shadow-lg font-sans">Quay lại danh mục</button>
            </div>
        );
    }

    const details = room.roomType || room.typeDetails || {};

    return (
        <div className="min-h-screen bg-cream text-slate-900 pt-44 pb-32 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto relative z-10">
                <button 
                  onClick={() => navigate('/rooms')} 
                  className="group flex items-center gap-4 text-slate-400 hover:text-amber-500 transition-luxury mb-16 text-sm font-black uppercase tracking-[0.1em] font-sans"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> Quay lại danh mục
                </button>

                {/* HEADER & HÌNH ẢNH */}
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32">
                    
                    <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-amber-500 uppercase tracking-[0.15em] text-xs font-black italic font-sans">
                                <Star size={14} fill="currentColor" /> Luxury Collection
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif italic text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Phòng <span className="text-amber-500 not-italic">{room.roomNumber}</span>
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium italic font-sans">
                                {details.description || 'Trải nghiệm không gian sống tiện nghi với những trang bị tân tiến, thiết kế nội thất sang trọng mang đậm dấu ấn Uy Nam.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium">
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-3 font-sans"><Users size={16} className="text-amber-500" /> Khách</span>
                                <span className="text-xs uppercase font-black text-slate-800 font-sans">{details.capacity || 2} Khách</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-3 font-sans"><Maximize size={16} className="text-amber-500" /> Diện tích</span>
                                <span className="text-xs uppercase font-black text-slate-800 font-sans">45 m²</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-3 font-sans"><Bed size={16} className="text-amber-500" /> Giường</span>
                                <span className="text-xs uppercase font-black text-slate-800 font-sans">1 King Size</span>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-[0.1em] font-black mb-3 italic flex items-center gap-2 font-sans">
                                    Mức phí lưu trú tiêu chuẩn
                                    {discount && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[8px] animate-pulse font-sans">-{Math.floor(discount.discountPercent)}% OFF</span>}
                                </p>
                                <div className="flex items-baseline gap-4">
                                    {discount && (
                                        <p className="text-xl text-slate-300 line-through font-serif italic font-sans" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {Number(details.price || 0).toLocaleString()}
                                        </p>
                                    )}
                                    <p className="text-5xl text-amber-500 font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {(Number(details.price || 0) * (discount ? (1 - discount.discountPercent / 100) : 1)).toLocaleString()}
                                        <span className="text-xs text-slate-400 not-italic uppercase font-black tracking-widest ml-4 font-sans">VNĐ / ĐÊM</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/booking/${room.id}`)}
                                disabled={room.status !== 'Available'}
                                className={`w-full py-6 font-black uppercase text-sm tracking-[0.1em] transition-luxury flex items-center justify-center gap-6 rounded-2xl shadow-premium font-sans ${
                                    room.status === 'Available' 
                                    ? 'bg-slate-900 text-white hover:bg-amber-500 hover:shadow-2xl shadow-slate-900/10 active:scale-95' 
                                    : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                }`}
                            >
                                {room.status === 'Available' ? (
                                    <>Xác nhận Đặt phòng <ArrowRight size={18} /></>
                                ) : 'Hiện phòng đang bận'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-7 rounded-[3rem] overflow-hidden border border-slate-100 shadow-premium relative h-[450px] lg:h-[650px] animate-in fade-in slide-in-from-right-10 duration-1000 group">
                        <img
                            src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                            className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110 font-sans"
                            alt={`Room ${room.roomNumber}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 flex flex-wrap gap-4">
                            <span className="bg-white/90 backdrop-blur-md px-6 py-3 text-xs font-black uppercase tracking-widest text-amber-500 rounded-xl border border-white/20 flex items-center gap-3 shadow-xl font-sans">
                                <ShieldCheck size={16} /> Dịch vụ Butler riêng
                            </span>
                            <span className="bg-white/90 backdrop-blur-md px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-900 rounded-xl border border-white/20 flex items-center gap-3 shadow-xl font-sans">
                                <Check size={16} className="text-amber-500" /> Toàn bộ tiện nghi cao cấp
                            </span>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐÁNH GIÁ (REVIEWS) */}
                <section className="bg-white rounded-[4rem] p-16 md:p-24 border border-slate-100 shadow-premium">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-50 pb-12 mb-16 gap-10">
                        <div className="space-y-6">
                            <span className="text-amber-500 text-sm font-black uppercase tracking-[0.15em] block font-sans">Đánh giá từ Khách hàng</span>
                            <h3 className="text-5xl md:text-7xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Cảm hứng <span className="not-italic text-amber-500">lưu trú</span>
                            </h3>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-black italic flex items-center gap-3 font-sans">
                                <Users size={16} className="text-amber-500" />
                                {reviews.length > 0 ? `Tổng hợp từ ${reviews.length} đánh giá thực tế` : 'Chưa có đánh giá nào cho phòng này'}
                            </p>
                        </div>
                        {reviews.length > 0 && (
                            <div className="bg-slate-50 px-10 py-8 rounded-[2rem] border border-slate-100 flex items-center gap-8 shadow-sm">
                                <span className="text-6xl text-amber-500 font-serif italic leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <div className="border-l border-amber-500/20 pl-8 space-y-2">
                                    {renderStars(Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length))}
                                    <span className="text-xs uppercase text-slate-400 font-black tracking-widest block">Xếp hạng tuyệt đối</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="relative bg-cream p-8 rounded-3xl border border-slate-50 hover:border-amber-500/30 transition-luxury group shadow-sm hover:shadow-xl">
                                <Quote className="absolute top-6 right-6 text-amber-500/10 group-hover:text-amber-500/20 transition-luxury" size={40} strokeWidth={1} />
                                
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 font-black text-lg shadow-xl group-hover:scale-105 transition-luxury font-sans">
                                            {(review.reviewer?.fullName || 'G').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-[0.15em] text-sm text-slate-900 font-sans">{review.reviewer?.fullName || 'Khách hàng'}</p>
                                            <p className="text-sm text-slate-400 uppercase tracking-widest font-black mt-0.5 italic font-sans">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {renderStars(review.rating)}
                                        <p className="text-slate-600 italic leading-relaxed text-sm font-medium font-sans">"{review.comment}"</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-cream border border-dashed border-slate-200 rounded-[3rem]">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                                    <Star size={40} className="text-amber-500/20" />
                                </div>
                                <p className="text-slate-400 uppercase tracking-[0.1em] font-black text-xs italic font-sans">Hãy trở thành người đầu tiên chia sẻ cảm nhận</p>
                            </div>
                        )}
                    </div>

                    {/* FORM VIẾT ĐÁNH GIÁ */}
                    <div className="mt-16 pt-16 border-t border-slate-100">
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="bg-cream p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                                <h4 className="text-2xl font-serif italic text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Chia sẻ trải nghiệm của bạn
                                </h4>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 font-sans">Đánh giá sao</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={28}
                                                className={`cursor-pointer transition-colors ${
                                                    star <= (hoverRating || reviewForm.rating) 
                                                    ? 'text-amber-500 fill-amber-500' 
                                                    : 'text-slate-300 hover:text-slate-400'
                                                }`}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 font-sans">Nội dung đánh giá</label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Chúng tôi rất mong nghe cảm nhận về trải nghiệm lưu trú của bạn..."
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-sm md:text-base text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all min-h-[120px] resize-y font-sans placeholder:text-slate-400"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={submittingReview || reviewForm.rating === 0}
                                        className={`px-10 py-5 text-xs font-black uppercase tracking-widest rounded-xl transition-luxury flex items-center gap-3 shadow-lg font-sans ${
                                            (submittingReview || reviewForm.rating === 0) 
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                            : 'bg-slate-900 text-white hover:bg-amber-500 hover:shadow-amber-500/20'
                                        }`}
                                    >
                                        {submittingReview ? <Loader2 size={16} className="animate-spin" /> : 'Gửi Đánh Giá'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-cream p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                                <p className="text-slate-600 mb-6 italic leading-loose text-base font-medium font-sans">
                                    Bạn cần đăng nhập để có thể chia sẻ cảm nhận về phòng này.
                                </p>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="px-10 py-4 mb-4 text-xs font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white hover:bg-amber-500 transition-luxury shadow-lg font-sans"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoomDetails;



