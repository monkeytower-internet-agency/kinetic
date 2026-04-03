import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: {
          owner: 'monkeytower-internet-agency',
          name: 'kinetic',
        },
      }
    : {
        kind: 'local',
      },
  singletons: {
    settings: singleton({
      label: 'Global Settings',
      path: 'src/content/settings/',
      schema: {
        announcement: fields.text({ 
          label: 'Top Announcement',
          description: 'Visible at the very top of all pages (empty = hidden)'
        }),
        siteName: fields.text({ label: 'Site Name', defaultValue: 'KINETIC' }),
      },
    }),
  },
  collections: {
    sections: collection({
      label: 'Landing Page Sections (German)',
      slugField: 'slug',
      path: 'src/content/sections/de/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Display Title (Public)', description: 'The title shown on the website buttons or section headers' }),
        slug: fields.text({ label: 'System Identifier (Slug)', description: 'CRITICAL: DO NOT change. Used as ID in code (e.g. "hero", "faq").' }),


        type: fields.select({
          label: 'Section Type',
          options: [
            { label: 'Hero', value: 'hero' },
            { label: 'Text/Intro', value: 'text' },
            { label: 'Client Story (Quote)', value: 'story' },
            { label: 'Feature (Image + Text)', value: 'features' },
            { label: 'Technical Grid (Facts)', value: 'grid' },
            { label: 'Media (Clips)', value: 'media' },
            { label: 'FAQ', value: 'faq' },
            { label: 'CTA / Footer', value: 'cta' },

          ],
          defaultValue: 'text',
        }),
        heading: fields.text({ label: 'Main Heading', multiline: true }),

        subheading: fields.text({ label: 'Subheading / Tagline', multiline: true }),
        content: fields.text({ label: 'Main Content / Description', multiline: true }),

        // For CTA
        button_text: fields.text({ label: 'Main CTA Button Text' }),
        button_link: fields.text({ label: 'Main CTA Button Link' }),
        
        // For Feature / Intro
        image: fields.image({
          label: 'Feature Image',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),

        // For Media Clips
        media_items: fields.array(
          fields.object({
            label: fields.text({ label: 'Video Title / Caption' }),
            video_url: fields.text({ label: 'Video URL (e.g. YouTube/MP4 Link)' }),
            thumbnail: fields.image({
              label: 'Thumbnail Image',
              directory: 'public/assets',
              publicPath: '/assets/',
            }),
          }),
          {
            label: 'Video Clips (Max 4 recommended)',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
        
        // For Grid/Specs/FAQ
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Item Label / Question', description: 'The main title or short fact' }),
            value: fields.text({ label: 'Item Value / Answer', multiline: true, description: 'The details or description' }),
            icon: fields.text({ label: 'Icon Name (Lucide)', description: 'Example: ShieldCheck, Hammer, Send' }),
          }),
          {
            label: 'List Items (Specs / Highlights / FAQ)',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
      },
    }),
  },
});
