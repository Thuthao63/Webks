import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { 
  Bed, Users, Maximize, ArrowRight, Star, Loader2, 
  SlidersHorizontal, Trash2, Filter, Check
} from 'lucide-react';
import { Slider, ConfigProvider } from 'antd';

const RoomList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  const [filters, setFilters] = useState({
    typeId: searchParams.get('typeId') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 20000000,
    capacity: searchParams.get('capacity') || '',
    status: searchParams.get('status') || '',
    checkInDate: searchParams.get('checkInDate') || '',
    checkOutDate: searchParams.get('checkOutDate') || '',
    hasDiscount: searchParams.get('hasDiscount') === 'true'
  });

  // Đồng bộ URL params vào state khi URL thay đổi (VD: từ trang chủ chuyển sang)
  useEffect(() => {
    setFilters({
      typeId: searchParams.get('typeId') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 20000000,
      capacity: searchParams.get('capacity') || '',
      status: searchParams.get('status') || '',
      checkInDate: searchParams.get('checkInDate') || '',
      checkOutDate: searchParams.get('checkOutDate') || '',
      hasDiscount: searchParams.get('hasDiscount') === 'true'
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, discountsRes] = await Promise.all([
          axiosClient.get('/rooms/types'),
          axiosClient.get('/discounts/active')
        ]);
        setRoomTypes(typesRes.data);
        setActiveDiscounts(discountsRes.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu khởi tạo:", err);
      }
    };
    fetchData();
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
      if (currentFilters.checkInDate) params.append('checkInDate', currentFilters.checkInDate);
      if (currentFilters.checkOutDate) params.append('checkOutDate', currentFilters.checkOutDate);

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
      if (filters.checkInDate) newParams.checkInDate = filters.checkInDate;
      if (filters.checkOutDate) newParams.checkOutDate = filters.checkOutDate;
      if (filters.hasDiscount) newParams.hasDiscount = 'true';
      
      // Chỉ cập nhật URL nếu nó thực sự thay đổi để tránh vòng lặp
      const currentParamsString = searchParams.toString();
      const newParamsString = new URLSearchParams(newParams).toString();
      if (currentParamsString !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchRooms, searchParams, setSearchParams]);

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
      <div className="h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={40} />
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
      <div className="min-h-screen bg-cream pt-24 pb-12 px-2 md:px-6 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-8 space-y-2">
            <span className="text-amber-500 text-sm font-black uppercase tracking-wider block font-sans">Exclusive Stay</span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-slate-900">{t('roomList.header')}</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Bộ lọc */}
            <aside className="lg:w-1/5 space-y-4 h-fit lg:sticky lg:top-24">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-premium space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SlidersHorizontal size={20} className="text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">Bộ lọc</h3>
                  </div>
                  <button 
                    onClick={resetFilters}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-luxury flex items-center gap-3 font-sans"
                  >
                    <Trash2 size={14} />{t('roomList.clear')}</button>
                </div>

                {/* --- LỌC NGÀY (QUAN TRỌNG) --- */}
                <div id="filter-dates" className="space-y-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Thời gian lưu trú
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-sans">Ngày Check-in</label>
                      <input 
                        type="date" 
                        value={filters.checkInDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({...prev, checkInDate: e.target.value}))}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-900 outline-none focus:border-amber-500 transition-all cursor-pointer shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-sans">Ngày Check-out</label>
                      <input 
                        type="date" 
                        value={filters.checkOutDate}
                        min={filters.checkInDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({...prev, checkOutDate: e.target.value}))}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-900 outline-none focus:border-amber-500 transition-all cursor-pointer shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Loại phòng */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('roomList.room_type')}</label>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setFilters(prev => ({...prev, typeId: ''}))}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold transition-luxury ${filters.typeId === '' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      Tất cả
                    </button>
                    {roomTypes.map(type => (
                      <button 
                        key={type.id}
                        onClick={() => setFilters(prev => ({...prev, typeId: type.id.toString()}))}
                        className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold transition-luxury flex justify-between items-center font-sans ${filters.typeId === type.id.toString() ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {type.name}
                        {filters.typeId === type.id.toString() && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lọc theo Giá */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('roomList.price_range')}</label>
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
                  <div className="flex justify-between text-[11px] font-black tracking-widest text-amber-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <span>{Number(filters.minPrice).toLocaleString()} đ</span>
                    <span>-</span>
                    <span>{Number(filters.maxPrice).toLocaleString()} đ</span>
                  </div>
                </div>

                {/* Sức chứa */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('roomList.capacity')}</label>
                  <select 
                    value={filters.capacity}
                    onChange={(e) => setFilters(prev => ({...prev, capacity: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-600 outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">{t('roomList.all')}</option>
                    <option value="1">{t('roomList.guests_1')}</option>
                    <option value="2">{t('roomList.guests_2')}</option>
                    <option value="4">{t('roomList.guests_4')}</option>
                    <option value="10">{t('roomList.guests_10')}</option>
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">{t('roomList.status')}</label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={filters.status === 'Available'}
                        onChange={(e) => setFilters(prev => ({...prev, status: e.target.checked ? 'Available' : ''}))}
                        className="sr-only"
                      />
                      <div className={`w-9 h-5 rounded-full transition-luxury ${filters.status === 'Available' ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-luxury ${filters.status === 'Available' ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-amber-500 transition-luxury font-sans">{t('roomList.available')}</span>
                  </label>
                </div>
                
                {/* Lọc Khuyến mãi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">Khuyến mãi</label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={filters.hasDiscount}
                        onChange={(e) => setFilters(prev => ({...prev, hasDiscount: e.target.checked}))}
                        className="sr-only"
                      />
                      <div className={`w-9 h-5 rounded-full transition-luxury ${filters.hasDiscount ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-luxury ${filters.hasDiscount ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-amber-500 transition-luxury font-sans">Đang giảm giá</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-4/5 space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-center bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm gap-2">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic font-sans">
                  Khám phá <span className="text-amber-500">{(() => {
                    const displayed = rooms.filter(room => {
                       if (filters.hasDiscount) {
                          const hasActive = activeDiscounts.find(d => d.roomTypeId === (room.roomType?.id || room.typeId));
                          if (!hasActive) return false;
                       }
                       return true;
                    });
                    return displayed.length;
                  })()}</span> phòng nghỉ cao cấp
                </p>
                <div className="flex items-center gap-4">
                  {filtering && (
                    <div className="flex items-center gap-2 text-amber-500">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Đang cập nhật...</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">{t('roomList.sort')}</label>
                     <select 
                        onChange={(e) => {
                          const val = e.target.value;
                          const sorted = [...rooms];
                          if (val === 'price-asc') sorted.sort((a,b) => a.roomType?.price - b.roomType?.price);
                          if (val === 'price-desc') sorted.sort((a,b) => b.roomType?.price - a.roomType?.price);
                          if (val === 'capacity') sorted.sort((a,b) => b.roomType?.capacity - a.roomType?.capacity);
                          setRooms(sorted);
                        }}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none cursor-pointer hover:text-amber-500 transition-colors"
                     >
                        <option value="default">{t('roomList.sort_default')}</option>
                        <option value="price-asc">{t('roomList.price_asc')}</option>
                        <option value="price-desc">{t('roomList.price_desc')}</option>
                        <option value="capacity">{t('roomList.largest_cap')}</option>
                     </select>
                  </div>
                </div>
              </div>

              {(() => {
                 const displayedRooms = rooms.filter(room => {
                    if (filters.hasDiscount) {
                       const hasActive = activeDiscounts.find(d => d.roomTypeId === (room.roomType?.id || room.typeId));
                       if (!hasActive) return false;
                    }
                    return true;
                 });
                 
                 return displayedRooms.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-premium">
                  <Filter size={48} className="text-amber-500/20 mx-auto mb-8" />
                  <h3 className="text-4xl font-serif italic text-slate-900 mb-6">{t('roomList.no_results')}</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-10">
                    Vui lòng điều chỉnh lại bộ lọc để tìm thấy căn phòng phù hợp nhất dành cho quý khách.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="bg-slate-900 text-white px-12 py-4 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-luxury shadow-lg"
                  >
                    Bắt đầu lại
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedRooms.map((room) => {
                    const details = room.roomType || {}; 
                    // Tìm khuyến mãi cho hạng phòng này
                    const isAvailable = room.status !== 'Maintenance';
                    const discount = activeDiscounts.find(d => d.roomTypeId === details.id);
                    const originalPrice = Number(details.price || 0);
                    const discountedPrice = discount 
                      ? originalPrice * (1 - Number(discount.discountPercent) / 100) 
                      : originalPrice;
                    
                    return (
                      <div 
                        key={room.id} 
                        className="group bg-white border border-slate-100 overflow-hidden hover:border-amber-500/30 transition-luxury shadow-premium hover:shadow-2xl rounded-xl flex flex-col"
                      >
                        <div 
                          className="relative h-36 overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/room/${room.id}`)}
                        >
                          <img 
                            src={`/Hinh anh/Hinh${(room.id % 20) + 1}.png`}
                            alt={`Room ${room.roomNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                          />
                          <div className={`absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 border text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors ${isAvailable ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' : 'bg-red-50/90 text-red-600 border-red-100'}`}>
                            {isAvailable ? 'Khả dụng' : 'Hết phòng'}
                          </div>
                          {discount && (
                            <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                              Ưu đãi -{Math.floor(discount.discountPercent)}%
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-amber-500 border border-white/10 uppercase tracking-widest">
                            Phòng {room.roomNumber}
                          </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="space-y-0.5">
                              <h4 
                                onClick={() => navigate(`/room/${room.id}`)}
                                className="text-[15px] font-serif italic text-slate-900 cursor-pointer hover:text-amber-500 transition-luxury line-clamp-1"
                               
                              >
                                {details.name || 'Luxury Suite'}
                              </h4>
                              <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black italic font-sans">Private Collection</p>
                            </div>
                            <div className="text-right">
                              {discount && (
                                <p className="text-[9px] text-slate-300 line-through font-bold decoration-rose-500/30">
                                  {originalPrice.toLocaleString()}đ
                                </p>
                              )}
                              <p className="text-amber-500 font-serif text-[15px] italic leading-none mt-1">
                                {discountedPrice.toLocaleString()}
                              </p>
                              <span className="text-[8px] text-slate-300 uppercase tracking-widest font-black mt-1 block">{t('roomList.per_night')}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-50 mb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-amber-500">
                                <Users size={12} strokeWidth={1} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-sans">{details.capacity || 2} Khách</span>
                                <span className="text-[7px] text-slate-300 uppercase font-black tracking-widest mt-0.5 font-sans">Sức chứa</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 border-l border-slate-50 pl-2">
                              <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-amber-500">
                                <Maximize size={12} strokeWidth={1} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-sans">45 m²</span>
                                <span className="text-[7px] text-slate-300 uppercase font-black tracking-widest mt-0.5 font-sans">{t('roomList.area')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-auto">
                            <button 
                              onClick={() => {
                                const qs = (filters.checkInDate && filters.checkOutDate) ? `?checkInDate=${filters.checkInDate}&checkOutDate=${filters.checkOutDate}` : '';
                                navigate(`/room/${room.id}${qs}`);
                              }}
                              className="flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-luxury rounded-md font-sans"
                            >{t('roomList.explore')}</button>

                            {/* Bắt buộc chọn ngày trước khi đặt */}
                            {(!filters.checkInDate || !filters.checkOutDate) ? (
                              <button 
                                onClick={() => {
                                  const el = document.getElementById('filter-dates');
                                  if(el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    el.classList.add('ring-2', 'ring-rose-500', 'ring-offset-2');
                                    setTimeout(() => el.classList.remove('ring-2', 'ring-rose-500', 'ring-offset-2'), 1500);
                                  }
                                }}
                                className="flex-[1.5] py-1.5 text-[8px] font-black uppercase tracking-widest transition-luxury flex items-center justify-center gap-1.5 rounded-md shadow-lg shadow-slate-900/10 font-sans bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
                              >
                                Vui lòng chọn ngày
                              </button>
                            ) : (
                              <button 
                                onClick={() => navigate(`/booking/${room.id}?checkInDate=${filters.checkInDate}&checkOutDate=${filters.checkOutDate}`)}
                                disabled={!isAvailable}
                                className={`flex-[1.5] py-1.5 text-[8px] font-black uppercase tracking-widest transition-luxury flex items-center justify-center gap-1.5 rounded-md shadow-lg shadow-slate-900/10 font-sans ${
                                  isAvailable 
                                  ? 'bg-slate-900 text-white hover:bg-amber-500' 
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none'
                                }`}
                              >
                                {isAvailable ? <>{t('roomList.book_now')} <ArrowRight size={10} /></> : 'Đã hết'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
              })()}
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RoomList;

