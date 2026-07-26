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
    tags: z.array(z.string()).default([]),
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

const experimentEntry = z.object({
  title: z.string(),
  description: z.string(),
  // Optional outbound link — used where the entry was published somewhere else.
  href: z.string().url().optional(),
});

const galleryItem = z.object({
  src: z.string(),
  alt: z.string(),
  // Some pieces are mounted on a coloured card in the design rather than
  // bleeding to the page background.
  background: z.string().optional(),
  // `tall` pieces get a full-width row of their own.
  tall: z.boolean().default(false),
});

const experiments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    order: z.number(),
    // Detail-page fields. `status: wip` renders a badge and keeps the card
    // visible without pretending the work is finished.
    subtitle: z.string(),
    intro: z.string(),
    status: z.enum(['live', 'wip']).default('live'),
    meta: z.array(metaItem).default([]),
    entries: z.array(experimentEntry).default([]),
    gallery: z.array(galleryItem).default([]),
    // When true the detail page lists the posts collection instead of `entries`,
    // so the Figma-tool write-ups live in exactly one place.
    listsPosts: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Optional: the cards show title and tags only, so a post can go live from
    // its Figma design before its summary has been written.
    excerpt: z.string().optional(),
    linkedinUrl: z.string().url(),
    image: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
  }),
});

const articleTextBlock = z.object({
  type: z.literal('text'),
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
});

const articleImageBlock = z.object({
  type: z.literal('image'),
  src: z.string(),
  alt: z.string(),
});

const articleGalleryBlock = z.object({
  type: z.literal('gallery'),
  images: z.array(z.object({ src: z.string(), alt: z.string() })),
});

// A segmented progress bar over a row of step labels — the "Development
// Process" pattern reused inside an article body (e.g. a workflow loop).
const articleProgressBlock = z.object({
  type: z.literal('progress'),
  steps: z.array(z.string()),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    // Breadcrumb + the writing card that links here from the experiment page.
    parentLabel: z.string(),
    parentHref: z.string(),
    cardImage: z.string(),
    // Figma sometimes reuses one write-up's card across more than one
    // experiment's writing-cards row (e.g. the Figma Site article also shows
    // up on the Claude Code page) — list those experiment slugs here.
    crossListedIn: z.array(z.string()).default([]),
    intro: z.array(z.string()),
    blocks: z.array(
      z.discriminatedUnion('type', [
        articleTextBlock,
        articleImageBlock,
        articleGalleryBlock,
        articleProgressBlock,
      ]),
    ),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  experiments,
  posts,
  articles,
};
