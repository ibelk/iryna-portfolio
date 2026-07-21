# Iryna Belkova Portfolio Site v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, unlisted, English-only static portfolio site (5 case studies, an Experiments gallery, a Writing section) that replaces the current Figma prototype as the link sent to recruiters.

**Architecture:** Astro static site. Case-study content lives in typed content collections (Zod schema), rendered through shared components (`CaseHeader`, `StatCallout`, `ContextCardGrid`, `QuoteTable`, `ImpactList`, `BeforeAfterSlider`) via a single dynamic route, so content and design edits never require touching five duplicated pages. GSAP + ScrollTrigger runs as one small vanilla-JS island for scroll reveals and animated stat counters, gated behind a `prefers-reduced-motion` check.

**Tech Stack:** Astro ^5, GSAP ^3 (+ ScrollTrigger), Vitest ^2 (unit tests + build-output assertions), gray-matter (test-only content parsing), deployed to Vercel.

## Global Constraints

- English only in v1. No UA content, no language switcher (spec: Non-goals).
- Site must ship `robots.txt` disallowing all crawlers and a `noindex, nofollow` meta tag on every page — access is unlisted, not password-gated (spec: Architecture, Hosting).
- Exactly 5 case studies in this order: VPN Premium, VPN Typography, Freelancehunt, Resonance, LEAF. No VTB, no VPN-B2B story (spec: Content scope, Non-goals).
- Every stat shown as a `StatCallout` must pair a large headline value with a smaller caption giving the real underlying figures — never show a rounded/invented number alone (spec: Case studies).
- The VPN Premium conversion stat is fixed at "+21%" / "0.28% → 0.34%, first 2 weeks, 700K+ visitors/month" — never extended to a later, unverifiable number (spec: Case studies).
- No LinkedIn impression/view/reach numbers appear anywhere in the Writing section (spec: Writing section).
- All animation must respect `prefers-reduced-motion` and must never delay or gate access to page content (spec: Animation).
- Both VPN case studies carry an NDA disclosure badge (spec: Case studies).

---

## File Structure

```
iryna-portfolio/
├── astro.config.mjs
├── package.json
├── public/
│   ├── robots.txt
│   └── images/
│       ├── case-vpn-premium/hero.svg
│       ├── case-vpn-typography/hero.svg
│       ├── case-freelancehunt/hero.svg
│       ├── case-resonance/hero.svg
│       ├── case-leaf/hero.svg
│       ├── experiments/*.svg
│       └── posts/*.svg
├── scripts/
│   └── generate-placeholder-images.mjs
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   ├── case-studies/*.md   (5 files)
│   │   ├── experiments/*.md    (3 files)
│   │   └── posts/*.md          (5 files)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── AboutSection.astro
│   │   ├── CaseCard.astro
│   │   ├── PreviewStrip.astro
│   │   ├── CaseHeader.astro
│   │   ├── StatCallout.astro
│   │   ├── ContextCardGrid.astro
│   │   ├── QuoteTable.astro
│   │   ├── ImpactList.astro
│   │   └── BeforeAfterSlider.astro
│   ├── lib/
│   │   ├── stats.ts
│   │   └── motion.ts
│   ├── scripts/
│   │   └── animations.js
│   ├── styles/
│   │   └── global.css
│   └── pages/
│       ├── index.astro
│       ├── 404.astro
│       ├── case/[slug].astro
│       ├── experiments/index.astro
│       └── writing/index.astro
└── tests/
    ├── stats.test.ts
    ├── motion.test.ts
    ├── content-schema.test.ts
    └── build-output.test.ts
```

---

### Task 1: Project scaffolding + unlisted access config

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `public/robots.txt`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro` (placeholder, replaced in Task 8)
- Test: `tests/build-output.test.ts`

**Interfaces:**
- Produces: `BaseLayout.astro` accepting a `title: string` prop, rendering `<slot />` inside `<body>`, with `<meta name="robots" content="noindex, nofollow">` always present in `<head>`. Every later page/layout wraps content in this layout.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "iryna-portfolio",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.1.0",
    "gsap": "^3.12.5"
  },
  "devDependencies": {
    "vitest": "^2.1.8",
    "gray-matter": "^4.0.3"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` populated, `package-lock.json` created, no errors.

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://iryna-portfolio.vercel.app',
  output: 'static',
});
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.vercel/
```

- [ ] **Step 5: Create `public/robots.txt`**

```
User-agent: *
Disallow: /
```

- [ ] **Step 6: Create `src/layouts/BaseLayout.astro`**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>{title}</title>
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 7: Create placeholder `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Iryna Belkova — Product Designer">
  <p>Under construction.</p>
</BaseLayout>
```

- [ ] **Step 8: Write the failing test for unlisted access**

Create `tests/build-output.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('unlisted access config', () => {
  it('ships a robots.txt that disallows all crawlers', () => {
    const contents = readFileSync('dist/robots.txt', 'utf-8');
    expect(contents).toContain('Disallow: /');
  });

  it('every built page has a noindex meta tag', () => {
    const indexHtml = readFileSync('dist/index.html', 'utf-8');
    expect(indexHtml).toContain('name="robots" content="noindex, nofollow"');
  });
});
```

- [ ] **Step 9: Run test to verify it fails (no build yet)**

Run: `npx vitest run tests/build-output.test.ts`
Expected: FAIL — `ENOENT: no such file or directory, open 'dist/robots.txt'`

- [ ] **Step 10: Build the site**

Run: `npm run build`
Expected: Astro builds successfully, `dist/index.html` and `dist/robots.txt` exist.

- [ ] **Step 11: Run test to verify it passes**

Run: `npx vitest run tests/build-output.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore public/robots.txt src/layouts/BaseLayout.astro src/pages/index.astro tests/build-output.test.ts
git commit -m "chore: scaffold Astro project with unlisted-access config"
```

---

### Task 2: Design tokens + global styles

**Files:**
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--font-sans`, `--space-*`) consumed by every component in later tasks.

- [ ] **Step 1: Pull real color/typography tokens from the source Figma file**

Use the Figma MCP tool `get_variable_defs` (fileKey `GQZovaUgvtpnyqPaEU0xJw`) to fetch the actual published variables. If the file has no published variable collection (likely, since the earlier metadata pull showed raw hex fills on individual nodes rather than bound variables), fall back to the dark theme observed directly in the case-study screenshots: near-black background, off-white text, a warm orange-red accent used for icon dots and highlight numbers, and a blue accent used for framed screenshot borders. Record whichever values are used in a comment at the top of `global.css` so they can be corrected later without guessing again.

- [ ] **Step 2: Create `src/styles/global.css`**

