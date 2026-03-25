import { defineCollection, z } from "astro:content";

const sectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    label: z.string().optional(),
    headline: z.string().optional(),
    story: z.array(z.string()).optional(),
    story_highlight: z.string().optional(),
    box_label: z.string().optional(),
    box_text: z.string().optional(),
    facts: z.array(z.string()).optional(),
    click_label: z.string().optional(),
    hover_label: z.string().optional(),
    cards: z.array(z.object({
      id: z.number(),
      frontTitle: z.string(),
      frontText: z.string(),
      backTitle: z.string(),
      backText: z.string(),
    })).optional(),
    mobile_click_label: z.string().optional(),
    // About Section
    job_title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    story_1: z.array(z.string()).optional(),
    quote: z.string().optional(),
    list_label: z.string().optional(),
    list_items: z.array(z.string()).optional(),
    story_2: z.array(z.string()).optional(),
    badges: z.array(z.object({
      label: z.string(),
      sub: z.string(),
    })).optional(),
    cta_primary: z.string().optional(),
    cta_secondary: z.string().optional(),
    cta_tertiary: z.string().optional(),
  }),
});

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    announcement: z.string().optional(),
    siteName: z.string().optional(),
  }),
});

const showroomsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    badge_region: z.string(),
    badge_status: z.string(),
    description: z.string(),
    address: z.string(),
    contact_name: z.string(),
    contact_role: z.string(),
    contact_image: z.string().optional(),
    contact_email: z.string().optional(),
    contact_phone: z.string().optional(),
    contact_url: z.string().optional(),
  }),
});


export const collections = {
  sections: sectionsCollection,
  settings: settingsCollection,
  showrooms: showroomsCollection,
};
