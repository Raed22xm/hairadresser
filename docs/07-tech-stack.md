# MVP Tech Stack

> **Task #7** | Status: ✅ Completed  
> Defines the technical stack for Hairadresser MVP

---

## 🎯 Goal

Define a tech stack that enables rapid MVP delivery while providing a solid foundation for future scaling.

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT                           │
│                      Vercel                             │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS 14                           │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │      FRONTEND       │  │        BACKEND          │  │
│  │   React + SSR/SSG   │  │     API Routes          │  │
│  │   TailwindCSS       │  │     Prisma ORM          │  │
│  └─────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                             │
│              PostgreSQL (Vercel/Supabase)               │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Decisions

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 14.x (App Router) |
| **Language** | TypeScript | 5.x |
| **Styling** | TailwindCSS | 3.x |
| **Database** | PostgreSQL | 15.x |
| **ORM** | Prisma | 5.x |
| **Validation** | Zod | 3.x |
| **Deployment** | Vercel | - |
| **DB Hosting** | Vercel Postgres / Supabase | - |

---

## Frontend Stack

### Next.js 14 (App Router)

| Feature | Use For |
|---------|---------|
| SSR | Public pages (SEO) |
| SSG | Static content |
| Client Components | Interactive booking UI |
| Server Components | Data fetching |

### Why Next.js?
- ✅ SEO-friendly (SSR/SSG)
- ✅ Fast performance
- ✅ Built-in API routes
- ✅ Easy Vercel deployment
- ✅ Large community

### Styling: TailwindCSS

| Reason | Benefit |
|--------|---------|
| Utility-first | Rapid development |
| No CSS files | Less context switching |
| Responsive | Mobile-first built-in |
| Dark mode | Easy theming |

### State Management
- **Local state only** (useState, useReducer)
- No Redux/Zustand in MVP
- Server state via React Query (optional)

---

## Backend Stack

### Next.js API Routes

All backend logic lives in `/src/app/api/`:

```
/api/services          → CRUD services
/api/availability      → Weekly schedule
/api/blocked           → Block time slots
/api/bookings          → Create/cancel bookings
/api/admin/login       → Admin authentication
```

### Why API Routes (Not Express)?
- ✅ One deployment
- ✅ Shared TypeScript types
- ✅ No CORS issues
- ✅ Simpler architecture
- ✅ Can extract to Express later

### Validation: Zod

```typescript
const BookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().date(),
  startTime: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
});
```

---

## Database Stack

### PostgreSQL + Prisma

| Aspect | Decision |
|--------|----------|
| Database | PostgreSQL |
| ORM | Prisma |
| Hosting | Vercel Postgres or Supabase |
| Migrations | Prisma Migrate |

### Why PostgreSQL (Not MongoDB)?
| Factor | PostgreSQL | MongoDB |
|--------|------------|---------|
| Booking conflicts | ✅ Easy with SQL | ⚠️ Harder |
| Relationships | ✅ Native | ⚠️ Manual |
| Transactions | ✅ ACID | ⚠️ Limited |
| Time queries | ✅ Excellent | ⚠️ Custom |
| Type safety | ✅ Prisma types | ⚠️ Less strict |

### Prisma Benefits
- ✅ Type-safe queries
- ✅ Auto-generated client
- ✅ Easy migrations
- ✅ Visual Studio (Prisma Studio)

---

## Core Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "bcryptjs": "^2.4.3",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## Deployment Architecture

### Development
```bash
# Start database
docker-compose up -d

# Run app
npm run dev

# Prisma Studio
npx prisma studio
```

### Production (Vercel)
```
GitHub Push → Vercel Build → Deploy
                  ↓
           Vercel Postgres
```

### Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="hashed-password"
NEXTAUTH_SECRET="random-secret"
SMTP_HOST="smtp.example.com"
SMTP_USER="..."
SMTP_PASS="..."
```

---

## Non-Functional Requirements

| Aspect | Implementation |
|--------|----------------|
| **Performance** | Next.js optimization, edge caching |
| **Security** | Input validation, parameterized queries |
| **SEO** | SSR for public pages, meta tags |
| **Mobile** | Responsive TailwindCSS |
| **Reliability** | PostgreSQL ACID, Prisma transactions |

---

## Future-Ready

The stack supports post-MVP features:

| Feature | How |
|---------|-----|
| Auth | Add NextAuth.js |
| Payments | Add Stripe |
| Mobile app | API routes ready |
| Multiple staff | Schema extensible |
| Analytics | Add Vercel Analytics |

---

## Out of Scope (Post-MVP)

| Technology | Status |
|------------|--------|
| WebSockets | Not needed |
| Redis caching | Premature |
| CI/CD pipelines | Vercel handles |
| Containerization | Vercel handles |
| Multi-region | Single region OK |

---

## Acceptance Criteria

- [x] Stack supports all MVP user journeys
- [x] Backend can enforce booking rules (SQL)
- [x] Frontend can implement all flows
- [x] Database schema supports relationships
- [x] Stack aligned with earlier decisions
- [x] Ready for implementation
