import { getCollection } from 'astro:content';

async function check() {
  const allSections = await getCollection('sections');
  console.log(JSON.stringify(allSections.map(s => s.id), null, 2));
}

check();
