import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosClient from '../../api/axiosClient';
import { 
  Bed, CalendarCheck, DollarSign, Loader2, TrendingUp, Clock, 
  CheckCircle, XCircle, ChevronRight, Package, Activity, 
  Users, Wallet, PieChart as PieChartIcon, BarChart3, TrendingDown,
  ArrowUpRight, ArrowDownRight, Sparkles, CheckSquare
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, availableRooms: 0, bookings: 0, revenue: 0 });
  const [allBookings, setAllBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          axiosClient.get('/rooms'),
          axiosClient.get('/bookings')
        ]);

        const bookings = bookingsRes.data;
        const rooms = roomsRes.data;

        const totalRevenue = bookings.reduce((sum, b) =>
          sum + (b.status === 'completed' || b.status === 'confirmed' ? Number(b.totalPrice) : 0), 0
        );

        setStats({
          rooms: rooms.length,
          availableRooms: rooms.filter(r => r.status === 'Available').length,
          bookings: bookings.length,
          revenue: totalRevenue
        });

        setAllBookings(bookings);
        const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
        setRecentBookings(sortedBookings.slice(0, 5));

      } catch (err) {
        console.error("Lỗi lấy dữ liệu Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- DỮ LIỆU BIỂU ĐỒ ---
  const { revenueChartData, statusChartData, weeklyChartData } = useMemo(() => {
    if (!allBookings.length) return { revenueChartData: [], statusChartData: [], weeklyChartData: [] };

    // 1. Dữ liệu doanh thu (7 ngày hoặc 30 ngày)
    const rangeArray = Array.from({ length: chartDays }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (chartDays - 1 - i));
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });

    const revData = rangeArray.map(dateStr => {
      const dailyRevenue = allBookings
        .filter(b => {
          const bDate = new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          return bDate === dateStr && (b.status === 'completed' || b.status === 'confirmed');
        })
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);
      
      return { name: dateStr, revenue: dailyRevenue };
    });

    // 2. Dữ liệu trạng thái booking
    const statusCounts = allBookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const statData = [
      { name: 'Hoàn tất', value: statusCounts['completed'] || 0, color: '#3b82f6' },
      { name: 'Đã xác nhận', value: statusCounts['confirmed'] || 0, color: '#10b981' },
      { name: 'Đang chờ', value: statusCounts['pending'] || 0, color: '#f59e0b' },
      { name: 'Đã hủy', value: statusCounts['cancelled'] || 0, color: '#ef4444' },
    ].filter(item => item.value > 0);

    // 3. Hoạt động đặt phòng theo ngày (luôn hiện 7 ngày gần nhất cho bar chart)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });
    
    const weekData = last7Days.map(dateStr => {
      const dailyCount = allBookings.filter(b => {
        const bDate = new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        return bDate === dateStr;
      }).length;
      return { name: dateStr, counts: dailyCount };
    });

    return { revenueChartData: revData, statusChartData: statData, weeklyChartData: weekData };
  }, [allBookings, chartDays]);

  const renderStatus = (status) => {
    const config = {
      pending: { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: <Clock size={12} />, text: 'Chờ duyệt' },
      confirmed: { color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: <CheckCircle size={12} />, text: 'Xác nhận' },
      cancelled: { color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', icon: <XCircle size={12} />, text: 'Đã hủy' },
      completed: { color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', icon: <Package size={12} />, text: 'Hoàn tất' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  const statCards = [
    { title: 'Doanh thu tổng', value: `${stats.revenue.toLocaleString()}đ`, icon: <Wallet size={24} />, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: 'đã xác thực' },
    { title: 'Lượt Booking', value: stats.bookings, icon: <CalendarCheck size={24} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: 'tổng giao dịch' },
    { title: 'Phòng khả dụng', value: stats.availableRooms, icon: <Bed size={24} />, color: 'text-sky-400', bg: 'bg-sky-500/10', trend: `trên ${stats.rooms} phòng` },
    { title: 'Hiệu suất', value: `${stats.rooms > 0 ? Math.round(( (stats.rooms - stats.availableRooms) / stats.rooms) * 100) : 0}%`, icon: <Activity size={24} />, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: 'tỷ lệ lấp đầy' },
  ];

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-6">
       <div className="relative">
          <Activity className="animate-bounce text-amber-500" size={50} />
          <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse rounded-full"></div>
       </div>
       <p className="text-amber-500 text-[10px] tracking-[0.5em] uppercase font-black animate-pulse">Phân tích dữ liệu hệ thống...</p>
    </div>
  );

  return (
    <AdminLayout title="Bảng điều khiển" subtitle="Hệ thống quản trị kinh doanh & Phân tích dữ liệu thời gian thực">
      <div className="space-y-8 pb-10">
        
        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item, idx) => (
            <div key={idx} className="relative group bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-white/20 transition-luxury overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-white/[0.05] transition-luxury"></div>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-2xl ${item.bg} ${item.color} border border-white/5`}>
                     {item.icon}
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.title}</p>
               </div>
               
               <div className="flex flex-col">
                  <h4 className="text-3xl font-serif italic text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</h4>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                     <ArrowUpRight size={10} className="text-emerald-500" /> {item.trend}
                  </p>
               </div>
            </div>
          ))}
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-serif italic text-white flex items-center gap-3">
                    <TrendingUp className="text-amber-500" size={20} />
                    Biểu đồ doanh thu
                  </h3>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1 ml-8">Phát sinh trong {chartDays} ngày gần nhất</p>
               </div>
               <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setChartDays(7)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${chartDays === 7 ? 'text-amber-500 bg-amber-500/10' : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    7 Ngày
                  </button>
                  <button 
                    onClick={() => setChartDays(30)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${chartDays === 30 ? 'text-amber-500 bg-amber-500/10' : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    Tháng
                  </button>
               </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontWeight: 'bold' }}
                  />
                  <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                    tick={{ fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff' }}
                    itemStyle={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <h3 className="text-xl font-serif italic text-white flex items-center gap-3 mb-8">
                <PieChartIcon className="text-emerald-500" size={20} />
                Trạng thái đơn
              </h3>
              
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-2xl font-serif italic text-white">{allBookings.length}</p>
                   <p className="text-[8px] text-gray-500 uppercase font-black">Tổng đơn</p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                 {statusChartData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{item.value} đơn</span>
                   </div>
                 ))}
              </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: Recent & Activity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Recent Transactions */}
           <div className="bg-[#0a0a0a] border border-white/5 p-8 pb-4 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h3 className="text-xl font-serif italic text-white flex items-center gap-3">
                  <Sparkles className="text-amber-500" size={20} />
                  Giao dịch mới
                </h3>
                <button className="text-[10px] text-amber-500 hover:text-amber-400 uppercase font-black tracking-widest transition-all">Tất cả</button>
              </div>

              <div className="space-y-4">
                {recentBookings.map((b, idx) => (
                  <div key={b.id || idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-white font-black text-xs border border-white/10 group-hover:scale-110 transition-luxury">
                           {(b.user?.fullName || b.customer?.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white truncate max-w-[120px]">{b.user?.fullName || 'Khách vãng lai'}</p>
                           <p className="text-[9px] text-gray-600 font-bold tracking-widest mt-0.5">P.{b.room?.roomNumber || '---'}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-6">
                        <div>
                           <p className="text-xs font-black text-amber-500">{Number(b.totalPrice || 0).toLocaleString()} <span className="text-[8px] text-gray-600">Đ</span></p>
                           <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="w-24 flex justify-end">
                          {renderStatus(b.status)}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Weekly Counts Bar Chart */}
           <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xl font-serif italic text-white flex items-center gap-3 mb-8">
                <BarChart3 className="text-purple-500" size={20} />
                Mật độ đặt phòng
              </h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyChartData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                       <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                       <Tooltip cursor={{ fill: '#ffffff02' }} contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                       <Bar dataKey="counts" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={25} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;