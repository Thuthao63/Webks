import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, MapPin, ShieldCheck, Zap, Mail, Loader2, BedDouble, Quote, Award } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import BookingBar from '../../components/BookingBar';


const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Lấy danh sách phòng
        const roomsRes = await axiosClient.get('/rooms');
        const available = roomsRes.data.filter(r => r.status === 'Available').slice(0, 3);
        setFeaturedRooms(available);

        // Lấy danh sách đánh giá (Dữ liệu thật)
        const reviewsRes = await axiosClient.get('/reviews/featured');
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu trang chủ:", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
        return Swal.fire(t('booking.error') || "Lỗi", "Vui lòng nhập email", "error");
    }

    try {
        const res = await axiosClient.post('/newsletters/subscribe', { email });
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: res.data.message || 'Cảm ơn quý khách đã đăng ký.',
          confirmButtonColor: '#d97706',
          background: '#fff',
          color: '#1a1a1a',
          confirmButtonText: 'Đóng',
        });
        setEmail('');
    } catch (err) {
        Swal.fire(t('booking.error') || "Lỗi", err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  return (
    <div className="bg-paper text-gray-900 selection:bg-amber-100 selection:text-amber-900 font-sans">

      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10 backdrop-blur-[2px]"></div>

          {/* Video for medium+ screens; poster helps first paint. */}
          <div className="hidden md:block w-full h-full">
            <video autoPlay loop muted playsInline preload="metadata" poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" className="w-full h-full object-cover">
              <source src="/video/hotel.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Static image for small screens to improve load and layout */}
          <img className="md:hidden w-full h-full object-cover" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" alt="Hero" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex justify-center gap-1.5 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-amber-600 drop-shadow-sm" fill="currentColor" />
            ))}
          </div>

          <h1 className="mb-6 tracking-tight font-serif">
            <span className="block text-3xl md:text-4xl font-light mb-4 tracking-widest uppercase text-gray-800 font-serif">{t('home.art_of')}</span>
            <span className="block text-6xl md:text-[8rem] font-bold italic text-amber-600 drop-shadow-lg leading-none font-serif">{t('home.living')}</span>
          </h1>

          <p className="text-gray-700 text-xs md:text-sm uppercase tracking-[0.15em] mb-12 max-w-2xl mx-auto leading-loose font-bold bg-white/50 backdrop-blur-md py-3 px-6 rounded-full inline-block border border-white/60 font-sans">
            {t('home.subtitle')}
          </p>

          <div className="flex justify-center mt-4 pb-16 md:pb-24">
            <button
              onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
              className="group text-[11px] font-black uppercase tracking-widest text-gray-800 flex items-center gap-3 border-b border-gray-400 pb-2 hover:border-amber-600 hover:text-amber-700 transition-all rounded-full px-8 py-3 bg-white/80 shadow-premium font-sans"
            >
              {t('home.explore')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <BookingBar />

      {/* --- 2. THE STORY --- */}
      <section id="explore" className="py-24 px-6 md:py-32 bg-white my-12 md:my-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-6 border border-amber-500/10 rounded-[3rem] -rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
                className="w-full h-[600px] object-cover shadow-xl rounded-[2.5rem] relative z-10"
                alt="Luxury Suite"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl border border-gray-50 rounded-[2rem] hidden md:block z-20">
                <p className="text-4xl font-serif text-amber-600 mb-2">100%</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">{t('home.satisfaction')}</p>
              </div>
            </div>

            <div className="space-y-10 order-1 md:order-2">
              <div className="space-y-4">
                <span className="text-amber-600 text-xs font-black uppercase tracking-[0.1em] block font-sans">{t('home.story_sup')}</span>
                <h2 className="text-4xl md:text-6xl leading-tight text-gray-900 font-serif">
                  {t('home.story_head')} <br /> <span className="italic font-light text-amber-700 font-serif">{t('home.story_head_italic')}</span>
                </h2>
              </div>

              <p className="text-gray-600 leading-loose text-sm md:text-base font-medium italic font-sans">
                {t('home.story_desc')}
              </p>

              <div className="grid grid-cols-2 gap-10 border-t border-gray-100 pt-10">
                <div className="space-y-3 p-6 bg-gray-50 rounded-2xl group hover:shadow-xl transition-all">
                  <ShieldCheck className="text-amber-600 group-hover:scale-110 transition-transform" size={32} strokeWidth={1} />
                  <h5 className="text-xs uppercase tracking-widest font-black text-gray-800">{t('home.privacy')}</h5>
                </div>
                <div className="space-y-3 p-6 bg-gray-50 rounded-2xl group hover:shadow-xl transition-all">
                  <Zap className="text-amber-600 group-hover:scale-110 transition-transform" size={32} strokeWidth={1} />
                  <h5 className="text-xs uppercase tracking-widest font-black text-gray-800">{t('home.service_247')}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2.5 AMENITIES HIGHLIGHT --- */}
      <section className="py-24 md:py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16 md:mb-24">
           <span className="text-amber-600 text-xs font-black uppercase tracking-[0.15em] mb-6 block">{t('home.amenities_sup')}</span>
           <h2 className="text-4xl md:text-7xl font-serif italic text-gray-900">
              {t('home.amenities_head')} <span className="text-amber-600 not-italic font-bold">{t('home.amenities_head_italic')}</span>
           </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: 'Infinity Pool', icon: '🏊‍♂️', desc: 'Hồ bơi vô cực hướng biển' },
             { title: 'Fine Dining', icon: '🍽️', desc: 'Ẩm thực chuẩn sao Michelin' },
             { title: 'Royal Spa', icon: '🕯️', desc: 'Liệu trình thư giãn cao cấp' },
             { title: 'Private Beach', icon: '🏖️', desc: 'Bãi biển biệt lập tuyệt mật' },
           ].map((item, i) => (
             <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium tracking-wide">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* --- 3. FEATURED ROOMS --- */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-amber-600 text-xs font-black uppercase tracking-[0.1em] block text-center md:text-left">{t('home.top_picks')}</span>
              <h3 className="text-4xl md:text-6xl italic font-serif text-gray-900">{t('home.perfect_space')} <span className="not-italic text-amber-600">{t('home.perfect_space_italic')}</span></h3>
            </div>
            <button
              onClick={() => navigate('/rooms')}
              className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-2 hover:border-amber-600 hover:text-amber-600 transition-all flex items-center gap-4 group"
            >
              {t('home.view_all')} <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {loadingRooms ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-3xl"></div>
              ))
            ) : featuredRooms.map(room => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-premium border border-gray-50 cursor-pointer hover:shadow-2xl transition-luxury flex flex-col"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                    alt={room.roomNumber}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20 shadow-xl">
                    {t('home.room_prefix')} {room.roomNumber}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[17px] font-serif italic text-slate-900 group-hover:text-amber-600 transition-luxury">{room.roomType?.name}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black italic">{t('home.signature_collection')}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-gray-300 uppercase tracking-widest font-black">{t('home.standard_price')}</p>
                      <p className="text-[17px] font-serif italic text-amber-600">{Number(room.roomType?.price).toLocaleString()} <span className="text-[9px] text-gray-300 font-black not-italic ml-0.5">{t('home.currency')}</span></p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white group-hover:shadow-lg transition-luxury">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. LIFESTYLE GALLERY MASONRY --- */}
      <section className="py-24 md:py-32 bg-paper">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24">
               <span className="text-amber-600 text-xs font-black uppercase tracking-[0.15em] mb-4 block">{t('home.capturing')}</span>
               <h3 className="text-4xl md:text-7xl italic font-serif text-gray-900">{t('home.live_inspire')} <span className="not-italic text-amber-600">{t('home.live_inspire_italic')}</span></h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px]">
               <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[3rem] shadow-xl">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Pool" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
               </div>
               <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] shadow-xl">
                  <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Spa" />
               </div>
               <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-[3rem] shadow-xl">
                  <img src="https://images.unsplash.com/photo-1550966842-307e07f474aa?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Dining" />
               </div>
               <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] shadow-xl">
                  <img src="https://images.unsplash.com/photo-1582719477059-59eb59b19c69?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Bed" />
               </div>
            </div>
         </div>
      </section>

      {/* --- 5. NEWSLETTER - EXCLUSIVE MEMBERSHIP --- */}
      <section className="py-16 md:py-20 bg-paper relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px]"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="group relative rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100/50 bg-white">
               {/* Background Image with Parallax effect */}
               <div className="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80" alt="Newsletter Background" className="w-full h-full object-cover opacity-[0.15] group-hover:scale-110 transition-transform duration-[3000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/95 mix-blend-multiply"></div>
               </div>
               
               <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-amber-500/20 group-hover:scale-110 transition-transform duration-700">
                      <Mail size={24} className="text-amber-500" />
                   </div>
                   
                   <h2 className="text-3xl md:text-4xl md:leading-tight font-serif italic text-white mb-4 drop-shadow-md">
                      {t('home.join')} <span className="text-amber-400 font-bold not-italic">{t('home.elite')}</span>
                   </h2>
                   
                   <p className="text-slate-300 max-w-xl mx-auto text-[10px] md:text-xs tracking-[0.2em] leading-loose mb-8 uppercase font-black">
                      {t('home.newsletter')}
                   </p>
                   
                   <form onSubmit={handleSubscribe} className="max-w-lg w-full flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1 group/input">
                         <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors z-10" />
                         <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('home.email_placeholder')}
                            className="w-full bg-white/5 border border-white/20 rounded-xl md:rounded-full pl-12 pr-5 py-3 text-white outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-[11px] font-bold tracking-widest placeholder-slate-400 backdrop-blur-sm"
                         />
                      </div>
                      <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl md:rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2">
                         {t('home.subscribe')} <ArrowRight size={14} />
                      </button>
                   </form>
               </div>
            </div>
         </div>
      </section>

      {/* --- 6. TESTIMONIALS --- */}
      {reviews.length > 0 && (
        <section className="py-24 md:py-32 bg-paper">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24 space-y-4">
              <span className="text-amber-600 text-xs font-black uppercase tracking-[0.1em] block">{t('home.customer_reviews')}</span>
              <h3 className="text-4xl md:text-6xl italic font-serif text-gray-900">{t('home.great_memories')} <span className="not-italic text-amber-600">{t('home.great_memories_italic')}</span></h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {reviews.map((rev) => (
                <div key={rev.id} className="relative p-12 bg-white rounded-[3rem] border border-gray-50 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group">
                  <Quote className="absolute top-10 right-10 text-amber-600/5 group-hover:text-amber-600/10 transition-colors" size={60} />
                  <div className="flex gap-1.5 mb-8">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-600" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic leading-loose text-sm mb-12 relative z-10">"{rev.comment}"</p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-[#334155] flex items-center justify-center text-white font-black text-sm shadow-xl">
                      {rev.reviewer?.fullName?.charAt(0).toUpperCase() || 'G'}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-slate-900">{rev.reviewer?.fullName || 'Khách hàng'}</p>
                      <p className="text-sm text-amber-600 uppercase tracking-widest font-bold italic">{t('home.elite_member_badge')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- 7. PRESTIGE & AWARDS --- */}
      <section className="py-32 border-t border-gray-100 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
            {[1, 2, 3, 4].map((award) => (
              <div key={award} className="flex flex-col items-center gap-3 w-40 text-center">
                <Award className="text-amber-700" size={40} strokeWidth={1} />
                <span className="text-sm font-black uppercase tracking-widest text-gray-600 text-center leading-loose">{t('home.luxury_award')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

