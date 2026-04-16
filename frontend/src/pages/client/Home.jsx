import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, MapPin, ShieldCheck, Zap, Mail, Loader2, BedDouble, Quote, Award } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import BookingBar from '../../components/BookingBar';

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

      {/* --- 1. HERO SECTION (Sáng sủa, Video mờ nhẹ) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10 backdrop-blur-[2px]"></div>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale-[20%]">
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

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-4">
            <button
              onClick={() => navigate('/rooms')}
              className="bg-amber-600 hover:bg-gray-900 text-white px-14 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-amber-600/20 rounded-none"
            >
              Đặt phòng ngay
            </button>
            <button
              onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
              className="group text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 flex items-center gap-3 border-b border-gray-400 pb-2 hover:border-amber-600 hover:text-amber-700 transition-all"
            >
              Khám phá thêm <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- 1.1 BOOKING BAR (Mới) --- */}
      <BookingBar />

      {/* --- 2. THE STORY (Gọn gàng, nhiều khoảng trắng) --- */}
      <section id="explore" className="py-32 px-6 max-w-7xl mx-auto bg-white my-20 shadow-[0_0_50px_rgba(0,0,0,0.02)]">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80"
              className="w-full h-[600px] object-cover shadow-xl"
              alt="Luxury Suite"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl border border-gray-100 hidden md:block">
              <p className="text-4xl font-serif text-amber-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sự hài lòng</p>
            </div>
          </div>

          <div className="space-y-10 order-1 md:order-2">
            <div className="space-y-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block">Kỳ nghỉ mơ ước</span>
              <h2 className="text-4xl md:text-6xl leading-tight text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tuyệt tác <br /> <span className="italic font-light text-amber-700">giữa đại dương</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-loose text-sm md:text-base font-medium">
              Uy Nam Luxury mang đến một chuẩn mực mới về sự tinh tế. Nơi ánh sáng tự nhiên hòa quyện cùng nội thất đương đại, tạo nên không gian nghỉ dưỡng hoàn mỹ dành riêng cho bạn.
            </p>

            <div className="grid grid-cols-2 gap-10 border-t border-gray-200 pt-10">
              <div className="space-y-3">
                <ShieldCheck className="text-amber-600" size={24} strokeWidth={1.5} />
                <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-800">Riêng tư tuyệt đối</h5>
              </div>
              <div className="space-y-3">
                <Zap className="text-amber-600" size={24} strokeWidth={1.5} />
                <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-800">Phục vụ 24/7</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. FEATURED ROOMS (Card trắng nổi bật) --- */}
      <section className="py-32 bg-[#FDFBF7]">
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
                <div key={i} className="h-[450px] bg-gray-200 animate-pulse rounded-xl"></div>
              ))
            ) : featuredRooms.map(room => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:shadow-2xl transition-all duration-500"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.roomType?.image ? `http://localhost:5000/uploads/${room.roomType.image}` : 'https://images.unsplash.com/photo-1590490360182-c33d57733427'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={room.roomNumber}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] font-black uppercase text-amber-700">
                    Phòng {room.roomNumber}
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-2xl font-serif text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{room.roomType?.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6">Đẳng cấp 5 Sao</p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <p className="text-lg font-bold text-amber-600">{Number(room.roomType?.price).toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">đ/đêm</span></p>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. TESTIMONIALS (Dữ liệu thật) --- */}
      {reviews.length > 0 && (
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block">Cảm nhận từ Thượng khách</span>
              <h3 className="text-4xl md:text-6xl italic font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Ký ức <span className="not-italic text-amber-600">tuyệt vời</span></h3>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {reviews.map((rev, idx) => (
                <div key={rev.id} className="relative p-10 bg-[#FDFBF7] rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <Quote className="absolute top-8 right-8 text-amber-600/10 group-hover:text-amber-600/30 transition-colors" size={60} />
                  <div className="flex gap-1 mb-6">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-600" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-loose text-sm mb-10 relative z-10">"{rev.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-black text-xs">
                      {rev.reviewer?.fullName?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">{rev.reviewer?.fullName || 'Khách hàng'}</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest">Thành viên Luxury</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- 5. PRESTIGE & AWARDS --- */}
      <section className="py-24 border-t border-gray-100 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex flex-col items-center gap-2">
              <Award className="text-amber-700" size={32} strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center">World Luxury <br/> Hotel Awards</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="text-amber-700" size={32} strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center">Travelers' <br/> Choice 2024</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="text-amber-700" size={32} strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center">Forbes Travel <br/> Guide Five-Star</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="text-amber-700" size={32} strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center">Condé Nast <br/> Johansens Award</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;