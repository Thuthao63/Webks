import React, { useEffect, useState, useRef } from 'react';
import { 
  ShieldCheck, Award, Users, Star, ArrowRight, 
  MapPin, Phone, Mail, Globe, 
  Quote, ChevronRight, Building, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    const team = [
        { name: "Uy Nam", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" },
        { name: "Elena Trinh", role: "Chief Architect", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" },
        { name: "Marcus Vu", role: "General Manager", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
    ];

    return (
        <div className="bg-[#FDFBF7] text-[#1E293B] selection:bg-amber-600 selection:text-white font-sans min-h-screen">

            {/* 1. HERO BANNER - LIGHT & AIRY */}
            <section id="hero" className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
                        alt="Hero"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className={`max-w-2xl transition-all duration-1000 ${isVisible['hero'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[1px] bg-amber-600"></div>
                            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">Est. 2018</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl leading-tight mb-8 font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Nơi Thời Gian <br /> 
                            <span className="text-amber-600 not-italic font-bold">Ngừng Lại</span>
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base leading-loose max-w-lg mb-10 translate-y-4">
                            Kiến tạo những trải nghiệm nghỉ dưỡng xa xỉ, nơi mỗi khoảnh khắc đều là một tác phẩm nghệ thuật trọn vẹn.
                        </p>
                        <div className="flex items-center gap-8">
                            <button 
                                onClick={() => navigate('/rooms')}
                                className="bg-[#1E293B] hover:bg-amber-600 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-full flex items-center gap-3 shadow-xl"
                            >
                                Khám Phá <ArrowRight size={16} />
                            </button>
                            <div className="hidden md:flex flex-col">
                                <span className="text-xs font-black text-amber-600 italic">"Tuyệt tác nghỉ dưỡng"</span>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">International Design Awards</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Text Decoration */}
                <div className="absolute right-10 bottom-10 vertical-text hidden lg:block opacity-20">
                   <p className="text-[10px] font-black uppercase tracking-[1em] rotate-180" style={{ writingMode: 'vertical-rl' }}>UY NAM LUXURY HOTEL & RESORT</p>
                </div>
            </section>

            {/* 2. THE STORY - TWO COLUMN GRID */}
            <section id="story" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className={`relative transition-all duration-1000 delay-300 ${isVisible['story'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                            <div className="absolute -inset-10 border-[20px] border-[#FDFBF7] z-20 pointer-events-none"></div>
                            <div className="relative group overflow-hidden rounded-[2.5rem]">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                                    alt="Hotel Architecture"
                                    className="w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-700"></div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-amber-600 text-white p-12 rounded-[2rem] shadow-2xl z-20 hidden md:block">
                                <Sparkles size={32} className="mb-4" />
                                <p className="text-3xl font-serif italic mb-1">05+</p>
                                <p className="text-[9px] uppercase tracking-widest font-black opacity-80">Năm di sản bản địa</p>
                            </div>
                        </div>

                        <div className={`space-y-10 transition-all duration-1000 ${isVisible['story'] ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[9px] font-black uppercase tracking-widest">
                                <Building size={12} /> Hành trình kiến tạo
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif italic leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Từ tâm huyết đến một <br />
                                <span className="text-amber-600">biểu tượng thượng lưu</span>
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base leading-loose italic font-medium">
                                "Uy Nam Luxury không đơn thuần là một khách sạn. Đó là một cam kết về sự tinh tế, một không gian nơi mỗi vị khách đều cảm thấy mình là trung tâm của vũ trụ nghệ thuật."
                            </p>
                            <div className="space-y-6 text-gray-500 text-sm leading-relaxed">
                                <p>
                                    Được ấp ủ từ giấc mơ mang chuẩn mực xa xỉ thế giới về với kiến trúc bản địa, Uy Nam đã vượt qua mọi giới hạn để trở thành điểm đến ưu tiên của giới thượng lưu.
                                </p>
                                <p>
                                    Chúng tôi tin rằng sự sang trọng thực sự nằm ở những chi tiết nhỏ nhất. Từ tiếng chuông gió rung khẽ ở hành lang đến hương tinh dầu nhài nồng nàn trong sảnh đợi – mọi trải nghiệm đều được "may đo" riêng cho bạn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. TEAM - NEW LEADERSHIP SECTION */}
            <section id="team" className="py-32 bg-[#FDFBF7]">
                <div className="container mx-auto px-6 text-center mb-20">
                     <h3 className="text-3xl md:text-5xl font-serif italic text-amber-600 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Những người dẫn dắt</h3>
                     <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Đội ngũ ban quản trị & Sáng tạo</p>
                </div>

                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
                   {team.map((member, idx) => (
                      <div key={idx} className={`group transition-all duration-1000 delay-${idx*200} ${isVisible['team'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                         <div className="relative mb-8 overflow-hidden rounded-[2rem] aspect-[4/5] shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                               <div className="flex gap-4 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-600 transition-colors cursor-pointer"><Globe size={14} /></div>
                                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-600 transition-colors cursor-pointer"><Mail size={14} /></div>
                               </div>
                            </div>
                         </div>
                         <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                         <p className="text-[10px] uppercase tracking-widest text-amber-600 font-black">{member.role}</p>
                      </div>
                   ))}
                </div>
            </section>

            {/* 4. CORE VALUES - LIGHT GLASS CARDS */}
            <section id="values" className="py-32 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-end mb-24">
                       <div className="max-w-2xl">
                          <h3 className="text-4xl md:text-6xl font-serif italic mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Gìn giữ những <br /> <span className="text-amber-600">tinh hoa cốt lõi</span>
                          </h3>
                       </div>
                       <div className="flex-1 lg:pb-4 border-l-2 border-amber-600 pl-8">
                          <p className="text-gray-500 text-sm uppercase tracking-widest leading-loose">Hơn cả một khách sạn, chúng tôi kiến tạo phong cách sống.</p>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShieldCheck size={32} />, title: "An Yên Tuyệt Đối", desc: "Không gian được thiết kế để bạn tìm lại chính mình trong sự tĩnh lặng và bảo mật hoàn hảo." },
                            { icon: <Star size={32} />, title: "Chạm Đến Cảm Xúc", desc: "Mỗi dịch vụ đều xuất phát từ sự thấu hiểu và chân thành của đội ngũ nhân viên." },
                            { icon: <Award size={32} />, title: "Gout Thượng Lưu", desc: "Nghệ thuật thưởng lãm tinh tế trong từng bữa ăn, kiến trúc và tiện ích đi kèm." },
                        ].map((v, i) => (
                            <div key={i} className={`p-12 bg-[#FDFBF7] rounded-[2.5rem] border border-gray-100 hover:border-amber-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group transition-all duration-1000 delay-${i*200} ${isVisible['values'] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                                <div className="text-amber-600 mb-8 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    {v.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-4">{v.title}</h4>
                                <p className="text-gray-500 text-xs leading-loose">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. QUOTE SECTION */}
            <section id="quote" className="py-40 bg-[#1E293B] text-white relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                   <img src="https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Texture" />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                   <div className={`transition-all duration-1000 ${isVisible['quote'] ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                      <Quote size={64} className="mx-auto mb-10 text-amber-500 opacity-50" />
                      <h2 className="text-4xl md:text-6xl font-serif italic leading-tight max-w-4xl mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
                        "Chúng tôi không bán phòng ở, chúng tôi trao tặng những kỷ niệm sẽ đi cùng bạn suốt cuộc đời."
                      </h2>
                      <div className="w-20 h-1 bg-amber-600 mx-auto mt-12 rounded-full"></div>
                   </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section id="cta" className="py-32 bg-[#FDFBF7]">
               <div className="container mx-auto px-6">
                  <div className={`bg-white border border-gray-100 rounded-[3rem] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden transition-all duration-1000 ${isVisible['cta'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                     <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full -ml-16 -mt-16"></div>
                     <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Kế hoạch cho chuyến đi</span>
                     <h2 className="text-4xl md:text-7xl font-serif italic mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                         Sẵn sàng trải nghiệm <br /> <span className="text-amber-600">đẳng cấp mới?</span>
                     </h2>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button 
                            onClick={() => navigate('/rooms')}
                            className="bg-[#1E293B] hover:bg-amber-600 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-full"
                        >
                            Đặt Phòng Ngay
                        </button>
                        <button 
                            onClick={() => navigate('/contact')}
                            className="border border-[#1E293B] hover:bg-[#1E293B] hover:text-white text-[#1E293B] px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-full"
                        >
                            Liên Hệ Tư Vấn
                        </button>
                     </div>
                  </div>
               </div>
            </section>

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>

        </div>
    );
};

export default About;

