-- ============================================================
-- ServiZone - On-Demand Service Application
-- Database Schema (MySQL)
-- ============================================================

-- 1. Roles (Enum-like reference table)
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('user', 'provider', 'admin') NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name) VALUES ('user'), ('provider'), ('admin');

-- 2. Users
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) DEFAULT NULL,
  status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- 3. User Roles (Many-to-Many)
CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role_id INT NOT NULL,
  UNIQUE KEY unique_user_role (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. Service Categories
CREATE TABLE service_categories (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Services
CREATE TABLE services (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(200) NOT NULL,
  category_id CHAR(36) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  image_url VARCHAR(500) DEFAULT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT,
  INDEX idx_category (category_id),
  INDEX idx_popular (is_popular)
);

-- 6. Bookings
CREATE TABLE bookings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  provider_id CHAR(36) NOT NULL,
  service_id CHAR(36) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(20) NOT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  price DECIMAL(10, 2) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  INDEX idx_user (user_id),
  INDEX idx_provider (provider_id),
  INDEX idx_status (status),
  INDEX idx_date (scheduled_date)
);

-- 7. Reviews
CREATE TABLE reviews (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  booking_id CHAR(36) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  provider_id CHAR(36) NOT NULL,
  service_id CHAR(36) NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  INDEX idx_provider (provider_id),
  INDEX idx_service (service_id)
);

-- 8. Payments (Bonus - Mocked)
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  booking_id CHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method ENUM('upi', 'card', 'cash', 'wallet') NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking (booking_id)
);

-- 9. Provider Availability
CREATE TABLE provider_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id CHAR(36) NOT NULL,
  day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_jobs INT DEFAULT 5,
  UNIQUE KEY unique_provider_day (provider_id, day_of_week),
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Notifications (Bonus - Mocked)
CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking', 'payment', 'system', 'promotion') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read)
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Insert sample users
INSERT INTO users (id, name, email, phone, password_hash, status) VALUES
('u1', 'Rahul Sharma', 'rahul@example.com', '+91 98765 43210', '$2b$10$hash1', 'active'),
('u2', 'Priya Patel', 'priya@example.com', '+91 98765 43211', '$2b$10$hash2', 'active'),
('u3', 'Amit Kumar', 'amit@example.com', '+91 98765 43212', '$2b$10$hash3', 'active'),
('u4', 'Sneha Reddy', 'sneha@example.com', '+91 98765 43213', '$2b$10$hash4', 'active'),
('u5', 'Admin User', 'admin@servizone.com', '+91 98765 00000', '$2b$10$hash5', 'active');

-- Assign roles
INSERT INTO user_roles (user_id, role_id) VALUES
('u1', 1), ('u2', 1), ('u3', 2), ('u4', 2), ('u5', 3);

-- Insert categories
INSERT INTO service_categories (id, name, icon, description) VALUES
('cat1', 'Home Cleaning', 'Sparkles', 'Professional home cleaning services'),
('cat2', 'Plumbing', 'Wrench', 'Expert plumbing repairs and installations'),
('cat3', 'Electrical', 'Zap', 'Licensed electrical work and repairs'),
('cat4', 'Painting', 'Paintbrush', 'Interior and exterior painting'),
('cat5', 'Appliance Repair', 'Settings', 'Fix all types of home appliances'),
('cat6', 'Pest Control', 'Bug', 'Safe and effective pest control');

-- Insert services
INSERT INTO services (id, name, category_id, description, price, duration, rating, review_count, is_popular) VALUES
('s1', 'Deep Home Cleaning', 'cat1', 'Thorough cleaning of your entire home', 1499.00, '3-4 hrs', 4.8, 2340, TRUE),
('s2', 'Bathroom Cleaning', 'cat1', 'Complete bathroom deep clean', 499.00, '1-2 hrs', 4.7, 1820, TRUE),
('s3', 'Pipe Leak Repair', 'cat2', 'Fix leaking pipes and faucets', 399.00, '1 hr', 4.6, 980, FALSE),
('s4', 'Drain Unclogging', 'cat2', 'Clear blocked drains', 349.00, '1 hr', 4.5, 750, FALSE),
('s5', 'Wiring & Installation', 'cat3', 'New wiring installations', 799.00, '2-3 hrs', 4.9, 620, TRUE),
('s6', 'Fan Installation', 'cat3', 'Ceiling and exhaust fan installation', 299.00, '1 hr', 4.7, 1450, FALSE),
('s7', 'Full Home Painting', 'cat4', 'Complete interior painting', 8999.00, '2-3 days', 4.8, 430, TRUE),
('s8', 'AC Repair', 'cat5', 'Air conditioner repair and servicing', 599.00, '1-2 hrs', 4.6, 2100, TRUE),
('s9', 'Pest Treatment', 'cat6', 'Complete pest control treatment', 999.00, '2 hrs', 4.5, 890, FALSE);
