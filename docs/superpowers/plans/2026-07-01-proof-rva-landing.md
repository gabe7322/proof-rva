# Proof RVA Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page React founding membership landing site for Proof RVA with 7 sections, a 4-step application form, and Airtable submission via a Netlify serverless function.

**Architecture:** Vite + React SPA, all sections in `src/components/`, all copy in `src/constants/copy.js`. A shared `<ScrollReveal>` wrapper drives all scroll-triggered entrance animations via Framer Motion. The 4-step form owns its state in `Application.jsx` and submits via `useAirtable.js` → `netlify/functions/submit-application.js` → Airtable REST API.

**Tech Stack:** React 18, Vite, Tailwind CSS 3, Framer Motion 11, Vitest, React Testing Library, Netlify Functions

---

## File Map

```
proof-rva/
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
  netlify.toml
  .env.example
  .gitignore
  package.json
  src/
    main.jsx
    App.jsx
    index.css                        ← global styles + font imports
    constants/
      copy.js                        ← all locked copy
      tokens.js                      ← design token JS constants (for Framer Motion)
    components/
      Logo.jsx                       ← placeholder wordmark, swap-ready
      ScrollReveal.jsx               ← shared fade-up scroll wrapper
      Hero.jsx
      TheGap.jsx
      WhatWeAre.jsx
      HowItWorks.jsx
      TheFeeling.jsx
      Application.jsx                ← owns all 4-step form state
      Footer.jsx
    hooks/
      useAirtable.js                 ← POST → serverless fn, returns { submit, status, error }
  netlify/
    functions/
      submit-application.js          ← serverless fn, proxies to Airtable API
  tests/
    setup.js
    hooks/
      useAirtable.test.js
    components/
      Application.test.jsx
    functions/
      submit-application.test.js
```

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`, `.env.example`, `netlify.toml`

- [ ] **Step 1: Initialize Vite + React project**

```bash
cd C:\Users\Administrator\proof-rva
npm create vite@latest . -- --template react
```

When prompted "current directory is not empty" → select **Ignore files and continue**.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind** — replace `tailwind.config.js` entirely:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        proof: {
          bg:        '#10141A',
          'bg-alt':  '#141820',
          'bg-surf': '#181D26',
          text:      '#F0F2F5',
          mute:      'rgba(240,242,245,0.55)',
          faint:     'rgba(240,242,245,0.25)',
          accent:    '#D63B3B',
          border:    'rgba(240,242,245,0.07)',
          'border-md': 'rgba(240,242,245,0.13)',
        },
      },
      fontFamily: {
        display: ['Anton', 'Arial Black', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Configure Vite** — replace `vite.config.js` entirely:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
  },
})
```

- [ ] **Step 5: Write test setup** — create `tests/setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Update `src/index.css`** — replace entirely:

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background-color: #10141A;
  color: #F0F2F5;
  font-family: 'Inter', system-ui, sans-serif;
  margin: 0;
}

/* Utility: eyebrow label */
.eyebrow {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  color: #D63B3B;
}
```

- [ ] **Step 7: Update `index.html`** — replace the `<title>` and add a meta description:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Proof RVA — A member-owned creative collective for Richmond, VA. Apply for founding membership." />
    <title>Proof RVA — Founding Membership</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `.env.example`**:

```
AIRTABLE_API_KEY=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_base_id
```

- [ ] **Step 9: Create `netlify.toml`**:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

- [ ] **Step 10: Update `.gitignore`** — add after existing content:

```
.env
.env.local
dist/
```

- [ ] **Step 11: Create minimal `src/App.jsx`**:

```jsx
export default function App() {
  return <div className="bg-proof-bg min-h-screen" />
}
```

- [ ] **Step 12: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173` with no errors. Open it — should show a dark slate page.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + Framer Motion"
```

---

## Task 2: Copy constants

**Files:**
- Create: `src/constants/copy.js`, `src/constants/tokens.js`

- [ ] **Step 1: Create `src/constants/copy.js`**:

