import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2, Code2 } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const project = await Project.findOne({ slug });

  if (!project) {
    return {
      title: 'Project Not Found | KELDORATHAL',
    };
  }

  const imageUrl = project.image || '/images/logoo.png';

  return {
    title: `${project.title} - Project Showcase | KELDORATHAL`,
    description: project.description.substring(0, 160),
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | KELDORATHAL`,
      description: project.description,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | KELDORATHAL`,
      description: project.description.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  const project = await Project.findOne({ slug }).lean();

  if (!project) {
    notFound();
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Cloud',
    image: project.image || '/images/logoo.png',
    author: {
      '@type': 'Organization',
      name: 'KELDORATHAL',
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Main Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono font-semibold text-blue-300">
            KELDORATHAL PORTFOLIO
          </span>
          {project.featured && (
            <span className="rounded-md bg-purple-500/20 border border-purple-500/40 px-3 py-1 text-xs font-semibold text-purple-300">
              Featured Project
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white break-words">
          {project.title}
        </h1>
        <p className="text-sm font-mono text-slate-400 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Published {new Date(project.createdAt).toLocaleDateString()}</span>
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#090d18] glow-blue">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-[#0b1021]">
            <Code2 className="h-16 w-16 text-slate-700" />
          </div>
        )}
      </div>

      {/* Grid Specs & Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
        
        {/* Left Column: Description & Case Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-5 sm:p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Project Overview</h2>
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-5 sm:p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Engineering Highlights</h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Clean Server-Side Rendering (SSR) & SEO optimization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Responsive full-stack dashboard and REST API integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Made by KELDORATHAL</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Tech Stack & Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-[#060812] px-3 py-1.5 text-xs font-mono text-blue-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.liveUrl && (
            <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                Project Actions
              </h3>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visit Live Project</span>
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
