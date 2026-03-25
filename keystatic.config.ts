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
        siteName: fields.text({ label: 'Site Name', defaultValue: 'ParaNomad' }),
      },
    }),
  },
  collections: {
    sections: collection({
      label: 'Page Blocks',
      slugField: 'slug',
      path: 'src/content/sections/**/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Path (e.g. de/hero)' } }),
        title: fields.text({ label: 'Internal Title' }),
        subtitle: fields.text({ label: 'Subtitle', multiline: true }),
        label: fields.text({ label: 'Section Label' }),
        headline: fields.text({ label: 'Main Headline', multiline: true }),
        
        story: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Story paragraphs',
          itemLabel: (props) => props.value,
        }),
        story_highlight: fields.text({ label: 'Story Highlight', multiline: true }),
        
        box_label: fields.text({ label: 'Box Badge/Label' }),
        box_text: fields.text({ label: 'Box Text', multiline: true }),
        
        facts: fields.array(fields.text({ label: 'Fact', multiline: true }), {
          label: 'Facts List',
          itemLabel: (props) => props.value,
        }),
        
        click_label: fields.text({ label: 'Click Label (Desktop)' }),
        hover_label: fields.text({ label: 'Hover Label (Mobile)' }),
        
        cards: fields.array(
          fields.object({
            id: fields.number({ label: 'ID' }),
            frontTitle: fields.text({ label: 'Front Title' }),
            frontText: fields.text({ label: 'Front Text', multiline: true }),
            backTitle: fields.text({ label: 'Back Title' }),
            backText: fields.text({ label: 'Back Text', multiline: true }),
          }),
          {
            label: 'Flip-Cards',
            itemLabel: (props) => props.fields.frontTitle.value,
          }
        ),
        
        mobile_click_label: fields.text({ label: 'Mobile Click Instruction' }),
        
        // About Section specific
        job_title: fields.text({ label: 'Job Title' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags / Roles',
          itemLabel: (props) => props.value,
        }),
        story_1: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'About Story Part 1',
          itemLabel: (props) => props.value,
        }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        list_label: fields.text({ label: 'List Heading' }),
        list_items: fields.array(fields.text({ label: 'List Item', multiline: true }), {
          label: 'List Items',
          itemLabel: (props) => props.value,
        }),
        story_2: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'About Story Part 2',
          itemLabel: (props) => props.value,
        }),
        
        badges: fields.array(
          fields.object({
            label: fields.text({ label: 'Badge Label' }),
            sub: fields.text({ label: 'Sub-label', multiline: true }),
          }),
          {
            label: 'Trust Badges',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
        
        cta_primary: fields.text({ label: 'CTA Primary' }),
        cta_secondary: fields.text({ label: 'CTA Secondary' }),
        cta_tertiary: fields.text({ label: 'CTA Tertiary' }),
      },
    }),
    showrooms: collection({
      label: 'Showrooms',
      slugField: 'name',
      path: 'src/content/showrooms/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Location Identifier (e.g. muenchen)' } }),
        title: fields.text({ label: 'Showroom Name' }),
        badge_region: fields.text({ label: 'Region Badge (e.g. Südbayern)' }),
        badge_status: fields.text({ label: 'Status Badge (e.g. Live erleben)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        address: fields.text({ label: 'Address', multiline: true }),
        contact_name: fields.text({ label: 'Contact Person' }),
        contact_role: fields.text({ label: 'Contact Role' }),
        contact_image: fields.image({
          label: 'Contact Image',
          directory: 'public/assets/showrooms',
          publicPath: '/assets/showrooms',
        }),
        contact_email: fields.text({ label: 'Contact Email' }),
        contact_phone: fields.text({ label: 'Contact Phone' }),
        contact_url: fields.text({ label: 'Contact Website URL' }),
      },
    }),
  },
});
