# ZEKETA - Urban Streetwear E-Commerce Platform

## 🚀 Overview

ZEKETA is a high-performance, production-ready e-commerce platform for streetwear fashion, inspired by FreshHoods design aesthetics.

### Features
- ⚡ Ultra-fast with TurboPack
- 🌍 Multi-language (Hebrew RTL + English LTR)
- 💰 Multi-currency (USD + ILS)
- 🎨 Stunning animations (Framer Motion + GSAP)
- 🔒 Enterprise-grade security
- 📊 Admin panel with CSV import
- 📧 Email alerts for errors
- 🐳 Docker-ready
- ☁️ Google Cloud ready

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- GSAP
- React Query
- Zustand

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Nodemailer (Gmail)

### Infrastructure
- Docker & Docker Compose
- Nginx
- Google Cloud Ready

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone the project
cd zeketa-store

# Start with Docker
docker compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# Admin: http://localhost:3000/admin
```

### Development (without Docker)

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (in another terminal)
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## 🔐 Security Features

- JWT Authentication with bcrypt
- Rate Limiting (100 req/min, 5 auth attempts/min)
- IP Blocking after suspicious activity
- SQL Injection protection (Prisma)
- XSS Protection
- CSRF Protection
- Attack pattern detection
- All security events logged with email alerts

## 📧 Email Alerts

Configure in `.env`:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
ALERT_EMAIL=alerts@yourstore.com
```

Alerts are sent for:
- ERROR and CRITICAL logs
- Failed login attempts (3+)
- Hack attempts
- Security events

## 👤 Admin Panel

### Roles
- **ADMIN**: Full access (users, logs, settings)
- **MANAGER**: Products, categories, orders
- **EDITOR**: Add/edit products only

### Default Admin
Create first admin via API:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zeketa.com","password":"Admin123!"}'
```

Then update role in database to ADMIN.

## 📤 CSV Import

Supported columns (WooCommerce compatible):
- מזהה (ID)
- שם (Name)
- תיאור (Description)
- קטגוריות (Categories)
- מחיר רגיל (Price)
- מק"ט (SKU)
- תמונות (Images - URLs)
- במלאי (Stock)

Categories are auto-created if they don't exist.

## 🎨 Design System

- **Colors**: Cyan (#22d3ee), Black, White
- **Typography**: Inter (body), Bebas Neue (headings)
- **Effects**: Glitch, Neon glow, Parallax
- **Animations**: Page loader, Hover effects, Transitions

## 📁 Project Structure

```
zeketa-store/
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── stores/        # Zustand stores
│   └── public/
│       └── images/        # Static images
├── backend/
│   ├── src/
│   │   ├── modules/       # NestJS modules
│   │   ├── common/        # Guards, interceptors
│   │   └── prisma/        # Prisma service
│   └── prisma/
│       └── schema.prisma
├── docker/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## 🚀 Deployment (Google Cloud)

1. Build Docker images
2. Push to Container Registry
3. Deploy to Cloud Run
4. Configure Cloud SQL (PostgreSQL)
5. Set up Cloud CDN
6. Configure Load Balancer

## 📞 Support

For issues or questions, contact the development team.

---

Built with ❤️ for ZEKETA Streetwear
