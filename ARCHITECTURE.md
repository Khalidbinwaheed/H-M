# H&M Trads Admin Dashboard - Architecture & Setup Guide

## Project Overview

**H&M Trads Admin Dashboard** is a production-grade enterprise resource planning (ERP) system designed for managing laptop and charger inventory, sales, and customer relationships with B2B and B2C support.

### Key Features
- ✅ Real-time inventory management
- ✅ B2B and B2C sales tracking  
- ✅ Advanced analytics and reporting
- ✅ Multi-level user roles (Admin, Manager, Staff, Salesperson)
- ✅ Professional dark/light theme
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Enterprise-grade security (JWT, role-based access)
- ✅ Comprehensive API documentation
- ✅ Production-ready deployment

---

## Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Router**: TanStack Router v1
- **UI Library**: Shadcn UI + Tailwind CSS
- **State Management**: Zustand (simple, fast, lightweight)
- **Query**: React Query v5 (server state management)
- **Charts**: Recharts (professional visualizations)
- **Forms**: React Hook Form + Zod (validation)
- **Animations**: Framer Motion
- **Build**: Vite + TanStack Start
- **Deployment**: Cloudflare Pages/Workers

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js or Laravel
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi or Zod
- **ORM**: Prisma (TypeScript) or Eloquent (Laravel)
- **Testing**: Jest + Supertest

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions / GitLab CI
- **Container**: Docker
- **Container Registry**: Docker Hub / ECR
- **Orchestration**: Kubernetes or Docker Compose
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

## Project Structure

```
h&m-trads-admin/
├── src/
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts       # All shared types and interfaces
│   ├── components/
│   │   ├── ui/            # Shadcn UI components
│   │   ├── layout/        # Layout components (AppShell, Topbar, Sidebar)
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── forms/         # Reusable form components
│   │   └── common/        # Common components (tables, modals, etc)
│   ├── store/             # Zustand stores (state management)
│   │   ├── auth.ts
│   │   ├── laptops.ts
│   │   ├── chargers.ts
│   │   ├── customers.ts
│   │   ├── orders.ts
│   │   ├── ui.ts
│   │   └── analytics.ts
│   ├── routes/            # TanStack Router pages
│   │   ├── __root.tsx
│   │   ├── index.tsx      # Dashboard
│   │   ├── laptops.tsx    # Laptops list
│   │   ├── laptops.new.tsx
│   │   ├── laptops.$id.tsx
│   │   ├── chargers/
│   │   ├── customers/
│   │   ├── orders/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── auth/
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-filters.ts
│   │   └── use-pagination.ts
│   ├── lib/
│   │   ├── api-client.ts  # REST API client
│   │   ├── mock-data.ts   # Mock data generators
│   │   ├── schemas.ts     # Zod validation schemas
│   │   ├── utils.ts       # Utility functions
│   │   ├── constants.ts
│   │   └── error-capture.ts
│   ├── styles/
│   │   └── styles.css     # Tailwind + custom styles
│   ├── start.ts           # App entry point
│   └── server.ts          # SSR server
├── backend/               # Backend API (Node.js/Express or Laravel)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── utils/
│   └── ...
├── docs/                  # Documentation
│   ├── DATABASE.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── .github/workflows/    # GitHub Actions CI/CD
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Local development setup
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+ (for production)
- Docker & Docker Compose (optional)

### 1. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hm-trads-admin.git
cd hm-trads-admin

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
cp .env.example .env.local

# Update environment variables
# VITE_API_URL=http://localhost:3000/api/v1

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Backend Setup (Node.js/Express)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure database connection
# DATABASE_URL=postgresql://user:password@localhost:5432/hm_trads

# Run migrations
npm run migrate

# Seed database with demo data
npm run seed

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Database Setup

```bash
# Using Docker Compose (recommended)
docker-compose up -d postgres

# Or using PostgreSQL CLI
createdb hm_trads
psql hm_trads < database.sql

