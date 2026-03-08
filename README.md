# ServiZone — On-Demand Service Application

A full-featured on-demand service platform (similar to Urban Company) where users browse and book services, providers manage jobs and availability, and admins oversee the entire platform.

> Built with Lovable AI as a rapid-prototyping and UI design tool.

---

## 📋 Project Overview

ServiZone connects customers with verified service professionals for home maintenance, repairs, and cleaning. The platform supports three user roles:

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse services, book with date/time, track bookings, make payments, leave reviews |
| **Provider** | Accept/reject jobs, manage weekly availability, view earnings & reviews |
| **Admin** | Manage users, services, categories, bookings, platform settings, view analytics |

---

## 🛠 Tech Stack

### Frontend (Web Application)
| Technology | Purpose |
|-----------|---------|
| **React 18** + **TypeScript** | UI framework with type safety |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing with role-based access |
| **React Query (TanStack)** | Server state management |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **Recharts** | Data visualization (admin/provider dashboards) |
| **Framer Motion** | Animations |
| **Lucide React** | Icon system |

### Backend (Recommended Stack for Production)
| Technology | Purpose |
|-----------|---------|
| **Node.js** + **TypeScript** | Runtime & language |
| **Express.js** | HTTP framework |
| **Sequelize ORM** | Database abstraction |
| **MySQL** | Relational database |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |

> **Note:** This Lovable project serves as the **web frontend prototype** with mock data. The backend API layer and React Native mobile app should be built separately using the schema and API contracts defined below.

---

## 🗄 Database Schema

The full SQL schema is available at [`public/schema.sql`](public/schema.sql).

### Entity Relationship Diagram

```
┌──────────┐     ┌────────────┐     ┌──────────┐
│  roles   │────<│ user_roles │>────│  users   │
└──────────┘     └────────────┘     └────┬─────┘
                                         │
                    ┌────────────────────┬┴──────────────────┐
                    │                    │                    │
              ┌─────┴─────┐     ┌───────┴──────┐    ┌───────┴────────┐
              │ bookings  │     │ notifications│    │ provider_      │
              │           │     └──────────────┘    │ availability   │
              └──┬────┬───┘                         └────────────────┘
                 │    │
          ┌──────┘    └──────┐
          │                  │
    ┌─────┴─────┐    ┌──────┴─────┐
    │  reviews  │    │  payments  │
    └───────────┘    └────────────┘

    ┌───────────────────┐     ┌──────────┐
    │ service_categories│────<│ services │
    └───────────────────┘     └──────────┘
```

### Core Tables
- **users** — All platform users (customers, providers, admins)
- **roles** — Role definitions (user, provider, admin)
- **user_roles** — Many-to-many user ↔ role mapping
- **service_categories** — Service groupings (Cleaning, Plumbing, etc.)
- **services** — Individual service offerings with pricing
- **bookings** — Service booking records with status tracking
- **reviews** — Customer ratings and comments
- **payments** — Payment transaction records (mocked)
- **provider_availability** — Weekly schedule per provider
- **notifications** — In-app notification records

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd servizone

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

---

## 🔐 Sample Credentials

The app uses mock authentication. Use these emails to log in (any password works):

| Email | Role | Name |
|-------|------|------|
| `rahul@example.com` | Customer | Rahul Sharma |
| `priya@example.com` | Customer | Priya Patel |
| `amit@example.com` | Provider | Amit Kumar |
| `sneha@example.com` | Provider | Sneha Reddy |
| `admin@servizone.com` | Admin | Admin User |

> **Tip:** Use the role switcher in the navbar (User / Provider / Admin buttons) to quickly switch between interfaces.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── Navbar.tsx        # Role-aware navigation
│   ├── Footer.tsx        # Site footer
│   ├── ServiceCard.tsx   # Service listing card
│   ├── BookingCard.tsx   # Booking history card
│   ├── StatCard.tsx      # Dashboard stat widget
│   └── NotificationBell.tsx
├── contexts/            # React context providers
│   ├── AuthContext.tsx   # Authentication & role management
│   └── NotificationContext.tsx
├── data/
│   └── mock.ts          # Mock data (users, services, bookings)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Route pages
│   ├── HomePage.tsx      # Landing page with service categories
│   ├── ServicesPage.tsx  # Service browsing & filtering
│   ├── ServiceDetailPage.tsx
│   ├── PaymentBookingPage.tsx  # 3-step booking checkout
│   ├── BookingTrackingPage.tsx # Real-time status tracking
│   ├── UserBookingsPage.tsx    # Booking history
│   ├── ReviewPage.tsx          # Rating & review submission
│   ├── ProfilePage.tsx         # User profile management
│   ├── ProviderDashboard.tsx   # Provider overview
│   ├── ProviderJobsPage.tsx    # Job accept/reject
│   ├── ProviderEarningsPage.tsx
│   ├── ProviderReviewsPage.tsx
│   ├── ProviderAvailabilityPage.tsx
│   ├── AdminDashboard.tsx      # Admin analytics
│   ├── AdminUsersPage.tsx      # User management
│   ├── AdminServicesPage.tsx   # Service CRUD
│   ├── AdminCategoriesPage.tsx # Category management
│   ├── AdminBookingsPage.tsx   # Booking status management
│   ├── AdminSettingsPage.tsx   # Platform configuration
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── AboutPage.tsx
│   └── HelpSupportPage.tsx
├── types/
│   └── index.ts         # TypeScript interfaces
└── App.tsx              # Root with role-based routing
```

---

## 🔌 REST API Design (Reference)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/logout` | Invalidate token |
| GET | `/api/auth/me` | Get current user |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (paginated) |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/:id` | Update user status |
| DELETE | `/api/users/:id` | Delete user |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List services (filterable) |
| GET | `/api/services/:id` | Get service details |
| POST | `/api/services` | Create service (Admin) |
| PUT | `/api/services/:id` | Update service (Admin) |
| DELETE | `/api/services/:id` | Delete service (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/:id` | Update category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings (role-filtered) |
| GET | `/api/bookings/:id` | Get booking details |
| POST | `/api/bookings` | Create booking (User) |
| PATCH | `/api/bookings/:id/status` | Update status (Provider/Admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit review (User) |
| GET | `/api/reviews/provider/:id` | Get provider reviews |

---

## ✅ Feature Checklist

### Core Features
- [x] User authentication (signup / login / logout)
- [x] Role-based access control (User / Provider / Admin)
- [x] Service browsing with category filtering
- [x] Service detail pages
- [x] Booking with date & time selection
- [x] Booking history and status tracking
- [x] Profile management
- [x] Provider job accept/reject
- [x] Provider availability management
- [x] Admin dashboard with analytics
- [x] Admin user management (suspend/activate)
- [x] Admin service & category CRUD
- [x] Admin booking status management

### Bonus Features
- [x] Mocked payment flow (UPI, Card, Cash)
- [x] Mocked push notifications
- [x] Review & rating system
- [x] Provider earnings dashboard with charts
- [x] Platform settings (commission, tax, maintenance mode)
- [x] Help & support page with FAQ
- [x] About page
- [x] Database schema with seed data

---

## 📄 License

MIT
