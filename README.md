# ArthaLedger

**Your Business. Our Financial Expertise.**

A production-oriented chartered accountancy and business-advisory website with a database-driven admin CMS, enquiry management, WhatsApp integration and a bilingual (English/Telugu) website assistant.

The public website and admin dashboard are built as one Next.js application. All website copy, services, testimonials, FAQs, legal pages, navigation, branding, contact details, SEO settings and chatbot configuration are stored in PostgreSQL and managed from the admin dashboard — no code edits are needed for routine content changes.

---

## 1. What is included

### Public website
- Premium navy/gold/ivory design with responsive navigation, mobile menu and accessible components.
- Home page with hero, featured services, differentiators, expertise, statistics, approved testimonials, FAQs and conversion band.
- About page with introduction, story, vision, mission, values, expertise, team and reasons to choose the firm.
- Dynamic services index and individual service pages with benefits, detailed content, enquiry CTA, WhatsApp CTA and related services.
- Testimonials page that only displays client feedback that has been approved **and** published. No synthetic reviews are seeded.
- Contact page with validated enquiry form, office details, Google Maps embed and WhatsApp.
- Terms, Privacy, Disclaimer and Cookie Policy pages rendered from the database.
- Floating WhatsApp widget on every public page, with a configurable number, pre-filled message and welcome tooltip.
- Floating chatbot with English/Telugu switching, quick replies, lead capture, appointment requests, conversation history and human handoff.
- SEO metadata, Open Graph/Twitter cards, canonicals, JSON-LD structured data, `sitemap.xml`, `robots.txt` and admin/API `noindex` protection.

### Admin dashboard (`/admin`)
- Secure login, first-run setup, session expiry, role-based access and audit logging.
- Dashboard with enquiry counts, new leads, services, testimonials, appointments, content health, 14-day enquiry chart, recent activity and analytics integration status.
- CMS modules:
  - Home page + statistics + why-choose-us + expertise cards
  - About page + values + team members
  - Services + service categories
  - Testimonials with approval/publishing workflow
  - FAQs (English + optional Telugu)
  - Legal pages (Terms, Privacy, Disclaimer, Cookie)
  - SEO & analytics settings
  - Branding, contact details, navigation, footer and social links
  - Media library with Cloudinary uploads
- Client desk: enquiries, appointment requests, chatbot conversations with transcripts and linked leads.
- Admin user management (SUPER_ADMIN only), account password change and audit logs.
- Create, read, update, delete, publish/unpublish, image upload, draft preview for services/legal pages, and confirmation dialogs for destructive actions.

### Security
- bcrypt password hashing (cost 12), HTTP-only JWT session cookies (HS256, 8 hours).
- Edge proxy protection plus server-side session/DB checks and per-action authorisation.
- Role permissions: `SUPER_ADMIN`, `ADMIN`, `EDITOR`.
- Zod validation on all public and admin writes.
- Rate limiting for login, contact enquiries, chat, leads, appointments and uploads.
- Same-origin enforcement on API routes; Next.js Server Actions provide built-in origin/CSRF protection.
- Server-only secrets; no API keys or database credentials in client code.
- Upload MIME/size validation and authenticated media access.
- Audit logs for authentication, content changes, publishing, enquiries and deletions.
- Security headers (`nosniff`, frame options, referrer policy, permissions policy).
- Dependency audit: runtime dependencies are clear after the Zod 4 security update. `npm audit` still reports one high-severity advisory in `deepmerge-ts`, pulled in only by the Prisma CLI/config tooling; it is not used by the web runtime. Remediation requires a breaking Prisma 7 upgrade and is tracked as a maintenance item.

---

## 2. Technology stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | React 19, TypeScript, Tailwind CSS, shadcn-style Radix primitives, Lucide icons, Framer Motion |
| Database | PostgreSQL 16+ |
| ORM | Prisma 6 |
| Auth | Custom secure session auth using `jose` + `bcryptjs` |
| Validation | Zod |
| Images | Cloudinary (optional) |
| AI | OpenAI-compatible chat-completions endpoint (optional, server-side only) |