```js
export const COPY = {
  hero: {
    eyebrow: 'Founding Membership',
    headline: ['A Home For', "Richmond's Creatives"],
    sub: 'Owned by its own members.',
    cta: 'Apply for Founding Membership →',
  },

  gap: {
    eyebrow: 'The Gap',
    headline: "Creating a community truly made up of Richmond's creative talent",
    paras: [
      "Richmond is full of people making real work — music, visual art, film, design — but they're scattered, rarely crossing paths, rarely building together.",
      'PROOF exists to connect that talent into one lasting community — not a single event or a one-off showcase, but something that keeps going.',
      'Starting with the people in this founding group: real events, real collaboration between members, and a foundation that grows into much more from there.',
    ],
  },

  whatWeAre: {
    eyebrow: 'What We Are',
    headline: 'A family. Not a showcase.',
    body: "PROOF is a member-owned creative collective for the people who contribute to Richmond's culture — DJs, producers, visual artists, photographers, filmmakers, designers. Real governance. Real ownership.",
    tags: ['Producers', 'DJs', 'Visual Artists', 'Photographers', 'Filmmakers', 'Designers'],
  },

  howItWorks: {
    eyebrow: 'How It Works',
    blocks: [
      {
        num: '01',
        label: 'Member-Owned',
        text: 'Every member has a real stake. Voluntary dues build a shared treasury the collective decides how to use.',
      },
      {
        num: '02',
        label: 'Democratic',
        text: 'Events, spending, direction — all decided by member vote. No gatekeepers.',
      },
      {
        num: '03',
        label: 'Built to Last',
        text: "Year-round, not a seasonal showcase. The goal is permanent infrastructure — eventually a physical space owned by the people who built it.",
      },
    ],
  },

  theFeeling: {
    eyebrow: 'The Feeling',
    lines: [
      { text: 'You stop building alone.', faded: false },
      { text: 'You stop waiting for permission.', faded: false },
      { text: 'You become part of something that outlasts any one event, any one night, any one of us.', faded: false },
      { text: 'This is yours to shape — starting with your vote.', faded: true },
    ],
  },

  application: {
    eyebrow: 'Apply',
    headline: 'Ready to be part of it?',
    step3Intro: "A few questions so we actually know who we're inviting in — not a test.",
    commitmentQuestion: "This is a founding group — small, hands-on, and still being shaped. We're looking for people who want to actually show up for that. Does that sound like you?",
    commitmentOptions: [
      { value: 'yes', label: "Yes, I'm in" },
      { value: 'learn_more', label: "I'd like to learn more first" },
    ],
    submitLabel: 'Submit Application →',
    continueLabel: 'Continue →',
    confirmation: "We read every application personally. If it's a fit, you'll hear from a real person — not an automated email.",
    learnMore: "We'll be in touch with more information soon.",
    disciplines: ['DJ', 'Producer', 'Visual Artist', 'Photographer', 'Filmmaker', 'Graphic Designer', 'Other'],
    excitesOptions: [
      'Meeting collaborators',
      'Having a real vote / governance',
      'Building something from the ground up',
      'Other',
    ],
  },

  footer: {
    closing: "Richmond's creative family. Owned by the people who make it.",
    cta: 'Apply for Founding Membership →',
    wordmark: 'Proof',
    tagline: 'PROOF · Richmond, VA · Est. 2026',
  },
}
```

- [ ] **Step 2: Create `src/constants/tokens.js`**:

```js
export const TOKENS = {
  accent: '#D63B3B',
  bg: '#10141A',
  bgAlt: '#141820',
  bgSurf: '#181D26',
  text: '#F0F2F5',
  textMute: 'rgba(240,242,245,0.55)',
  textFaint: 'rgba(240,242,245,0.25)',
  border: 'rgba(240,242,245,0.07)',
  borderMd: 'rgba(240,242,245,0.13)',
}
```

- [ ] **Step 3: Commit**

```bash
git add src/constants/
git commit -m "feat: add locked copy and design token constants"
```

---

## Task 3: Shared components — ScrollReveal + Logo

**Files:**
- Create: `src/components/ScrollReveal.jsx`, `src/components/Logo.jsx`

- [ ] **Step 1: Create `src/components/ScrollReveal.jsx`**:

```jsx
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Wraps children in a scroll-triggered fade-up animation.
 * @param {number} delay - stagger delay in seconds (default 0)
 * @param {string} className - additional classes
 */
export default function ScrollReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `src/components/Logo.jsx`**:

```jsx
/**
 * Placeholder wordmark — swap for final SVG logo by replacing the inner element.
 * Keep this component as the single import point across the app.
 */
