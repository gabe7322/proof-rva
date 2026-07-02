# Proof RVA — Landing Page Design Spec
**Date:** 2026-07-01  
**Project:** `C:\Users\Administrator\proof-rva\`  
**Status:** Approved — ready for implementation

---

## Overview

Single-page founding membership landing site for Proof RVA — a member-owned creative collective for Richmond, VA. Goal: communicate what Proof is, make the right people feel seen, and funnel serious applicants through a 4-step application form that submits to Airtable.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion (scroll-triggered only) |
| Form backend | Airtable via Netlify serverless function |
| Deployment | Netlify (free tier) |

---

## Design Tokens

```css
--bg:          #10141A   /* cool slate — page background */
--bg-alt:      #141820   /* slightly lighter — alternate sections */
--bg-surface:  #181D26   /* card surfaces, form background */
--text:        #F0F2F5   /* near-white, slightly cool */
--text-mute:   rgba(240,242,245,0.55)
--text-faint:  rgba(240,242,245,0.25)
--accent:      #D63B3B   /* crimson — CTAs, eyebrows, active states */
--border:      rgba(240,242,245,0.07)
--border-md:   rgba(240,242,245,0.13)
--radius:      4px
--radius-lg:   8px
```

---

## Typography

- **Display / headlines:** Anton or Arial Black — bold condensed, uppercase, `letter-spacing: -0.02em`
- **Body:** Inter or system-ui — clean, readable
- **Eyebrows:** 10px, `letter-spacing: 0.2em`, uppercase, `font-weight: 600`
- Load Anton via Google Fonts in `index.html`

---

## Animation Philosophy

- All entrance animations are **scroll-triggered** (Framer Motion `whileInView`) — nothing plays on a timer
- Hero gets the one "wow" moment: headline words/lines stagger in sequentially (~80ms apart), then sub-copy, then CTA
- All other sections: fade-up + slight translate on scroll entry, staggered per element
- The Feeling section: lines appear one at a time as user scrolls — slow, deliberate pacing
- Soft glowing orb in hero background drifts very slowly (8–12s loop, barely perceptible) — `--accent` at ~8% opacity
- Hover states: instant, snappy (no slow eases) — slight scale on tags and buttons
- Mobile: disable the drifting orb and reduce stagger count for performance
- Shared `<ScrollReveal>` wrapper handles fade-up logic for all sections

---

## Component Architecture

```
src/
  App.jsx
  components/
    Logo.jsx              — placeholder "PROOF" wordmark, swap-ready
    Hero.jsx
    TheGap.jsx
    WhatWeAre.jsx
    HowItWorks.jsx
    TheFeeling.jsx
    Application.jsx       — owns all 4-step form state
    Footer.jsx
    ScrollReveal.jsx      — shared scroll-triggered fade-up wrapper
  hooks/
    useAirtable.js        — POST to /api/submit-application, returns status
  constants/
    copy.js               — all locked copy in one file
netlify/functions/
  submit-application.js   — serverless fn, proxies POST to Airtable API
```

---

## Section Specs

### §1 Hero

**Layout:** Full viewport height, content vertically centered, scroll cue bottom-left.  
**Background:** `--bg` with a radial gradient orb (`--accent` at 8% opacity) drifting slowly top-right.

**Copy:**
```
Eyebrow:    FOUNDING MEMBERSHIP · RICHMOND, VA
Headline:   A HOME FOR RICHMOND'S CREATIVES
Sub:        Owned by its own members.
CTA:        Apply for Founding Membership →
```

**Animation:** Eyebrow fades in first → headline lines stagger in (80ms each) → sub fades in → CTA fades in → scroll cue last.

---

### §2 The Gap

**Layout:** Left-aligned, `--bg`, max-width content column.  
**Background:** `--bg`

**Copy:**
```
Eyebrow:    THE GAP
Headline:   Creating a community truly made up of Richmond's creative talent
Para 1:     Richmond is full of people making real work — music, visual art, film, design — but they're scattered, rarely crossing paths, rarely building together.
Para 2:     PROOF exists to connect that talent into one lasting community — not a single event or a one-off showcase, but something that keeps going.
Para 3:     Starting with the people in this founding group: real events, real collaboration between members, and a foundation that grows into much more from there.
```

**Animation:** Eyebrow → headline → paragraphs fade up individually, staggered on scroll.

---

### §3 What We Are

**Layout:** Left-aligned, `--bg`, discipline tags as loose cluster below body copy.  
**Background:** `--bg`

**Copy:**
```
Eyebrow:    WHAT WE ARE
Headline:   A family. Not a showcase.
Body:       PROOF is a member-owned creative collective for the people who contribute to Richmond's culture — DJs, producers, visual artists, photographers, filmmakers, designers. Real governance. Real ownership.
Tags:       Producers  DJs  Visual Artists  Photographers  Filmmakers  Designers
```

**Animation:** Eyebrow → headline → body → tags drift in with stagger. Tags have hover-scale.

---

### §4 How It Works

**Layout:** 3-column grid on desktop, stacked on mobile. `--bg-alt` background.  
**Cards:** `--bg` surface, `--border` border, `--radius-lg`, numbered 01/02/03 in `--accent`.

**Copy:**
```
Eyebrow:    HOW IT WORKS

