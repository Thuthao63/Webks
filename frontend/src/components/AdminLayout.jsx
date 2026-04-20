import React, { useState } from 'react';
import AdminNav from './AdminNav';
import { Menu, X, User, Bell, Search, LogOut } from 'lucide-react';

const AdminLayout = ({ children, title = "Dashboard", subtitle = "Luxury Hotel Management" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] transition-transform duration-500 ease-luxury
        lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminNav isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-amber-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-xl lg:text-2xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-3 focus-within:border-amber-500/50 transition-all">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Tìm kiếm hệ thống..." 
                className="bg-transparent border-none outline-none text-xs w-48 placeholder:text-gray-600"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-amber-500 hover:border-amber-500/30 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-black" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px]">
                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-amber-500">
                    <User size={20} />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden admin-scrollbar p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