```css
:root {
  --color-bg: #0a0a0c;
  --color-surface: #17171b;
  --color-surface-alt: #1f1f24;
  --color-text: #f5f5f5;
  --color-text-muted: #9a9aa2;
  --color-accent: #e8542c;
  --color-accent-blue: #3b6fe0;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --radius: 12px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.5;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Wire the stylesheet into the layout and verify a manual build**

Run: `npm run build`
Expected: no build errors; `dist/styles/global.css` exists (Astro copies `src/styles` only if imported — confirm by adding `import '../styles/global.css';` to the frontmatter of `BaseLayout.astro` instead of the `<link>` tag).

- [ ] **Step 4: Update `BaseLayout.astro` to import the stylesheet**

Replace the `<link rel="stylesheet" ...>` line with a frontmatter import:

```astro
---
import '../styles/global.css';
interface Props {
  title: string;
}
const { title } = Astro.props;
---
```

(remove the `<link>` tag from `<head>` since Astro now bundles the imported CSS automatically)

- [ ] **Step 5: Run the existing build-output test to confirm nothing broke**

Run: `npm run build && npx vitest run tests/build-output.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "style: add dark theme design tokens and global stylesheet"
```

---

### Task 3: Header and Footer components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `Header.astro` (no props — static site name/tagline/nav), `Footer.astro` (no props — static contact links). Every page in later tasks includes both.

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
<header class="site-header">
  <div class="container site-header__row">
    <a href="/" class="site-header__name">Iryna Belkova</a>
    <nav class="site-header__nav">
      <a href="/#work">Work</a>
      <a href="/experiments">Experiments</a>
      <a href="/writing">Writing</a>
    </nav>
  </div>
</header>

<style>
  .site-header {
    padding: var(--space-3) 0;
  }
  .site-header__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .site-header__name {
    font-weight: 700;
    text-decoration: none;
    font-size: 1.1rem;
  }
  .site-header__nav {
    display: flex;
    gap: var(--space-3);
  }
  .site-header__nav a {
    text-decoration: none;
    color: var(--color-text-muted);
  }
  .site-header__nav a:hover {
    color: var(--color-text);
  }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
<footer class="site-footer">
  <div class="container site-footer__row">
    <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer">Dribbble</a>
    <a href="https://www.linkedin.com/in/iryna-belkova-1368981a0/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="https://t.me/" target="_blank" rel="noopener noreferrer">Telegram</a>
    <a href="mailto:iryn.belkova@gmail.com">iryn.belkova@gmail.com</a>
  </div>
</footer>

<style>
  .site-footer {
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-surface-alt);
    margin-top: var(--space-5);
  }
  .site-footer__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
  .site-footer__row a {
    text-decoration: none;
  }
  .site-footer__row a:hover {
    color: var(--color-text);
  }
</style>
```

Note: the Dribbble and Telegram URLs are placeholders — replace with Iryna's actual handles before deploy (Task 13 checklist covers this).

- [ ] **Step 3: Wire both into `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Iryna Belkova — Product Designer">
  <Header />
  <p>Under construction.</p>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Build and confirm the nav and footer links render**

Run: `npm run build && grep -o 'Experiments' dist/index.html`
Expected: `Experiments` printed (confirms Header rendered)

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add site header and footer components"
```

---

### Task 4: Content collections config + case study seed data

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/case-studies/vpn-premium.md`
- Create: `src/content/case-studies/vpn-typography.md`
- Create: `src/content/case-studies/freelancehunt.md`
- Create: `src/content/case-studies/resonance.md`
- Create: `src/content/case-studies/leaf.md`
- Create: `scripts/generate-placeholder-images.mjs`
- Test: `tests/content-schema.test.ts`

**Interfaces:**
- Produces: the `case-studies` collection schema (fields: `title`, `subtitle`, `tag`, `order`, `ndaBadge`, `heroImage`, `meta[]`, `statValue`, `statCaption`, `contextCards[]`, `quoteTable[]`, `impactList[]`). Task 7 queries this collection via `getCollection('case-studies')`.

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const metaItem = z.object({
  label: z.string(),
  value: z.string(),
});

const contextCard = z.object({
  title: z.string(),
  bullets: z.array(z.string()),
});

const quoteRow = z.object({
  role: z.string(),
  whatWentWrong: z.string(),
  howItAffected: z.string(),
  quote: z.string(),
});

const impactItem = z.object({
  label: z.string(),
  description: z.string(),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    tag: z.string(),
    order: z.number(),
    ndaBadge: z.boolean().default(false),
    heroImage: z.string(),
    meta: z.array(metaItem),
    statValue: z.string(),
    statCaption: z.string(),
    contextCards: z.array(contextCard).default([]),
    quoteTable: z.array(quoteRow).default([]),
    impactList: z.array(impactItem),
  }),
});

const experiments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    order: z.number(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    linkedinUrl: z.string().url(),
    image: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  experiments,
  posts,
};
```

- [ ] **Step 2: Create `src/content/case-studies/vpn-premium.md`**

```markdown
---
title: "Premium Purchase Flow Redesign"
subtitle: "Redesigned the upgrade flow on a live VPN product — conversion moved from 0.28% to 0.34% in the first two weeks."
tag: "Consumer / Growth"
order: 1
ndaBadge: true
heroImage: "/images/case-vpn-premium/hero.svg"
meta:
  - label: "Product"
    value: "B2C VPN app"
  - label: "Scale"
    value: "700,000+ visitors/month"
  - label: "Monetization model"
    value: "Freemium → Premium"
  - label: "Restrictions"
    value: "No full redesign, no pricing changes"
statValue: "+21%"
statCaption: "0.28% → 0.34% conversion, first 2 weeks, 700K+ visitors/month"
contextCards:
  - title: "Why users weren't reaching payment"
    bullets:
      - "Premium had no clear value explanation — users delayed the decision"
      - "Interface focus was on the free plan, not on monetization"
      - "Analytics showed 38% of users who reached the pricing page clicked Download instead of Get Premium"
impactList:
  - label: "Shift in focus"
    description: "Moved users from \"Download\" toward \"Buy Premium\" as the primary action"
  - label: "Ready for A/B testing"
    description: "Rebuilt decision architecture makes future experiments straightforward"
  - label: "Conversion"
    description: "0.28% → 0.34% in the first two weeks post-launch"
---

Interfaces on this page are reproduced for portfolio purposes under NDA.
```

- [ ] **Step 3: Create `src/content/case-studies/vpn-typography.md`**

```markdown
---
title: "Typography & Accessibility in VPN"
subtitle: "Caught a systemic accessibility problem before it broke translations for 60+ languages — cut fix requests from weekly to monthly."
tag: "Accessibility / Infrastructure"
order: 2
ndaBadge: true
heroImage: "/images/case-vpn-typography/hero.svg"
meta:
  - label: "Product"
    value: "VPN apps (desktop, mobile, browser extension)"
  - label: "Scale"
    value: "10M+ users"
  - label: "Localization"
    value: "60+ languages"
  - label: "Environment"
    value: "Living product, no pause for redesign"
statValue: "Weekly → Monthly"
statCaption: "Typography-related fix requests, after the Noto Sans migration"
contextCards:
  - title: "Why the system font became a problem"
    bullets:
      - "Montserrat was used as a system font without considering localization"
      - "Low contrast on key UI elements"
      - "Text did not meet WCAG standards"
quoteTable:
  - role: "Translators"
    whatWentWrong: "Phrases didn't fit UI components and often lost meaning"
    howItAffected: "Incorrect or broken translations in the UI"
    quote: "German translations don't fit the button again — half the word gets cut off."
  - role: "Developers"
    whatWentWrong: "Each new language caused layout issues or broken elements"
    howItAffected: "Constant fixes slowed down release cycles"
    quote: "Every new language feels like a whole new project."
  - role: "QA Testers"
    whatWentWrong: "Every new locale introduced new bugs during testing"
    howItAffected: "Manual re-checking of all localization scenarios each time"
    quote: "Something always breaks — guaranteed."
impactList:
  - label: "Localization fixed"
    description: "Readability and localization issues resolved across 60+ languages"
  - label: "Typography unified"
    description: "Consistent system font across desktop, mobile, and extension"
  - label: "Fix requests"
    description: "Reduced from weekly to once a month"
---

Interfaces on this page are reproduced for portfolio purposes under NDA.
```

- [ ] **Step 4: Create `src/content/case-studies/freelancehunt.md`**

