export type UserRole = 'user' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  popular: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalProviders: number;
  totalRevenue: number;
  bookingsToday: number;
  pendingBookings: number;
}
