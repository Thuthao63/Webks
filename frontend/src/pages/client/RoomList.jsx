import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Bed, Users, Maximize, ArrowRight, Star, Loader2 } from 'lucide-react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosClient.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-40 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Tiêu đề trang - Chỉnh lại font chuẩn Luxury */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.6em] block">Exclusive Stay</span>
          <h2 className="text-6xl md:text-8xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Danh sách phòng nghỉ
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-8"></div>
        </div>

        {/* Lưới danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rooms.map((room) => {
            // Đảm bảo lấy dữ liệu từ roomType (Alias chuẩn)
            const details = room.roomType || {}; 
            
            return (
              <div 
                key={room.id} 
                className="group bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-700 shadow-2xl"
              >
                {/* Hình ảnh phòng */}
                <div 
                  className="relative h-80 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  <img 
                    src={details.image ? `http://localhost:5000/uploads/${details.image}` : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'}
                    alt={room.roomNumber}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 border border-white/10 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                    {room.status === 'Available' ? 'Phòng trống' : 'Đã đặt'}
                  </div>
                </div>

                {/* Thông tin phòng */}
                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 
                        onClick={() => navigate(`/room/${room.id}`)}
                        className="text-2xl font-serif italic text-white mb-2 cursor-pointer hover:text-amber-500 transition-colors" 
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Phòng {room.roomNumber}
                      </h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {details.name || 'Luxury Suite'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-serif text-2xl italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {Number(details.price || 0).toLocaleString()}
                      </p>
                      <p className="text-[8px] text-gray-600 uppercase tracking-widest font-black mt-1">VNĐ / Đêm</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 py-6 border-y border-white/5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={12} className="text-amber-500" />
                        <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">Sức chứa</span>
                      </div>
                      <span className="text-[10px] text-white uppercase font-black tracking-widest">
                        {details.capacity || 2} Khách
                      </span>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5"></div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Maximize size={12} className="text-amber-500" />
                        <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">Diện tích</span>
                      </div>
                      <span className="text-[10px] text-white uppercase font-black tracking-widest">45 m²</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/booking/${room.id}`)}
                    disabled={room.status !== 'Available'}
                    className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 ${
                      room.status === 'Available' 
                      ? 'bg-amber-600 text-black hover:bg-white' 
                      : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {room.status === 'Available' ? (
                      <>Đặt phòng ngay <ArrowRight size={14} /></>
                    ) : (
                      'Không khả dụng'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomList;