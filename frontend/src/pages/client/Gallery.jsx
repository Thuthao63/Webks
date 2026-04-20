import React, { useState, useEffect } from 'react';
import { X, Maximize2, Camera, Filter } from 'lucide-react';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const images = [
        { id: 1, category: 'Rooms', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', title: 'Luxury Presidential Suite' },
        { id: 2, category: 'Dining', url: 'https://images.unsplash.com/photo-1550966842-307e07f474aa?auto=format&fit=crop&q=80', title: 'Ocean View Restaurant' },
        { id: 3, category: 'Facilities', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80', title: 'Infinity Pool at Sunset' },
        { id: 4, category: 'Rooms', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80', title: 'Heritage Deluxe Room' },
        { id: 5, category: 'Dining', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80', title: 'Private Candlelight Dinner' },
        { id: 6, category: 'Facilities', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80', title: 'The Royal Spa' },
        { id: 7, category: 'Architecture', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', title: 'Grand Lobby Atrium' },
        { id: 8, category: 'Architecture', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80', title: 'Exterior Night View' },
        { id: 9, category: 'Facilities', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80', title: 'Modern Fitness Center' },
    ];

    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    return (
        <div className="bg-[#FDFBF7] min-h-screen pt-44 pb-32 px-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <span className="text-amber-600 text-[11px] font-black uppercase tracking-[0.5em] block">Visual Journey</span>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Thư viện <span className="text-amber-600 not-italic font-bold">Tuyệt tác</span>
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {['All', 'Rooms', 'Dining', 'Facilities', 'Architecture'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === cat 
                                ? 'bg-[#1E293B] text-white shadow-xl' 
                                : 'bg-white text-gray-500 border border-gray-100 hover:border-amber-600 hover:text-amber-600'
                            }`}
                        >
                            {cat === 'All' ? 'Tất cả' : cat}
                        </button>
                    ))}
                </div>

                {/* Masonry-like Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {filteredImages.map((img) => (
                        <div 
                            key={img.id}
                            className="relative group overflow-hidden rounded-[2rem] cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-700 break-inside-avoid"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img 
                                src={img.url} 
                                alt={img.title}
                                className="w-full h-auto object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest mb-2">{img.category}</span>
                                <h3 className="text-xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{img.title}</h3>
                                <div className="mt-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                    <Maximize2 size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                        <X size={40} strokeWidth={1} />
                    </button>
                    
                    <div className="max-w-6xl w-full relative group" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedImage.url} 
                            alt={selectedImage.title}
                            className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                        />
                        <div className="absolute -bottom-16 left-0 w-full text-center">
                            <span className="text-amber-500 text-[11px] font-black uppercase tracking-widest block mb-2">{selectedImage.category}</span>
                            <h2 className="text-3xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedImage.title}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
