import React, { useState } from 'react';
import AdminNav from './AdminNav';
import { Menu, User, Bell, Search } from 'lucide-react';

const AdminLayout = ({ children, title = "Dashboard", subtitle = "Luxury Hotel Management" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[100px]" />
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
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-amber-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-xl lg:text-2xl font-serif italic text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold hidden sm:block mt-1 font-sans">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 gap-3 focus-within:border-amber-500/50 focus-within:bg-white transition-all shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm hệ thống..." 
                className="bg-transparent border-none outline-none text-xs w-56 placeholder:text-slate-400 font-sans font-medium text-slate-900"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-amber-500 hover:border-amber-500/30 transition-all relative shadow-sm">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-[2px] shadow-md shadow-amber-500/20">
                 <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-amber-500">
                    <User size={18} />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden admin-scrollbar p-6 lg:p-10 relative z-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
