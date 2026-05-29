# Portfolio Website — Build Prompt

\---

## What you're building

A personal portfolio website that tells a story as you scroll through it. Five sections, each animating into view, guiding the visitor from intro to about to skills to projects to contact. There's a working backend too — a contact form that validates input, sends an email to the owner, and logs the submission. Everything ships as one Next.js app. No separate servers, no half-implemented features, no "TODO: add later" comments.

\---

## Stack

Lock these in. Don't substitute.

**Frontend**

* Next.js 14 with App Router
* Framer Motion for every animation not CSS keyframes, not GSAP
* Tailwind CSS for styling -no inline styles, no external UI libraries

**Backend**

* Next.js Route Handlers at `app/api/contact/route.ts` — no Express, no separate server
* Nodemailer for sending email over SMTP
* Zod for validation — write the schema once in `lib/validations.ts` and use it on both client and server
* In-memory rate limiting: max 5 submissions per IP per 15 minutes

**Config**

* TypeScript strict mode, no `any` types anywhere
* All credentials in `.env.local`, never hardcoded

**Optional but include the code**

* MongoDB via Mongoose for persisting submissions — write the model and connection logic even if the DB isn't live

\---

## Folder structure

Use exactly this. Don't reorganize it.

```
/
├── app/
│   ├── layout.tsx               # Root layout, fonts, metadata
│   ├── page.tsx                 # Assembles all sections
│   └── api/
│       └── contact/
│           └── route.ts         # The only backend file you need
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
│   ├── validations.ts           # Zod schemas, shared client + server
│   ├── mailer.ts                # Nodemailer setup
│   └── db.ts                   # MongoDB connection
├── hooks/
│   └── useScrollAnimation.ts   # Reusable hook for scroll-triggered variants
├── types/
│   └── index.ts                 # All shared TypeScript types live here
├── .env.local.example
├── README.md
└── tailwind.config.ts
```

\---

## The five sections

### Hero

Full viewport height. Bold headline with name, a one-line role description, a short tagline. Two buttons: \*Works\* that scrolls to projects and \*Contact\* that open contact modal

Animations on page load — don't wait for scroll here, fire immediately:

* Headline: `{ opacity: 0, y: 40 }` , `{ opacity: 1, y: 0 }`, duration 0.8s
* Subtitle: same, but delayed 200ms
* Buttons: delayed 400ms, with a small scale-up from `0.95` to `1`
* Background: a subtle looping gradient shift or particle effect — CSS is fine here, keep it lightweight

\---

### About

Two columns on desktop \[text left, image right], stacked on mobile. Three or four sentences of bio. Two stats like "5+ Years of Experience" and "30+ Projects Delivered."

Animations trigger when the section scrolls into view using Framer Motion's `useInView` — not a raw Intersection Observer:

* Each paragraph in the text column reveals line by line, `staggerChildren: 0.15`
* The image slides in from the right (`x: 60` → `x: 0`) with a simultaneous fade
* The stat numbers count up from zero using a `useCountUp` hook you write yourself

\---

### Skills

Title: "What I Work With." A grid of at least 8 skill cards. Each card shows the skill name, a category tag such as Frontend / Backend / DevOps, and a proficiency bar.

Use these skills: React, Next.js, TypeScript, Node.js, Tailwind CSS, PostgreSQL, Docker, Framer Motion.

Animations on scroll:

* Cards stagger in: `staggerChildren: 0.08`, each with `{ opacity: 0, y: 20 }` \& `{ opacity: 1, y: 0 }`
* Proficiency bars animate their width from 0% to the real value once the section is visible, `duration: 1, ease: "easeOut"`
* On hover, cards lift slightly: `whileHover: { y: -4 }` with a soft shadow

\---

### Projects

Title: "Selected Work." At least three project cards. Each card needs: a title, a two-sentence description, tech stack tags, a gradient thumbnail (or real image), and two buttons — "Live Demo" and "GitHub" (placeholder `#` links are fine, but render the buttons).

Animations:

* Same staggered scroll-in pattern as Skills
* Hovering a card scales the thumbnail to `1.05` and fades in an overlay
* Tech tags stagger in after the card itself appears, `staggerChildren: 0.05`
* Add `layoutId` to the card container so it's ready for an expand animation later

\---

### Contact CTA

A full-width section with one job: get the visitor to reach out. Bold headline "Ready to build something great?", a large "Get in Touch" button (same modal as Hero), and optionally some social icon links.

Animations:

* Split the headline into words and stagger each word in with `staggerChildren: 0.1`
* The button pulses gently on a 2s loop: scale `\\\\\\\[1, 1.03, 1]`

\---

## The contact modal

### Behaviour

State lives in `page.tsx` or a Context provider. Don't use a modal library — build it with `AnimatePresence` from Framer Motion so the exit animation plays before unmounting.

* Entrance: `{ opacity: 0, scale: 0.95, y: 20 }` to `{ opacity: 1, scale: 1, y: 0 }`
* Exit: reverse of entrance
* The backdrop is its own `motion.div` that fades independently
* Three ways to close it: the ✕ button, clicking the backdrop, pressing Escape — all three must actually work
* Focus stays trapped inside while open — either implement it manually or use `focus-trap-react`

### Form fields

|Field|Required|Rule|
|-|-|-|
|Name|Yes|2–100 characters|
|Email|Yes|Valid email format|
|Phone|Yes|10–15 digits, optional `+` prefix, no letters|
|Message|No|Max 1000 characters|

