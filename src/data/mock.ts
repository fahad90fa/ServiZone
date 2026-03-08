import { User, ServiceCategory, Service, Booking, DashboardStats } from '@/types';

export const categories: ServiceCategory[] = [
  { id: 'cat1', name: 'Home Cleaning', icon: 'Sparkles', description: 'Professional home cleaning services' },
  { id: 'cat2', name: 'Plumbing', icon: 'Wrench', description: 'Expert plumbing repairs and installations' },
  { id: 'cat3', name: 'Electrical', icon: 'Zap', description: 'Licensed electrical work and repairs' },
  { id: 'cat4', name: 'Painting', icon: 'Paintbrush', description: 'Interior and exterior painting' },
  { id: 'cat5', name: 'Appliance Repair', icon: 'Settings', description: 'Fix all types of home appliances' },
  { id: 'cat6', name: 'Pest Control', icon: 'Bug', description: 'Safe and effective pest control' },
];

export const services: Service[] = [
  { id: 's1', name: 'Deep Home Cleaning', categoryId: 'cat1', category: 'Home Cleaning', description: 'Thorough cleaning of your entire home including kitchen, bathrooms, and living areas.', price: 1499, duration: '3-4 hrs', rating: 4.8, reviewCount: 2340, image: '', popular: true },
  { id: 's2', name: 'Bathroom Cleaning', categoryId: 'cat1', category: 'Home Cleaning', description: 'Complete bathroom deep clean and sanitization.', price: 499, duration: '1-2 hrs', rating: 4.7, reviewCount: 1820, image: '', popular: true },
  { id: 's3', name: 'Pipe Leak Repair', categoryId: 'cat2', category: 'Plumbing', description: 'Fix leaking pipes and faucets quickly.', price: 399, duration: '1 hr', rating: 4.6, reviewCount: 980, image: '', popular: false },
  { id: 's4', name: 'Drain Unclogging', categoryId: 'cat2', category: 'Plumbing', description: 'Clear blocked drains and restore water flow.', price: 349, duration: '1 hr', rating: 4.5, reviewCount: 750, image: '', popular: false },
  { id: 's5', name: 'Wiring & Installation', categoryId: 'cat3', category: 'Electrical', description: 'New wiring installations and rewiring services.', price: 799, duration: '2-3 hrs', rating: 4.9, reviewCount: 620, image: '', popular: true },
  { id: 's6', name: 'Fan Installation', categoryId: 'cat3', category: 'Electrical', description: 'Ceiling and exhaust fan installation.', price: 299, duration: '1 hr', rating: 4.7, reviewCount: 1450, image: '', popular: false },
  { id: 's7', name: 'Full Home Painting', categoryId: 'cat4', category: 'Painting', description: 'Complete interior painting for your home.', price: 8999, duration: '2-3 days', rating: 4.8, reviewCount: 430, image: '', popular: true },
  { id: 's8', name: 'AC Repair', categoryId: 'cat5', category: 'Appliance Repair', description: 'Air conditioner repair and servicing.', price: 599, duration: '1-2 hrs', rating: 4.6, reviewCount: 2100, image: '', popular: true },
  { id: 's9', name: 'Pest Treatment', categoryId: 'cat6', category: 'Pest Control', description: 'Complete pest control treatment for your home.', price: 999, duration: '2 hrs', rating: 4.5, reviewCount: 890, image: '', popular: false },
];

export const users: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', role: 'user', createdAt: '2025-01-15', status: 'active' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', role: 'user', createdAt: '2025-02-20', status: 'active' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', role: 'provider', createdAt: '2025-01-10', status: 'active' },
  { id: 'u4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98765 43213', role: 'provider', createdAt: '2025-03-05', status: 'active' },
  { id: 'u5', name: 'Admin User', email: 'admin@servizone.com', phone: '+91 98765 00000', role: 'admin', createdAt: '2024-12-01', status: 'active' },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', role: 'user', createdAt: '2025-04-12', status: 'inactive' },
];

export const bookings: Booking[] = [
  { id: 'b1', userId: 'u1', userName: 'Rahul Sharma', providerId: 'u3', providerName: 'Amit Kumar', serviceId: 's1', serviceName: 'Deep Home Cleaning', date: '2026-03-10', time: '10:00 AM', status: 'confirmed', price: 1499, address: '42 MG Road, Bangalore', createdAt: '2026-03-07' },
  { id: 'b2', userId: 'u2', userName: 'Priya Patel', providerId: 'u4', providerName: 'Sneha Reddy', serviceId: 's5', serviceName: 'Wiring & Installation', date: '2026-03-09', time: '2:00 PM', status: 'pending', price: 799, address: '15 Park Street, Mumbai', createdAt: '2026-03-07' },
  { id: 'b3', userId: 'u1', userName: 'Rahul Sharma', providerId: 'u4', providerName: 'Sneha Reddy', serviceId: 's8', serviceName: 'AC Repair', date: '2026-03-05', time: '11:00 AM', status: 'completed', price: 599, address: '42 MG Road, Bangalore', createdAt: '2026-03-03' },
  { id: 'b4', userId: 'u2', userName: 'Priya Patel', providerId: 'u3', providerName: 'Amit Kumar', serviceId: 's2', serviceName: 'Bathroom Cleaning', date: '2026-03-08', time: '9:00 AM', status: 'in_progress', price: 499, address: '15 Park Street, Mumbai', createdAt: '2026-03-06' },
  { id: 'b5', userId: 'u6', userName: 'Vikram Singh', providerId: 'u3', providerName: 'Amit Kumar', serviceId: 's9', serviceName: 'Pest Treatment', date: '2026-03-12', time: '3:00 PM', status: 'pending', price: 999, address: '8 Nehru Place, Delhi', createdAt: '2026-03-08' },
  { id: 'b6', userId: 'u1', userName: 'Rahul Sharma', providerId: 'u4', providerName: 'Sneha Reddy', serviceId: 's7', serviceName: 'Full Home Painting', date: '2026-02-20', time: '8:00 AM', status: 'completed', price: 8999, address: '42 MG Road, Bangalore', createdAt: '2026-02-15' },
];

export const dashboardStats: DashboardStats = {
  totalBookings: 1247,
  totalUsers: 856,
  totalProviders: 134,
  totalRevenue: 2847500,
  bookingsToday: 42,
  pendingBookings: 18,
};