export default function Logo({ className = '' }) {
  return (
    <span
      className={`font-display font-black tracking-[0.2em] text-proof-text uppercase ${className}`}
      aria-label="Proof RVA"
    >
      Proof
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollReveal.jsx src/components/Logo.jsx
git commit -m "feat: add ScrollReveal and Logo shared components"
```

---

## Task 4: Hero section

**Files:**
- Create: `src/components/Hero.jsx`

- [ ] **Step 1: Create `src/components/Hero.jsx`**:

```jsx
import { motion } from 'framer-motion'
import { COPY } from '../constants/copy'
import { TOKENS } from '../constants/tokens'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function Hero() {
  const { eyebrow, headline, sub, cta } = COPY.hero

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden bg-proof-bg"
      aria-label="Hero"
    >
      {/* Ambient orb */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '-10%',
          right: '-5%',
          width: '55vw',
          height: '55vw',
          background: `radial-gradient(circle, ${TOKENS.accent}14 0%, transparent 65%)`,
        }}
        animate={{ x: [0, 18, -8, 0], y: [0, -12, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <motion.p
          className="eyebrow text-proof-faint mb-6"
          {...fadeUp(0)}
        >
          {eyebrow}
        </motion.p>

        {/* Headline */}
        <h1 className="font-display font-black uppercase leading-none tracking-tight text-proof-text mb-5"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
        >
          {headline.map((line, i) => (
            <motion.span
              key={i}
              className="block"
              {...fadeUp(0.15 + i * 0.08)}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* Sub */}
        <motion.p
          className="text-proof-mute italic mb-10"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.375rem)' }}
          {...fadeUp(0.35)}
        >
          {sub}
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#apply"
          className="inline-flex items-center gap-2 bg-proof-accent text-proof-text font-bold uppercase tracking-widest text-xs px-7 py-4 rounded-sm hover:opacity-90 transition-opacity"
          {...fadeUp(0.45)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cta}
        </motion.a>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-6 md:left-16 flex items-center gap-3 opacity-25"
        {...fadeUp(0.7)}
      >
        <div className="w-6 h-px bg-proof-text" />
        <span className="text-proof-text text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Wire into `App.jsx` and verify in browser**:

```jsx
import Hero from './components/Hero'
import './index.css'

export default function App() {
  return (
    <main className="bg-proof-bg">
      <Hero />
    </main>
  )
}
```

Run `npm run dev`. Verify: dark slate page, headline animates in, orb glows softly top-right, CTA button is crimson.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx src/App.jsx
git commit -m "feat: Hero section with staggered entrance and ambient orb"
```

---

## Task 5: TheGap section

**Files:**
- Create: `src/components/TheGap.jsx`

- [ ] **Step 1: Create `src/components/TheGap.jsx`**:

```jsx
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function TheGap() {
  const { eyebrow, headline, paras } = COPY.gap

  return (
    <section className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-2xl">
        <ScrollReveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2 className="text-proof-text font-bold leading-snug mb-10"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {headline}
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-6">
          {paras.map((para, i) => (
            <ScrollReveal key={i} delay={0.08 * (i + 1)}>
              <p className="text-proof-mute leading-relaxed text-base md:text-lg">
                {para}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `App.jsx`**:

```jsx
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import './index.css'

export default function App() {
  return (
    <main className="bg-proof-bg">
      <Hero />
      <TheGap />
    </main>
  )
}
```

Verify: paragraphs fade up individually as you scroll down.

- [ ] **Step 3: Commit**

```bash
git add src/components/TheGap.jsx src/App.jsx
git commit -m "feat: TheGap section"
```

---

## Task 6: WhatWeAre section

**Files:**
- Create: `src/components/WhatWeAre.jsx`

- [ ] **Step 1: Create `src/components/WhatWeAre.jsx`**:

```jsx
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function WhatWeAre() {
  const { eyebrow, headline, body, tags } = COPY.whatWeAre

  return (
    <section className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-2xl">
        <ScrollReveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2
            className="text-proof-text font-bold italic leading-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
          >
            {headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-proof-mute leading-relaxed text-base md:text-lg mb-10">
            {body}
          </p>
        </ScrollReveal>

        {/* Tag cluster */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <ScrollReveal key={tag} delay={0.12 + i * 0.04}>
              <motion.span
                className="text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full border border-proof-border-md text-proof-mute cursor-default"
                whileHover={{ scale: 1.04, borderColor: 'rgba(240,242,245,0.3)' }}
                transition={{ duration: 0.12 }}
              >
                {tag}
              </motion.span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `App.jsx`** — import and render `<WhatWeAre />` after `<TheGap />`. Verify tags drift in with stagger and scale on hover.

- [ ] **Step 3: Commit**

```bash
git add src/components/WhatWeAre.jsx src/App.jsx
git commit -m "feat: WhatWeAre section with animated tag cluster"
```

---

## Task 7: HowItWorks section

**Files:**
- Create: `src/components/HowItWorks.jsx`

- [ ] **Step 1: Create `src/components/HowItWorks.jsx`**:

```jsx
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function HowItWorks() {
  const { eyebrow, blocks } = COPY.howItWorks

  return (
    <section className="bg-proof-bg-alt px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <ScrollReveal>
        <p className="eyebrow mb-10">{eyebrow}</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {blocks.map((block, i) => (
          <ScrollReveal key={block.num} delay={0.1 * i}>
            <div className="bg-proof-bg border border-proof-border rounded-lg p-6 h-full">
              <p className="text-proof-accent text-xs font-bold tracking-wide mb-3">
                {block.num}
              </p>
              <h3 className="text-proof-text font-bold text-base mb-3">
                {block.label}
              </h3>
              <p className="text-proof-mute text-sm leading-relaxed">
                {block.text}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `App.jsx`** — import and render `<HowItWorks />` after `<WhatWeAre />`. Verify 3-column on desktop, stacked on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorks.jsx src/App.jsx
git commit -m "feat: HowItWorks section with numbered cards"
```

---

## Task 8: TheFeeling section

**Files:**
- Create: `src/components/TheFeeling.jsx`

- [ ] **Step 1: Create `src/components/TheFeeling.jsx`**:

```jsx
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function TheFeeling() {
  const { eyebrow, lines } = COPY.theFeeling

  return (
    <section className="bg-proof-bg-surf px-6 md:px-16 lg:px-24 py-28 md:py-40">
      <ScrollReveal>
        <p className="text-xs tracking-eyebrow uppercase font-semibold text-proof-faint mb-14">
          {eyebrow}
        </p>
      </ScrollReveal>

      <div className="flex flex-col gap-7 max-w-2xl">
        {lines.map((line, i) => (
          <ScrollReveal key={i} delay={0.12 * i}>
            <p
              className={`font-semibold leading-snug ${
                line.faded
                  ? 'text-proof-mute text-xl md:text-2xl'
                  : 'text-proof-text text-2xl md:text-3xl'
              }`}
            >
              {line.text}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `App.jsx`** — render `<TheFeeling />` after `<HowItWorks />`. Verify lines breathe with deliberate spacing, last line is visually quieter.

- [ ] **Step 3: Commit**

```bash
git add src/components/TheFeeling.jsx src/App.jsx
git commit -m "feat: TheFeeling section with staggered manifesto lines"
```

---

## Task 9: useAirtable hook + tests

**Files:**
- Create: `src/hooks/useAirtable.js`, `tests/hooks/useAirtable.test.js`

- [ ] **Step 1: Write failing tests** — create `tests/hooks/useAirtable.test.js`:

```js
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useAirtable from '../../src/hooks/useAirtable'

const samplePayload = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  workLink: 'https://instagram.com/jordanlee',
  discipline: 'DJ',
  proudWork: 'My debut EP',
  futureWork: 'A live audiovisual show',
  collaborators: 'Filmmakers and visual artists',
  project: 'A collaborative short film',
  excites: ['Meeting collaborators'],
  commitment: 'yes',
  anythingElse: '',
  _gotcha: '',
}

describe('useAirtable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with idle status', () => {
    const { result } = renderHook(() => useAirtable())
    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  it('sets status to loading while submitting', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(() => {}) // never resolves
    )
    const { result } = renderHook(() => useAirtable())
    act(() => { result.current.submit(samplePayload) })
    expect(result.current.status).toBe('loading')
  })

  it('sets status to success on 200 response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
  })

  it('sets status to error on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed' }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Submission failed')
  })

  it('posts to /api/submit-application with JSON body', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/submit-application',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      })
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/hooks/useAirtable.test.js
```

Expected: FAIL — `Cannot find module '../../src/hooks/useAirtable'`

- [ ] **Step 3: Create `src/hooks/useAirtable.js`**:

```js
import { useState } from 'react'

export default function useAirtable() {
  const [status, setStatus] = useState('idle')   // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  const submit = async (data) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return { submit, status, error }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/hooks/useAirtable.test.js
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAirtable.js tests/hooks/useAirtable.test.js
git commit -m "feat: useAirtable hook with tests"
```

---

## Task 10: Netlify serverless function + tests

**Files:**
- Create: `netlify/functions/submit-application.js`, `tests/functions/submit-application.test.js`

- [ ] **Step 1: Write failing tests** — create `tests/functions/submit-application.test.js`:

```js
import { vi, describe, it, expect, beforeEach } from 'vitest'

// We import the handler after mocking fetch
let handler

const makeRequest = (body, method = 'POST') => ({
  method,
  json: async () => body,
})

const airtableSuccess = {
  ok: true,
  json: async () => ({ id: 'rec123' }),
}

const airtableFailure = {
  ok: false,
  json: async () => ({ error: { message: 'INVALID_VALUE_FOR_COLUMN' } }),
}

const validBody = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  workLink: 'https://instagram.com/jordanlee',
  discipline: 'DJ',
  proudWork: 'My debut EP',
  futureWork: 'A live audiovisual show',
  collaborators: 'Filmmakers',
  project: 'A short film',
  excites: ['Meeting collaborators'],
  commitment: 'yes',
  anythingElse: '',
  _gotcha: '',
}

describe('submit-application serverless function', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    process.env.AIRTABLE_API_KEY = 'fakekey'
    process.env.AIRTABLE_BASE_ID = 'fakebase'
    // Re-import fresh each test to avoid module caching issues
    vi.resetModules()
    handler = (await import('../../netlify/functions/submit-application.js')).default
  })

  it('returns 405 for non-POST requests', async () => {
    const res = await handler(makeRequest(validBody, 'GET'))
    expect(res.status).toBe(405)
  })

  it('silently succeeds for honeypot-filled submissions', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const res = await handler(makeRequest({ ...validBody, _gotcha: 'bot@spam.com' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('posts correct fields to Airtable and returns success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(airtableSuccess)
    const res = await handler(makeRequest(validBody))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
  })

  it('returns 500 when Airtable responds with an error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(airtableFailure)
    const res = await handler(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('sends the correct Airtable API URL', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(airtableSuccess)
    await handler(makeRequest(validBody))
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/fakebase/Applications',
      expect.anything()
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/functions/submit-application.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `netlify/functions/submit-application.js`**:

```js
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json()

  // Honeypot — silent success so bots don't know they were caught
  if (body._gotcha) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Applications`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: body.name,
          Email: body.email,
          'Work Link': body.workLink,
          Discipline: body.discipline,
          'Proud Work': body.proudWork,
          'Future Work': body.futureWork,
          Collaborators: body.collaborators,
          'Project Idea': body.project,
          Excites: Array.isArray(body.excites) ? body.excites.join(', ') : body.excites,
          Commitment: body.commitment,
          'Anything Else': body.anythingElse,
        },
      }),
    }
  )

  if (!airtableRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to save application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/functions/submit-application.test.js
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/submit-application.js tests/functions/submit-application.test.js
git commit -m "feat: Netlify serverless function for Airtable submission with tests"
```

---

## Task 11: Application form + tests

**Files:**
- Create: `src/components/Application.jsx`, `tests/components/Application.test.jsx`

- [ ] **Step 1: Write failing tests** — create `tests/components/Application.test.jsx`:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Application from '../../src/components/Application'

// Mock useAirtable
vi.mock('../../src/hooks/useAirtable', () => ({
  default: vi.fn(),
}))

import useAirtable from '../../src/hooks/useAirtable'

const mockIdle = { submit: vi.fn(), status: 'idle', error: null }
const mockSuccess = { submit: vi.fn(), status: 'success', error: null }

describe('Application form', () => {
  beforeEach(() => {
    useAirtable.mockReturnValue(mockIdle)
  })

  it('renders Step 1 by default', () => {
    render(<Application />)
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('does not advance past Step 1 with empty required fields', async () => {
    render(<Application />)
    await userEvent.click(screen.getByText(/continue/i))
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
  })

  it('advances to Step 2 after filling Step 1 required fields', async () => {
    render(<Application />)
    await userEvent.type(screen.getByLabelText(/name/i), 'Jordan Lee')
    await userEvent.type(screen.getByLabelText(/email/i), 'jordan@example.com')
    await userEvent.type(screen.getByLabelText(/instagram/i), 'https://instagram.com/j')
    await userEvent.selectOptions(screen.getByLabelText(/discipline/i), 'DJ')
    await userEvent.click(screen.getByText(/continue/i))
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument()
  })

  it('shows confirmation message after successful submission', async () => {
    useAirtable.mockReturnValue(mockSuccess)
    render(<Application />)
    expect(screen.getByText(/we read every application personally/i)).toBeInTheDocument()
  })

  it('honeypot field is hidden and empty by default', () => {
    render(<Application />)
    const honeypot = document.querySelector('input[name="_gotcha"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot.value).toBe('')
    expect(honeypot).toHaveStyle({ display: 'none' })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/components/Application.test.jsx
```

Expected: FAIL — `Cannot find module '../../src/components/Application'`

- [ ] **Step 3: Create `src/components/Application.jsx`**:

```jsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import useAirtable from '../hooks/useAirtable'
import { COPY } from '../constants/copy'

const EMPTY_FORM = {
  name: '', email: '', workLink: '', discipline: '',
  proudWork: '', futureWork: '',
  collaborators: '', project: '', excites: [],
  commitment: '', anythingElse: '',
  _gotcha: '',
}

const STEP_REQUIRED = {
  1: ['name', 'email', 'workLink', 'discipline'],
  2: ['proudWork', 'futureWork'],
  3: [],
  4: ['commitment'],
}

const slideVariants = {
  enter:  { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -40 },
}

function ProgressBar({ step, total = 4 }) {
  return (
    <div className="flex items-center gap-0 px-6 py-4 bg-proof-bg-surf border-b border-proof-border">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-200 ${
              i + 1 === step
                ? 'bg-proof-accent text-proof-text'
                : i + 1 < step
                ? 'bg-proof-bg-surf border border-proof-border-md text-proof-faint'
                : 'border border-proof-border text-proof-faint'
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 && <div className="flex-1 h-px bg-proof-border mx-1" />}
        </div>
      ))}
    </div>
  )
}

function Field({ label, id, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-proof-mute">
        {label}{required && <span className="text-proof-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'bg-proof-bg-surf border border-proof-border rounded text-proof-text text-sm px-3 py-2.5 outline-none focus:border-proof-border-md transition-colors w-full'

export default function Application() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const { submit, status, error } = useAirtable()

  const c = COPY.application

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleExcites = (val) =>
    setForm((f) => ({
      ...f,
      excites: f.excites.includes(val)
        ? f.excites.filter((v) => v !== val)
        : [...f.excites, val],
    }))

  const validate = (s) => {
    const errs = {}
    STEP_REQUIRED[s].forEach((field) => {
      if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
        errs[field] = 'Required'
      }
    })
    // Min-length checks
    if (s === 2 && form.futureWork.trim().length > 0 && form.futureWork.trim().length < 30) {
      errs.futureWork = 'Please share at least 30 characters'
    }
    if (s === 3 && form.collaborators.trim().length > 0 && form.collaborators.trim().length < 30) {
      errs.collaborators = 'Please share at least 30 characters'
    }
    return errs
  }

  const advance = () => {
    const errs = validate(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(4)
    if (Object.keys(errs).length) { setErrors(errs); return }
    await submit(form)
  }

  // Success / learn-more states
  if (status === 'success') {
    const isLearnMore = form.commitment === 'learn_more'
    return (
      <section id="apply" className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="max-w-md">
          <p className="text-proof-text text-lg leading-relaxed">
            {isLearnMore ? c.learnMore : c.confirmation}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-lg">
        <ScrollReveal>
          <p className="eyebrow mb-4">{c.eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <h2 className="text-proof-text font-bold mb-10"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {c.headline}
          </h2>
        </ScrollReveal>

        {/* Hidden honeypot */}
        <input
          name="_gotcha"
          value={form._gotcha}
          onChange={set('_gotcha')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="border border-proof-border-md rounded-lg overflow-hidden">
          <ProgressBar step={step} />

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="p-6 flex flex-col gap-4 bg-proof-bg-alt"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 1 of 4 — Who You Are</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Name" id="name" required>
                        <input id="name" className={inputClass} value={form.name} onChange={set('name')} placeholder="Your name" />
                        {errors.name && <span className="text-proof-accent text-xs">{errors.name}</span>}
                      </Field>
                      <Field label="Email" id="email" required>
                        <input id="email" type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="you@example.com" />
                        {errors.email && <span className="text-proof-accent text-xs">{errors.email}</span>}
                      </Field>
                    </div>
                    <Field label="Instagram / primary work link" id="workLink" required>
                      <input id="workLink" className={inputClass} value={form.workLink} onChange={set('workLink')} placeholder="https://" />
                      {errors.workLink && <span className="text-proof-accent text-xs">{errors.workLink}</span>}
                    </Field>
                    <Field label="Discipline" id="discipline" required>
                      <select id="discipline" className={inputClass} value={form.discipline} onChange={set('discipline')}>
                        <option value="">Select...</option>
                        {c.disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.discipline && <span className="text-proof-accent text-xs">{errors.discipline}</span>}
                    </Field>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 2 of 4 — Your Work</p>
                    <Field label="Link to or describe the work you're most proud of right now" id="proudWork" required>
                      <textarea id="proudWork" className={`${inputClass} min-h-[80px] py-2`} value={form.proudWork} onChange={set('proudWork')} />
                      {errors.proudWork && <span className="text-proof-accent text-xs">{errors.proudWork}</span>}
                    </Field>
                    <Field label="What kind of work do you want to be making a year from now?" id="futureWork" required>
                      <textarea id="futureWork" className={`${inputClass} min-h-[80px] py-2`} value={form.futureWork} onChange={set('futureWork')} />
                      {errors.futureWork && <span className="text-proof-accent text-xs">{errors.futureWork}</span>}
                    </Field>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-1">Step 3 of 4 — Getting to Know You</p>
                    <p className="text-proof-mute text-sm italic mb-2">{c.step3Intro}</p>
                    <Field label="What kind of collaborators or creative people are you hoping to meet here?" id="collaborators">
                      <textarea id="collaborators" className={`${inputClass} min-h-[72px] py-2`} value={form.collaborators} onChange={set('collaborators')} />
                      {errors.collaborators && <span className="text-proof-accent text-xs">{errors.collaborators}</span>}
                    </Field>
                    <Field label="Is there a project or idea you've been wanting to start but haven't had the right people around you for?" id="project">
                      <textarea id="project" className={`${inputClass} min-h-[72px] py-2`} value={form.project} onChange={set('project')} />
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-proof-mute">What part of this excites you most?</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {c.excitesOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleExcites(opt)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                              form.excites.includes(opt)
                                ? 'bg-proof-accent border-proof-accent text-proof-text'
                                : 'border-proof-border-md text-proof-mute hover:border-proof-border-md'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <>
                    <p className="text-xs tracking-widest uppercase text-proof-faint mb-2">Step 4 of 4 — Last Step</p>
                    <div className="flex flex-col gap-2">
                      <p className="text-proof-text text-sm leading-relaxed mb-3">{c.commitmentQuestion}</p>
                      {c.commitmentOptions.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="commitment"
                            value={opt.value}
                            checked={form.commitment === opt.value}
                            onChange={set('commitment')}
                            className="accent-proof-accent"
                          />
                          <span className="text-proof-mute text-sm group-hover:text-proof-text transition-colors">{opt.label}</span>
                        </label>
                      ))}
                      {errors.commitment && <span className="text-proof-accent text-xs">{errors.commitment}</span>}
                    </div>
                    <Field label="Anything else you'd like us to know? (optional)" id="anythingElse">
                      <textarea id="anythingElse" className={`${inputClass} min-h-[72px] py-2`} value={form.anythingElse} onChange={set('anythingElse')} />
                    </Field>
                  </>
                )}

                {/* Error banner */}
                {error && (
                  <p className="text-proof-accent text-sm">Something went wrong — please try again.</p>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="text-proof-mute text-xs uppercase tracking-wide hover:text-proof-text transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  <div className="ml-auto">
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={advance}
                        className="bg-proof-accent text-proof-text text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
                      >
                        {c.continueLabel}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-proof-accent text-proof-text text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {status === 'loading' ? 'Sending...' : c.submitLabel}
                      </button>
                    )}
                  </div>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/Application.test.jsx
```

Expected: 5 tests pass.

- [ ] **Step 5: Add to `App.jsx`** — import and render `<Application />` after `<TheFeeling />`. Verify: step indicator shows, fields validate, step transitions slide.

- [ ] **Step 6: Commit**

```bash
git add src/components/Application.jsx tests/components/Application.test.jsx src/App.jsx
git commit -m "feat: Application 4-step form with validation, animations, and tests"
```

---

## Task 12: Footer section

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Create `src/components/Footer.jsx`**:

```jsx
import ScrollReveal from './ScrollReveal'
import Logo from './Logo'
import { COPY } from '../constants/copy'

export default function Footer() {
  const { closing, cta, tagline } = COPY.footer

  return (
    <footer className="bg-proof-bg-alt px-6 md:px-16 lg:px-24 py-20 md:py-28">
      <ScrollReveal>
        <p className="text-proof-text font-bold leading-snug mb-6"
          style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', maxWidth: '28rem' }}
        >
          {closing}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <a
          href="#apply"
          className="inline-block text-proof-accent text-xs font-bold uppercase tracking-widest mb-16 hover:opacity-80 transition-opacity"
        >
          {cta}
        </a>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex items-center justify-between pt-6 border-t border-proof-border">
          <Logo className="text-xl" />
          <p className="text-proof-faint text-xs tracking-widest uppercase">{tagline}</p>
          {/* Social links placeholder — add handles when available */}
        </div>
      </ScrollReveal>
    </footer>
  )
}
```

- [ ] **Step 2: Add to `App.jsx`** — import and render `<Footer />` as the last element. Verify footer renders, CTA link scrolls to `#apply`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.jsx src/App.jsx
git commit -m "feat: Footer section"
```

---

## Task 13: Wire App.jsx + final passes

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx`** with the final wired version:

```jsx
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import WhatWeAre from './components/WhatWeAre'
import HowItWorks from './components/HowItWorks'
import TheFeeling from './components/TheFeeling'
import Application from './components/Application'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <main className="bg-proof-bg">
      <Hero />
      <TheGap />
      <WhatWeAre />
      <HowItWorks />
      <TheFeeling />
      <Application />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 3: Mobile pass** — open DevTools, switch to mobile viewport (375px). Check:
  - Hero headline wraps cleanly — `clamp()` font size keeps it from overflowing
  - HowItWorks cards stack vertically (`grid-cols-1 md:grid-cols-3`)
  - Form fields are full-width and tappable
  - Application form Step 1 name/email fields stack (`grid-cols-2` — change to `grid-cols-1` on mobile if they feel too tight)
  
  If the Step 1 name/email grid feels cramped on 375px, update in `Application.jsx`:
  ```jsx
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  ```

- [ ] **Step 4: Reduce motion for performance on mobile** — in `Hero.jsx`, conditionally skip the orb animation on small screens. Add at the top of the component:

```jsx
import { useReducedMotion } from 'framer-motion'

// inside Hero():
const prefersReduced = useReducedMotion()
```

Then on the orb `<motion.div>`, add:
```jsx
animate={prefersReduced ? {} : { x: [0, 18, -8, 0], y: [0, -12, 10, 0] }}
```

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/Hero.jsx src/components/Application.jsx
git commit -m "feat: wire all sections, mobile responsive pass, reduced-motion orb"
```

---

## Task 14: Netlify deploy

**Files:**
- No new files — uses `netlify.toml` from Task 1

- [ ] **Step 1: Build locally to verify no errors**

```bash
npm run build
```

Expected: `dist/` folder created, no TypeScript/Vite errors.

- [ ] **Step 2: Create a new Netlify site**

Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → connect GitHub → select the `proof-rva` repo → confirm build settings match `netlify.toml` (build command: `npm run build`, publish: `dist`).

- [ ] **Step 3: Set environment variables in Netlify**

In Netlify dashboard → **Site settings** → **Environment variables** → add:
```
AIRTABLE_API_KEY    = <your Airtable Personal Access Token>
AIRTABLE_BASE_ID   = <your Airtable base ID>
```

Do **not** commit these values to git.

- [ ] **Step 4: Create the Airtable base**

In Airtable, create a base called **Proof RVA Applications** with a table called **Applications** and these fields:

| Field name | Type |
|---|---|
| Name | Single line text |
| Email | Email |
| Work Link | URL |
| Discipline | Single line text |
| Proud Work | Long text |
| Future Work | Long text |
| Collaborators | Long text |
| Project Idea | Long text |
| Excites | Long text |
| Commitment | Single line text |
| Anything Else | Long text |

- [ ] **Step 5: Trigger a deploy**

Push any small change (e.g., update `README.md`) to trigger a Netlify build. Monitor the deploy log — it should complete in under 2 minutes.

- [ ] **Step 6: Test the live form end-to-end**

Fill out all 4 form steps on the live Netlify URL and submit. Verify the application appears in the Airtable base within a few seconds.

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: production deploy verified"
```

---

## Post-deploy checklist

- [ ] All 7 sections visible and scroll-triggered animations fire correctly
- [ ] Form validates all required fields, shows inline errors
- [ ] Step transitions animate cleanly between all 4 steps
- [ ] "I'd like to learn more first" shows the learn-more message, not the main confirmation
- [ ] Airtable receives submissions with all fields populated
- [ ] Honeypot submissions do not create Airtable records
- [ ] Mobile layout holds at 375px with no overflow
- [ ] Orb animation respects `prefers-reduced-motion`
- [ ] `#apply` anchor link from Hero CTA and Footer CTA scrolls to the form