Use `react-hook-form` with a Zod resolver pointing at the same schema from `lib/validations.ts`. Errors show inline on blur, not just on submit. The submit button is disabled and shows a spinner while submitting. On success: a green confirmation message inside the modal and the form resets. On API failure: a red banner at the top of the form.

\---

## The API

One endpoint: `POST /api/contact`

It does these things in this order:

1. Parse the request body and validate with Zod. Return 400 with field-level errors if it fails.
2. Strip HTML from all string inputs to block XSS.
3. Check the request IP against the rate limit. Return 429 if exceeded.
4. Send the email via Nodemailer.
5. Log to console: timestamp, name, email — truncate the message to 50 chars, don't log the full thing in production.
6. Optionally save to MongoDB using the `Submission` model.
7. Return a structured JSON response.

**Response shapes:**

```
200  { "success": true, "message": "Your message has been received." }
400  { "success": false, "error": "Validation failed", "details": { field: string\\\\\\\[] } }
429  { "success": false, "error": "Too many requests. Please wait before trying again." }
500  { "success": false, "error": "Internal server error. Please try again later." }
```

### Email

The email the owner receives:

```
Subject: New Portfolio Contact from \\\\\\\[Name]

Name: \\\\\\\[value]
Email: \\\\\\\[value]
Phone: \\\\\\\[value]
Message: \\\\\\\[value or "No message provided"]
Submitted at: \\\\\\\[ISO 8601 timestamp, Asia/Kolkata timezone]
```

All SMTP config comes from env variables: `SMTP\\\\\\\_HOST`, `SMTP\\\\\\\_PORT`, `SMTP\\\\\\\_USER`, `SMTP\\\\\\\_PASS`, `OWNER\\\\\\\_EMAIL`. Handle transporter errors without leaking credentials into logs.

\---

## Environment variables

Ship a `.env.local.example` with every variable commented:

```bash
# SMTP — works with Gmail, SendGrid, Mailgun, etc.
SMTP\\\\\\\_HOST=smtp.gmail.com
SMTP\\\\\\\_PORT=587
SMTP\\\\\\\_USER=your-email@gmail.com
SMTP\\\\\\\_PASS=your-app-password   # Gmail: use an App Password, not your account password

# Who gets the contact form emails
OWNER\\\\\\\_EMAIL=owner@example.com

# MongoDB (optional — comment out if not using)
MONGODB\\\\\\\_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# Rate limiting
RATE\\\\\\\_LIMIT\\\\\\\_WINDOW\\\\\\\_MS=900000   # 15 minutes in ms
RATE\\\\\\\_LIMIT\\\\\\\_MAX=5              # requests per window per IP

# App
NEXT\\\\\\\_PUBLIC\\\\\\\_SITE\\\\\\\_URL=http://localhost:3000
```

\---

## Animation rules that apply everywhere

A few constraints that keep things fast and consistent:

* Scroll animations use `useInView` with `{ once: true, margin: "-100px" }` — they play once, they don't replay on scroll-up
* Only animate `opacity` and `transform` properties (`x`, `y`, `scale`, `rotate`). Never animate `height`, `width`, `margin`, or `padding` — those cause layout recalculations
* Define variants as named constants in each component file, not as inline objects
* No `useEffect` scroll listeners anywhere — use Framer Motion's `whileInView` or `useInView`
* Check `useReducedMotion()` at the top of animated components — if it returns true, set `transition={{ duration: 0 }}` on everything

\---

## Responsiveness

Tailwind breakpoints only — no JS-based layout switching.

* Mobile (< 640px): everything stacks, hero text centred, cards full width
* Tablet (640–1024px): two-column About, two-column Projects grid
* Desktop (> 1024px): full layouts as described per section

\---

## Accessibility

* Every interactive element has an `aria-label`
* The modal has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the modal's title element
* Every form field has a proper `<label>` linked via `htmlFor` and `id`
* Text contrast is at least 4.5:1 (WCAG AA)
* Tab order is logical, Escape closes the modal
* Images have descriptive `alt` text; purely decorative ones get `alt=""`

\---

## Performance

* Load fonts with `next/font`, not a `<link>` tag
* Lazy-load `ProjectsSection` and `ContactModal` with `next/dynamic({ ssr: false })`
* All images go through `next/image` with explicit dimensions
* Lighthouse mobile performance target: 85 or above

\---

## README

Include all of these sections, written out properly — not as stubs:

1. Project overview
2. Tech stack
3. Folder structure
4. Prerequisites (Node version, package manager)
5. Local setup (clone → install → configure env → run)
6. Environment variables table (name, purpose, example)
7. How to set up Gmail App Passwords
8. How to deploy on Vercel including env var configuration
9. Full API reference
10. Known limitations (e.g. rate limiter resets on server restart since it's in-memory)

\---

## Things not to do

* Don't use `create-react-app`
* Don't use CSS keyframes for scroll animations — that's what Framer Motion is for
* Don't reach for `react-modal` or Headless UI's Dialog — build the modal yourself
* Don't hardcode your name, email, or any credentials — use env variables and `\\\\\\\[YOUR\\\\\\\_NAME]` style placeholders
* Don't leave any `TODO` comments or unimplemented functions
* Don't use `any` as a TypeScript type — define everything properly in `types/index.ts`

\---

Output every file in full, in folder order. Don't truncate anything.

