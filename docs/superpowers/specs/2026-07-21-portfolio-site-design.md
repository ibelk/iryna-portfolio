# Iryna Belkova Portfolio Site — Design Spec

## Problem

Iryna's current portfolio is a Figma prototype. In practice this creates real friction: opening
the link in a plain browser surfaces a login prompt before any content renders, and the
canvas is slow to load. This is exactly the kind of friction a recruiter skimming candidates
will not push through. The case study content itself (reviewed via screenshots and the Figma
API) is strong — structured, backed by real metrics — but the delivery layer is undermining it,
and the homepage entry point doesn't preview any of that strength (generic hero line, case
card subtitles that describe the client company rather than Iryna's contribution).

## Goals

- Replace the Figma prototype with a fast, low-friction, real website as the primary link to send recruiters.
- Rewrite positioning so it leads with credible, specific proof (real metrics, real scale) rather than generic craft language — and never inflate or round numbers beyond what's defensible.
- Make the breadth of Iryna's experience (enterprise/data-heavy platforms ↔ consumer mobile apps, plus AI-tool fluency and 3D/illustration craft) legible within seconds of landing, without a wall of text.
- Ship a strong v1 within a 3–5 day budget. Everything not essential to that goal is deferred.

## Non-goals (v1)

- Ukrainian translation / UA-EN toggle (site ships English-only for v1; UA is v2).
- VTB case study (added in v2). LEAF **is** included in v1, not deferred.
- The VPN B2B design-system realignment story — no case study, no visual artifact exists, no metric to anchor it; it stays as a spoken interview story, not site content.
- Cinematic/complex page-transition animation — v1 keeps animation expressive but scoped to what fits the timeline (see Animation, below).

## Content scope

### Case studies (5, in this order)
1. **VPN Premium purchase flow redesign** — tag: `Consumer / Growth`
2. **VPN Typography & Accessibility** — tag: `Accessibility / Infrastructure` — this is the strongest "catches problems before they become incidents" story; frame it explicitly that way.
3. **Freelancehunt portfolio redesign** — tag: `Marketplace`
4. **Resonance analytical platform** — tag: `Enterprise / Data-heavy`
5. **LEAF** — tag: `Consumer Mobile / 0→1`

Each case gets a **StatCallout** treatment (new component, doesn't exist in the current Figma
file) for its strongest metric — a large headline number with a smaller caption giving the
real underlying figures, so the punchy version and the verifiable version sit together:

- VPN Premium: **+21%** / "(0.28% → 0.34%, first 2 weeks, 700K+ visitors/month)". Do not
  extend this to a larger, later number — Iryna no longer has access to that data and other
  product changes shipped in the interim, so any later figure can't be cleanly attributed to
  this redesign.
- VPN Typography: **fix requests: weekly → once a month**, plus contrast deltas (4.49→7.76,
  3.57→10.27) as supporting detail.
- Freelancehunt: **63%** of users were re-uploading work just to reorder it (the research
  insight that justified the portfolio builder).
- Resonance: **"Design system still running the product 4+ years after I left"** — no number
  needed, this is the headline stat as a sentence.
- LEAF: **74%** of users didn't know where to start (onboarding research finding).

Both VPN case studies keep their NDA disclosure badge ("Interfaces reproduced for portfolio via
NDA"). Since the mockups have to be recreated anyway, Iryna will redraw them to look more
polished as part of the content-prep phase.

### Experiments section
Gallery of 3D illustration work (from LEAF and any other pieces Iryna supplies). Included in v1 — low
build effort since assets already exist as rendered images.

### Writing section
Broader than the AI-tool series alone: includes the existing "7 days, 7 Figma tools" LinkedIn
posts *and* stories from Iryna's ~2 years doing hands-on troubleshooting within a design team.
Scoped to 5–6 posts total for v1, not a full archive. Presented as teaser card + text excerpt,
linking out to the original LinkedIn post rather than reproducing full post text on-site.
**Content still needed from Iryna:** which troubleshooting stories to include, written or
pointed to.

Do not display LinkedIn reach/impression numbers anywhere (verified via the account's own
analytics: low hundreds of impressions, 1–3 interactions per post) — that data undercuts
rather than supports the positioning. The value of this section is demonstrated skill/curiosity,
not audience size.

### Home page
Hero (rewritten — states the enterprise↔consumer↔AI↔3D range directly, replacing the current
generic "crafting innovative product designs that merge aesthetics with functionality" line) →
About (2–3 sentences; includes the "catches problems before they become incidents" framing as
a throughline, not a list of every anecdote) → grid of 5 case cards (each with its category tag,
subtitle rewritten as "what I changed → what happened" instead of a description of the client
company) → a short two-card preview strip linking into Experiments and Writing → footer
(Dribbble, LinkedIn, Telegram, email — same as current Figma footer).

## Architecture

**Framework:** Astro, static output. Reusable components for the structure every case study
shares (header/meta block, hero image, context-card grid, before/after slider, quote table,
impact list, the new StatCallout) so a content or design tweak doesn't mean editing five
duplicated pages by hand.

**Animation:** GSAP + ScrollTrigger as a lightweight vanilla-JS island — scroll-triggered
section reveals, animated number counters on StatCallouts, hover states on case cards, an
animated gradient hero background (matching the LinkedIn card series' visual language).
`prefers-reduced-motion` must be respected, and no animation may gate or delay access to
content — the whole point of leaving Figma was to remove friction, not add new friction dressed
up as motion design.

**Hosting:** Vercel (or Netlify) free tier, auto-generated subdomain. Access is unlisted, not
password-gated: `noindex` meta tag, `robots.txt` disallow, and the URL is never linked from
LinkedIn, Dribbble, or any other public profile — shared only directly.

**i18n:** Not built in v1. Structured so a `ua/` content path and a language switcher can be
added in v2 without a rebuild (content kept separate from layout components already, for this
reason among others).

## Edge cases

- 404 page for broken/typo'd URLs.
- Lazy-loading for the heavy case-study screenshots.
- Before/after slider and stat counters must work on touch (mobile), not just mouse drag.
- Since UA is deferred, no fallback-translation logic is needed yet — English is the only copy path in v1.

## Testing

- Responsive check at mobile/tablet/desktop breakpoints (the preview tool's resize presets).
- Reduced-motion check (OS-level setting toggled, animations should disable/simplify accordingly).
- Manual link check across all nav paths (home → each case → back, Experiments, Writing, footer links).
- Confirm `noindex`/`robots.txt` are actually in place before the real deploy goes live.

## Open items to resolve before/during implementation

- Redrawn VPN mockup visuals — Iryna is producing these.
- 3D illustration asset exports for the Experiments gallery.
- Final list + source text for the 5–6 Writing section posts (troubleshooting stories still need to be identified/written).
- Employment end date for the NDA VPN role — needed to correct the CV ("Present" is stale) and to phrase that case study in the correct tense; tracked as a parallel CV task, not blocking the site build.
