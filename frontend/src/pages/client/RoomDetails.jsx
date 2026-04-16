import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Star, Maximize, Users, Bed, Loader2, ArrowRight, Check, User } from 'lucide-react';

const RoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, reviewRes] = await Promise.all([
                    axiosClient.get(`/rooms/${roomId}`),
                    axiosClient.get(`/reviews/${roomId}`)
                ]);
                setRoom(roomRes.data);
                setReviews(reviewRes.data);
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
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? "text-amber-500 fill-amber-500" : "text-white/20"} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
                <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-6">
                <p className="text-white text-xl">Không tìm thấy thông tin phòng.</p>
                <button onClick={() => navigate('/rooms')} className="text-amber-500 underline uppercase tracking-widest text-xs font-bold">Quay lại danh mục</button>
            </div>
        );
    }

    const details = room.roomType || room.typeDetails || {};

    return (
        <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#000] text-white pt-32 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto relative z-10">
                <button onClick={() => navigate('/rooms')} className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <ArrowLeft size={16} /> Danh sách phòng
                </button>

                {/* HEADER & HÌNH ẢNH */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
                        <div className="flex items-center gap-2 text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold">
                            <Star size={14} fill="currentColor" /> Khám phá Hạng phòng
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Phòng <span className="text-amber-500 not-italic">{room.roomNumber}</span>
                        </h1>
                        <p className="text-gray-400 leading-loose italic max-w-lg mb-8">
                            {details.description || 'Trải nghiệm không gian sống thượng lưu với những trang bị tân tiến, thiết kế nội thất sang trọng mang đậm dấu ấn Uy Nam Luxury. Mang lại một kỳ nghỉ thư thái tuyệt đỉnh.'}
                        </p>
                        <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2"><Users size={14} className="text-amber-500" /> Sức chứa</span>
                                <span className="text-sm uppercase font-black">{details.capacity || 2} Khách</span>
                            </div>
                            <div className="w-[1px] bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2"><Maximize size={14} className="text-amber-500" /> Diện tích</span>
                                <span className="text-sm uppercase font-black">45 m²</span>
                            </div>
                            <div className="w-[1px] bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2"><Bed size={14} className="text-amber-500" /> Giường</span>
                                <span className="text-sm uppercase font-black">1 Size King</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-6">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Mức giá ưu đãi</p>
                                <p className="text-4xl text-amber-500 font-serif italic drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {Number(details.price || 0).toLocaleString()}<span className="text-base text-gray-400 not-italic uppercase font-sans font-black ml-2">VNĐ / ĐÊM</span>
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/booking/${room.id}`)}
                                disabled={room.status !== 'Available'}
                                className={`px-8 py-4 font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-2xl w-full sm:w-auto ${room.status === 'Available' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transform hover:scale-105' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
                                    }`}
                            >
                                {room.status === 'Available' ? (
                                    <>Đặt Phòng Ngay <ArrowRight size={16} /></>
                                ) : 'Phòng Đang Bận'}
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative h-[400px] lg:h-[600px] order-1 lg:order-2 group">
                        <img
                            src={details.image ? `http://localhost:5000/uploads/${details.image}` : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            alt={`Room ${room.roomNumber}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-3">
                            <span className="bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-500 rounded-full border border-white/10 flex items-center gap-2">
                                <Check size={12} /> View Biển Tuyệt Đỉnh
                            </span>
                            <span className="bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 rounded-full border border-white/10 flex items-center gap-2">
                                <Check size={12} /> Bữa Sáng Miễn Phí
                            </span>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐÁNH GIÁ (REVIEWS) */}
                <div className="mt-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12 gap-6">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Trải nghiệm từ <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl tracking-wider ml-1">Khách hàng</span>
                            </h3>
                            <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold mt-4 flex items-center gap-2">
                                <Users size={14} className="text-amber-500" />
                                {reviews.length > 0 ? `Chiết xuất từ ${reviews.length} đánh giá thực tế đã qua kiểm duyệt` : 'Hãy trở thành người đầu tiên trải nghiệm dịch vụ này'}
                            </p>
                        </div>
                        {reviews.length > 0 && (
                            <div className="bg-black/40 backdrop-blur-xl px-8 py-5 rounded-[2rem] border border-amber-500/30 flex items-center gap-6 shadow-2xl shrink-0">
                                <span className="text-5xl text-amber-500 font-serif italic leading-none drop-shadow-md">
                                    {(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <div className="border-l border-white/10 pl-6 space-y-1.5">
                                    {renderStars(Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length))}
                                    <span className="text-[9px] uppercase text-gray-500 font-bold tracking-widest block">Tuyệt hảo</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="bg-white/[0.02] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] hover:border-amber-500/30 hover:bg-black/40 hover:backdrop-blur-xl transition-all duration-500 group shadow-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-300 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(217,119,6,0.3)] relative overflow-hidden group-hover:scale-110 transition-transform">
                                            <div className="absolute inset-0 bg-white/20 blur-sm"></div>
                                            <span className="relative z-10">{(review.reviewer?.fullName || 'A').charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors drop-shadow-sm">{review.reviewer?.fullName || 'Khách lưu trú'}</p>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Đã viết ngày: {new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 group-hover:border-amber-500/30 transition-colors self-start sm:self-auto">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-4xl text-amber-500/20 font-serif">"</span>
                                    <p className="text-gray-300 italic leading-loose text-sm sm:text-base relative z-10 pl-4 border-l border-amber-500/10 group-hover:border-amber-500/50 transition-colors">{review.comment}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center lg mb-6">
                                    <Star size={40} className="text-gray-600 opacity-50" />
                                </div>
                                <p className="text-gray-400 uppercase tracking-[0.2em] font-bold text-xs">Hiện tại chưa có bất kỳ phản hồi nào về dịch vụ này.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RoomDetails;
