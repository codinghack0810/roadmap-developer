import { getAllBestPractices } from '../lib/best-practice';
import { getAllGuides } from '../lib/guide';
import { getRoadmapsByTag } from '../lib/roadmap';
import { getAllVideos } from '../lib/video';
import { getAllQuestionGroups } from '../lib/question-group';

export async function GET() {
  const guides = await getAllGuides();
  const videos = await getAllVideos();
  const questionGroups = await getAllQuestionGroups();
  const roadmaps = await getRoadmapsByTag('roadmap');
  const bestPractices = await getAllBestPractices();

  return new Response(
    JSON.stringify([
      ...roadmaps.map((roadmap) => ({
        id: roadmap.id,
        url: `/${roadmap.id}`,
        title: roadmap.frontmatter.briefTitle,
        description: roadmap.frontmatter.briefDescription,
        group: 'Roadmaps',
        metadata: {
          tags: roadmap.frontmatter.tags,
        },
        renderer: roadmap?.frontmatter?.renderer || 'balsamiq',
      })),
      ...bestPractices.map((bestPractice) => ({
        id: bestPractice.id,
        url: `/best-practices/${bestPractice.id}`,
        title: bestPractice.frontmatter.briefTitle,
        description: bestPractice.frontmatter.briefDescription,
        group: 'Best Practices',
      })),
      ...questionGroups.map((questionGroup) => ({
        id: questionGroup.id,
        url: `/questions/${questionGroup.id}`,
        title: questionGroup.frontmatter.briefTitle,
        group: 'Questions',
      })),
      ...guides.map((guide) => ({
        id: guide.id,
        url: guide.frontmatter.excludedBySlug
          ? guide.frontmatter.excludedBySlug
          : `/guides/${guide.id}`,
        title: guide.frontmatter.title,
        description: guide.frontmatter.description,
        authorId: guide.frontmatter.authorId,
        group: 'Guides',
      })),
      ...videos.map((video) => ({
        id: video.id,
        url: `/videos/${video.id}`,
        title: video.frontmatter.title,
        group: 'Videos',
      })),
    ]),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

import { getAllBestPractices } from '../lib/best-pratice';
import { getAllGuides } from '../lib/guide';
import { getRoadmapsByTag } from '../lib/roadmap';
import { getAllVideos } from '../lib/video';

export async function get() {
  const guides = await getAllGuides();
  const videos = await getAllVideos();
  const roadmaps = await getRoadmapsByTag('roadmap');
  const bestPractices = await getAllBestPractices();

  return {
    body: JSON.stringify([
      ...roadmaps.map((roadmap) => ({
        url: `/${roadmap.id}`,
        title: roadmap.frontmatter.briefTitle,
        group: 'Roadmaps',
      })),
      ...bestPractices.map((bestPractice) => ({
        url: `/best-practices/${bestPractice.id}`,
        title: bestPractice.frontmatter.briefTitle,
        group: 'Best Practices',
      })),
      ...guides.map((guide) => ({
        url: `/guides/${guide.id}`,
        title: guide.frontmatter.title,
        group: 'Guides',
      })),
      ...videos.map((guide) => ({
        url: `/videos/${guide.id}`,
        title: guide.frontmatter.title,
        group: 'Videos',
      })),
    ]),
  };
}