# Run migrations
npm run migrate:latest
```

---

## Environment Variables

### Frontend (.env.local)
```env
VITE_APP_NAME="H&M Trads Admin"
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=debug
```

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/hm_trads
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
EMAIL_SERVICE=smtp
EMAIL_FROM=noreply@hm-trads.com
```

---

## Development Workflow

### Running Locally

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Database (if using Docker)
docker-compose up postgres redis

# Access
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000/api/v1
# PostgreSQL: localhost:5432
```

### Code Standards

- **Language**: TypeScript (strict mode)
- **Linting**: ESLint + Prettier
- **Formatting**: Automatic on save
- **Naming**: camelCase for variables, PascalCase for components
- **File structure**: Feature-based organization

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make commits with conventional messages
git commit -m "feat: add laptop filter functionality"

# Push and create PR
git push origin feature/your-feature
```

---

## Testing

### Unit Tests
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Open Cypress UI
npm run test:e2e:ui
```

---

## Deployment

### Production Build
```bash
# Frontend
npm run build
# Output: dist/

# Backend
cd backend
npm run build
# Output: dist/
```

### Docker Deployment

```bash
# Build image
docker build -t hm-trads-admin:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  hm-trads-admin:latest

# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Cloudflare Pages (Frontend)

```bash
# Connect GitHub repository
# Configure build settings:
# - Build command: npm run build
# - Build output: dist/
# - Environment: VITE_API_URL=https://api.hm-trads.com

# Deploy
git push origin main
# Automatic deployment on push
```

### Kubernetes (Scalable)

```bash
# Create deployment
kubectl apply -f k8s/deployment.yaml

# Expose service
kubectl apply -f k8s/service.yaml

# Scale replicas
kubectl scale deployment hm-trads-admin --replicas=3
```

---

## Monitoring & Logging

### Application Monitoring
```bash
# Using Prometheus + Grafana
docker-compose -f monitoring/docker-compose.yml up

# Access Grafana: http://localhost:3000
# Access Prometheus: http://localhost:9090
```

### Error Tracking
```bash
# Sentry integration (optional)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Logging
```bash
# Log viewer
tail -f logs/app.log

# Using ELK Stack
# Elasticsearch, Logstash, Kibana
```

---

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with sharp
- CSS minification
- JavaScript minification
- Lazy loading of routes
- Service worker for offline support

### Backend
- Database query optimization (indices, joins)
- API response caching (Redis)
- Gzip compression
- Request batching
- Rate limiting

### Monitoring
```bash
# Lighthouse CI
npm run lighthouse

# Bundle size analysis
npm run analyze:bundle
```

---

## Security

### Best Practices
- ✅ HTTPS/TLS enforced
- ✅ CORS properly configured
- ✅ CSRF protection enabled
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (sanitized inputs)
- ✅ Rate limiting & DDoS protection
- ✅ Regular security updates
- ✅ Dependency scanning

```bash
# Security audit
npm audit
npm audit fix

# OWASP dependency check
docker run --rm -v $(pwd):/src owasp/dependency-check
```

---

## Common Issues & Troubleshooting

### Development
| Issue | Solution |
|-------|----------|
| Port already in use | `lsof -i :3000` & kill process |
| Database connection error | Check DATABASE_URL in .env |
| CORS errors | Verify CORS_ORIGIN in backend .env |
| Hot reload not working | Clear .next cache, restart dev server |

### Production
| Issue | Solution |
|-------|----------|
| High memory usage | Increase Node heap: `NODE_OPTIONS=--max-old-space-size=4096` |
| Slow database queries | Add indices, analyze query plans |
| API timeout errors | Increase timeout, optimize endpoints |

---

## Resources & Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org)

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is proprietary and confidential. All rights reserved to H&M Trads.

---

## Support

For issues and questions:
- Email: support@hm-trads.com
- Issues: GitHub Issues
- Documentation: https://docs.hm-trads.com
