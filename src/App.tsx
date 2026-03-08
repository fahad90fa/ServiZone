import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import BookingPage from "@/pages/BookingPage";
import UserBookingsPage from "@/pages/UserBookingsPage";
import ProfilePage from "@/pages/ProfilePage";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderJobsPage from "@/pages/ProviderJobsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminServicesPage from "@/pages/AdminServicesPage";
import AdminBookingsPage from "@/pages/AdminBookingsPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </>
    );
  }

  // Role-based routing
  if (currentUser.role === 'admin') {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </>
    );
  }

  if (currentUser.role === 'provider') {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider/jobs" element={<ProviderJobsPage />} />
          <Route path="/provider/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/provider" />} />
          <Route path="*" element={<Navigate to="/provider" />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book/:serviceId" element={<BookingPage />} />
        <Route path="/bookings" element={<UserBookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
