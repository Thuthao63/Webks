import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200">
      {/* Cột bên trái: Menu */}
      <Sidebar />
      
      {/* Cột bên phải: Nội dung chính */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Chào mừng trở lại</h1>
            <p className="text-2xl font-bold text-white">Thảo Nguyễn 👋</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-blue-400">
            TN
          </div>
        </header>
        
        {/* Nơi hiển thị Hero, StatCard, Sơ đồ phòng... */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;