import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import PaymentBookingPage from "@/pages/PaymentBookingPage";
import BookingTrackingPage from "@/pages/BookingTrackingPage";
import UserBookingsPage from "@/pages/UserBookingsPage";
import ProfilePage from "@/pages/ProfilePage";
import ReviewPage from "@/pages/ReviewPage";
import HelpSupportPage from "@/pages/HelpSupportPage";
import AboutPage from "@/pages/AboutPage";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderJobsPage from "@/pages/ProviderJobsPage";
import ProviderAvailabilityPage from "@/pages/ProviderAvailabilityPage";
import ProviderEarningsPage from "@/pages/ProviderEarningsPage";
import ProviderReviewsPage from "@/pages/ProviderReviewsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminServicesPage from "@/pages/AdminServicesPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminBookingsPage from "@/pages/AdminBookingsPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser.role === 'provider') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/provider/jobs" element={<ProviderJobsPage />} />
            <Route path="/provider/earnings" element={<ProviderEarningsPage />} />
            <Route path="/provider/reviews" element={<ProviderReviewsPage />} />
            <Route path="/provider/availability" element={<ProviderAvailabilityPage />} />
            <Route path="/provider/profile" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/provider" />} />
            <Route path="*" element={<Navigate to="/provider" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/book/:serviceId" element={<PaymentBookingPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          <Route path="/track/:bookingId" element={<BookingTrackingPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
