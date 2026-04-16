import React, { useEffect } from 'react';
import { ShieldCheck, Award, Users, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" 
             alt="About Uy Nam Luxury" 
             className="w-full h-full object-cover opacity-60"
           />
         </div>
         <div className="relative z-20 text-center px-6 mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-4xl">
           <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-6 block">Câu Chuyện Của Chúng Tôi</span>
           <h1 className="text-5xl md:text-8xl mb-8 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
             Tuyệt Tác <span className="text-amber-500 font-bold not-italic">Kiến Trúc</span>
           </h1>
           <p className="text-gray-300 text-xs md:text-sm uppercase tracking-[0.3em] leading-loose">
             Uy Nam Luxury ra đời với sứ mệnh tái định nghĩa chuẩn mực nghỉ dưỡng xa xỉ tại Việt Nam.
           </p>
         </div>
      </section>

      {/* 2. THE STORY */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
         <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -z-10"></div>
         
         <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Khởi nguồn cảm hứng</h2>
               <div className="w-16 h-[1px] bg-amber-500"></div>
               <div className="space-y-6 text-gray-400 text-sm leading-loose">
                  <p>
                    Được thành lập từ năm 2018, Uy Nam Luxury khởi đầu từ một ý tưởng táo bạo: tạo ra một không gian tuyệt mật, nơi ranh giới giữa kiến trúc hiện đại và vẻ đẹp nguyên sơ của thiên nhiên được xóa nhòa.
                  </p>
                  <p>
                    Mỗi chi tiết tại khách sạn đều được thiết kế tỉ mỉ bởi các kiến trúc sư danh tiếng toàn cầu. Từ vật liệu cao cấp, ánh sáng, cho đến âm nhạc và hương thơm – tất cả hòa quyện tạo nên một trải nghiệm nghệ thuật đánh thức mọi giác quan.
                  </p>
               </div>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 border border-amber-500/20 rounded-2xl rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80" 
                 alt="Hotel Interior" 
                 className="w-full h-auto rounded-2xl relative z-10 shadow-2xl"
               />
            </div>
         </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="py-32 bg-[#080808] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h3 className="text-3xl md:text-5xl font-serif italic text-amber-500" style={{ fontFamily: "'Playfair Display', serif" }}>Triết lý phục vụ</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">3 giá trị cốt lõi làm nên thương hiệu</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors group">
                  <ShieldCheck size={40} className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                  <h4 className="text-xl font-bold mb-4">Riêng Tư Tuyệt Đối</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Không gian được tối ưu để đảm bảo sự riêng tư hoàn hảo, bảo mật danh tính và đem lại sự thảnh thơi trọn vẹn.</p>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors group">
                  <Star size={40} className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                  <h4 className="text-xl font-bold mb-4">Cá Nhân Hoá</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Mỗi dịch vụ, từ ẩm thực đến liệu trình chăm sóc sức khoẻ, đều được thiết kế riêng theo sở thích của từng vị khách.</p>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors group">
                  <Award size={40} className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                  <h4 className="text-xl font-bold mb-4">Tiêu Chuẩn Toàn Cầu</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">Hệ thống phòng nghỉ và tiện ích đạt tiêu chuẩn 5 sao quốc tế, với đội ngũ chuyên gia được đào tạo khắt khe.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="py-24 border-t border-b border-white/5 bg-gradient-to-r from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-white/5">
           <div>
             <div className="text-4xl md:text-6xl font-black text-amber-500 mb-2 font-serif">5+</div>
             <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Năm kinh nghiệm</div>
           </div>
           <div>
             <div className="text-4xl md:text-6xl font-black text-amber-500 mb-2 font-serif">10k</div>
             <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Khách hàng hài lòng</div>
           </div>
           <div>
             <div className="text-4xl md:text-6xl font-black text-amber-500 mb-2 font-serif">120</div>
             <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Phòng tiêu chuẩn</div>
           </div>
           <div>
             <div className="text-4xl md:text-6xl font-black text-amber-500 mb-2 font-serif">20</div>
             <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Giải thưởng quốc tế</div>
           </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-32 text-center px-6">
         <h2 className="text-3xl md:text-5xl font-serif italic mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Khám phá kỷ nguyên nghỉ dưỡng mới
         </h2>
         <button 
           onClick={() => navigate('/rooms')} 
           className="inline-flex items-center gap-3 bg-amber-600 hover:bg-white text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-full"
         >
            Xem Phòng Ngay <ArrowRight size={16} />
         </button>
      </section>

    </div>
  );
};

export default About;