---

## 3. Project structure

```
prisma/
  schema.prisma          Database models and enums
  migrations/            Committed SQL migrations
  seed.ts                Idempotent seed: roles, admin bootstrap, content, 16 services, FAQs, legal drafts
src/
  app/
    (site)/              Public pages and site layout
    admin/(auth)/        Login and first-run setup
    admin/(dashboard)/   Protected admin shell and all CMS modules
    api/chat/            Chatbot message / lead / appointment endpoints
    api/upload/          Authenticated Cloudinary upload endpoint
    sitemap.ts, robots.ts
  actions/               Server actions (auth, CMS, services, enquiries, media, users)
  components/
    site/                Navbar, footer, chat, WhatsApp, analytics consent, shared sections
    admin/               Shell, forms, editors, dialogs, charts
    ui/                  Button, input, card, badge, dialog, accordion, switch
  lib/                   DB, auth, permissions, validation, content access, SEO, chatbot, rate limits
  proxy.ts               Edge route protection for /admin
```

---

## 4. Local development

### Prerequisites
- Node.js 20.9+ (tested with Node 24)
- PostgreSQL 16+ (local, Docker or managed)
- Optional: Cloudinary account, OpenAI-compatible API key

### 4.1 Install

```bash
npm install
cp .env.example .env
# Edit .env with your database URL and a generated AUTH_SECRET
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4.2 Start PostgreSQL (Docker example)

```bash
docker run --name arthaledger-db \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=arthaledger \
  -p 5432:5432 -d postgres:16
```

Then use:

```env
DATABASE_URL="postgresql://postgres:devpassword@localhost:5432/arthaledger?schema=public"
```

### 4.3 Migrate and seed

```bash
npx prisma migrate dev
npm run db:seed
```

The seed is idempotent. It creates:
- Roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`)
- A bootstrap admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (or generates and prints a one-time random password)
- Brand copy, 16 services, 6 categories, 8 FAQs, navigation, statistics, values/expertise, and India-appropriate legal drafts

The seed intentionally does **not** create testimonials or team members. Add only genuine client feedback and real team profiles.

### 4.4 Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>

For the local workspace in this repository, `.env` points at an isolated PostgreSQL development cluster on port `5433` under `.dev/pgdata` (ignored by Git). Start it with:

```bash
"/c/Program Files/PostgreSQL/16/bin/pg_ctl.exe" -D .dev/pgdata -o "-p 5433" -l .dev/pg.log start
```

Use the seeded email and the `SEED_ADMIN_PASSWORD` from `.env` to sign in.

---

## 5. First administrator in production

There are two supported paths. Neither hardcodes a password.

### Option A — controlled first-run setup (recommended)
1. Set a long random `ADMIN_SETUP_TOKEN` in the server environment.
2. Deploy with no admin users.
3. Visit `/admin/setup`, enter your name, email, a strong password and the setup token.
4. Remove `ADMIN_SETUP_TOKEN` from the environment and redeploy/restart.

Setup is automatically disabled once an admin exists. The page returns "Setup has already been completed".

### Option B — seed bootstrap
1. Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` and run `npm run db:seed` once in the deployment environment.
2. Remove `SEED_ADMIN_PASSWORD` afterwards. The seed never overwrites an existing account's password.

Passwords require at least 12 characters with a letter, number and symbol. A SUPER_ADMIN can create further named users and reset passwords under **Security → Admin users**.

---

## 6. Configuration

### Required
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | JWT signing secret, 32+ characters |
| `NEXT_PUBLIC_SITE_URL` | Public site origin for canonical URLs, sitemap and robots |

### Setup / seed (temporary)
| Variable | Purpose |
| --- | --- |
| `ADMIN_SETUP_TOKEN` | Enables `/admin/setup` while no admin exists. Remove after setup. |
| `SEED_ADMIN_NAME` | Optional bootstrap admin display name |
| `SEED_ADMIN_EMAIL` | Bootstrap admin email |
| `SEED_ADMIN_PASSWORD` | Bootstrap password; if omitted, a random password is printed once by the seed |

### Optional integrations
| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Enables AI chatbot mode. Read only server-side. |
| `OPENAI_BASE_URL` | OpenAI-compatible API base URL (default `https://api.openai.com/v1`) |
| `OPENAI_MODEL` | Model override; otherwise the model configured in the admin chatbot settings is used |
| `CLOUDINARY_CLOUD_NAME` | Image storage |
| `CLOUDINARY_API_KEY` | Image storage |
| `CLOUDINARY_API_SECRET` | Image storage |

