# ArthaLedger — Database-Free Demo

**Your Business. Our Financial Expertise.**

A fully static-content demonstration of the ArthaLedger chartered-accountancy website and admin dashboard.

This repository was converted from a PostgreSQL/Prisma CMS into a **database-free demo**. There is no database, ORM client, migration, seed step or `DATABASE_URL` requirement. Public content is hardcoded in `src/data/`; the admin area runs against a small in-memory demo repository.

## Live deployment

- Target Cloudflare Workers URL: <https://arthaledger.blackvavecorporation.workers.dev>
- GitHub repository: <https://github.com/blackvavecorporation/ArthaLedger>

## Demo credentials

| Field | Value |
| --- | --- |
| URL | `/admin/login` |
| Email | `demo@arthaledger.example` |
| Password | `ArthaLedgerDemo2026!` |

The login is intentionally public and fixed. It is **not real authentication**, has no password database and must not be used for real accounts. The demo cookie only marks a browser session; it does not grant access to live data.

## What is included

### Public website

- Home, About, Services, service detail, Testimonials, Contact and four legal pages.
- Existing navy/gold/ivory branding, responsive layout, motion and accessible components.
- 16 hardcoded service descriptions, six categories, sample FAQs, sample testimonials and sample team-independent content.
- Contact form with validation and a demo confirmation; nothing is stored or delivered.
- Floating chat assistant using deterministic rule-based replies, with English/Telugu UI.
- Chat enquiry and appointment forms that validate input and clearly state that nothing was scheduled or saved.
- WhatsApp link and Google Map embed retained for layout demonstration, using sample contact data.
- SEO metadata, canonical URLs, Open Graph, JSON-LD, `sitemap.xml` and `robots.txt`.
- A site-wide demo banner and footer notice.

### Admin demo

- Dashboard with sample enquiry, appointment, conversation and content counts.
- Content editors for home, about, branding, contact, footer, navigation and SEO.
- Service/category, testimonial, FAQ and legal-page screens.
- Client-desk screens with sample enquiries, appointments and chat transcripts.
- Audit-log screen with sample activity.
- Forms can be submitted to demonstrate the UI. Changes are held in server memory for the running session and show a **not saved to a database** notice.
- Media uploads, account creation, password changes and user provisioning are intentionally disabled.

## Demo data and editing

All content is easy to find and edit:

```text
src/data/
  services.ts       16 service records and long-form service copy
  legal.ts          Terms, Privacy, Disclaimer and Cookie sample pages
  site.ts           Branding, contact details, home/about copy, navigation,
                    FAQs, testimonials, SEO settings and sample admin records
src/lib/
  demo-types.ts     Local TypeScript model types
  db.ts             In-memory demo repository (no Prisma, no database)
  content.ts        Public content accessors used by pages
```

To change the public site, edit the arrays/objects in `src/data/`. To change the admin sample records, edit the `demoEnquiries`, `demoAppointments`, `demoConversations` and `demoAuditLogs` exports in `src/data/site.ts`.

Environment variables are optional:

```env
# Optional public origin for canonical URLs and sitemap entries.
NEXT_PUBLIC_SITE_URL="https://arthaledger.blackvavecorporation.workers.dev"
```

No `DATABASE_URL`, `AUTH_SECRET`, AI key or storage credential is read by the application.

## Technology

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS, Radix primitives, Lucide, Framer Motion |
| Data | Hardcoded TypeScript modules + in-memory demo repository |
| Auth | Fixed demo cookie only |
| Validation | Zod |
| Deployment | OpenNext for Cloudflare + Wrangler |

Database, ORM, bcrypt, JWT and Cloudinary dependencies have been removed.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No database or environment file is required.

```bash
npm run typecheck        # TypeScript
npm run build            # Next.js production build
npm run build:cloudflare # OpenNext Cloudflare worker build
npm run preview:cloudflare
```

## Cloudflare Workers

The repository includes:

- `wrangler.jsonc` with a Workers asset binding, `nodejs_compat` and a worker named `arthaledger`.
- `open-next.config.ts` using the default Cloudflare adapter configuration.
- `images.unoptimized` in `next.config.ts` so no Cloudflare Images binding is required.

Build and preview locally:

```bash
npm run build:cloudflare
npx wrangler dev
```

Deploy from an authenticated Cloudflare account:

```bash
npm run deploy:cloudflare
```

No D1, Hyperdrive, PostgreSQL, R2 or KV binding is required. The demo's admin edits are intentionally process-local and may reset when a Worker isolate is recycled.

## Demo limitations

- This is **not** a production CMS. Admin changes are not persistent.
- Forms do not send email, create records or deliver enquiries.
- Chat history is stored only in the visitor's browser local storage.
- Sample testimonials are explicitly fictional and must not be treated as real reviews.
- Contact details, WhatsApp number and map location are sample data.
- Legal pages describe the demo only and are not legal advice.
- There is no real authentication, MFA, user management or audit persistence.
- Media upload, Cloudinary, external AI and server-side analytics are not connected.

## Verification performed

- `npm run typecheck` — passed.
- `npm run build` — Next.js production build passed.
- `npm run build:cloudflare` — OpenNext bundle created at `.open-next/worker.js`.
- `wrangler dev` — public pages, admin login, admin save and chat API tested in the local Workers runtime.
- Public routes returned 200; unauthenticated `/admin` redirected to `/admin/login`.
- Browser test: demo login, contact confirmation and admin content save passed.
- No Prisma client, PostgreSQL connection, database environment variable or migration remains in the runtime.
