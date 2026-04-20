import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, MapPin, ShieldCheck, Zap, Mail, Loader2, BedDouble, Quote, Award } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';


const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Lấy danh sách phòng
        const roomsRes = await axiosClient.get('/rooms');
        const available = roomsRes.data.filter(r => r.status === 'Available').slice(0, 3);
        setFeaturedRooms(available);

        // Lấy danh sách đánh giá (Dữ liệu thật)
        const reviewsRes = await axiosClient.get('/reviews');
        // Chỉ lấy các đánh giá từ 4 sao trở lên
        const guestReviews = (reviewsRes.data || []).filter(rev => rev.rating >= 4).slice(0, 3);
        setReviews(guestReviews);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu trang chủ:", err);
      } finally {
        setLoadingRooms(false);
        setLoadingReviews(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    Swal.fire({
      title: 'Đăng ký thành công',
      text: 'Chào mừng Thượng khách. Ưu đãi độc quyền sẽ sớm được gửi đến email của bạn.',
      icon: 'success',
      background: '#fff',
      color: '#1a1a1a',
      confirmButtonText: 'Đóng',
      confirmButtonColor: '#d97706',
    });
    setEmail('');
  };

  return (
    <div className="bg-[#FDFBF7] text-gray-900 selection:bg-amber-100 selection:text-amber-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10 backdrop-blur-[2px]"></div>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/video/hotel.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex justify-center gap-1.5 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-amber-600 drop-shadow-sm" fill="currentColor" />
            ))}
          </div>

          <h1 className="mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="block text-3xl md:text-5xl font-light mb-4 tracking-[0.3em] uppercase text-gray-800">The Art of</span>
            <span className="block text-6xl md:text-[10rem] font-bold italic text-amber-600 drop-shadow-lg leading-none">Living</span>
          </h1>

          <p className="text-gray-700 text-xs md:text-sm uppercase tracking-[0.5em] mb-12 max-w-2xl mx-auto leading-loose font-bold bg-white/50 backdrop-blur-md py-3 px-6 rounded-full inline-block border border-white/60">
            Nghệ thuật nghỉ dưỡng thượng lưu
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
              className="group text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 flex items-center gap-3 border-b border-gray-400 pb-2 hover:border-amber-600 hover:text-amber-700 transition-all"
            >
              Khám phá thêm <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- 2. THE STORY --- */}
      <section id="explore" className="py-32 px-6 max-w-7xl mx-auto bg-white my-32 shadow-[0_0_50px_rgba(0,0,0,0.02)] rounded-[4rem]">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-6 border border-amber-500/10 rounded-[3rem] -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
              className="w-full h-[600px] object-cover shadow-xl rounded-[2.5rem] relative z-10"
              alt="Luxury Suite"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl border border-gray-50 rounded-[2rem] hidden md:block z-20">
              <p className="text-4xl font-serif text-amber-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sự hài lòng</p>
            </div>
          </div>

          <div className="space-y-10 order-1 md:order-2">
            <div className="space-y-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block">Kỳ nghỉ mơ ước</span>
              <h2 className="text-4xl md:text-6xl leading-tight text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tuyệt tác <br /> <span className="italic font-light text-amber-700">giữa đại dương</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-loose text-sm md:text-base font-medium italic">
              "Uy Nam Luxury mang đến một chuẩn mực mới về sự tinh tế. Nơi ánh sáng tự nhiên hòa quyện cùng nội thất đương đại, tạo nên không gian nghỉ dưỡng hoàn mỹ dành riêng cho bạn."
            </p>

            <div className="grid grid-cols-2 gap-10 border-t border-gray-100 pt-10">
              <div className="space-y-3 p-6 bg-gray-50 rounded-2xl group hover:shadow-xl transition-all">
                <ShieldCheck className="text-amber-600 group-hover:scale-110 transition-transform" size={32} strokeWidth={1} />
                <h5 className="text-[10px] uppercase tracking-widest font-black text-gray-800">Riêng tư tuyệt đối</h5>
              </div>
              <div className="space-y-3 p-6 bg-gray-50 rounded-2xl group hover:shadow-xl transition-all">
                <Zap className="text-amber-600 group-hover:scale-110 transition-transform" size={32} strokeWidth={1} />
                <h5 className="text-[10px] uppercase tracking-widest font-black text-gray-800">Phục vụ 24/7</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2.5 AMENITIES HIGHLIGHT --- */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
           <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Premium Facilities</span>
           <h2 className="text-4xl md:text-7xl font-serif italic text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tiện ích <span className="text-amber-600 not-italic font-bold">Thượng hạng</span>
           </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: 'Infinity Pool', icon: '🏊‍♂️', desc: 'Hồ bơi vô cực hướng biển' },
             { title: 'Fine Dining', icon: '🍽️', desc: 'Ẩm thực chuẩn sao Michelin' },
             { title: 'Royal Spa', icon: '🕯️', desc: 'Liệu trình thư giãn đế vương' },
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
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block text-center md:text-left">Lựa chọn hàng đầu</span>
              <h3 className="text-4xl md:text-6xl italic font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Không gian <span className="not-italic text-amber-600">tuyệt mỹ</span></h3>
            </div>
            <button
              onClick={() => navigate('/rooms')}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-800 border-b border-gray-300 pb-2 hover:border-amber-600 hover:text-amber-600 transition-all flex items-center gap-4 group"
            >
              Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {loadingRooms ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-3xl"></div>
              ))
            ) : featuredRooms.map(room => (
              <div
                key={room.id}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-premium border border-gray-50 cursor-pointer hover:shadow-2xl transition-luxury"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                    alt={room.roomNumber}
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20 shadow-xl">
                    Phòng {room.roomNumber}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-serif italic text-slate-900 group-hover:text-amber-600 transition-luxury" style={{ fontFamily: "'Playfair Display', serif" }}>{room.roomType?.name}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black italic">Signature Collection</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-gray-300 uppercase tracking-widest font-black">Giá chuẩn</p>
                      <p className="text-2xl font-serif italic text-amber-600">{Number(room.roomType?.price).toLocaleString()} <span className="text-[10px] text-gray-300 font-black not-italic ml-1">VNĐ</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white group-hover:shadow-lg transition-luxury">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. LIFESTYLE GALLERY MASONRY --- */}
      <section className="py-40 bg-[#FDFBF7]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
               <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Capturing Moments</span>
               <h3 className="text-4xl md:text-7xl italic font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Cảm hứng <span className="not-italic text-amber-600">Sống</span></h3>
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

            <div className="text-center mt-16">
               <button 
                  onClick={() => navigate('/gallery')}
                  className="bg-white border border-gray-200 text-[#1E293B] px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-600 hover:text-amber-600 transition-all shadow-sm"
               >
                  Xem thêm thư viện ảnh
               </button>
            </div>
         </div>
      </section>

      {/* --- 5. NEWSLETTER - EXCLUSIVE MEMBERSHIP --- */}
      <section className="py-40 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#1E293B] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl flex flex-col items-center">
               <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
               <Mail size={48} className="text-amber-500 mb-8 opacity-50" />
               <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Gia nhập <span className="text-amber-500">Uy Nam Elite</span>
               </h2>
               <p className="text-gray-400 max-w-xl mx-auto text-sm tracking-widest leading-loose mb-12 uppercase font-bold">
                  Nhận những ưu đãi đặc quyền và thông tin về các sự kiện nghệ thuật dành riêng cho hội viên.
               </p>
               <form onSubmit={handleSubscribe} className="max-w-md w-full flex gap-4">
                  <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="EMAIL CỦA BẠN" 
                     className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-amber-500/50 transition-all text-xs font-bold tracking-widest"
                  />
                  <button type="submit" className="bg-amber-600 hover:bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                     Đăng ký
                  </button>
               </form>
            </div>
         </div>
      </section>

      {/* --- 6. TESTIMONIALS --- */}
      {reviews.length > 0 && (
        <section className="py-40 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block">Cảm nhận từ Thượng khách</span>
              <h3 className="text-4xl md:text-6xl italic font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Ký ức <span className="not-italic text-amber-600">tuyệt vời</span></h3>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {reviews.map((rev, idx) => (
                <div key={rev.id} className="relative p-12 bg-white rounded-[3rem] border border-gray-50 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group">
                  <Quote className="absolute top-10 right-10 text-amber-600/5 group-hover:text-amber-600/10 transition-colors" size={60} />
                  <div className="flex gap-1.5 mb-8">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-600" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic leading-loose text-sm mb-12 relative z-10">"{rev.comment}"</p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E293B] to-[#334155] flex items-center justify-center text-white font-black text-sm shadow-xl">
                      {rev.reviewer?.fullName?.charAt(0).toUpperCase() || 'G'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#1E293B]">{rev.reviewer?.fullName || 'Khách hàng'}</p>
                      <p className="text-[9px] text-amber-600 uppercase tracking-widest font-bold italic">Elite Member</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- 7. PRESTIGE & AWARDS --- */}
      <section className="py-32 border-t border-gray-100 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
            {[1, 2, 3, 4].map((award) => (
              <div key={award} className="flex flex-col items-center gap-3">
                <Award className="text-amber-700" size={40} strokeWidth={1} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center leading-loose">International <br /> Luxury Award 2024</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;