```markdown
---
title: "Freelancer Portfolio Redesign"
subtitle: "63% of users were re-uploading finished work just to reorder it — replaced a fixed template with a flexible portfolio builder."
tag: "Marketplace"
order: 3
ndaBadge: false
heroImage: "/images/case-freelancehunt/hero.svg"
meta:
  - label: "Product"
    value: "Freelance services marketplace"
  - label: "Scale"
    value: "2M+ registered users"
  - label: "Area of responsibility"
    value: "Increasing user competitiveness"
  - label: "Task type"
    value: "UX redesign of the key decision-making flow"
statValue: "63%"
statCaption: "of users re-uploaded finished work solely to change its display order"
contextCards:
  - title: "Key research insights"
    bullets:
      - "Media and text limitations reduced case quality"
      - "One template ignored specialization-specific needs"
      - "Low trust in displayed work — no control over order reduced conversion"
impactList:
  - label: "Decision tool"
    description: "Portfolio became a decision tool, not a formality"
  - label: "Flexible presentation"
    description: "Different specializations received flexible self-presentation"
  - label: "Trust"
    description: "Trust in displayed work increased"
---

Redesign of the key page clients use to decide who to hire on a 2M+ user marketplace.
```

- [ ] **Step 5: Create `src/content/case-studies/resonance.md`**

```markdown
---
title: "Design System for an Analytical Platform"
subtitle: "Built a design system for a data-heavy fintech platform that's still running the product 4+ years after I left."
tag: "Enterprise / Data-heavy"
order: 4
ndaBadge: false
heroImage: "/images/case-resonance/hero.svg"
meta:
  - label: "Product"
    value: "Analytical platform (web, data-heavy)"
  - label: "Scale"
    value: "Startup → break-even point"
  - label: "Data"
    value: "High-density information charts"
  - label: "Environment"
    value: "Continuous development and team turnover"
statValue: "4+ years"
statCaption: "The design system has outlived my tenure and still supports active development"
contextCards:
  - title: "Problems of managing complex data"
    bullets:
      - "High cognitive load from many simultaneous visual elements"
      - "No clear focus hierarchy between signal and noise"
      - "Limited UI scalability across tools and scenarios"
impactList:
  - label: "Product"
    description: "Scalable without a full redesign"
  - label: "Team"
    description: "System survives designer changes"
  - label: "Process"
    description: "Product grows without manual design control"
---

Design system built for growth, without losing control over a data-heavy interface.
```

- [ ] **Step 6: Create `src/content/case-studies/leaf.md`**

```markdown
---
title: "LEAF"
subtitle: "74% of users didn't know where to start — solo end-to-end, from research to a Google Play release."
tag: "Consumer Mobile / 0→1"
order: 5
ndaBadge: false
heroImage: "/images/case-leaf/hero.svg"
meta:
  - label: "Product"
    value: "B2C startup, eco-habit mobile app"
  - label: "Scale"
    value: "Published on Google Play"
  - label: "Monetization model"
    value: "Free mobile app"
  - label: "Contribution"
    value: "Full product cycle: research → UI design → 3D illustration → launch"
statValue: "74%"
statCaption: "of surveyed users didn't know where to start with waste sorting"
contextCards:
  - title: "Research findings"
    bullets:
      - "74% didn't know where to start with waste sorting"
      - "Most users wanted a beginner's guide before anything else"
      - "Planning calendar and recycling map were the most valued features"
impactList:
  - label: "Onboarding"
    description: "Shaped by the 74% research finding into a dedicated beginner's guide"
  - label: "End-to-end build"
    description: "From wireframes to Google Play release, solo"
  - label: "Illustration"
    description: "Created 130+ original 3D illustrations in Cinema 4D"
---

Full-cycle solo product, from research through 3D illustration to a Google Play launch.
```

- [ ] **Step 7: Create the placeholder image generator script**

```js
// scripts/generate-placeholder-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const targets = [
  ['public/images/case-vpn-premium/hero.svg', 'VPN Premium'],
  ['public/images/case-vpn-typography/hero.svg', 'VPN Typography'],
  ['public/images/case-freelancehunt/hero.svg', 'Freelancehunt'],
  ['public/images/case-resonance/hero.svg', 'Resonance'],
  ['public/images/case-leaf/hero.svg', 'LEAF'],
];

function svgFor(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <rect width="100%" height="100%" fill="#1f1f24"/>
  <text x="50%" y="50%" fill="#9a9aa2" font-family="sans-serif" font-size="32" text-anchor="middle" dominant-baseline="middle">${label} (placeholder)</text>
</svg>`;
}

for (const [path, label] of targets) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svgFor(label));
}

console.log(`Generated ${targets.length} placeholder images.`);
```

- [ ] **Step 8: Write the failing schema test**

Create `tests/content-schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';

const CASE_DIR = 'src/content/case-studies';
const EXPECTED_ORDER = [
  'vpn-premium.md',
  'vpn-typography.md',
  'freelancehunt.md',
  'resonance.md',
  'leaf.md',
];

describe('case study content', () => {
  it('has exactly the 5 expected case studies, no more, no less', () => {
    const files = readdirSync(CASE_DIR).sort();
    expect(files.sort()).toEqual(EXPECTED_ORDER.slice().sort());
  });

  it('every case study has the required frontmatter fields', () => {
    for (const file of EXPECTED_ORDER) {
      const { data } = matter(readFileSync(`${CASE_DIR}/${file}`, 'utf-8'));
      expect(data.title, `${file}: title`).toBeTruthy();
      expect(data.tag, `${file}: tag`).toBeTruthy();
      expect(data.statValue, `${file}: statValue`).toBeTruthy();
      expect(data.statCaption, `${file}: statCaption`).toBeTruthy();
      expect(Array.isArray(data.impactList), `${file}: impactList`).toBe(true);
    }
  });

  it('the VPN premium conversion stat is exactly the verified figure', () => {
    const { data } = matter(readFileSync(`${CASE_DIR}/vpn-premium.md`, 'utf-8'));
    expect(data.statValue).toBe('+21%');
    expect(data.statCaption).toContain('0.28% → 0.34%');
    expect(data.statCaption).toContain('first 2 weeks');
  });

  it('both VPN case studies have the NDA badge enabled', () => {
    const premium = matter(readFileSync(`${CASE_DIR}/vpn-premium.md`, 'utf-8'));
    const typography = matter(readFileSync(`${CASE_DIR}/vpn-typography.md`, 'utf-8'));
    expect(premium.data.ndaBadge).toBe(true);
    expect(typography.data.ndaBadge).toBe(true);
  });
});
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: FAIL — `gray-matter` not yet installed, or directory read error if content files aren't created yet. If steps 2–6 above are already done, this should actually pass; if so, temporarily confirm it would have failed by checking the assertions match the file content deliberately (this is a content-validation test, not a pure TDD red step — proceed to Step 10 if content already matches).

- [ ] **Step 10: Run test to verify it passes**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 11: Generate placeholder images and verify build**

Run: `node scripts/generate-placeholder-images.mjs && npm run build`
Expected: 5 SVG files created under `public/images/`, build succeeds (content collection schema validates all 5 files without throwing).

- [ ] **Step 12: Commit**

```bash
git add src/content scripts/generate-placeholder-images.mjs tests/content-schema.test.ts public/images
git commit -m "feat: add case study content collection and seed data for 5 cases"
```

---

### Task 5: StatCallout component + formatting helper

**Files:**
- Create: `src/lib/stats.ts`
- Create: `src/components/StatCallout.astro`
- Test: `tests/stats.test.ts`

