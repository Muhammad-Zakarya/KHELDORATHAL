import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://keldorathal.com';

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let dynamicProjectRoutes = [];
  try {
    await dbConnect();
    const projects = await Project.find({}, 'slug updatedAt createdAt').lean();
    dynamicProjectRoutes = projects.map((proj) => ({
      url: `${baseUrl}/projects/${proj.slug}`,
      lastModified: proj.updatedAt
        ? new Date(proj.updatedAt).toISOString()
        : proj.createdAt
        ? new Date(proj.createdAt).toISOString()
        : new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error fetching dynamic project routes for sitemap:', err.message);
  }

  return [...staticRoutes, ...dynamicProjectRoutes];
}
