# Repository & Project Structure

> **Task #2** | Status: ✅ Completed  
> Defines the project structure and development setup

---

## 🎯 Goal

Set up a clean and scalable project structure for the Hairadresser MVP using Next.js as a full-stack framework.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 14 (App Router) | SEO, SSR, API routes built-in |
| **Language** | TypeScript | Type safety across full stack |
| **Database** | PostgreSQL | Perfect for relational booking data |
| **ORM** | Prisma | Type-safe queries, easy migrations |
| **Styling** | TailwindCSS | Rapid UI development |
| **Deployment** | Vercel | Optimized for Next.js |

---

## Project Structure

```
hairadresser/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Public pages (no auth)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── services/      # Services page
│   │   │   ├── booking/       # Booking flow
│   │   │   └── contact/       # Contact page
│   │   │
│   │   ├── admin/             # Admin pages (protected)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── bookings/      # Manage bookings
│   │   │   └── services/      # Manage services
│   │   │
│   │   ├── api/               # API Routes
│   │   │   ├── services/      # Services CRUD
│   │   │   ├── bookings/      # Bookings CRUD
│   │   │   └── availability/  # Time slot checks
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base components (Button, Input)
│   │   ├── booking/           # Booking-specific components
│   │   └── admin/             # Admin-specific components
│   │
│   ├── lib/                   # Utilities & configurations
│   │   ├── db.ts              # Prisma client
│   │   ├── utils.ts           # Helper functions
│   │   └── validations.ts     # Zod schemas
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
│
├── public/                    # Static assets
│   └── images/
│
├── docs/                      # Documentation
│   ├── 01-module-structure.md
│   ├── 02-repository-structure.md
│   └── ...
│
├── tests/                     # Test files
│
├── .env.example               # Environment template
├── .gitignore
├── docker-compose.yml         # Local PostgreSQL
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Files

### Environment Variables (.env.example)
```env
# Database
DATABASE_URL="postgresql://hairadresser:localdev@localhost:5432/hairadresser"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin (MVP - simple auth)
ADMIN_PASSWORD="change-me-in-production"
```

### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: hairadresser
      POSTGRES_PASSWORD: localdev
      POSTGRES_DB: hairadresser
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Prisma Schema (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models will be defined in Task #4 (Data Model)
```

---

## Setup Commands

```bash
# 1. Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# 2. Install dependencies
npm install prisma @prisma/client
npm install zod                    # Validation
npm install date-fns               # Date handling

# 3. Initialize Prisma
npx prisma init

# 4. Start database
docker-compose up -d

# 5. Run development server
npm run dev
```

---

## Acceptance Criteria

- [x] Tech stack decided: Next.js + PostgreSQL + Prisma
- [x] Project structure defined with App Router
- [x] API routes planned under `/api`
- [x] Database config with Docker ready
- [x] Environment variables documented
- [x] README explains setup

---

## Out of Scope (Later)

- CI/CD pipelines
- Production deployment config
- Advanced authentication (NextAuth)
- Payment integration

---

## Benefits of This Structure

| Benefit | Description |
|---------|-------------|
| **No separate backend** | Next.js API routes handle everything |
| **Type-safe end-to-end** | Prisma + TypeScript = fully typed |
| **Easy deployment** | `git push` to Vercel and done |
| **SEO ready** | SSR/SSG for public pages |
| **Scalable** | Can add microservices later if needed |
