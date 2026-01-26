# Platform Module Structure

> **Task #1** | Status: ✅ Completed  
> Defines the core platform modules for Hairadresser MVP

---

## 🎯 Goal

Define the core platform modules and clearly separate MVP scope from future features.

## 📋 Why This Matters

- Prevents scope creep during development
- Creates clear boundaries between features
- Guides all future development decisions
- Enables parallel work on different modules

---

## MVP Modules (Build Now)

### 1. Website Module

Public-facing pages for the salon.

| Page | Description |
|------|-------------|
| Homepage | Welcome page with key information |
| Services & Prices | List of all services with pricing |
| Opening Hours | Business hours display |
| Contact | Location, phone, email |
| About | Salon story and team |

**Dependencies:** None (standalone)

---

### 2. Booking Module

Core functionality of the platform.

| Feature | Description |
|---------|-------------|
| Service Selection | Choose one or more services |
| Availability Check | View available time slots |
| Create Booking | Submit appointment request |
| Booking Confirmation | Email confirmation to customer |
| Basic Cancellation | Cancel existing booking |

**Dependencies:** 
- Website Module (embedded booking widget)
- Admin Module (for availability data)

---

### 3. Admin Module

Internal management for the hairdresser.

| Feature | Description |
|---------|-------------|
| Admin Login | Secure authentication |
| Manage Services | Add/edit/delete services |
| Manage Prices | Update service pricing |
| Manage Working Hours | Set availability schedule |
| View Bookings | Calendar view of all appointments |
| Manage Bookings | Confirm, reschedule, cancel |
| Block Time Slots | Mark unavailable periods |

**Dependencies:** 
- Booking Module (manages booking data)

---

## Module Dependency Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
├─────────────────┬─────────────────┬─────────────────────┤
│  Website Module │  Booking Module │    Admin Module     │
│  (Public)       │  (Public)       │    (Protected)      │
└────────┬────────┴────────┬────────┴──────────┬──────────┘
         │                 │                   │
         │    ┌────────────┴────────────┐      │
         │    │                         │      │
         ▼    ▼                         ▼      ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                            │
├─────────────────┬─────────────────┬─────────────────────┤
│  Services API   │  Bookings API   │    Admin API        │
│                 │  Availability   │    Authentication   │
└─────────────────┴─────────────────┴─────────────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │  Database │
                    └───────────┘
```

---

## Post-MVP Modules (Future)

### 4. Customers Module
- Customer profiles & registration
- Booking history
- Preferences & favorites
- Loyalty tracking

### 5. Products Module
- Product catalog
- Inventory management
- Online sales
- Product recommendations

### 6. Payments Module
- Online payments (Stripe/similar)
- Invoicing
- Payouts to salon
- Refund handling

### 7. Notifications Module *(Suggested)*
- Email confirmations
- SMS reminders
- Push notifications
- Marketing emails

### 8. Analytics Module *(Suggested)*
- Popular services dashboard
- Revenue tracking
- Busy hours analysis
- Customer insights

---

## Acceptance Criteria

- [x] MVP modules are clearly defined
- [x] MVP vs post-MVP is explicit
- [x] No overlap between modules
- [x] Module dependencies documented
- [x] Authentication strategy included (Admin login)
- [x] Future notification needs identified
- [x] Analytics considerations noted

---

## Notes

- Admin authentication is part of Admin Module for MVP simplicity
- Notifications in MVP will be basic email only (no separate module)
- Database will be shared across all modules
- API will be RESTful with clear module-based endpoints