**Interfaces:**
- Produces: `parseStatValue(value: string): { isNumeric: boolean; numericTarget: number | null; prefix: string; suffix: string }` — used by the animation island in Task 11 to decide whether a stat can be count-up animated (e.g. "+21%" → animate 0→21 with a "+"/"%" wrap) or must render as static text (e.g. "Weekly → Monthly", "4+ years").
- Produces: `StatCallout.astro` accepting `value: string` and `caption: string` props.

- [ ] **Step 1: Write the failing test**

Create `tests/stats.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseStatValue } from '../src/lib/stats';

describe('parseStatValue', () => {
  it('parses a signed percentage into an animatable numeric target', () => {
    expect(parseStatValue('+21%')).toEqual({
      isNumeric: true,
      numericTarget: 21,
      prefix: '+',
      suffix: '%',
    });
  });

  it('parses a plain percentage with no sign', () => {
    expect(parseStatValue('63%')).toEqual({
      isNumeric: true,
      numericTarget: 63,
      prefix: '',
      suffix: '%',
    });
  });

  it('treats non-numeric stats as static, not animatable', () => {
    expect(parseStatValue('Weekly → Monthly')).toEqual({
      isNumeric: false,
      numericTarget: null,
      prefix: '',
      suffix: '',
    });
    expect(parseStatValue('4+ years')).toEqual({
      isNumeric: false,
      numericTarget: null,
      prefix: '',
      suffix: '',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/stats.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/stats'`

- [ ] **Step 3: Implement `src/lib/stats.ts`**

```ts
export interface ParsedStat {
  isNumeric: boolean;
  numericTarget: number | null;
  prefix: string;
  suffix: string;
}

export function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(%?)$/);
  if (!match) {
    return { isNumeric: false, numericTarget: null, prefix: '', suffix: '' };
  }
  const [, sign, number, percent] = match;
  return {
    isNumeric: true,
    numericTarget: Number(number),
    prefix: sign,
    suffix: percent,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/stats.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Create `src/components/StatCallout.astro`**

```astro
---
import { parseStatValue } from '../lib/stats';

interface Props {
  value: string;
  caption: string;
}
const { value, caption } = Astro.props;
const parsed = parseStatValue(value);
---
<div class="stat-callout" data-animatable={parsed.isNumeric} data-target={parsed.numericTarget ?? ''} data-prefix={parsed.prefix} data-suffix={parsed.suffix}>
  <div class="stat-callout__value">{value}</div>
  <div class="stat-callout__caption">{caption}</div>
</div>

