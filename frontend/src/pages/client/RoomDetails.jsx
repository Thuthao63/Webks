import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Star, Maximize, Users, Bed, Loader2, ArrowRight, Check, User, Quote, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const RoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
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
        if (!user) return toast.error(t('room_details.login_required'));
        if (reviewForm.rating === 0) return toast.error(t('room_details.rating_required'));
        
        setSubmittingReview(true);
        try {
            const res = await axiosClient.post('/reviews', {
                roomId: parseInt(roomId),
                userId: user.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            toast.success(res.data.message || t('room_details.review_success'));
            
            // Xóa form và cập nhật lại danh sách đánh giá
            setReviewForm({ rating: 0, comment: '' });
            const reviewRes = await axiosClient.get(`/reviews/${roomId}`);
            setReviews(reviewRes.data);
            
        } catch (error) {
            console.error("Lỗi gửi đánh giá:", error);
            toast.error(error.response?.data?.message || t('room_details.review_error'));
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
                <p className="text-slate-900 text-xl font-serif italic font-sans">{t('room_details.not_found')}</p>
                <button onClick={() => navigate('/rooms')} className="bg-slate-900 text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-luxury shadow-lg font-sans">{t('room_details.back_to_list')}</button>
            </div>
        );
    }

    const details = room.roomType || room.typeDetails || {};

    return (
        <div className="min-h-screen bg-cream text-slate-900 pt-24 pb-12 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto relative z-10">
                <button 
                  onClick={() => navigate('/rooms')} 
                  className="group flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-luxury mb-6 text-sm font-black uppercase tracking-[0.1em] font-sans"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> {t('room_details.back_to_list')}
                </button>

                {/* HEADER & HÌNH ẢNH */}
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
                    
                    <div className="lg:col-span-5 space-y-5 animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-amber-500 uppercase tracking-[0.15em] text-[10px] font-black italic font-sans">
                                <Star size={12} fill="currentColor" /> Luxury Collection
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif italic text-slate-900 leading-tight">
                                {t('room_details.room_prefix')} <span className="text-amber-500 not-italic">{room.roomNumber}</span>
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium italic font-sans">
                                {details.description || t('room_details.default_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-premium">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2 font-sans"><Users size={14} className="text-amber-500" /> {t('room_details.guests')}</span>
                                <span className="text-[11px] uppercase font-black text-slate-800 font-sans">{details.capacity || 2} {t('room_details.guests')}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2 font-sans"><Maximize size={14} className="text-amber-500" /> {t('room_details.area')}</span>
                                <span className="text-[11px] uppercase font-black text-slate-800 font-sans">45 m²</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2 font-sans"><Bed size={14} className="text-amber-500" /> {t('room_details.bed')}</span>
                                <span className="text-[11px] uppercase font-black text-slate-800 font-sans">1 King Size</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-black mb-2 italic flex items-center gap-2 font-sans">
                                    {t('room_details.standard_fee')}
                                    {discount && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[8px] animate-pulse font-sans">-{Math.floor(discount.discountPercent)}% OFF</span>}
                                </p>
                                <div className="flex items-baseline gap-3">
                                    {discount && (
                                        <p className="text-lg text-slate-300 line-through font-serif italic font-sans">
                                            {Number(details.price || 0).toLocaleString()}
                                        </p>
                                    )}
                                    <p className="text-3xl text-amber-500 font-serif italic">
                                        {(Number(details.price || 0) * (discount ? (1 - discount.discountPercent / 100) : 1)).toLocaleString()}
                                        <span className="text-[10px] text-slate-400 not-italic uppercase font-black tracking-widest ml-3 font-sans">{t('room_details.currency_per_night')}</span>
                                    </p>
                                </div>
                            </div>
                            {(!checkInDate || !checkOutDate) ? (
                                <button
                                    onClick={() => {
                                        toast.error("Vui lòng chọn ngày lưu trú trước khi Đặt phòng");
                                        navigate('/rooms');
                                    }}
                                    className="w-full py-3 font-black uppercase text-[10px] tracking-[0.1em] transition-luxury flex items-center justify-center gap-3 rounded-lg shadow-sm font-sans bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
                                >
                                    Vui lòng chọn ngày lưu trú
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate(`/booking/${room.id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)}
                                    disabled={room.status === 'Maintenance'}
                                    className={`w-full py-3 font-black uppercase text-[10px] tracking-[0.1em] transition-luxury flex items-center justify-center gap-3 rounded-lg shadow-sm font-sans ${
                                        room.status !== 'Maintenance' 
                                        ? 'bg-slate-900 text-white hover:bg-amber-500 hover:shadow-md active:scale-95' 
                                        : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                    }`}
                                >
                                    {room.status !== 'Maintenance' ? (
                                        <>{t('room_details.confirm_booking')} <ArrowRight size={14} /></>
                                    ) : t('room_details.room_maintenance')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative h-[250px] lg:h-[350px] animate-in fade-in slide-in-from-right-10 duration-1000 group">
                        <img
                            src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                            className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-105 font-sans"
                            alt={`Room ${room.roomNumber}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 rounded border border-white/20 flex items-center gap-1.5 shadow-sm font-sans">
                                <ShieldCheck size={12} /> {t('room_details.private_butler')}
                            </span>
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 rounded border border-white/20 flex items-center gap-1.5 shadow-sm font-sans">
                                <Check size={12} className="text-amber-500" /> {t('room_details.premium_amenities')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐÁNH GIÁ (REVIEWS) */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-50 pb-4 mb-6 gap-4">
                        <div className="space-y-2">
                            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.15em] block font-sans">{t('room_details.customer_reviews')}</span>
                            <h3 className="text-2xl md:text-3xl font-serif italic text-slate-900">
                                {t('room_details.inspiration')} <span className="not-italic text-amber-500">{t('room_details.stay')}</span>
                            </h3>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black italic flex items-center gap-2 font-sans">
                                <Users size={12} className="text-amber-500" />
                                {reviews.length > 0 ? t('room_details.total_reviews').replace('{count}', reviews.length) : t('room_details.no_reviews')}
                            </p>
                        </div>
                        {reviews.length > 0 && (
                            <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm">
                                <span className="text-2xl text-amber-500 font-serif italic leading-none">
                                    {(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <div className="border-l border-amber-500/20 pl-4 space-y-0.5">
                                    {renderStars(Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length))}
                                    <span className="text-[9px] uppercase text-slate-400 font-black tracking-widest block">{t('room_details.absolute_rating')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="relative bg-cream p-4 rounded-xl border border-slate-50 hover:border-amber-500/30 transition-luxury group shadow-sm">
                                <Quote className="absolute top-3 right-3 text-amber-500/10 group-hover:text-amber-500/20 transition-luxury" size={24} strokeWidth={1} />
                                
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-amber-500 font-black text-sm shadow-sm font-sans">
                                            {(review.reviewer?.fullName || 'G').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-[0.15em] text-[11px] text-slate-900 font-sans">{review.reviewer?.fullName || t('room_details.customer')}</p>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-0.5 italic font-sans">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        {renderStars(review.rating)}
                                        <p className="text-slate-600 italic leading-relaxed text-xs font-medium font-sans line-clamp-3">"{review.comment}"</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-10 flex flex-col items-center justify-center bg-cream border border-dashed border-slate-200 rounded-xl">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                    <Star size={20} className="text-amber-500/20" />
                                </div>
                                <p className="text-slate-400 uppercase tracking-[0.1em] font-black text-[10px] italic font-sans">{t('room_details.be_the_first')}</p>
                            </div>
                        )}
                    </div>

                    {/* FORM VIẾT ĐÁNH GIÁ */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="bg-cream p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                                <h4 className="text-lg font-serif italic text-slate-900 mb-2">
                                    {t('room_details.share_experience')}
                                </h4>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('room_details.star_rating')}</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={20}
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
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('room_details.review_content')}</label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder={t('room_details.review_placeholder')}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all min-h-[80px] resize-y font-sans placeholder:text-slate-400"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={submittingReview || reviewForm.rating === 0}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-luxury flex items-center gap-2 shadow-sm font-sans ${
                                            (submittingReview || reviewForm.rating === 0) 
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                            : 'bg-slate-900 text-white hover:bg-amber-500'
                                        }`}
                                    >
                                        {submittingReview ? <Loader2 size={12} className="animate-spin" /> : t('room_details.submit_review')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-cream p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                                <p className="text-slate-600 mb-3 italic leading-relaxed text-xs font-medium font-sans">
                                    {t('room_details.login_to_review')}
                                </p>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded bg-slate-900 text-white hover:bg-amber-500 transition-luxury shadow-sm font-sans"
                                >
                                    {t('room_details.login_now')}
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