Cloudinary and AI are optional: uploads are disabled with a clear admin message if Cloudinary is absent, and AI mode automatically falls back to approved FAQ/rule-based answers if no key is configured.

---

## 7. Chatbot behaviour

Modes are configurable under **Site setup → Contact & messaging**:

1. **AI with FAQ fallback** — calls a secure server endpoint with approved CMS content as context. Falls back to rule-based answers if no key/provider error.
2. **FAQ / rule-based only** — deterministic answers using approved services and FAQs; works without external AI.
3. **Human handoff only** — directs visitors to WhatsApp/contact.

Safety behaviour:
- The system prompt forbids inventing tax rates, thresholds, compliance deadlines, penalties, legal outcomes or professional opinions.
- It states that specific questions need a qualified CA's review and offers a consultation.
- It never asks for passwords, OTPs, bank credentials or sensitive documents.
- It uses only published services, published FAQs and configured contact details.
- English and Telugu are supported; Telugu FAQ translations are optional per FAQ.
- Conversations, messages and captured leads are stored in PostgreSQL and visible under **Client desk → Chat conversations**.
- Leads also create a ContactEnquiry (`source = CHATBOT`) and appointment requests create an AppointmentRequest.

No AI key is required for the site to function. The assistant still answers approved FAQs and captures leads.

---

## 8. WhatsApp

- The number is stored in `WebsiteSettings.whatsappNumber` (digits with country code).
- The floating widget and service-page enquiry use the official `https://wa.me/<number>?text=...` click-to-chat link.
- Both the pre-filled message and the welcome tooltip are editable in the admin.
- Open **Contact information** in the admin to test the current link.

---

## 9. SEO, analytics and legal

- Dynamic metadata is generated from `SEOSettings` and page/service records.
- Canonical base, title template, OG image, Twitter handle, keywords and GA4 measurement ID are editable.
- `sitemap.xml` includes published services and legal pages only.
- `robots.txt` disallows `/admin` and `/api`.
- Structured data includes `AccountingService`, `Service` and `FAQPage`.
- If a GA4 ID is configured, optional analytics loads **only after the visitor accepts** the cookie banner. Decline stores the preference and loads nothing.
- Legal pages are editable Markdown drafts. The seeded text contains bracketed placeholders and must be completed and reviewed by qualified legal counsel before publication or reliance.

---

## 10. Database

Key models: `Role`, `AdminUser`, `WebsiteSettings`, `NavItem`, `SocialLink`, `HomePageContent`, `AboutPageContent`, `Stat`, `WhyChooseItem`, `ExpertiseItem`, `ValueItem`, `TeamMember`, `ServiceCategory`, `Service`, `Testimonial`, `FAQ`, `ContactEnquiry`, `AppointmentRequest`, `ChatConversation`, `ChatMessage`, `LegalPage`, `SEOSettings`, `Media`, `AuditLog`.

Useful commands:

```bash
npm run db:migrate      # create a development migration
npm run db:deploy       # apply committed migrations in production
npm run db:seed         # idempotent seed
npm run db:studio       # inspect data
npm run typecheck       # TypeScript
npm run build           # production build
```

Production migration flow:

```bash
npx prisma migrate deploy
npm run db:seed        # only if bootstrapping a new environment
```

Back up the database before migrations. Do not run `prisma migrate reset` against production.

---

## 11. Deployment

