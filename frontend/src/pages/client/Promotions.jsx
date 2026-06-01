import React, { useEffect, useState } from 'react';
import { Gift, Calendar, ArrowRight, Sparkles, Heart, Coffee, Compass, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const Promotions = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubscribe = async () => {
        if (!email) return toast.error(t('booking.error') || "Vui lòng nhập email");
        setLoading(true);
        try {
            const res = await axiosClient.post('/newsletters/subscribe', { email });
            toast.success(res.data.message || "Đăng ký thành công!");
            setEmail('');
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const offers = [
        {
            id: 1,
            title: 'Honeymoon Bliss Package',
            tag: 'Romance',
            desc: t('promotions.offer_1_desc'),
            price: '15,000,000',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
            icon: <Heart size={24} />
        },
        {
            id: 2,
            title: 'Early Bird Special: 20% Off',
            tag: 'Savings',
            desc: t('promotions.offer_2_desc'),
            price: `${t('promotions.from')} 5,000,000`,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
            icon: <Calendar size={24} />
        },
        {
            id: 3,
            title: 'Weekend Luxury Escape',
            tag: 'Staycation',
            desc: t('promotions.offer_3_desc'),
            price: '8,500,000',
            image: 'https://images.unsplash.com/photo-1550966842-307e07f474aa?auto=format&fit=crop&q=80',
            icon: <Coffee size={24} />
        },
        {
            id: 4,
            title: 'Heritage Discovery Tour',
            tag: 'Experience',
            desc: t('promotions.offer_4_desc'),
            price: '12,000,000',
            image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80',
            icon: <Compass size={24} />
        }
    ];

    return (
        <div className="bg-paper min-h-screen pt-44 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-600/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <Gift size={14} /> {t('promotions.guest_privilege')}
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif italic text-slate-900">
                        {t('promotions.hero_title')} <span className="text-amber-600 not-italic font-bold">{t('promotions.hero_exclusive')}</span>
                    </h1>
                    <p className="text-gray-500 italic text-base leading-relaxed">
                        {t('promotions.hero_desc')}
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
                                        <span className="text-xs font-black uppercase tracking-widest">{offer.tag}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 space-y-8">
                                <span className="text-gray-400 text-xs font-black uppercase tracking-[0.1em]">{t('promotions.limited_time')}</span>
                                <h3 className="text-4xl md:text-5xl font-serif italic text-slate-900">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 leading-loose text-sm md:text-base font-medium italic">
                                    "{offer.desc}"
                                </p>
                                
                                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-1">{t('promotions.package_price_from')}</p>
                                        <p className="text-2xl font-sans font-semibold tracking-tight text-amber-600">{offer.price} <span className="text-[10px] not-italic text-gray-400 ml-1.5 font-sans font-bold">{t('promotions.currency')}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/rooms')}
                                        className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-amber-600 transition-all shadow-xl hover:-translate-x-2"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Box Integration */}
                <div className="mt-40 bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                    <Sparkles size={48} className="text-amber-500 mx-auto mb-10 opacity-50" />
                    <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-8">
                        {t('promotions.newsletter_title')} <span className="text-amber-500">{t('promotions.newsletter_instant')}</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm tracking-widest leading-loose mb-12 uppercase font-bold">
                        {t('promotions.newsletter_desc')}
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                            placeholder={t('promotions.email_placeholder')} 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-amber-500/50 transition-all text-xs font-bold tracking-widest"
                        />
                        <button 
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="bg-amber-600 hover:bg-white text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : t('promotions.submit')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;


