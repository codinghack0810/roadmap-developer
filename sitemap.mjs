import path from 'node:path';
import fs from 'node:fs/promises';

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/roadmaps'));
}

export function shouldIndexPage(page) {
  return ![
    'https://roadmap.sh/404',
    'https://roadmap.sh/terms',
    'https://roadmap.sh/privacy',
    'https://roadmap.sh/pdfs',
  ].includes(page);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'https://roadmap.sh',
    'https://roadmap.sh/about',
    'https://roadmap.sh/roadmaps',
    'https://roadmap.sh/guides',
    'https://roadmap.sh/videos',
    ...(await getRoadmapIds()).flatMap((id) => [`https://roadmap.sh/${id}`, `https://roadmap.sh/${id}/topics`]),
  ];

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (item.url.startsWith('https://roadmap.sh/guides') || item.url.startsWith('https://roadmap.sh/videos')) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}
