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
const RoomDetails = lazy(() => import('./pages/client/RoomDetails'));
const Booking = lazy(() => import('./pages/client/Booking'));
const PaymentResult = lazy(() => import('./pages/client/PaymentResult'));
const Profile = lazy(() => import('./pages/client/Profile'));
const Services = lazy(() => import('./pages/client/Services'));
const Contact = lazy(() => import('./pages/client/Contact'));
const About = lazy(() => import('./pages/client/About'));
// Gallery and Promotions removed to simplify site
const FAQ = lazy(() => import('./pages/client/FAQ'));
const Terms = lazy(() => import('./pages/client/Terms'));
const Privacy = lazy(() => import('./pages/client/Privacy'));
const Blog = lazy(() => import('./pages/client/Blog'));
const BlogDetail = lazy(() => import('./pages/client/BlogDetail'));
const NotFound = lazy(() => import('./pages/client/NotFound'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Verify = lazy(() => import('./pages/auth/Verify'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ManageRooms = lazy(() => import('./pages/Admin/ManageRooms'));
const ManageBookings = lazy(() => import('./pages/Admin/ManageBookings'));
const ManageContacts = lazy(() => import('./pages/Admin/ManageContacts'));
const ManageUsers = lazy(() => import('./pages/Admin/ManageUsers'));
const ManageReviews = lazy(() => import('./pages/Admin/ManageReviews'));
const ManageServices = lazy(() => import('./pages/Admin/ManageServices'));
const ManageDiscounts = lazy(() => import('./pages/Admin/ManageDiscounts'));
const ManageBlogs = lazy(() => import('./pages/Admin/ManageBlogs'));
const GuestStats = lazy(() => import('./pages/Admin/GuestStats'));

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
  const isAuthPage = ['/login', '/register', '/verify', '/forgot-password', '/reset-password']
    .some(path => currentPath.includes(path));
  const shouldShowSiteChrome = !isAdminPage && !isAuthPage;

  return (
    <>
      {/* 1. Chỉ hiện Navbar nếu không phải trang admin */}
      {!isAdminPage && <Navbar />}

      <main className={!isAdminPage ? "min-h-screen bg-paper" : ""}>
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center bg-[#050505]">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        }>
          <Routes>
            {/* --- 🌍 PUBLIC ROUTES --- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Gallery and Promotions removed */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/room/:roomId" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* CHỐT: Các Route xác thực */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* --- 👤 CLIENT SECURE ROUTES (Cần Login) --- */}
            <Route path="/booking/:roomId" element={<AuthGuard><Booking /></AuthGuard>} />
            <Route path="/payment-result" element={<AuthGuard><PaymentResult /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />

            {/* --- 👑 ADMIN SECURE ROUTES (Cần Quyền Admin) --- */}
            <Route path="/admin/dashboard" element={<AuthGuard requireAdmin={true}><Dashboard /></AuthGuard>} />
            <Route path="/admin/rooms" element={<AuthGuard requireAdmin={true}><ManageRooms /></AuthGuard>} />
            <Route path="/admin/bookings" element={<AuthGuard requireAdmin={true}><ManageBookings /></AuthGuard>} />
            <Route path="/admin/contacts" element={<AuthGuard requireAdmin={true}><ManageContacts /></AuthGuard>} />
            <Route path="/admin/users" element={<AuthGuard requireAdmin={true}><ManageUsers /></AuthGuard>} />
            <Route path="/admin/reviews" element={<AuthGuard requireAdmin={true}><ManageReviews /></AuthGuard>} />
            <Route path="/admin/services" element={<AuthGuard requireAdmin={true}><ManageServices /></AuthGuard>} />
            <Route path="/admin/discounts" element={<AuthGuard requireAdmin={true}><ManageDiscounts /></AuthGuard>} />
            <Route path="/admin/blogs" element={<AuthGuard requireAdmin={true}><ManageBlogs /></AuthGuard>} />
            <Route path="/admin/guest-stats" element={<AuthGuard requireAdmin={true}><GuestStats /></AuthGuard>} />

            {/* --- 404 FALLBACK --- */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* 2. Chỉ hiện Footer và nút Chat nếu không phải trang admin */}
      {shouldShowSiteChrome && <Footer />}
      {shouldShowSiteChrome && <ContactFab />}
    </>
  );
};

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
