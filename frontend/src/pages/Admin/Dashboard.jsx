import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import { Bed, CalendarCheck, DollarSign, Loader2, TrendingUp, Clock, CheckCircle, XCircle, ChevronRight, Package, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, bookings] = await Promise.all([
          axiosClient.get('/rooms'),
          axiosClient.get('/bookings')
        ]);
        
        // 1. Tính toán thống kê
        const totalRevenue = bookings.data.reduce((sum, b) => 
          sum + (b.status === 'completed' || b.status === 'confirmed' ? Number(b.totalPrice) : 0), 0
        );
        
        setStats({
          rooms: rooms.data.length,
          bookings: bookings.data.length,
          revenue: totalRevenue
        });

        // 2. Lấy 5 đơn hàng mới nhất 
        const sortedBookings = [...bookings.data].sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setRecentBookings(sortedBookings.slice(0, 5));

      } catch (err) { 
        console.error("Lỗi lấy dữ liệu Dashboard:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm render Badge
  const renderStatus = (status) => {
    const config = {
        pending: { color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
        confirmed: { color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
        cancelled: { color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]', icon: <XCircle size={12}/>, text: 'Đã hủy' },
        completed: { color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(96,165,250,0.2)]', icon: <Package size={12}/>, text: 'Hoàn thành' }
    };
    const s = config[status] || config.pending;
    return (
        <span className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${s.color}`}>
            {s.icon} {s.text}
        </span>
    );
  };

  const statCards = [
    { title: 'Phòng trong kho', value: stats.rooms, icon: <Bed size={28}/>, glow: 'group-hover:shadow-[0_0_40px_rgba(217,119,6,0.2)]', iconColor: 'text-amber-400' },
    { title: 'Lượt Booking', value: stats.bookings, icon: <CalendarCheck size={28}/>, glow: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]', iconColor: 'text-emerald-400' },
    { title: 'Tổng Doanh Thu', value: `${stats.revenue.toLocaleString()}đ`, icon: <TrendingUp size={28}/>, glow: 'group-hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]', iconColor: 'text-sky-400' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div className="relative z-10 flex flex-col items-center">
        <Activity className="animate-bounce text-amber-500 mb-4" size={48} />
        <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse">Khởi tạo dữ liệu hệ thống</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050505] to-[#000] text-white p-6 md:p-10 pt-24 relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute -left-40 top-40 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        <AdminNav />
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-sm">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bảng điều khiển <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Admin</span>
            </h2>
            <p className="text-gray-400 text-[11px] mt-4 tracking-[0.4em] uppercase font-bold flex items-center gap-2">
              Uy Nam Luxury Hotel Management <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute inset-0 animate-ping opacity-75"></div>
            </div>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Hệ thống Live</span>
          </div>
        </div>
        
        {/* --- LƯỚI THỐNG KÊ --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((item, idx) => (
            <div key={idx} className={`relative overflow-hidden bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all duration-700 group hover:-translate-y-3 shadow-xl ${item.glow}`}>
              {/* Background Ambient Component */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.iconColor} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-3">{item.title}</p>
                  <p className="text-4xl font-serif italic text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-500" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- HOẠT ĐỘNG GẦN ĐÂY --- */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-40 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-10 border-b border-white/10 pb-6">
            <h3 className="text-2xl font-serif italic text-white flex items-center gap-4" style={{ fontFamily: "'Playfair Display', serif" }}>
               <div className="w-1.5 h-8 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
               Giao dịch hiển vi
            </h3>
            <button className="text-[10px] text-amber-500 hover:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full uppercase font-black tracking-widest transition-all flex items-center gap-1 border border-amber-500/30">
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((b, index) => (
                <div key={b.id || index} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:border-white/20 transition-all duration-500 gap-6 backdrop-blur-md">
                  
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(217,119,6,0.3)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-sm pointer-events-none"></div>
                      <span className="relative z-10">{(b.user?.fullName || b.customer?.fullName || 'U').charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-sm">{b.user?.fullName || 'Khách vãng lai'}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium tracking-wide">
                        <span className="flex items-center gap-1.5"><Bed size={14} className="text-amber-500"/> P.{b.room?.roomNumber || '---'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-500"/> {new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5">Trị giá</p>
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 drop-shadow-md">
                        {Number(b.totalPrice || 0).toLocaleString()}đ
                      </p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                    <div className="min-w-[130px] flex justify-end">
                      {renderStatus(b.status)}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
                <Activity size={40} className="mx-auto mb-4 text-white/20" />
                <p className="text-gray-400 text-[11px] font-bold tracking-[0.2em] uppercase">Mạch dữ liệu tĩnh lặp</p>
                <p className="text-gray-600 text-[10px] mt-2">Hệ thống chưa ghi nhận đơn đặt phòng mới.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;