# ClubSync — College Event Management Platform
## Full Build Plan: Next.js (FE) + NestJS (BE)

---

## 1. Overview

ClubSync is a multi-tenant event management platform built for college clubs. It covers the full lifecycle of an event — creation, promotion, registration, check-in, and post-event analytics — while giving clubs an identity layer (club pages, membership, roles) and students a unified dashboard to discover and manage event participation.

**Stack:**
- Frontend: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, React Query
- Backend: NestJS, PostgreSQL, Prisma ORM, Redis (BullMQ), Cloudinary (media)
- Auth: better-auth(college SSO / OAuth)
- AI: groq ai api (claude-sonnet-4-20250514)
- Realtime: Socket.io
- Payments: Razorpay (for paid events)
- Infra: Docker Compose (local), Render (prod)

---

## 2. User Roles

| Role | Description |
|---|---|
| **Student** | Registers for events, follows clubs, manages profile |
| **Club Member** | Basic club access, helps organize |
| **Club Admin** | Creates/manages events, manages members |
| **Club Owner** | Full club control, transfers ownership |
| **College Admin** | Platform-wide moderation, college settings |
| **Super Admin** | Full system access |

---

## 3. Pages & Routes (Frontend — Next.js)

### Public / Unauthenticated

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, featured events, top clubs, CTA to sign up |
| `/explore` | Explore | Browse all events + clubs, filters, search |
| `/events/[id]` | Event Detail | Full event info, registration button, speaker cards |
| `/clubs/[slug]` | Club Profile | Club bio, team, upcoming events, gallery |
| `/login` | Login | Better Auth-powered auth with college email SSO |

### Student (Authenticated)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Student Dashboard | Upcoming events, followed clubs, AI recommendations |
| `/my-events` | My Events | Registered events (upcoming + past), tickets |
| `/my-clubs` | My Clubs | Clubs the student follows or is a member of |
| `/profile` | Profile | Bio, interests, events attended, badges |
| `/tickets/[id]` | Ticket / QR | QR code ticket for a registered event |
| `/notifications` | Notifications | Event updates, reminders, club announcements |
| `/certificates/[id]` | Certificate | AI-generated participation certificate |

### Club Admin

| Route | Page | Description |
|---|---|---|
| `/club/[slug]/dashboard` | Club Dashboard | Overview stats, quick actions |
| `/club/[slug]/events` | Events List | All club events (drafts, published, past) |
| `/club/[slug]/events/new` | Create Event | Multi-step event creation form |
| `/club/[slug]/events/[id]/edit` | Edit Event | Edit event details, schedule, assets |
| `/club/[slug]/events/[id]/checkin` | Check-in Console | Live QR scanner, manual check-in, attendance list |
| `/club/[slug]/events/[id]/analytics` | Event Analytics | Registrations, demographics, check-in rate |
| `/club/[slug]/members` | Members | Member list, roles, invite links |
| `/club/[slug]/settings` | Club Settings | Name, bio, banner, social links, visibility |
| `/club/[slug]/announcements` | Announcements | Create and send announcements to followers |

### College Admin

| Route | Page | Description |
|---|---|---|
| `/admin` | Admin Dashboard | Platform-wide metrics |
| `/admin/clubs` | Clubs | Approve, suspend, or delete clubs |
| `/admin/events` | Events | Review flagged or reported events |
| `/admin/users` | Users | User management, role assignment |
| `/admin/settings` | Settings | College branding, domain whitelist, feature flags |

---

## 4. Feature Breakdown

### 4.1 Auth & Identity
- Better Auth integration with college email domain restriction
- Role assignment on signup (Student default, Club Admin by invite)
- College Admin assigned manually by Super Admin
- JWT sessions with refresh token rotation

### 4.2 Club Management
- Clubs can be created by any student (pending College Admin approval)
- Club profile: name, tagline, category (Tech / Cultural / Sports / Social), banner, logo, social links
- Membership tiers: Follower (public), Member (invite/request), Admin, Owner
- Invite links with expiry and usage limits
- Club verification badge (approved by college admin)

