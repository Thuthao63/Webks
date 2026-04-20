import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
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

        const totalRevenue = bookings.data.reduce((sum, b) =>
          sum + (b.status === 'completed' || b.status === 'confirmed' ? Number(b.totalPrice) : 0), 0
        );

        setStats({
          rooms: rooms.data.length,
          bookings: bookings.data.length,
          revenue: totalRevenue
        });

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

  const renderStatus = (status) => {
    const config = {
      pending: { color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]', icon: <Clock size={12} />, text: 'Chờ duyệt' },
      confirmed: { color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]', icon: <CheckCircle size={12} />, text: 'Đã xác nhận' },
      cancelled: { color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]', icon: <XCircle size={12} />, text: 'Đã hủy' },
      completed: { color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(96,165,250,0.2)]', icon: <Package size={12} />, text: 'Hoàn thành' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  const statCards = [
    { title: 'Phòng trong kho', value: stats.rooms, icon: <Bed size={28} />, glow: 'group-hover:shadow-[0_0_40px_rgba(217,119,6,0.2)]', iconColor: 'text-amber-400' },
    { title: 'Lượt Booking', value: stats.bookings, icon: <CalendarCheck size={28} />, glow: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]', iconColor: 'text-emerald-400' },
    { title: 'Tổng Doanh Thu', value: `${stats.revenue.toLocaleString()}đ`, icon: <TrendingUp size={28} />, glow: 'group-hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]', iconColor: 'text-sky-400' },
  ];

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-4">
       <Activity className="animate-bounce text-amber-500" size={40} />
       <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-bold animate-pulse">Khởi tạo hệ thống...</p>
    </div>
  );

  return (
    <AdminLayout title="Bảng điều khiển" subtitle="Hệ thống quản trị khách sạn Uy Nam Luxury">
      <div className="space-y-12 pb-10">
        
        {/* --- LƯỚI THỐNG KÊ --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((item, idx) => (
            <div key={idx} className={`relative overflow-hidden bg-[#0a0a0a] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-700 group hover:-translate-y-3 shadow-2xl ${item.glow}`}>
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
        <div className="bg-[#0a0a0a] backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -mr-40 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 flex items-center justify-between mb-10 border-b border-white/10 pb-6">
            <h3 className="text-2xl font-serif italic text-white flex items-center gap-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <div className="w-1.5 h-8 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
              Giao dịch gần đây
            </h3>
            <button className="text-[10px] text-amber-500 hover:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full uppercase font-black tracking-widest transition-all flex items-center gap-1 border border-amber-500/30">
              Chi tiết <ChevronRight size={14} />
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((b, index) => (
                <div key={b.id || index} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white/[0.01] rounded-3xl border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 gap-6 backdrop-blur-md">

                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-all duration-500">
                      {(b.user?.fullName || b.customer?.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-sm">{b.user?.fullName || 'Khách vãng lai'}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium tracking-wide">
                        <span className="flex items-center gap-1.5"><Bed size={14} className="text-amber-500" /> P.{b.room?.roomNumber || '---'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-500" /> {new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5">Trị giá</p>
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 drop-shadow-md">
                        {Number(b.totalPrice || 0).toLocaleString()} <span className="text-[10px] text-gray-600 font-black">đ</span>
                      </p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
                    <div className="min-w-[130px] flex justify-end">
                      {renderStatus(b.status)}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                <Activity size={40} className="mx-auto mb-4 text-white/10" />
                <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Chưa có giao dịch phát sinh</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;