import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { 
  Bed, Users, Maximize, ArrowRight, Star, Loader2, 
  SlidersHorizontal, Trash2, Filter, Check
} from 'lucide-react';
import { Slider, ConfigProvider } from 'antd';

const RoomList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  const [filters, setFilters] = useState({
    typeId: searchParams.get('typeId') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 20000000,
    capacity: searchParams.get('capacity') || '',
    status: searchParams.get('status') || ''
  });

  // Đồng bộ URL params vào state khi URL thay đổi (VD: từ trang chủ chuyển sang)
  useEffect(() => {
    setFilters({
      typeId: searchParams.get('typeId') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 20000000,
      capacity: searchParams.get('capacity') || '',
      status: searchParams.get('status') || ''
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axiosClient.get('/rooms/types');
        setRoomTypes(res.data);
      } catch (err) {
        console.error("Lỗi lấy loại phòng:", err);
      }
    };
    fetchTypes();
  }, []);

  const fetchRooms = useCallback(async (currentFilters) => {
    setFiltering(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.typeId) params.append('typeId', currentFilters.typeId);
      if (currentFilters.minPrice > 0) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice < 20000000) params.append('maxPrice', currentFilters.maxPrice);
      if (currentFilters.capacity) params.append('capacity', currentFilters.capacity);
      if (currentFilters.status) params.append('status', currentFilters.status);

      const res = await axiosClient.get(`/rooms?${params.toString()}`);
      setRooms(res.data);
    } catch (err) {
      console.error("Lỗi lọc phòng:", err);
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRooms(filters);
      
      const newParams = {};
      if (filters.typeId) newParams.typeId = filters.typeId;
      if (filters.minPrice > 0) newParams.minPrice = filters.minPrice.toString();
      if (filters.maxPrice < 20000000) newParams.maxPrice = filters.maxPrice.toString();
      if (filters.capacity) newParams.capacity = filters.capacity;
      if (filters.status) newParams.status = filters.status;
      
      // Chỉ cập nhật URL nếu nó thực sự thay đổi để tránh vòng lặp
      const currentParamsString = searchParams.toString();
      const newParamsString = new URLSearchParams(newParams).toString();
      if (currentParamsString !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchRooms, setSearchParams]);

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
  };

  const resetFilters = () => {
    setFilters({
      typeId: '',
      minPrice: 0,
      maxPrice: 20000000,
      capacity: '',
      status: ''
    });
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#B59A6D]" size={40} />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#B59A6D',
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-[#F9F8F6] pt-44 pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-24 space-y-6">
            <span className="text-[#B59A6D] text-[11px] font-black uppercase tracking-[0.6em] block">Exclusive Stay</span>
            <h2 className="text-5xl md:text-7xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tìm không gian riêng
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Bộ lọc */}
            <aside className="lg:w-1/4 space-y-10 h-fit lg:sticky lg:top-40">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SlidersHorizontal size={20} className="text-[#B59A6D]" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Bộ lọc</h3>
                  </div>
                  <button 
                    onClick={resetFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#B59A6D] transition-luxury flex items-center gap-3"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>

                {/* Loại phòng */}
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loại phòng</label>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setFilters(prev => ({...prev, typeId: ''}))}
                      className={`px-6 py-4 rounded-xl text-left text-[11px] font-bold transition-luxury ${filters.typeId === '' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      Tất cả
                    </button>
                    {roomTypes.map(type => (
                      <button 
                        key={type.id}
                        onClick={() => setFilters(prev => ({...prev, typeId: type.id.toString()}))}
                        className={`px-6 py-4 rounded-xl text-left text-[11px] font-bold transition-luxury flex justify-between items-center ${filters.typeId === type.id.toString() ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {type.name}
                        {filters.typeId === type.id.toString() && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lọc theo Giá */}
                <div className="space-y-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Khoảng giá (VNĐ)</label>
                  <div className="px-2">
                    <Slider 
                      range 
                      min={0} 
                      max={20000000} 
                      step={500000}
                      value={[filters.minPrice, filters.maxPrice]}
                      onChange={handlePriceChange}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-black tracking-widest text-[#B59A6D] bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span>{Number(filters.minPrice).toLocaleString()} đ</span>
                    <span>-</span>
                    <span>{Number(filters.maxPrice).toLocaleString()} đ</span>
                  </div>
                </div>

                {/* Sức chứa */}
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sức chứa (Khách)</label>
                  <select 
                    value={filters.capacity}
                    onChange={(e) => setFilters(prev => ({...prev, capacity: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-[11px] font-bold text-slate-600 outline-none focus:border-[#B59A6D]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả</option>
                    <option value="1">1 Khách</option>
                    <option value="2">2 Khách</option>
                    <option value="4">3-4 Khách</option>
                    <option value="10">8-10 Khách</option>
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={filters.status === 'Available'}
                        onChange={(e) => setFilters(prev => ({...prev, status: e.target.checked ? 'Available' : ''}))}
                        className="sr-only"
                      />
                      <div className={`w-14 h-7 rounded-full transition-luxury ${filters.status === 'Available' ? 'bg-[#B59A6D]' : 'bg-slate-200'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-luxury ${filters.status === 'Available' ? 'translate-x-7' : ''}`}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#B59A6D] transition-luxury">Còn phòng trống</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4 space-y-12">
              
              <div className="flex flex-col md:flex-row justify-between items-center bg-white px-10 py-6 rounded-[2rem] border border-slate-100 shadow-sm gap-6">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                  Khám phá <span className="text-[#B59A6D]">{rooms.length}</span> tuyệt tác lưu trú
                </p>
                <div className="flex items-center gap-6">
                  {filtering && (
                    <div className="flex items-center gap-3 text-[#B59A6D]">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Đang cập nhật...</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sắp xếp:</label>
                     <select 
                        onChange={(e) => {
                          const val = e.target.value;
                          const sorted = [...rooms];
                          if (val === 'price-asc') sorted.sort((a,b) => a.roomType?.price - b.roomType?.price);
                          if (val === 'price-desc') sorted.sort((a,b) => b.roomType?.price - a.roomType?.price);
                          if (val === 'capacity') sorted.sort((a,b) => b.roomType?.capacity - a.roomType?.capacity);
                          setRooms(sorted);
                        }}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none cursor-pointer hover:text-[#B59A6D] transition-colors"
                     >
                        <option value="default">Mặc định</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="capacity">Sức chứa lớn nhất</option>
                     </select>
                  </div>
                </div>
              </div>

              {rooms.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-premium">
                  <Filter size={48} className="text-[#B59A6D]/20 mx-auto mb-8" />
                  <h3 className="text-4xl font-serif italic text-slate-900 mb-6">Xin lỗi, không tìm thấy kết quả</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-10">
                    Vui lòng điều chỉnh lại bộ lọc để tìm thấy căn phòng phù hợp nhất dành cho quý khách.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="bg-slate-900 text-white px-12 py-5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B59A6D] transition-luxury shadow-lg"
                  >
                    Bắt đầu lại
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {rooms.map((room) => {
                    const details = room.roomType || {}; 
                    const isAvailable = room.status === 'Available';
                    
                    return (
                      <div 
                        key={room.id} 
                        className="group bg-white border border-slate-100 overflow-hidden hover:border-[#B59A6D]/30 transition-luxury shadow-premium hover:shadow-2xl rounded-[2.5rem]"
                      >
                        <div 
                          className="relative h-64 overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/room/${room.id}`)}
                        >
                          <img 
                            src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                            alt={`Room ${room.roomNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                          />
                          <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 border text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors ${isAvailable ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' : 'bg-red-50/90 text-red-600 border-red-100'}`}>
                            {isAvailable ? 'Khả dụng' : 'Hết phòng'}
                          </div>
                          <div className="absolute bottom-6 right-6 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-[#B59A6D] border border-white/10 uppercase tracking-widest">
                            Phòng {room.roomNumber}
                          </div>
                        </div>

                        <div className="p-8 space-y-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 
                                onClick={() => navigate(`/room/${room.id}`)}
                                className="text-2xl font-serif italic text-slate-900 cursor-pointer hover:text-[#B59A6D] transition-luxury"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                              >
                                {details.name || 'Luxury Suite'}
                              </h4>
                              <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black italic">Private Collection</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#B59A6D] font-serif text-2xl italic leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {Number(details.price || 0).toLocaleString()}
                              </p>
                              <span className="text-[9px] text-slate-300 uppercase tracking-widest font-black mt-1 block">VNĐ / Đêm</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#B59A6D]">
                                <Users size={16} strokeWidth={1} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{details.capacity || 2} Khách</span>
                                <span className="text-[8px] text-slate-300 uppercase font-black tracking-widest mt-0.5">Sức chứa</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 border-l border-slate-50 pl-4">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#B59A6D]">
                                <Maximize size={16} strokeWidth={1} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">45 m²</span>
                                <span className="text-[8px] text-slate-300 uppercase font-black tracking-widest mt-0.5">Diện tích</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button 
                              onClick={() => navigate(`/room/${room.id}`)}
                              className="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-luxury rounded-xl"
                            >
                              Khám phá
                            </button>
                            <button 
                              onClick={() => navigate(`/booking/${room.id}`)}
                              disabled={!isAvailable}
                              className={`flex-[2] py-3.5 text-[10px] font-black uppercase tracking-widest transition-luxury flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-slate-900/10 ${
                                isAvailable 
                                ? 'bg-slate-900 text-white hover:bg-[#B59A6D]' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none'
                              }`}
                            >
                              {isAvailable ? <>Đặt phòng <ArrowRight size={16} /></> : 'Đã hết'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RoomList;