### 4.3 Event Management
- Multi-step creation: Details → Schedule → Venue → Tickets → Assets → Review
- Event types: In-person, Online (with meeting link), Hybrid
- Rich text description (Tiptap editor)
- Cover image upload (Cloudinary)
- Speaker / Guest profiles with photo and bio
- FAQs section per event
- Multiple ticket tiers (Free, Paid, Early Bird, VIP)
- Capacity limits per tier
- Event tags and category for discoverability
- Draft / Published / Cancelled / Completed status
- Scheduled publish (publish at a future datetime)
- Event duplication (copy an existing event as a new draft)

### 4.4 Registration & Ticketing
- Registration form builder (club can add custom fields: T-shirt size, dietary preference, etc.)
- Email confirmation with QR code ticket on registration
- Waitlist with auto-promotion when a spot opens
- Group registration (register multiple students at once)
- Cancellation with configurable refund window
- Registration deadline enforcement

### 4.5 Check-in System
- QR code scanning via device camera (browser-based, no app needed)
- Manual check-in by name / student ID search
- Real-time attendance counter visible to all club admins
- Check-in gate: block duplicate scan, handle waitlist spot
- Offline-capable check-in (IndexedDB sync on reconnect)
- Check-in opens X minutes before event start (configurable)

### 4.6 Payments (Paid Events)
- Razorpay integration for ticket purchases
- Payment capture on successful registration
- Refund initiation through admin panel
- Transaction history per event
- Revenue summary on event analytics page

### 4.7 Notifications
- In-app notification bell (real-time via Socket.io)
- Email notifications: registration confirmation, event reminder (24h before), event update, cancellation
- Push notifications (PWA — optional phase 2)
- Announcement broadcast by club admins to all followers

