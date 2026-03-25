import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
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
      label: 'Landing Page Sections',
      slugField: 'slug',
      path: 'src/content/sections/**/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Path (e.g. de/hero)' } }),
        type: fields.select({
          label: 'Section Type',
          options: [
            { label: 'Hero', value: 'hero' },
            { label: 'Text/Intro', value: 'text' },
            { label: 'Client Story (Quote)', value: 'story' },
            { label: 'Feature Highlight (Image + Text)', value: 'feature' },
            { label: 'Technical Grid (Facts)', value: 'grid' },
            { label: 'FAQ', value: 'faq' },
            { label: 'CTA / Footer', value: 'cta' },
          ],
          defaultValue: 'text',
        }),
        title: fields.text({ label: 'Internal Title (for Keystatic list)' }),
        heading: fields.text({ label: 'Main Heading', multiline: true }),
        subheading: fields.text({ label: 'Subheading / Tagline', multiline: true }),
        content: fields.text({ label: 'Main Content / Description', multiline: true }),
        
        // Dynamic blocks for different section types
        image: fields.image({
          label: 'Background / Feature Image',
          directory: 'src/assets/sections',
          publicPath: '@/assets/sections',
        }),
        
        button_text: fields.text({ label: 'Main CTA Button Text' }),
        button_link: fields.text({ label: 'Main CTA Button Link' }),
        
        // For Grid/Specs/FAQ
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Item Label / Question' }),
            value: fields.text({ label: 'Item Value / Answer', multiline: true }),
            icon: fields.text({ label: 'Icon Name (Lucide)' }),
          }),
          {
            label: 'List Items (Specs / Highlights / FAQ)',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
        
        // Specific for Fit System (3x3)
        fit_grid: fields.object({
          rows: fields.text({ label: 'Rows Label (e.g. 3 Beinlängen)' }),
          cols: fields.text({ label: 'Cols Label (e.g. 3 Oberkörperlängen)' }),
          result: fields.text({ label: 'Result Text (e.g. 9 Kombinationen)' }),
        }),
      },
    }),
  },
});
