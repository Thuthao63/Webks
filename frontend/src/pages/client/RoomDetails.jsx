import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Star, Maximize, Users, Bed, Loader2, ArrowRight, Check, User, Quote, ShieldCheck } from 'lucide-react';

const RoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? "text-[#B59A6D] fill-[#B59A6D]" : "text-slate-100"} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B59A6D]/5 rounded-full blur-[100px]"></div>
                <Loader2 className="animate-spin text-[#B59A6D] relative z-10" size={48} />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center flex-col gap-8">
                <p className="text-slate-900 text-xl font-serif italic">Không tìm thấy thông tin phòng.</p>
                <button onClick={() => navigate('/rooms')} className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B59A6D] transition-luxury shadow-lg">Quay lại danh mục</button>
            </div>
        );
    }

    const details = room.roomType || room.typeDetails || {};

    return (
        <div className="min-h-screen bg-[#F9F8F6] text-slate-900 pt-44 pb-32 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto relative z-10">
                <button 
                  onClick={() => navigate('/rooms')} 
                  className="group flex items-center gap-4 text-slate-400 hover:text-[#B59A6D] transition-luxury mb-16 text-[11px] font-black uppercase tracking-[0.4em]"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> Quay lại danh mục
                </button>

                {/* HEADER & HÌNH ẢNH */}
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32">
                    
                    <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-[#B59A6D] uppercase tracking-[0.5em] text-[10px] font-black italic">
                                <Star size={14} fill="currentColor" /> Luxury Collection
                            </div>
                            <h1 className="text-6xl md:text-[5.5rem] font-serif italic text-slate-900 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Phòng <span className="text-[#B59A6D] not-italic">{room.roomNumber}</span>
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                                {details.description || 'Trải nghiệm không gian sống thượng lưu với những trang bị tân tiến, thiết kế nội thất sang trọng mang đậm dấu ấn Uy Nam.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-3"><Users size={16} className="text-[#B59A6D]" /> Khách</span>
                                <span className="text-xs uppercase font-black text-slate-800">{details.capacity || 2} Thượng khách</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-3"><Maximize size={16} className="text-[#B59A6D]" /> Diện tích</span>
                                <span className="text-xs uppercase font-black text-slate-800">45 m²</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-3"><Bed size={16} className="text-[#B59A6D]" /> Giường</span>
                                <span className="text-xs uppercase font-black text-slate-800">1 King Size</span>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black mb-3 italic flex items-center gap-2">
                                    Mức phí lưu trú tiêu chuẩn
                                    {discount && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[8px] animate-pulse">-{Math.floor(discount.discountPercent)}% OFF</span>}
                                </p>
                                <div className="flex items-baseline gap-4">
                                    {discount && (
                                        <p className="text-xl text-slate-300 line-through font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {Number(details.price || 0).toLocaleString()}
                                        </p>
                                    )}
                                    <p className="text-5xl text-[#B59A6D] font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {(Number(details.price || 0) * (discount ? (1 - discount.discountPercent / 100) : 1)).toLocaleString()}
                                        <span className="text-[10px] text-slate-400 not-italic uppercase font-black tracking-[0.3em] ml-4">VNĐ / ĐÊM</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/booking/${room.id}`)}
                                disabled={room.status !== 'Available'}
                                className={`w-full py-6 font-black uppercase text-[11px] tracking-[0.4em] transition-luxury flex items-center justify-center gap-6 rounded-2xl shadow-premium ${
                                    room.status === 'Available' 
                                    ? 'bg-slate-900 text-white hover:bg-[#B59A6D] hover:shadow-2xl shadow-slate-900/10 active:scale-95' 
                                    : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                }`}
                            >
                                {room.status === 'Available' ? (
                                    <>Xác nhận Đặt phòng <ArrowRight size={18} /></>
                                ) : 'Hiện phòng đang bận'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-7 rounded-[3rem] overflow-hidden border border-slate-100 shadow-premium relative h-[500px] lg:h-[750px] animate-in fade-in slide-in-from-right-10 duration-1000 group">
                        <img
                            src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            alt={`Room ${room.roomNumber}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 flex flex-wrap gap-4">
                            <span className="bg-white/90 backdrop-blur-md px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#B59A6D] rounded-xl border border-white/20 flex items-center gap-3 shadow-xl">
                                <ShieldCheck size={16} /> Dịch vụ Butler riêng
                            </span>
                            <span className="bg-white/90 backdrop-blur-md px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 rounded-xl border border-white/20 flex items-center gap-3 shadow-xl">
                                <Check size={16} className="text-[#B59A6D]" /> Toàn bộ tiện nghi cao cấp
                            </span>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐÁNH GIÁ (REVIEWS) */}
                <section className="bg-white rounded-[4rem] p-16 md:p-24 border border-slate-100 shadow-premium">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-50 pb-12 mb-16 gap-10">
                        <div className="space-y-6">
                            <span className="text-[#B59A6D] text-[11px] font-black uppercase tracking-[0.5em] block">Lời nhắn từ Thượng khách</span>
                            <h3 className="text-5xl md:text-7xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Cảm hứng <span className="not-italic text-[#B59A6D]">lưu trú</span>
                            </h3>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black italic flex items-center gap-3">
                                <Users size={16} className="text-[#B59A6D]" />
                                {reviews.length > 0 ? `Tổng hợp từ ${reviews.length} đánh giá thực tế` : 'Chưa có đánh giá nào cho phòng này'}
                            </p>
                        </div>
                        {reviews.length > 0 && (
                            <div className="bg-slate-50 px-10 py-8 rounded-[2rem] border border-slate-100 flex items-center gap-8 shadow-sm">
                                <span className="text-6xl text-[#B59A6D] font-serif italic leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <div className="border-l border-[#B59A6D]/20 pl-8 space-y-2">
                                    {renderStars(Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length))}
                                    <span className="text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] block">Xếp hạng tuyệt đối</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="relative bg-[#F9F8F6] p-12 rounded-[2.5rem] border border-slate-50 hover:border-[#B59A6D]/30 transition-luxury group shadow-sm hover:shadow-xl">
                                <Quote className="absolute top-10 right-10 text-[#B59A6D]/10 group-hover:text-[#B59A6D]/20 transition-luxury" size={70} strokeWidth={1} />
                                
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#B59A6D] font-black text-xl shadow-xl group-hover:scale-110 transition-luxury">
                                            {(review.reviewer?.fullName || 'G').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-[0.2em] text-[12px] text-slate-900">{review.reviewer?.fullName || 'Thượng khách'}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1 italic">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {renderStars(review.rating)}
                                        <p className="text-slate-600 italic leading-loose text-base font-medium">"{review.comment}"</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-[#F9F8F6] border border-dashed border-slate-200 rounded-[3rem]">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                                    <Star size={40} className="text-[#B59A6D]/20" />
                                </div>
                                <p className="text-slate-400 uppercase tracking-[0.4em] font-black text-[10px] italic">Hãy trở thành người đầu tiên chia sẻ cảm nhận</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoomDetails;