### 4.8 Analytics
- Per-event: registrations over time, check-in rate, drop-off (registered but didn't attend), ticket tier breakdown, gender/year breakdown (from profile)
- Per-club: monthly event count, total attendees, follower growth, top events
- College admin: platform-wide event volume, active clubs, top categories

### 4.9 Discovery & Search
- Full-text search across events and clubs (PostgreSQL `tsvector`)
- Filter by: date range, category, club, event type, registration status (open / closed), price (free / paid)
- Sort by: date, popularity, newest
- Trending events (based on registration velocity)
- "Near you" events (if user shares location — phase 2)

### 4.10 Certificates
- Auto-generate participation certificate after event is marked Complete and attendance is confirmed
- Certificate includes: student name, event name, club name, date, unique verification ID
- PDF download, shareable verification link

---

## 5. AI Features

All AI features use the Claude API (claude-sonnet-4-20250514).

### 5.1 AI Event Description Generator
**Where:** Event creation form (Details step)
**What it does:** Club admin enters a rough prompt ("Tech talk on LLMs by a Google engineer, 2 hours, casual") and Claude generates a polished event description with highlights, what to expect, and a closing CTA.
**Implementation:** FE calls BE `/ai/event-description` endpoint. BE sends prompt + club context to Claude. Streamed response back to FE using SSE.

### 5.2 AI Poster Generator Prompt Builder
**Where:** Event creation form (Assets step)
**What it does:** Club admin fills in event details; Claude generates an optimized text prompt they can paste into Canva or Midjourney to create a poster. Saves them from writing briefs.
**Implementation:** Simple Claude call with event JSON → returns a structured prompt string.

### 5.3 Smart Event Recommendations
**Where:** Student Dashboard (`/dashboard`)
**What it does:** Based on student's past registrations, followed clubs, profile interests, and events they've skimmed (tracked via view events), Claude ranks and explains upcoming event recommendations.
**Implementation:** BE aggregates student interest signals, passes to Claude with candidate event list. Claude returns ranked list with 1-line reason per event. Cached in Redis per student (TTL 6 hours).

### 5.4 AI Q&A Chatbot per Event
**Where:** Event Detail page (`/events/[id]`)
**What it does:** Students can ask "Is this event beginner-friendly?", "What should I bring?", "Is food provided?" — Claude answers based on the event's description, FAQ, and club info.
**Implementation:** FE chat widget → BE `/ai/event-chat` → Claude with event context as system prompt. No conversation history stored (stateless, context window per session).

### 5.5 Club Announcement Drafting Assistant
**Where:** Club Admin → Announcements page
**What it does:** Admin types a rough idea ("Remind followers about the hackathon registration closing tomorrow and hype them up") and Claude drafts a ready-to-send announcement.
**Implementation:** Simple Claude call, no streaming needed. Response rendered in a preview box with Edit / Send options.

### 5.6 AI Post-Event Summary
**Where:** Club Admin → Event Analytics page (after event is marked Complete)
**What it does:** Claude generates a shareable post-event summary: attendance stats, key highlights (from description), notable moments, and a social-media-ready recap paragraph.
**Implementation:** BE sends event metadata + analytics snapshot to Claude → returns structured summary. Club admin can edit and copy.

### 5.7 Spam / Moderation Filter
**Where:** Runs automatically on event creation and club bio save
**What it does:** Claude checks submitted content for spam, inappropriate language, or policy violations. Flags or auto-rejects with a reason.
**Implementation:** BE middleware on event creation and club profile update endpoints. If flagged, event is moved to "Pending Review" and college admin is notified.

---

## 6. Backend — NestJS Module Breakdown

```
src/
├── auth/             # Clerk webhook, JWT guard, role guard
├── users/            # User profile CRUD, interest tags
├── clubs/            # Club CRUD, membership, invite links
├── events/           # Event CRUD, scheduling, duplication
├── registrations/    # Registration, waitlist, cancellation
├── tickets/          # QR generation, ticket state
├── checkin/          # Check-in logic, real-time counter
├── payments/         # Razorpay webhook, transaction records
├── notifications/    # Email (Resend/Nodemailer), in-app, Socket.io gateway
├── announcements/    # Club broadcast announcements
├── analytics/        # Aggregated stats queries
├── search/           # Full-text search, filters, trending
├── certificates/     # Certificate generation (Puppeteer PDF)
├── media/            # Cloudinary upload pre-sign
├── ai/               # All Claude API calls, prompt builders
├── admin/            # College admin endpoints
└── common/           # Guards, interceptors, decorators, DTOs
```

### Key API Endpoints

**Auth**
- `POST /auth/webhook` — Better Auth webhook handler (user created/updated)

**Clubs**
- `GET /clubs` — list + search
- `POST /clubs` — create (pending approval)
- `GET /clubs/:slug` — public club profile
- `PATCH /clubs/:slug` — update (admin only)
- `POST /clubs/:slug/members/invite` — generate invite link
- `POST /clubs/:slug/join/:token` — accept invite

**Events**
- `GET /events` — list + filters
- `POST /events` — create event (draft)
- `GET /events/:id` — event detail
- `PATCH /events/:id` — update
- `POST /events/:id/publish` — publish
- `POST /events/:id/duplicate` — clone as draft
- `DELETE /events/:id` — cancel

**Registrations**
- `POST /events/:id/register` — register student
- `DELETE /events/:id/register` — cancel registration
- `GET /events/:id/registrations` — list (admin)
- `GET /my/registrations` — student's registrations

**Check-in**
- `POST /checkin/scan` — validate QR and mark attended
- `POST /checkin/manual` — manual check-in by name/ID
- `GET /events/:id/attendance` — live attendance list

**AI**
- `POST /ai/event-description` — generate description (SSE stream)
- `POST /ai/poster-prompt` — generate poster brief
- `POST /ai/recommendations` — personalized event list
- `POST /ai/event-chat` — event Q&A (SSE stream)
- `POST /ai/announcement-draft` — draft announcement
- `POST /ai/post-event-summary` — generate recap

**Analytics**
- `GET /analytics/events/:id` — per-event stats
- `GET /analytics/clubs/:slug` — per-club stats
- `GET /analytics/platform` — admin-only platform stats

---

## 7. Database Schema (Key Tables)

```
users               id, auth_id, email, name, avatar, college_id, interests[], year, created_at
colleges            id, name, domain, logo, settings{}
clubs               id, slug, name, tagline, category, bio, logo, banner, college_id, status, owner_id
club_members        id, club_id, user_id, role, joined_at
events              id, club_id, title, description, type, status, start_at, end_at, venue, capacity, cover_image, created_by
ticket_tiers        id, event_id, name, price, capacity, available, closes_at
registrations       id, event_id, user_id, tier_id, status, qr_token, registered_at, custom_fields{}
checkins            id, registration_id, checked_in_at, checked_in_by
payments            id, registration_id, amount, currency, razorpay_order_id, status, paid_at
announcements       id, club_id, title, body, sent_by, sent_at
notifications       id, user_id, type, title, body, read, created_at
certificates        id, registration_id, issued_at, verify_token, pdf_url
event_views         id, event_id, user_id, viewed_at  (for recommendation signals)
```

---

## 8. Build Timeline (8 Weeks)

### Week 1 — Foundation
- Monorepo setup (Turborepo or pnpm workspaces)
- NestJS scaffold: auth module, Better Auth webhook, user model
- Next.js scaffold: Better Auth, base layout, Tailwind + shadcn/ui setup
- Docker Compose: PostgreSQL + Redis + app containers
- Prisma schema v1 (users, colleges, clubs)
- Deployed skeleton to Render

### Week 2 — Clubs
- Club CRUD API + service layer
- Club profile page (public)
- Membership system: invite link generation + join flow
- Club dashboard shell (admin)
- College admin: approve / reject clubs
- Image upload via Cloudinary (logo + banner)

### Week 3 — Events Core
- Event CRUD API (all fields, ticket tiers)
- Multi-step event creation form (FE)
- Event detail page (public)
- Event list + filters + search (PostgreSQL FTS)
- Explore page
- Draft / Publish / Cancel lifecycle

### Week 4 — Registrations & Tickets
- Registration API (with custom fields)
- Waitlist logic
- QR code generation (qrcode npm)
- Email confirmation (Resend)
- Student: My Events page + Ticket view
- Razorpay integration for paid tiers

### Week 5 — Check-in & Realtime
- QR scanner (browser camera via `@zxing/browser`)
- Check-in API + duplicate scan handling
- Real-time attendance counter (Socket.io)
- Manual check-in UI
- Offline-capable check-in (IndexedDB)
- Notifications: in-app bell + Socket.io gateway

### Week 6 — AI Features
- `/ai` module in NestJS with Claude API client
- Event description generator (streaming SSE)
- Smart recommendations (student dashboard)
- Event Q&A chatbot (event detail page)
- Announcement draft assistant
- Spam moderation middleware
- Post-event summary

### Week 7 — Analytics, Certificates & Polish
- Analytics aggregation queries + API endpoints
- Per-event and per-club analytics dashboards
- Certificate generation (Puppeteer PDF)
- Certificate verification page
- Platform-wide admin analytics
- Email reminders (BullMQ scheduled jobs)
- Announcement broadcast

### Week 8 — QA, Hardening & Launch
- E2E test suite (Playwright: happy path registration, check-in, AI flows)
- Unit tests for critical services (registration, check-in, payments)
- Rate limiting on AI endpoints (Redis token bucket)
- Error boundaries + Sentry integration
- Performance audit (Lighthouse, query indexes)
- Production environment setup + CI/CD (GitHub Actions)
- Soft launch with 2-3 pilot clubs

---

## 9. Non-Functional Requirements

| Concern | Approach |
|---|---|
| Auth security | Domain-restricted Better Auth org, role guards on every protected route |
| AI cost control | Redis cache on recommendations (6h TTL), rate limit AI endpoints per club |
| File uploads | Pre-signed Cloudinary URLs (BE never handles raw file bytes) |
| Payments | Verify Razorpay webhook signature server-side before fulfilling registration |
| Check-in integrity | Idempotent scan: same QR always returns same result, never double-marks |
| Scalability | Stateless NestJS instances, BullMQ for async jobs, Redis for session + cache |
| Observability | Structured logging (Pino), Sentry for errors, basic uptime monitor |

---

## 10. Future Scope (Post v1)

- **Mobile app** — React Native, deep link into events from QR posters
- **Event calendar export** — `.ics` file / Google Calendar sync
- **Inter-college events** — events visible across colleges on the same platform
- **Sponsor management** — clubs can log sponsors per event, sponsors get a mention on event page
- **Live event features** — polls, Q&A, reactions during online events
- **AI: speaker match** — suggest relevant speakers from alumni network based on event topic
- **Leaderboard** — students earn points for attending events, redeemable for perks