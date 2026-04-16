import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axiosClient from '../../api/axiosClient';
import { Bed, CalendarCheck, DollarSign, Loader2, TrendingUp, Clock, CheckCircle, XCircle, ChevronRight, Package } from 'lucide-react';

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
        pending: { color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
        confirmed: { color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
        cancelled: { color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', icon: <XCircle size={12}/>, text: 'Đã hủy' },
        completed: { color: 'text-blue-500 border-blue-500/30 bg-blue-500/10', icon: <Package size={12}/>, text: 'Hoàn thành' }
    };
    const s = config[status] || config.pending;
    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${s.color}`}>
            {s.icon} {s.text}
        </span>
    );
  };

  const statCards = [
    { title: 'Quản lý phòng', value: stats.rooms, icon: <Bed size={24}/>, glow: 'group-hover:shadow-blue-500/20' },
    { title: 'Tổng đơn đặt', value: stats.bookings, icon: <CalendarCheck size={24}/>, glow: 'group-hover:shadow-emerald-500/20' },
    { title: 'Doanh thu thực tế', value: `${stats.revenue.toLocaleString()}đ`, icon: <DollarSign size={24}/>, glow: 'group-hover:shadow-amber-500/20' },
  ];

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Đang đồng bộ hệ thống</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 pt-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <AdminNav />
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-5xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bảng điều khiển <span className="text-amber-500 not-italic font-sans font-black uppercase text-3xl ml-2 tracking-wider">Admin</span>
            </h2>
            <p className="text-gray-500 text-xs mt-3 tracking-[0.3em] uppercase font-bold">Uy Nam Luxury Hotel Management</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Hệ thống đang hoạt động</span>
          </div>
        </div>
        
        {/* --- LƯỚI THỐNG KÊ --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((item, idx) => (
            <div key={idx} className={`relative overflow-hidden bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 hover:border-amber-500/30 transition-all duration-700 group hover:-translate-y-2 shadow-2xl ${item.glow}`}>
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] group-hover:bg-amber-500/10 transition-colors duration-700"></div>
              
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/10 transition-all duration-500">
                {item.icon}
              </div>
              <div className="relative z-10">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">{item.title}</p>
                <p className="text-4xl font-serif italic text-white group-hover:text-amber-500 transition-colors duration-500" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- HOẠT ĐỘNG GẦN ĐÂY --- */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-8 border-b border-white/5 pb-6">
            <h3 className="text-2xl font-serif italic text-white flex items-center gap-4" style={{ fontFamily: "'Playfair Display', serif" }}>
               <div className="w-1.5 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
               Giao dịch mới nhất
            </h3>
            <button className="text-[10px] text-amber-500 hover:text-white uppercase font-black tracking-widest transition-colors flex items-center gap-1">
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((b, index) => (
                <div key={b.id || index} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] hover:border-amber-500/20 transition-all duration-500 gap-4">
                  
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500">
                      {b.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{b.user?.fullName || 'Khách vãng lai'}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Bed size={12} className="text-amber-500"/> Phòng {b.room?.roomNumber || '---'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Tổng tiền</p>
                      <p className="text-lg font-bold text-amber-500">{Number(b.totalPrice || 0).toLocaleString()}đ</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                    <div className="min-w-[120px] text-right">
                      {renderStatus(b.status)}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <p className="text-gray-500 text-sm font-medium tracking-wide">Hệ thống chưa ghi nhận đơn đặt phòng nào.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;