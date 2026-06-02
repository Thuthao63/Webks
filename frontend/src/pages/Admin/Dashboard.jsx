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

    // 3. Hoạt động đặt phòng theo ngày
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

  const renderStatus = (booking) => {
    const status = booking.status;
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const now = new Date();
    now.setHours(0,0,0,0);
    checkInDate.setHours(0,0,0,0);
    checkOutDate.setHours(0,0,0,0);

    let config = { color: 'text-slate-500 border-slate-500/30 bg-slate-50', icon: <Package size={12} />, text: status };

    if (status === 'pending') {
      config = { color: 'text-amber-500 border-amber-500/30 bg-amber-50', icon: <Clock size={12} />, text: 'Chờ duyệt' };
    } else if (status === 'cancelled') {
      config = { color: 'text-rose-500 border-rose-500/30 bg-rose-50', icon: <XCircle size={12} />, text: 'Đã hủy' };
    } else if (status === 'completed') {
      config = { color: 'text-slate-500 border-slate-500/30 bg-slate-50', icon: <Package size={12} />, text: 'Hoàn tất' };
    } else if (status === 'checked_in') {
      config = { color: 'text-blue-500 border-blue-500/30 bg-blue-50', icon: <CheckCircle size={12} />, text: 'Đang lưu trú' };
    } else if (status === 'confirmed') {
      if (now < checkInDate) {
        config = { color: 'text-emerald-500 border-emerald-500/30 bg-emerald-50', icon: <CheckCircle size={12} />, text: 'Đã cọc (Sắp tới)' };
      } else if (now >= checkInDate && now <= checkOutDate) {
        config = { color: 'text-blue-500 border-blue-500/30 bg-blue-50', icon: <CheckCircle size={12} />, text: 'Đang lưu trú' };
      } else {
        config = { color: 'text-emerald-500 border-emerald-500/30 bg-emerald-50', icon: <CheckCircle size={12} />, text: 'Chờ hoàn tất' };
      }
    }

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black tracking-widest ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const statCards = [
    { title: 'Doanh thu tổng', value: `${stats.revenue.toLocaleString()}đ`, icon: <Wallet size={24} />, color: 'text-amber-500', bg: 'bg-amber-50', trend: 'đã xác thực' },
    { title: 'Lượt Booking', value: stats.bookings, icon: <CalendarCheck size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'tổng giao dịch' },
    { title: 'Phòng khả dụng', value: stats.availableRooms, icon: <Bed size={24} />, color: 'text-sky-500', bg: 'bg-sky-50', trend: `trên ${stats.rooms} phòng` },
    { title: 'Hiệu suất', value: `${stats.rooms > 0 ? Math.round(( (stats.rooms - stats.availableRooms) / stats.rooms) * 100) : 0}%`, icon: <Activity size={24} />, color: 'text-purple-500', bg: 'bg-purple-50', trend: 'tỷ lệ lấp đầy' },
  ];

  if (loading) return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-6">
       <div className="relative">
          <Activity className="animate-bounce text-amber-500" size={50} />
          <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse rounded-full"></div>
       </div>
       <p className="text-amber-500 text-xs tracking-[0.15em]  font-black animate-pulse font-sans">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <AdminLayout title="Bảng điều khiển" subtitle="Hệ thống quản trị kinh doanh & Phân tích dữ liệu">
      <div className="space-y-8 pb-10">
        
        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item, idx) => (
            <div key={idx} className="relative group bg-white border border-slate-100 p-6 rounded-3xl hover:border-amber-500/30 transition-luxury overflow-hidden shadow-sm hover:shadow-soft">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-amber-50 transition-luxury"></div>
               
               <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                     {item.icon}
                  </div>
                  <p className="text-[10px] text-slate-400 font-black  tracking-widest font-sans">{item.title}</p>
               </div>
               
               <div className="flex flex-col relative z-10">
                  <h4 className="text-2xl font-medium font-sans text-slate-900 mb-1">{item.value}</h4>
                  <p className="text-[10px] text-slate-500 font-bold  tracking-widest flex items-center gap-1 font-sans">
                     <ArrowUpRight size={12} className="text-emerald-500" /> {item.trend}
                  </p>
               </div>
            </div>
          ))}
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-sm hover:shadow-soft transition-luxury">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-3">
                    <TrendingUp className="text-amber-500" size={20} />
                    Biểu đồ doanh thu
                  </h3>
                  <p className="text-[10px] text-slate-400  tracking-widest font-black mt-1 ml-8 font-sans">Phát sinh trong {chartDays} ngày gần nhất</p>
               </div>
               <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button 
                    onClick={() => setChartDays(7)}
                    className={`px-4 py-2 text-[10px] font-black  tracking-wider rounded-lg transition-all font-sans ${chartDays === 7 ? 'text-amber-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    7 Ngày
                  </button>
                  <button 
                    onClick={() => setChartDays(30)}
                    className={`px-4 py-2 text-[10px] font-black  tracking-wider rounded-lg transition-all font-sans ${chartDays === 30 ? 'text-amber-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                      <stop offset="5%" stopColor="#b59a6d" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#b59a6d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontWeight: 'bold', fontFamily: 'Inter' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                    tick={{ fontWeight: 'bold', fontFamily: 'Inter' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '15px', color: '#0f172a', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}
                    itemStyle={{ color: '#b59a6d', fontSize: '12px', fontWeight: 'bold', fontFamily: 'Inter' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#b59a6d" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-sm hover:shadow-soft transition-luxury">
              <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-3 mb-8">
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
                       contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                       itemStyle={{ fontWeight: 'bold', fontFamily: 'Inter' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-xl font-medium font-sans text-slate-900">{allBookings.length}</p>
                   <p className="text-[9px] text-slate-400  font-black font-sans">Tổng đơn</p>
                </div>
              </div>

              <div className="space-y-3 mt-8">
                 {statusChartData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-slate-500 font-bold  tracking-widest font-sans">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 font-sans">{item.value} đơn</span>
                   </div>
                 ))}
              </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: Recent & Activity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Recent Transactions */}
           <div className="bg-white border border-slate-100 p-8 pb-4 rounded-[2.5rem] shadow-sm hover:shadow-soft transition-luxury">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-3">
                  <Sparkles className="text-amber-500" size={20} />
                  Giao dịch mới
                </h3>
                <button className="text-[10px] text-amber-600 hover:text-amber-500  font-black tracking-widest transition-all font-sans">Tất cả</button>
              </div>

              <div className="space-y-4">
                {recentBookings.map((b, idx) => (
                  <div key={b.id || idx} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 font-black text-xs border border-slate-200 group-hover:scale-110 group-hover:border-amber-200 transition-luxury shadow-sm">
                           {(b.user?.fullName || b.customer?.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900 truncate max-w-[120px] font-sans">{b.user?.fullName || 'Khách vãng lai'}</p>
                           <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5 font-sans">P.{b.room?.roomNumber || '---'}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-6">
                        <div>
                           <p className="text-xs font-black text-slate-900 font-sans">{Number(b.totalPrice || 0).toLocaleString()} <span className="text-[9px] text-slate-400">Đ</span></p>
                           <p className="text-[9px] text-slate-400 font-bold  tracking-widest mt-0.5 font-sans">{new Date(b.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="w-24 flex justify-end">
                          {renderStatus(b)}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Weekly Counts Bar Chart */}
           <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-soft transition-luxury">
              <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-3 mb-8">
                <BarChart3 className="text-purple-500" size={20} />
                Mật độ đặt phòng
              </h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyChartData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'Inter', fontWeight: 'bold'}} />
                       <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'Inter', fontWeight: 'bold'}} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px' }} />
                       <Bar dataKey="counts" fill="#b59a6d" radius={[6, 6, 0, 0]} barSize={25} />
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
