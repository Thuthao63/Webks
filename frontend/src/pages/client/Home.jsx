import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, MapPin, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#050505] text-white selection:bg-amber-500 selection:text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Lớp phủ tối sâu hơn để nổi bật chữ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 z-10"></div>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/video/hotel.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex justify-center gap-1.5 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-amber-500" fill="currentColor" />
            ))}
          </div>
          
          <h1 className="mb-8 tracking-tight leading-[0.9]" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="block text-4xl md:text-6xl font-light mb-4 tracking-[0.2em] uppercase">The Art of</span>
            <span className="block text-7xl md:text-[12rem] font-bold italic text-amber-500">Living</span>
          </h1>

          <p className="text-gray-300 text-xs md:text-sm uppercase tracking-[0.6em] mb-12 max-w-2xl mx-auto leading-loose">
            Đẳng cấp nghỉ dưỡng vô cực giữa lòng đại dương
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button 
              onClick={() => navigate('/rooms')} 
              className="bg-amber-600 hover:bg-white text-black px-14 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-700 shadow-xl shadow-amber-600/10"
            >
              Đặt phòng ngay
            </button>
            <button 
              onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
              className="group text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 border-b border-white/20 pb-2 hover:border-amber-500 transition-all"
            >
              Khám phá thêm <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform"/>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>
      </section>

      {/* --- 2. THE STORY --- */}
      <section id="explore" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-32 items-center">
          <div className="relative order-2 md:order-1">
             <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px] -z-10"></div>
             <img 
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80" 
                className="w-full h-[700px] object-cover rounded-sm shadow-2xl brightness-90 hover:brightness-100 transition-all duration-1000" 
                alt="Luxury Suite" 
             />
             <div className="absolute bottom-10 -right-10 bg-[#0a0a0a] p-10 border border-white/5 hidden md:block">
                <p className="text-4xl font-serif text-amber-500 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>100%</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sự hài lòng</p>
             </div>
          </div>

          <div className="space-y-12 order-1 md:order-2">
            <div className="space-y-6">
              <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.5em] block">Kỳ nghỉ mơ ước</span>
              <h2 className="text-5xl md:text-8xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tuyệt tác <br/> <span className="italic font-light">giữa biển khơi</span>
              </h2>
            </div>
            
            <p className="text-gray-400 leading-[2] text-sm md:text-base font-light">
              Uy Nam Luxury mang đến một chuẩn mực mới về sự tinh tế. Không chỉ là nơi nghỉ ngơi, 
              đó là không gian nghệ thuật nơi Thảo có thể tận hưởng sự tĩnh lặng tuyệt đối 
              và dịch vụ cá nhân hoá đến từng chi tiết nhỏ nhất.
            </p>

            <div className="grid grid-cols-2 gap-10 border-t border-white/10 pt-12">
              <div className="space-y-4">
                <ShieldCheck className="text-amber-500" size={28} strokeWidth={1} />
                <h5 className="text-[11px] uppercase tracking-widest font-bold">Bảo mật cao cấp</h5>
              </div>
              <div className="space-y-4">
                <Zap className="text-amber-500" size={28} strokeWidth={1} />
                <h5 className="text-[11px] uppercase tracking-widest font-bold">Phục vụ 24/7</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. AMENITIES GRID --- */}
      <section className="py-40 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h3 className="text-4xl md:text-6xl italic" style={{ fontFamily: "'Playfair Display', serif" }}>Trải nghiệm đặc quyền</h3>
            <div className="w-20 h-[1px] bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            <FeatureCard 
              icon={<MapPin size={30} strokeWidth={1}/>}
              title="Vị trí đắc địa"
              desc="Toạ lạc tại trung tâm bãi biển đẹp nhất Đà Nẵng."
            />
            <FeatureCard 
              icon={<Star size={30} strokeWidth={1}/>}
              title="Dịch vụ 5 sao"
              desc="Tận tâm phục vụ theo yêu cầu riêng của từng khách hàng."
            />
            <FeatureCard 
              icon={<Zap size={30} strokeWidth={1}/>}
              title="Ẩm thực quốc tế"
              desc="Hành trình mỹ vị từ các đầu bếp đạt giải thưởng lớn."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 p-16 border border-white/5 hover:bg-white hover:text-black transition-all duration-700 group cursor-default">
    <div className="text-amber-500 group-hover:text-black transition-colors mb-10 uppercase">
      {icon}
    </div>
    <h4 className="text-2xl mb-4 font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h4>
    <p className="text-[11px] leading-loose tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
      {desc}
    </p>
  </div>
);

export default Home;