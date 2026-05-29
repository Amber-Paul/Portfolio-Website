# Portfolio

A full-stack personal portfolio built with Next.js 14, Framer Motion, and Tailwind CSS. Five animated sections, a contact form with email delivery, in-memory rate limiting, and optional MongoDB persistence — all in one repository.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, API routes, `next/font`, `next/image` |
| Animation | Framer Motion | Scroll-triggered variants, `AnimatePresence` |
| Styling | Tailwind CSS | Utility-first, zero runtime |
| Validation | Zod | Shared schema, client + server |
| Forms | react-hook-form + @hookform/resolvers | Field-level errors, no re-renders |
| Email | Nodemailer | SMTP, works with Gmail / SendGrid |
| Database | MongoDB via Mongoose | Optional persistence of submissions |
| Types | TypeScript strict mode | No `any`, all types in `types/index.ts` |

---

## Folder Structure

```
/
├── app/
│   ├── layout.tsx               # Root layout, fonts, metadata
│   ├── page.tsx                 # Assembles all sections
│   ├── globals.css
│   └── api/
│       └── contact/
│           └── route.ts         # POST /api/contact
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactCTASection.tsx
│   ├── ui/
│   │   ├── ContactModal.tsx
│   │   ├── ContactForm.tsx
│   │   └── AnimatedText.tsx
│   └── layout/
│       └── Navbar.tsx
├── lib/
│   ├── validations.ts           # Zod schema (shared)
│   ├── mailer.ts                # Nodemailer transporter
│   ├── db.ts                    # MongoDB + Submission model
│   └── rateLimiter.ts           # In-memory rate limiter
├── hooks/
│   └── useScrollAnimation.ts
├── types/
│   └── index.ts
├── .env.local.example
├── README.md
└── tailwind.config.ts
```

---

## Prerequisites

- **Node.js** ≥ 18.17 (required by Next.js 14)
- **npm** ≥ 9 (or yarn / pnpm)
- A Gmail account with an App Password, **or** a SendGrid/Mailgun SMTP account

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/[YOUR_USERNAME]/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local — see table below

# 4. Run the dev server
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username / sending address | `you@gmail.com` |
| `SMTP_PASS` | SMTP password / app password | `abcd efgh ijkl mnop` |
| `OWNER_EMAIL` | Destination for contact emails | `owner@example.com` |
| `MONGODB_URI` | MongoDB connection string (optional) | `mongodb+srv://…` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max submissions per IP per window | `5` |
| `NEXT_PUBLIC_SITE_URL` | Public URL (used in metadata) | `https://yourname.dev` |

---

## Setting Up Gmail App Passwords

Google blocks plain-password SMTP by default. Use an **App Password** instead:

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already on
3. Search for **"App Passwords"** and open it
4. Select app → **Mail**, device → **Other** → enter "Portfolio"
5. Copy the 16-character password shown
6. Paste it into `SMTP_PASS` in `.env.local` (spaces are fine, Nodemailer ignores them)

---

## Deploying on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Or connect your GitHub repo at vercel.com → Import Project
```

**Environment variables on Vercel:**
1. Go to your project → **Settings → Environment Variables**
2. Add each variable from the table above
3. Redeploy — Vercel picks up env changes on next deploy

For production, set `NEXT_PUBLIC_SITE_URL` to your actual domain.

---

## API Reference

### `POST /api/contact`

Validates input, rate-limits by IP, sends an email, optionally persists to MongoDB.

**Request body**

```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "phone": "+919876543210",
  "message": "I'd love to work together."
}
```

**Responses**

| Status | Body |
|---|---|
| `200` | `{ "success": true, "message": "Your message has been received." }` |
| `400` | `{ "success": false, "error": "Validation failed", "details": { "email": ["Please enter a valid email address"] } }` |
| `429` | `{ "success": false, "error": "Too many requests. Please wait before trying again." }` |
| `500` | `{ "success": false, "error": "Internal server error. Please try again later." }` |

**Validation rules**

| Field | Required | Rule |
|---|---|---|
| `name` | Yes | 2–100 characters |
| `email` | Yes | Valid email format |
| `phone` | Yes | 10–15 digits, optional `+` prefix |
| `message` | No | Max 1000 characters |

---

## Rate Limiter Notes

The rate limiter is **in-memory** (a `Map` in `lib/rateLimiter.ts`).

**Efficiency constraints:**
- O(1) lookup and write per request
- Maximum 10,000 concurrent IP entries (oldest evicted beyond this)
- Stale-entry cleanup runs at most once per 60 seconds (non-blocking)
- Zero external dependencies — no Redis, no `express-rate-limit`

**Known limitation:** State resets on server restart. This is acceptable for a portfolio with low traffic. For production-scale rate limiting, replace `lib/rateLimiter.ts` with a Redis-backed solution such as `@upstash/ratelimit`.

---

## Known Limitations

- **Rate limiter resets on restart** — in-memory only; see note above
- **No CAPTCHA** — suitable for personal portfolios; add hCaptcha/Cloudflare Turnstile for higher-traffic sites
- **Placeholder links** — project "Live Demo" and "GitHub" buttons use `#`; replace with real URLs in `ProjectsSection.tsx`
- **Profile photo** — the About section shows a placeholder; replace with a real `next/image` component
