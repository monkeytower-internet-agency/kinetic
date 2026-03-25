import { defineCollection, z } from "astro:content";

const sectionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string().optional(),
    type: z.string().optional(),
    title: z.string().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    content: z.string().optional(),
    button_text: z.string().optional(),
    button_link: z.string().optional(),
    items: z.array(z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string().optional(),
    })).optional(),
    fit_grid: z.object({
      rows: z.string(),
      cols: z.string(),
      result: z.string(),
    }).optional(),
    image: z.string().optional(),
    thumbnail: z.string().optional(),
    media_items: z.array(z.object({
      label: z.string().optional(),
      video_url: z.string().optional(),
      thumbnail: z.string().optional(),
    })).optional(),

    // Legacy fields
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
