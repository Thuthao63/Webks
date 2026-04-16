import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// --- LAYOUT COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactFab from './components/ContactFab';

// --- LAZY LOADING PAGES ---
const Home = lazy(() => import('./pages/client/Home'));
const RoomList = lazy(() => import('./pages/client/RoomList'));
const Booking = lazy(() => import('./pages/client/Booking'));
const Profile = lazy(() => import('./pages/client/Profile'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ManageRooms = lazy(() => import('./pages/Admin/ManageRooms'));
const ManageBookings = lazy(() => import('./pages/Admin/ManageBookings'));
const ManageContacts = lazy(() => import('./pages/Admin/ManageContacts'));

// --- 🛡️ HÀM KIỂM TRA QUYỀN TRUY CẬP ---
const AuthGuard = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  
  if (requireAdmin && user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children; 
};

// --- 🕵️ BỘ ĐIỀU KHIỂN HIỂN THỊ (Để ẩn Navbar/Footer ở trang Admin) ---
const AppContent = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  
  // Kiểm tra nếu đang ở trang Admin
  const isAdminPage = currentPath.startsWith('/admin');

  return (
    <>
      {/* 1. Chỉ hiện Navbar nếu không phải trang admin */}
      {!isAdminPage && <Navbar />}
      
      <main className={!isAdminPage ? "min-h-screen bg-[#050505]" : ""}>
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center bg-[#050505]">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        }>
          <Routes>
            {/* --- 🌍 PUBLIC ROUTES --- */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* CHỐT: Route Quên mật khẩu ở đây */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- 👤 CLIENT SECURE ROUTES (Cần Login) --- */}
            <Route path="/booking/:roomId" element={<AuthGuard><Booking /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />

            {/* --- 👑 ADMIN SECURE ROUTES (Cần Quyền Admin) --- */}
            <Route path="/admin/dashboard" element={<AuthGuard requireAdmin={true}><Dashboard /></AuthGuard>} />
            <Route path="/admin/rooms" element={<AuthGuard requireAdmin={true}><ManageRooms /></AuthGuard>} />
            <Route path="/admin/bookings" element={<AuthGuard requireAdmin={true}><ManageBookings /></AuthGuard>} />
            <Route path="/admin/contacts" element={<AuthGuard requireAdmin={true}><ManageContacts /></AuthGuard>} />

            {/* --- 404 FALLBACK --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* 2. Chỉ hiện Footer và nút Chat nếu không phải trang admin */}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ContactFab />}
    </>
  );
};

// ========================================================
// 🚀 TRUNG TÂM ĐIỀU PHỐI HỆ THỐNG
// ========================================================
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;