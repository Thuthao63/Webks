import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, ArrowLeft, Home, Compass } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 overflow-hidden relative">
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] -z-10"></div>
            <div className="absolute top-20 right-20 w-64 h-64 border border-white/5 rounded-full rotate-45 -z-10"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 border border-white/5 rounded-full -rotate-12 -z-10"></div>

            <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
                
                {/* 404 Visual */}
                <div className="relative inline-block">
                    <h1 className="text-[12rem] md:text-[20rem] font-serif italic leading-none opacity-10 select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 border border-amber-500/30 rounded-full flex items-center justify-center bg-[#050505] shadow-[0_0_50px_rgba(217,119,6,0.2)] animate-pulse">
                            <Compass size={60} className="text-amber-500" strokeWidth={1} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Hành trình <span className="text-amber-500 not-italic">bị gián đoạn</span>
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.4em] leading-loose max-w-md mx-auto font-medium">
                        Có vẻ như Thảo đã đi lạc vào một không gian chưa được khai phá. Hãy để chúng tôi dẫn đường trở lại.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-amber-500 transition-all flex items-center justify-center gap-3 shadow-2xl"
                    >
                        <Home size={16} /> Về trang chủ
                    </button>
                    <button 
                        onClick={() => navigate('/rooms')}
                        className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    >
                        <Bed size={16} /> Danh mục phòng
                    </button>
                </div>

                {/* Decorative Brand footer */}
                <div className="pt-20 flex flex-col items-center gap-4 opacity-40">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-amber-500"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-serif tracking-[0.3em] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>Uy Nam</span>
                        <span className="text-[7px] tracking-[0.6em] text-amber-500 uppercase font-black">Private Collection</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotFound;