01 Member-Owned
   Every member has a real stake. Voluntary dues build a shared treasury the collective decides how to use.

02 Democratic
   Events, spending, direction — all decided by member vote. No gatekeepers.

03 Built to Last
   Year-round, not a seasonal showcase. The goal is permanent infrastructure — eventually a physical space owned by the people who built it.
```

**Animation:** Cards fade up with left-to-right stagger on scroll.

---

### §5 The Feeling

**Layout:** Full-width, `--bg-surface`, generous vertical padding. Lines are large, one per "beat."  
**Background:** `--bg-surface` (slightly lighter than `--bg` — creates a section break without a color jump)

**Copy:**
```
Eyebrow:    THE FEELING
Line 1:     You stop building alone.
Line 2:     You stop waiting for permission.
Line 3:     You become part of something that outlasts any one event, any one night, any one of us.
Line 4:     This is yours to shape — starting with your vote.  [muted weight]
```

**Animation:** Each line triggers independently as user scrolls — slow, deliberate. Line 4 renders slightly smaller and in `--text-mute`.

---

### §6 Application

**Layout:** `--bg`, 4-step form centered in a `--bg-alt` frame with `--border-md` border.  
**Progress indicator:** 4 numbered dots connected by lines at top of form frame.  
**Step transitions:** slide-left/fade between steps (Framer Motion `AnimatePresence`).  
**Section headline:** "Ready to be part of it?" — suggested, not from locked copy worksheet, adjust as needed.

**Step 1 — Who You Are**
- Name (required)
- Email (required)
- Instagram / primary work link (required)
- Discipline — dropdown: DJ / Producer / Visual Artist / Photographer / Filmmaker / Graphic Designer / Other

**Step 2 — Your Work**
- "Link to or describe the work you're most proud of right now" (required)
- "What kind of work do you want to be making a year from now?" (open text, min 30 chars)

**Step 3 — Getting to Know You**
- Section intro: *"A few questions so we actually know who we're inviting in — not a test."*
- "What kind of collaborators or creative people are you hoping to meet here?" (open text, min 30 chars)
- "Is there a project or idea you've been wanting to start but haven't had the right people around you for?" (open text)
- "What part of this excites you most?" — tag-select: `Meeting collaborators` / `Having a real vote / governance` / `Building something from the ground up` / `Other`

**Step 4 — Last Step**
- "This is a founding group — small, hands-on, and still being shaped. We're looking for people who want to actually show up for that. Does that sound like you?"
  - `Yes, I'm in` → submits full application
  - `I'd like to learn more first` → routes to a "we'll follow up" message
- Optional: "Anything else you'd like us to know?" (open text)
- Submit: `Submit Application →`

**Post-submit confirmation:**
> "We read every application personally. If it's a fit, you'll hear from a real person — not an automated email."

**Bot protection:** Hidden honeypot field on Step 1. No CAPTCHA.

---

### §7 Footer

**Layout:** `--bg-alt`, minimal. Closing line + CTA repeat + thin divider + wordmark/tagline row.

**Copy:**
```
Closing:    Richmond's creative family. Owned by the people who make it.
CTA repeat: Apply for Founding Membership →
Wordmark:   PROOF
Tagline:    PROOF · Richmond, VA · Est. 2026
```

Social links: none for now — placeholder slots added as comments in the component.

---

## Airtable Integration

- Serverless function at `netlify/functions/submit-application.js`
- Receives POST from `useAirtable.js` hook
- Forwards to Airtable REST API using `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` env vars (set in Netlify dashboard — never in client code)
- Returns `{ success: true }` or `{ error: "..." }` to client
- `Application.jsx` shows confirmation on success, inline error message on failure (no spinning loaders)

---

## Logo Plan

Build with placeholder `PROOF` text wordmark in `<Logo />` component. A separate design session using 6 reference images (Palace, Nike/Syyn, Simbiosys, Siyana, Parallax Rental, Bape) will produce a custom graffiti/bubble/liquid-chrome wordmark. Swap into `<Logo />` once final asset is ready — no restructuring required.

---

## Out of Scope

- Multiple pages / routing
- CMS
- User accounts / login
- Revenue-sharing mechanics (content not finalized)
- Social links (handles not yet created)
