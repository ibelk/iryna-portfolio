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
    // When true the detail page lists the posts collection instead of `entries`,
    // so the Figma-tool write-ups live in exactly one place.
    listsPosts: z.boolean().default(false),
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
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  experiments,
  posts,
};