<style>
  .stat-callout {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .stat-callout__value {
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--color-accent);
    line-height: 1;
  }
  .stat-callout__caption {
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/stats.ts src/components/StatCallout.astro tests/stats.test.ts
git commit -m "feat: add StatCallout component with numeric-vs-static stat parsing"
```

---

### Task 6: Case study shared components

**Files:**
- Create: `src/components/CaseHeader.astro`
- Create: `src/components/ContextCardGrid.astro`
- Create: `src/components/QuoteTable.astro`
- Create: `src/components/ImpactList.astro`
- Create: `src/components/BeforeAfterSlider.astro`
- Create: `src/scripts/before-after-slider.js`

**Interfaces:**
- Produces: `CaseHeader.astro` (`title`, `subtitle`, `meta: {label, value}[]`, `ndaBadge: boolean`), `ContextCardGrid.astro` (`cards: {title, bullets: string[]}[]`), `QuoteTable.astro` (`rows: {role, whatWentWrong, howItAffected, quote}[]`), `ImpactList.astro` (`items: {label, description}[]`), `BeforeAfterSlider.astro` (`beforeSrc`, `afterSrc`, `beforeLabel`, `afterLabel`). Task 7 composes all five inside the case study page template. `BeforeAfterSlider` is included in the template but not wired to real before/after image pairs in v1 (no case study data currently defines them) — it exists so a case can opt in later by passing the two image props.

- [ ] **Step 1: Create `src/components/CaseHeader.astro`**

```astro
---
interface MetaItem {
  label: string;
  value: string;
}
interface Props {
  title: string;
  subtitle: string;
  meta: MetaItem[];
  ndaBadge: boolean;
}
const { title, subtitle, meta, ndaBadge } = Astro.props;
---
<div class="case-header container">
  <div class="case-header__intro">
    <a href="/#work" class="case-header__back">← Back</a>
    <h1>{title}</h1>
    <p class="case-header__subtitle">{subtitle}</p>
    {ndaBadge && (
      <p class="case-header__nda">Interfaces reproduced for portfolio via NDA</p>
    )}
  </div>
  <dl class="case-header__meta">
    {meta.map((item) => (
      <div class="case-header__meta-row">
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    ))}
  </dl>
</div>

<style>
  .case-header {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: var(--space-4);
    padding-top: var(--space-4);
  }
  .case-header__subtitle {
    color: var(--color-text-muted);
  }
  .case-header__nda {
    display: inline-block;
    background: #4a3418;
    color: #e8b45c;
    padding: var(--space-1) var(--space-2);
    border-radius: 999px;
    font-size: 0.8rem;
  }
  .case-header__meta-row {
    display: flex;
    justify-content: space-between;
    padding: var(--space-1) 0;
    border-bottom: 1px solid var(--color-surface-alt);
  }
  .case-header__meta-row dt {
    color: var(--color-text-muted);
  }
  @media (max-width: 720px) {
    .case-header {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/ContextCardGrid.astro`**

```astro
---
interface Card {
  title: string;
  bullets: string[];
}
interface Props {
  cards: Card[];
}
const { cards } = Astro.props;
---
<div class="context-grid container">
  {cards.map((card) => (
    <div class="context-grid__card">
      <h3>{card.title}</h3>
      <ul>
        {card.bullets.map((bullet) => <li>{bullet}</li>)}
      </ul>
    </div>
  ))}
</div>

<style>
  .context-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-3);
    margin: var(--space-4) 0;
  }
  .context-grid__card {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .context-grid__card ul {
    padding-left: 1.1rem;
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 3: Create `src/components/QuoteTable.astro`**

```astro
---
interface Row {
  role: string;
  whatWentWrong: string;
  howItAffected: string;
  quote: string;
}
interface Props {
  rows: Row[];
}
const { rows } = Astro.props;
---
{rows.length > 0 && (
  <div class="quote-table container">
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>What went wrong</th>
          <th>How it affected the product</th>
          <th>Quote</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            <td>{row.role}</td>
            <td>{row.whatWentWrong}</td>
            <td>{row.howItAffected}</td>
            <td><em>"{row.quote}"</em></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<style>
  .quote-table {
    margin: var(--space-4) 0;
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  th, td {
    text-align: left;
    padding: var(--space-2);
    border-bottom: 1px solid var(--color-surface-alt);
    vertical-align: top;
  }
  th {
    color: var(--color-text-muted);
    font-weight: 600;
  }
</style>
```

- [ ] **Step 4: Create `src/components/ImpactList.astro`**

```astro
---
interface Item {
  label: string;
  description: string;
}
interface Props {
  items: Item[];
  heading?: string;
}
const { items, heading = 'Product Impact' } = Astro.props;
---
<div class="impact-list container">
  <h3>{heading}</h3>
  <ul>
    {items.map((item) => (
      <li>
        <span class="impact-list__dot" aria-hidden="true"></span>
        <div>
          <strong>{item.label}.</strong> {item.description}
        </div>
      </li>
    ))}
  </ul>
</div>

<style>
  .impact-list {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
    margin: var(--space-4) 0;
  }
  .impact-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .impact-list li {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-1) 0;
  }
  .impact-list__dot {
    flex: none;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--color-accent);
  }
</style>
```

- [ ] **Step 5: Create `src/scripts/before-after-slider.js`**

```js
export function initBeforeAfterSliders() {
  document.querySelectorAll('[data-before-after]').forEach((el) => {
    const handle = el.querySelector('[data-handle]');
    const afterLayer = el.querySelector('[data-after-layer]');
    if (!handle || !afterLayer) return;

    const setPosition = (clientX) => {
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      afterLayer.style.clipPath = `inset(0 ${100 - ratio * 100}% 0 0)`;
      handle.style.left = `${ratio * 100}%`;
    };

    let dragging = false;
    handle.addEventListener('pointerdown', () => (dragging = true));
    window.addEventListener('pointerup', () => (dragging = false));
    window.addEventListener('pointermove', (event) => {
      if (dragging) setPosition(event.clientX);
    });
    handle.addEventListener('touchstart', () => (dragging = true), { passive: true });
    window.addEventListener('touchend', () => (dragging = false));
    window.addEventListener(
      'touchmove',
      (event) => {
        if (dragging && event.touches[0]) setPosition(event.touches[0].clientX);
      },
      { passive: true },
    );
  });
}
```

- [ ] **Step 6: Create `src/components/BeforeAfterSlider.astro`**

```astro
---
interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}
const { beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After' } = Astro.props;
---
<div class="before-after container" data-before-after>
  <img src={beforeSrc} alt={beforeLabel} />
  <div class="before-after__after" data-after-layer>
    <img src={afterSrc} alt={afterLabel} />
  </div>
  <div class="before-after__handle" data-handle></div>
  <span class="before-after__label before-after__label--before">{beforeLabel}</span>
  <span class="before-after__label before-after__label--after">{afterLabel}</span>
</div>

<style>
  .before-after {
    position: relative;
    margin: var(--space-4) 0;
    border-radius: var(--radius);
    overflow: hidden;
  }
  .before-after__after {
    position: absolute;
    inset: 0;
    clip-path: inset(0 50% 0 0);
  }
  .before-after__handle {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: white;
    cursor: ew-resize;
    touch-action: none;
  }
  .before-after__label {
    position: absolute;
    bottom: var(--space-2);
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  .before-after__label--before {
    left: var(--space-2);
  }
  .before-after__label--after {
    right: var(--space-2);
  }
</style>
```

- [ ] **Step 7: Build to confirm no errors**

Run: `npm run build`
Expected: build succeeds (these components aren't referenced by any page yet, so this just checks for syntax errors — Astro will not fail on unused files).

- [ ] **Step 8: Commit**

```bash
git add src/components/CaseHeader.astro src/components/ContextCardGrid.astro src/components/QuoteTable.astro src/components/ImpactList.astro src/components/BeforeAfterSlider.astro src/scripts/before-after-slider.js
git commit -m "feat: add shared case study presentation components"
```

---

### Task 7: Case study dynamic route

**Files:**
- Create: `src/pages/case/[slug].astro`
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: `getCollection('case-studies')` from `astro:content`, and the components from Task 6 plus `StatCallout` from Task 5.
- Produces: one built page per case study at `/case/<slug>/`, where `<slug>` is the content filename without extension (e.g. `/case/vpn-premium/`).

- [ ] **Step 1: Create `src/pages/case/[slug].astro`**

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import CaseHeader from '../../components/CaseHeader.astro';
import StatCallout from '../../components/StatCallout.astro';
import ContextCardGrid from '../../components/ContextCardGrid.astro';
import QuoteTable from '../../components/QuoteTable.astro';
import ImpactList from '../../components/ImpactList.astro';

export async function getStaticPaths() {
  const cases = await getCollection('case-studies');
  return cases.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'case-studies'>;
}
const { entry } = Astro.props;
const { title, subtitle, meta, ndaBadge, heroImage, statValue, statCaption, contextCards, quoteTable, impactList } =
  entry.data;
---
<BaseLayout title={`${title} — Iryna Belkova`}>
  <Header />
  <CaseHeader title={title} subtitle={subtitle} meta={meta} ndaBadge={ndaBadge} />
  <div class="container">
    <img src={heroImage} alt={title} class="case-hero-image" />
  </div>
  <div class="container">
    <StatCallout value={statValue} caption={statCaption} />
  </div>
  <ContextCardGrid cards={contextCards} />
  <QuoteTable rows={quoteTable} />
  <ImpactList items={impactList} />
  <Footer />
</BaseLayout>

<style>
  .case-hero-image {
    border-radius: var(--radius);
    margin: var(--space-3) 0;
  }
</style>
```

- [ ] **Step 2: Add build-output assertions for the case study pages**

Append to `tests/build-output.test.ts`:

```ts
describe('case study pages', () => {
  const slugs = ['vpn-premium', 'vpn-typography', 'freelancehunt', 'resonance', 'leaf'];

  it('builds a page for every case study slug', () => {
    for (const slug of slugs) {
      const html = readFileSync(`dist/case/${slug}/index.html`, 'utf-8');
      expect(html.length).toBeGreaterThan(0);
    }
  });

  it('the VPN premium page shows the verified conversion stat', () => {
    const html = readFileSync('dist/case/vpn-premium/index.html', 'utf-8');
    expect(html).toContain('+21%');
    expect(html).toContain('0.28% → 0.34%');
  });

  it('both VPN pages show the NDA disclosure', () => {
    const premium = readFileSync('dist/case/vpn-premium/index.html', 'utf-8');
    const typography = readFileSync('dist/case/vpn-typography/index.html', 'utf-8');
    expect(premium).toContain('Interfaces reproduced for portfolio via NDA');
    expect(typography).toContain('Interfaces reproduced for portfolio via NDA');
  });

  it('non-VPN pages do not show the NDA disclosure', () => {
    const resonance = readFileSync('dist/case/resonance/index.html', 'utf-8');
    expect(resonance).not.toContain('Interfaces reproduced for portfolio via NDA');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run build && npx vitest run tests/build-output.test.ts`
Expected: FAIL on the new `describe('case study pages')` block if `[slug].astro` wasn't picked up correctly, or PASS if Step 1 is already correct — if it passes immediately, deliberately rename one prop in the component, rebuild, confirm the corresponding assertion fails, then revert the rename before continuing (this proves the test actually exercises the code).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && npx vitest run tests/build-output.test.ts`
Expected: PASS (all tests, including the 4 new ones)

- [ ] **Step 5: Commit**

```bash
git add src/pages/case/[slug].astro tests/build-output.test.ts
git commit -m "feat: render all 5 case studies through a shared dynamic route"
```

---

### Task 8: Home page — Hero, About, case grid with tags, preview strip

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/AboutSection.astro`
- Create: `src/components/CaseCard.astro`
- Create: `src/components/PreviewStrip.astro`
- Modify: `src/pages/index.astro`
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: `getCollection('case-studies')`, sorted by `entry.data.order`.
- Produces: the final home page replacing the Task 1 placeholder.

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
<section class="hero container">
  <h1>
    Product designer shipping across the full range — from data-heavy enterprise platforms to
    consumer mobile apps, with hands-on 3D craft and active AI-tool experimentation.
  </h1>
</section>

<style>
  .hero {
    padding: var(--space-5) 0 var(--space-4);
  }
  .hero h1 {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    max-width: 900px;
    line-height: 1.2;
  }
</style>
```

- [ ] **Step 2: Create `src/components/AboutSection.astro`**

```astro
<section class="about container">
  <h2>About</h2>
  <p>
    Product Designer with 5+ years across B2C and B2B products. I look for the problems that
    would otherwise turn into incidents — catching them early, on live products, without
    stopping the team to do it.
  </p>
</section>

<style>
  .about {
    padding: var(--space-4) 0;
    max-width: 720px;
  }
  .about p {
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 3: Create `src/components/CaseCard.astro`**

```astro
---
interface Props {
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  heroImage: string;
}
const { slug, title, subtitle, tag, heroImage } = Astro.props;
---
<a href={`/case/${slug}/`} class="case-card">
  <img src={heroImage} alt={title} />
  <span class="case-card__tag">{tag}</span>
  <h3>{title}</h3>
  <p>{subtitle}</p>
</a>

<style>
  .case-card {
    display: block;
    text-decoration: none;
    color: var(--color-text);
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
    transition: transform 0.2s ease;
  }
  .case-card:hover {
    transform: translateY(-4px);
  }
  .case-card img {
    border-radius: var(--radius);
    margin-bottom: var(--space-2);
  }
  .case-card__tag {
    display: inline-block;
    font-size: 0.75rem;
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
    border-radius: 999px;
    padding: 2px 10px;
    margin-bottom: var(--space-1);
  }
  .case-card p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
</style>
```

- [ ] **Step 4: Create `src/components/PreviewStrip.astro`**

```astro
<section class="preview-strip container">
  <a href="/experiments" class="preview-strip__card">
    <h3>Experiments</h3>
    <p>3D illustration work, outside the case studies.</p>
  </a>
  <a href="/writing" class="preview-strip__card">
    <h3>Writing</h3>
    <p>Notes on troubleshooting design problems and testing new AI-native tools.</p>
  </a>
</section>

<style>
  .preview-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    padding: var(--space-4) 0;
  }
  .preview-strip__card {
    display: block;
    text-decoration: none;
    color: var(--color-text);
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .preview-strip__card p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
  @media (max-width: 640px) {
    .preview-strip {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 5: Replace `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/Hero.astro';
import AboutSection from '../components/AboutSection.astro';
import CaseCard from '../components/CaseCard.astro';
import PreviewStrip from '../components/PreviewStrip.astro';

const cases = (await getCollection('case-studies')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Iryna Belkova — Product Designer">
  <Header />
  <Hero />
  <AboutSection />
  <section id="work" class="container case-grid">
    {cases.map((entry) => (
      <CaseCard
        slug={entry.slug}
        title={entry.data.title}
        subtitle={entry.data.subtitle}
        tag={entry.data.tag}
        heroImage={entry.data.heroImage}
      />
    ))}
  </section>
  <PreviewStrip />
  <Footer />
</BaseLayout>

<style>
  .case-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-3);
    padding: var(--space-4) 0;
  }
</style>
```

- [ ] **Step 6: Add build-output assertions for the home page**

Append to `tests/build-output.test.ts`:

```ts
describe('home page', () => {
  it('does not contain the old generic hero copy', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).not.toContain('crafting innovative product designs');
  });

  it('lists all 5 case study tags', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    for (const tag of [
      'Consumer / Growth',
      'Accessibility / Infrastructure',
      'Marketplace',
      'Enterprise / Data-heavy',
      'Consumer Mobile / 0→1',
    ]) {
      expect(html).toContain(tag);
    }
  });

  it('links to both Experiments and Writing from the preview strip', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).toContain('href="/experiments"');
    expect(html).toContain('href="/writing"');
  });
});
```

- [ ] **Step 7: Run test to verify it fails, then passes**

Run: `npm run build && npx vitest run tests/build-output.test.ts`
Expected: if any assertion fails, fix the corresponding component/page and rebuild; final expected result is PASS (all tests).

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero.astro src/components/AboutSection.astro src/components/CaseCard.astro src/components/PreviewStrip.astro src/pages/index.astro tests/build-output.test.ts
git commit -m "feat: build home page with rewritten hero, tagged case grid, and preview strip"
```

---

### Task 9: Experiments page

**Files:**
- Create: `src/content/experiments/leaf-illustrations.md`
- Create: `src/content/experiments/experiment-2.md`
- Create: `src/content/experiments/experiment-3.md`
- Create: `src/pages/experiments/index.astro`
- Modify: `scripts/generate-placeholder-images.mjs`
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: `getCollection('experiments')`.
- Produces: `/experiments/` page rendering a simple image grid.

- [ ] **Step 1: Add experiment placeholder images to the generator script**

In `scripts/generate-placeholder-images.mjs`, extend the `targets` array:

```js
const targets = [
  ['public/images/case-vpn-premium/hero.svg', 'VPN Premium'],
  ['public/images/case-vpn-typography/hero.svg', 'VPN Typography'],
  ['public/images/case-freelancehunt/hero.svg', 'Freelancehunt'],
  ['public/images/case-resonance/hero.svg', 'Resonance'],
  ['public/images/case-leaf/hero.svg', 'LEAF'],
  ['public/images/experiments/leaf-illustrations.svg', 'LEAF 3D Illustrations'],
  ['public/images/experiments/experiment-2.svg', 'Experiment 2'],
  ['public/images/experiments/experiment-3.svg', 'Experiment 3'],
];
```

- [ ] **Step 2: Create the 3 experiment content files**

`src/content/experiments/leaf-illustrations.md`:

```markdown
---
title: "LEAF — 3D Illustrations"
image: "/images/experiments/leaf-illustrations.svg"
order: 1
---

130+ original 3D illustrations created in Cinema 4D for the LEAF app.
```

`src/content/experiments/experiment-2.md`:

```markdown
---
title: "Experiment 2"
image: "/images/experiments/experiment-2.svg"
order: 2
---

Replace with a real 3D piece before launch.
```

`src/content/experiments/experiment-3.md`:

```markdown
---
title: "Experiment 3"
image: "/images/experiments/experiment-3.svg"
order: 3
---

Replace with a real 3D piece before launch.
```

- [ ] **Step 3: Create `src/pages/experiments/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

const items = (await getCollection('experiments')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Experiments — Iryna Belkova">
  <Header />
  <section class="container">
    <h1>Experiments</h1>
    <div class="experiments-grid">
      {items.map((item) => (
        <figure>
          <img src={item.data.image} alt={item.data.title} />
          <figcaption>{item.data.title}</figcaption>
        </figure>
      ))}
    </div>
  </section>
  <Footer />
</BaseLayout>

<style>
  .experiments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-3);
    margin: var(--space-3) 0;
  }
  .experiments-grid figure {
    margin: 0;
  }
  .experiments-grid img {
    border-radius: var(--radius);
  }
  .experiments-grid figcaption {
    color: var(--color-text-muted);
    font-size: 0.85rem;
    margin-top: var(--space-1);
  }
</style>
```

- [ ] **Step 4: Add build-output assertions**

Append to `tests/build-output.test.ts`:

```ts
describe('experiments page', () => {
  it('builds and lists at least the LEAF illustrations entry', () => {
    const html = readFileSync('dist/experiments/index.html', 'utf-8');
    expect(html).toContain('LEAF — 3D Illustrations');
  });
});
```

- [ ] **Step 5: Regenerate placeholders, build, and run tests**

Run: `node scripts/generate-placeholder-images.mjs && npm run build && npx vitest run tests/build-output.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Commit**

```bash
git add src/content/experiments src/pages/experiments scripts/generate-placeholder-images.mjs tests/build-output.test.ts public/images/experiments
git commit -m "feat: add Experiments page with 3D illustration gallery"
```

---

### Task 10: Writing page + no-reach-numbers guardrail

**Files:**
- Create: `src/content/posts/figma-make.md`
- Create: `src/content/posts/figma-sites.md`
- Create: `src/content/posts/figma-buzz.md`
- Create: `src/content/posts/figma-motion.md`
- Create: `src/content/posts/figma-draw.md`
- Create: `src/pages/writing/index.astro`
- Modify: `scripts/generate-placeholder-images.mjs`
- Test: `tests/content-schema.test.ts` (extended)
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: `getCollection('posts')`.
- Produces: `/writing/` page listing post teaser cards linking out to LinkedIn.

- [ ] **Step 1: Add post placeholder images to the generator script**

Extend `targets` in `scripts/generate-placeholder-images.mjs`:

```js
  ['public/images/posts/figma-make.svg', 'Figma Make'],
  ['public/images/posts/figma-sites.svg', 'Figma Sites'],
  ['public/images/posts/figma-buzz.svg', 'Figma Buzz'],
  ['public/images/posts/figma-motion.svg', 'Figma Motion'],
  ['public/images/posts/figma-draw.svg', 'Figma Draw'],
```

- [ ] **Step 2: Create the 5 post content files**

`src/content/posts/figma-make.md`:

```markdown
---
title: "Day 1: Figma Make — how far can AI push before I design by hand?"
excerpt: "Pushed a multi-step B2B workflow through 9 prompts and 9 iterations with zero manual edits. The blank-canvas problem is solved — but alignment, contrast, and edge cases still needed a human reviewing every version."
linkedinUrl: "https://www.linkedin.com/in/iryna-belkova-1368981a0/"
image: "/images/posts/figma-make.svg"
order: 1
---
```

`src/content/posts/figma-sites.md`:

```markdown
---
title: "Day 2: Figma Sites — can I publish without leaving Figma?"
excerpt: "Built and published a responsive multi-page marketing site with AI-generated Code Components, entirely inside Figma. Publishing was the easy part; getting the responsive layouts and animated components right took most of the time."
linkedinUrl: "https://www.linkedin.com/in/iryna-belkova-1368981a0/"
image: "/images/posts/figma-sites.svg"
order: 2
---
```

`src/content/posts/figma-buzz.md`:

```markdown
---
title: "Day 3: Figma Buzz — can one design become four social posts?"
excerpt: "Bulk Edit turned one campaign template into four social formats by editing a single value, like a spreadsheet instead of a poster. Still had to fix layouts and typography by hand after resizing."
linkedinUrl: "https://www.linkedin.com/in/iryna-belkova-1368981a0/"
image: "/images/posts/figma-buzz.svg"
order: 3
---
```

`src/content/posts/figma-motion.md`:

```markdown
---
title: "Day 4: Figma Motion — can AI animate a real product UI?"
excerpt: "Animated dashboard cards, a hero section, and UI components three different ways, including prompt-only iteration. Motion understood plain-language feedback like \"make it snappier\" surprisingly well, and exports directly to React motion code."
linkedinUrl: "https://www.linkedin.com/in/iryna-belkova-1368981a0/"
image: "/images/posts/figma-motion.svg"
order: 4
---
```

`src/content/posts/figma-draw.md`:

```markdown
---
title: "Day 5: Figma Draw — one illustration, one poster, zero Illustrator"
excerpt: "Made a poster and a custom illustration for a fictional product without leaving Figma. It's not trying to replace Illustrator — it solves a different problem: staying in the same file as the product and the design system."
linkedinUrl: "https://www.linkedin.com/in/iryna-belkova-1368981a0/"
image: "/images/posts/figma-draw.svg"
order: 5
---
```

- [ ] **Step 3: Create `src/pages/writing/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

const posts = (await getCollection('posts')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Writing — Iryna Belkova">
  <Header />
  <section class="container">
    <h1>Writing</h1>
    <p class="writing-intro">Notes on testing new tools and troubleshooting design problems.</p>
    <div class="writing-grid">
      {posts.map((post) => (
        <a class="writing-card" href={post.data.linkedinUrl} target="_blank" rel="noopener noreferrer">
          <img src={post.data.image} alt={post.data.title} />
          <h3>{post.data.title}</h3>
          <p>{post.data.excerpt}</p>
          <span class="writing-card__cta">Read on LinkedIn →</span>
        </a>
      ))}
    </div>
  </section>
  <Footer />
</BaseLayout>

<style>
  .writing-intro {
    color: var(--color-text-muted);
    max-width: 600px;
  }
  .writing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-3);
    margin: var(--space-3) 0;
  }
  .writing-card {
    display: block;
    text-decoration: none;
    color: var(--color-text);
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .writing-card img {
    border-radius: var(--radius);
    margin-bottom: var(--space-2);
  }
  .writing-card p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
  .writing-card__cta {
    font-size: 0.85rem;
    color: var(--color-accent);
  }
</style>
```

- [ ] **Step 4: Write the failing guardrail test**

Append to `tests/content-schema.test.ts`:

```ts
describe('writing section content', () => {
  const POSTS_DIR = 'src/content/posts';
  const bannedPattern = /impressions|reach|[0-9]+\s*views?/i;

  it('has at least 5 posts', () => {
    const files = readdirSync(POSTS_DIR);
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it('never mentions impressions, reach, or view counts in any post', () => {
    const files = readdirSync(POSTS_DIR);
    for (const file of files) {
      const raw = readFileSync(`${POSTS_DIR}/${file}`, 'utf-8');
      expect(raw, `${file} should not mention reach/impressions/views`).not.toMatch(bannedPattern);
    }
  });

  it('every post links out to LinkedIn rather than hosting the full text', () => {
    const files = readdirSync(POSTS_DIR);
    for (const file of files) {
      const { data } = matter(readFileSync(`${POSTS_DIR}/${file}`, 'utf-8'));
      expect(data.linkedinUrl, `${file}: linkedinUrl`).toMatch(/^https:\/\/www\.linkedin\.com\//);
    }
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: FAIL if posts aren't created yet — confirm the failure is `ENOENT` or an empty-files assertion before Step 2 is done; once Step 2 is done, this becomes the pass check.

- [ ] **Step 6: Regenerate placeholders, build, run all tests**

Run: `node scripts/generate-placeholder-images.mjs && npm run build && npx vitest run`
Expected: PASS (all test files)

- [ ] **Step 7: Commit**

```bash
git add src/content/posts src/pages/writing scripts/generate-placeholder-images.mjs tests/content-schema.test.ts public/images/posts
git commit -m "feat: add Writing section with 5 posts and a no-reach-numbers guardrail test"
```

---

### Task 11: GSAP animation island with reduced-motion gate

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/scripts/animations.js`
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/motion.test.ts`

**Interfaces:**
- Produces: `prefersReducedMotion(mediaQueryList: { matches: boolean }): boolean` — a pure function taking anything shaped like the result of `window.matchMedia(...)`, so it's testable without a real browser.
- Consumes: `parseStatValue` from Task 5 (to decide which `StatCallout` elements get a count-up animation) and `initBeforeAfterSliders` from Task 6.

- [ ] **Step 1: Write the failing test**

Create `tests/motion.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { prefersReducedMotion } from '../src/lib/motion';

describe('prefersReducedMotion', () => {
  it('returns true when the media query matches', () => {
    expect(prefersReducedMotion({ matches: true })).toBe(true);
  });

  it('returns false when the media query does not match', () => {
    expect(prefersReducedMotion({ matches: false })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/motion.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/motion'`

- [ ] **Step 3: Implement `src/lib/motion.ts`**

```ts
export function prefersReducedMotion(mediaQueryList: { matches: boolean }): boolean {
  return mediaQueryList.matches;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/motion.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Create `src/scripts/animations.js`**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initBeforeAfterSliders } from './before-after-slider.js';

gsap.registerPlugin(ScrollTrigger);

function reducedMotionRequested() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealSections() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });
}

function animateStatCounters() {
  document.querySelectorAll('[data-animatable="true"]').forEach((el) => {
    const target = Number(el.dataset.target);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const valueEl = el.querySelector('.stat-callout__value');
    if (!valueEl || Number.isNaN(target)) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.2,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      onUpdate: () => {
        valueEl.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });
  });
}

export function initAnimations() {
  if (reducedMotionRequested()) {
    return;
  }
  revealSections();
  animateStatCounters();
  initBeforeAfterSliders();
}
```

Note: content sections that should reveal on scroll (`Hero`, `AboutSection`, `.case-grid`, `PreviewStrip`, and each case-study block) need a `data-reveal` attribute added to their outer wrapper. This is a small follow-up edit to the templates from Tasks 6 and 8 — add `data-reveal` to: `.hero` in `Hero.astro`, `.about` in `AboutSection.astro`, `.case-grid` in `index.astro`, `.preview-strip` in `PreviewStrip.astro`, and `.context-grid`, `.quote-table`, `.impact-list` in their respective components. Since `prefers-reduced-motion` is checked before any of this runs, content is never hidden by default — `gsap.from` only applies its starting state at animation time, not via CSS, so a JS failure or slow script load never leaves content invisible.

- [ ] **Step 6: Add `data-reveal` attributes**

In `src/components/Hero.astro`, change `<section class="hero container">` to `<section class="hero container" data-reveal>`. Repeat the same pattern (add `data-reveal` to the outermost element) in `AboutSection.astro`, `PreviewStrip.astro`, `ContextCardGrid.astro`, `QuoteTable.astro`, `ImpactList.astro`, and the `.case-grid` section in `src/pages/index.astro`.

- [ ] **Step 7: Wire the animation script into `BaseLayout.astro`**

```astro
---
import '../styles/global.css';
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    <script>
      import { initAnimations } from '../scripts/animations.js';
      document.addEventListener('DOMContentLoaded', initAnimations);
    </script>
  </body>
</html>
```

- [ ] **Step 8: Build and confirm no runtime errors**

Run: `npm run build && npm run preview`
Then manually open the preview URL in the Browser pane (see Task 13 for the full manual QA pass) — this step just needs to confirm the build doesn't throw; full visual verification happens in Task 13.

- [ ] **Step 9: Commit**

```bash
git add src/lib/motion.ts src/scripts/animations.js src/layouts/BaseLayout.astro src/components/Hero.astro src/components/AboutSection.astro src/components/PreviewStrip.astro src/components/ContextCardGrid.astro src/components/QuoteTable.astro src/components/ImpactList.astro src/pages/index.astro tests/motion.test.ts
git commit -m "feat: add GSAP scroll-reveal and stat-counter animations behind a reduced-motion gate"
```

---

### Task 12: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Page not found — Iryna Belkova">
  <Header />
  <section class="container not-found">
    <h1>Page not found</h1>
    <p><a href="/">Back to home</a></p>
  </section>
  <Footer />
</BaseLayout>

<style>
  .not-found {
    padding: var(--space-5) 0;
    text-align: center;
  }
</style>
```

- [ ] **Step 2: Build and confirm the file is emitted**

Run: `npm run build && test -f dist/404.html && echo "404 page built"`
Expected: `404 page built`

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

### Task 13: Deploy to Vercel + manual QA pass

**Files:**
- Create: `vercel.json`

**Interfaces:**
- None (deployment/QA task, no new code interfaces).

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

- [ ] **Step 2: Replace placeholder contact links**

In `src/components/Footer.astro`, replace the placeholder Dribbble and Telegram `href` values with Iryna's real profile URLs (get these from her directly — do not guess or leave the placeholder `https://dribbble.com/` and `https://t.me/` in the production build).

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 4: Deploy on Vercel**

Connect the `ibelk/iryna-portfolio` GitHub repo in the Vercel dashboard (or via `vercel` CLI if installed), accept the default Astro build settings, and deploy. Note the resulting `*.vercel.app` URL.

- [ ] **Step 5: Update `astro.config.mjs` with the real deployed URL**

Replace the placeholder `site: 'https://iryna-portfolio.vercel.app'` with whatever URL Vercel actually assigned, commit, and push again (triggers a redeploy).

- [ ] **Step 6: Verify unlisted access in production**

Run (replace the URL with the real one):

```bash
curl -s https://<real-deployed-url>/robots.txt
curl -s https://<real-deployed-url>/ | grep -o 'noindex, nofollow'
```

Expected: `Disallow: /` and `noindex, nofollow` both present in the live output.

- [ ] **Step 7: Manual browser QA pass**

Using the Browser preview tool:
1. Open the deployed URL.
2. Resize to mobile (375×812), tablet (768×1024), and desktop (1280×800) presets; confirm the case grid, writing grid, and experiments grid reflow without horizontal scroll.
3. Toggle the OS-level reduced-motion setting (or use the browser's emulation for `prefers-reduced-motion: reduce`) and confirm scroll-reveal and counter animations are skipped, while all text and images remain immediately visible.
4. Click through: home → each of the 5 case study cards → back link → Experiments → Writing (each writing card opens LinkedIn in a new tab) → footer links.
5. Confirm the VPN Premium page shows "+21%" prominently with the "0.28% → 0.34%" caption beneath it, and both VPN pages show the NDA badge.
6. Take a screenshot of the home page and the VPN Typography case page as visual confirmation.

- [ ] **Step 8: Commit the final config**

```bash
git add vercel.json astro.config.mjs src/components/Footer.astro
git commit -m "chore: add Vercel deploy config and finalize production URL"
git push origin main
```

---

## Self-Review

**Spec coverage:**
- Unlisted access (noindex + robots disallow) → Task 1, verified in Task 13. ✓
- 5 case studies with exact stats and NDA badges → Tasks 4, 7. ✓
- Hero/positioning rewrite, no generic craft language → Task 8. ✓
- Category tags for range/diapazon → Tasks 4, 8. ✓
- Experiments section (3D gallery) → Task 9. ✓
- Writing section (5–6 posts, no reach numbers, links out to LinkedIn) → Task 10. ✓
- Astro + GSAP, static output, Vercel hosting → Tasks 1, 11, 13. ✓
- Reduced-motion respected, no animation gating content → Task 11. ✓
- English-only v1, UA deferred → no UA content anywhere in this plan; confirmed by omission. ✓
- VPN Premium stat frozen at "+21%" / "0.28% → 0.34%", never extended → enforced by the Task 4 and Task 7 tests. ✓
- 404 page → Task 12. ✓

**Placeholder scan:** The only literal "placeholder" nouns in this plan refer to genuinely pending external inputs (Dribbble/Telegram URLs, 2 of the 3 Experiments images, redrawn VPN mockup art) — each is called out explicitly with what needs to replace it and where, not left vague. No TODO/TBD in any code or step.

**Type consistency:** `parseStatValue` (Task 5) is consumed by the `data-animatable`/`data-target`/`data-prefix`/`data-suffix` attributes read in Task 11's `animateStatCounters` — field names match. `getCollection('case-studies')` entry shape (Task 4 schema) matches the destructured fields used in Task 7 and Task 8. `initBeforeAfterSliders` (Task 6) is imported by name in Task 11's `animations.js` — matches.

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-21-portfolio-site-v1.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
