'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-[clamp(12px,2vw,24px)] border border-slate-300/80 bg-slate-100/90 shadow-[0_10px_30px_rgba(168,85,247,0.06)] transition-all duration-300 hover:bg-slate-100/95 hover:border-purple-400 hover:shadow-[0_20px_45px_rgba(168,85,247,0.14)] hover:-translate-y-1">
      
      {/* Project Image Box */}
      <div className="relative h-[clamp(70px,14vw,192px)] w-full overflow-hidden bg-slate-200/80">
        {project.image && !imgError ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 400px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200/90 to-purple-100/70 text-slate-500">
            <span className="font-mono text-[clamp(7px,0.8vw,12px)] uppercase tracking-widest font-semibold">Made by KELDORATHAL</span>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-[clamp(4px,0.8vw,12px)] right-[clamp(4px,0.8vw,12px)] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-[clamp(4px,0.8vw,12px)] py-[clamp(1px,0.25vw,3px)] text-[clamp(6px,0.75vw,10px)] font-bold text-white tracking-wide uppercase shadow-md shadow-blue-600/30">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-[clamp(8px,1.6vw,24px)] space-y-[clamp(4px,1vw,16px)]">
        <div className="space-y-[clamp(2px,0.5vw,8px)]">
          <Link href={`/projects/${project.slug}`} className="group-hover:text-purple-700 transition-colors">
            <h3 className="text-[clamp(9.5px,1.35vw,19px)] font-bold text-slate-900 flex items-center gap-1 break-words leading-tight">
              <span>{project.title}</span>
              <ArrowUpRight className="h-[clamp(8px,0.9vw,14px)] w-[clamp(8px,0.9vw,14px)] opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 shrink-0" />
            </h3>
          </Link>
          <p className="text-[clamp(7px,0.9vw,13px)] text-slate-600 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-[clamp(2px,0.4vw,6px)] pt-1">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-full border border-slate-300/80 bg-white/90 px-[clamp(4px,0.6vw,10px)] py-[clamp(1px,0.25vw,3px)] text-[clamp(6px,0.75vw,11px)] font-mono text-slate-700 font-medium shadow-xs whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center justify-between gap-1 pt-[clamp(4px,1vw,14px)] border-t border-slate-200/80 text-[clamp(6.5px,0.85vw,12px)]">
          <Link
            href={`/projects/${project.slug}`}
            className="font-bold text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap"
          >
            View Details →
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              <ExternalLink className="h-[clamp(7px,0.8vw,12px)] w-[clamp(7px,0.8vw,12px)]" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