### Vercel + managed PostgreSQL (recommended)
1. Create a PostgreSQL database (Neon, Supabase, RDS, etc.) and copy the pooled connection string.
2. Import this repository into Vercel.
3. Set environment variables: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, optional AI/Cloudinary keys, and temporarily `ADMIN_SETUP_TOKEN`.
4. Build command: `npm run build` (runs `prisma generate` then `next build`).
5. Apply migrations from a trusted environment/CI job: `npx prisma migrate deploy`.
6. Complete `/admin/setup`, then remove `ADMIN_SETUP_TOKEN`.
7. Set `NEXT_PUBLIC_SITE_URL` and the admin **SEO → canonical base URL** to the production origin.
8. Update contact information, WhatsApp, Google Maps embed and branding.
9. Replace legal placeholders and obtain legal review.
10. Add real team and approved testimonial content when available.

### Any Node host
```bash
npm ci
npm run build
npx prisma migrate deploy
npm start                 # defaults to port 3000
```

Run behind HTTPS. The session cookie uses `secure: true` automatically when `NODE_ENV=production`.

### Post-deployment checks
- `/`, `/services`, a service detail page, `/contact`, `/legal/privacy-policy` return 200.
- `/admin` redirects to `/admin/login` when unauthenticated.
- Login works; wrong passwords are rejected; rate limiting responds after repeated attempts.
- Submit a contact enquiry and verify it under **Enquiries**.
- Send a chatbot message; verify the transcript under **Chat conversations**.
- Verify sitemap.xml and robots.txt use the production domain.
- Verify WhatsApp opens the correct number and message.
- If GA is configured, the analytics consent banner appears and no GA request fires before acceptance.

---

## 12. Operations & limitations

- **Rate limiting** uses an in-process sliding window. This is effective per instance but should be replaced with a shared store (e.g. Redis/Upstash) for multi-instance or serverless deployments with high abuse risk.
- **AI provider failures** degrade gracefully to approved FAQ answers. Review chatbot transcripts and update FAQs/services accordingly.
- **Cloudinary** is optional; without it, only external image URLs can be used. Uploaded assets should be reviewed for size and alt text.
- **Legal content** is a draft template, not legal advice. Complete placeholders and obtain counsel review.
- **Testimonials/team** are intentionally empty in the seed. Do not fabricate reviews, people or qualifications.
- **Professional scope:** descriptions must not imply regulated audit/attest services or qualifications the firm does not hold. The seeded service copy includes eligibility caveats.
- **Analytics consent** is stored in browser local storage. Essential admin session cookies are not optional.
- **Backups:** configure automated PostgreSQL backups and test restoration.
- **Audit logs** are append-only through the application UI; retain them according to the firm's policy and applicable law.
- **Secret rotation:** rotate `AUTH_SECRET` to invalidate all admin sessions; rotate Cloudinary/AI keys if exposure is suspected.

---

## 13. Verification performed

- `npx tsc --noEmit` — passes with zero errors.
- `npm run build` — production build succeeds; all public and admin routes compile.
- PostgreSQL migration applied and seed executed (16 services, 8 FAQs, 4 legal pages).
- Public pages return 200; `/admin` returns 307 to `/admin/login` without a session.
- Password hash verified against the seeded account; invalid password rejected.
- Signed admin session grants access to all 20 admin routes; admin login redirects authenticated users to the dashboard.
- Chatbot tested in English and Telugu, including guardrail responses for tax-rate and sensitive-credential questions.
- Chat lead and appointment APIs tested; records verified in `ContactEnquiry`, `AppointmentRequest`, `ChatConversation` and `ChatMessage`.
- Unauthenticated upload rejected with 401; authenticated upload reports missing Cloudinary configuration as expected.
- After the Zod 4 security update, contact validation (valid, invalid and consent paths) and the chatbot tax-rate guardrail were re-tested against the rebuilt production server.

---

## Contact placeholders

The seeded site uses placeholder firm details (`hello@arthaledger.example`, `+91 90000 00000`, generic Hyderabad map, `[Firm Legal Name]`). Replace these in the admin before launch.
