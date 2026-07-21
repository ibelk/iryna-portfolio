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
