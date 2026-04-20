import React, { useEffect } from 'react';
import { Gift, Calendar, ArrowRight, Sparkles, Heart, Coffee, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Promotions = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const offers = [
        {
            id: 1,
            title: 'Honeymoon Bliss Package',
            tag: 'Romance',
            desc: 'Tận hưởng kỳ nghỉ trăng mật trong mơ với trang trí hoa tươi, bữa tối nến dưới ánh sao và liệu trình spa đôi đặc quyền.',
            price: '15,000,000',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
            icon: <Heart size={24} />
        },
        {
            id: 2,
            title: 'Early Bird Special: 20% Off',
            tag: 'Savings',
            desc: 'Lên kế hoạch sớm cho hành trình của bạn. Đặt phòng trước 30 ngày để nhận ưu đãi giảm trực tiếp 20% giá phòng.',
            price: 'Từ 5,000,000',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
            icon: <Calendar size={24} />
        },
        {
            id: 3,
            title: 'Weekend Luxury Escape',
            tag: 'Staycation',
            desc: 'Gói nghỉ dưỡng cuối tuần bao gồm bữa sáng buffet tại nhà hàng Ocean View và tiệc trà chiều thượng hạng.',
            price: '8,500,000',
            image: 'https://images.unsplash.com/photo-1550966842-307e07f474aa?auto=format&fit=crop&q=80',
            icon: <Coffee size={24} />
        },
        {
            id: 4,
            title: 'Heritage Discovery Tour',
            tag: 'Experience',
            desc: 'Khám phá vẻ đẹp bản địa với tour tham quan riêng biệt và lưu trú tại phòng Suite hướng biển.',
            price: '12,000,000',
            image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80',
            icon: <Compass size={24} />
        }
    ];

    return (
        <div className="bg-[#FDFBF7] min-h-screen pt-44 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-600/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Gift size={14} /> Đặc quyền thượng khách
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif italic text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Ưu đãi <span className="text-amber-600 not-italic font-bold">Độc quyền</span>
                    </h1>
                    <p className="text-gray-500 italic text-base leading-relaxed">
                        Khám phá những gói nghỉ dưỡng được thiết kế riêng biệt để mang lại trải nghiệm xa xỉ với giá trị tối ưu nhất.
                    </p>
                </div>

                {/* Offers List */}
                <div className="space-y-20">
                    {offers.map((offer, idx) => (
                        <div 
                            key={offer.id}
                            className={`flex flex-col lg:flex-row gap-16 items-center group ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-3/5 relative">
                                <div className="absolute -inset-4 border border-amber-500/10 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                                <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] shadow-2xl">
                                    <img 
                                        src={offer.image} 
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                                    />
                                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 text-amber-600 shadow-xl">
                                        {offer.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{offer.tag}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 space-y-8">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Limited Time Offer</span>
                                <h3 className="text-4xl md:text-5xl font-serif italic text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 leading-loose text-sm md:text-base font-medium italic">
                                    "{offer.desc}"
                                </p>
                                
                                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Giá trọn gói từ</p>
                                        <p className="text-3xl font-serif italic text-amber-600">{offer.price} <span className="text-xs not-italic text-gray-300 ml-2 font-sans font-black">VNĐ</span></p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/rooms')}
                                        className="w-14 h-14 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center hover:bg-amber-600 transition-all shadow-xl hover:-translate-x-2"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Box Integration */}
                <div className="mt-40 bg-[#1E293B] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                    <Sparkles size={48} className="text-amber-500 mx-auto mb-10 opacity-50" />
                    <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Nhận tin ưu đãi <span className="text-amber-500">tức thì</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm tracking-widest leading-loose mb-12 uppercase font-bold">
                        Đăng ký để trở thành người đầu tiên nhận thông báo về các ưu đãi bí mật và sự kiện đặc biệt.
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input 
                            type="email" 
                            placeholder="Email của bạn..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-amber-500/50 transition-all text-xs font-bold tracking-widest"
                        />
                        <button className="bg-amber-600 hover:bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;
