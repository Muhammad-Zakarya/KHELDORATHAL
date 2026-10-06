'use client';

import { Code2, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service, onOrder }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-[clamp(12px,2vw,24px)] border border-slate-300/80 bg-slate-100/90 p-[clamp(8px,1.6vw,24px)] transition-all duration-300 hover:bg-slate-100/95 hover:border-purple-400 hover:shadow-[0_20px_45px_rgba(168,85,247,0.14)] hover:-translate-y-1">
      
      {/* Soft Glow Accent */}
      <div className="absolute top-0 right-0 h-[clamp(40px,7vw,112px)] w-[clamp(40px,7vw,112px)] rounded-full bg-gradient-to-br from-purple-500/5 to-cyan-500/5 blur-2xl group-hover:from-purple-500/15 group-hover:to-cyan-500/15 transition-all" />

      <div className="space-y-[clamp(4px,1vw,16px)] relative z-10">
        {/* Service Icon inside Glowing Pod Mini */}
        <div className="inline-flex h-[clamp(22px,3.2vw,48px)] w-[clamp(22px,3.2vw,48px)] items-center justify-center rounded-[clamp(6px,1vw,16px)] border border-purple-200/80 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-cyan-500/10 text-purple-600 shadow-sm group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
          <Code2 className="h-[clamp(12px,1.6vw,24px)] w-[clamp(12px,1.6vw,24px)] text-purple-600" />
        </div>

        {/* Title */}
        <h3 className="text-[clamp(9.5px,1.35vw,19px)] font-bold text-slate-900 group-hover:text-purple-700 transition-colors break-words leading-tight">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[clamp(7px,0.9vw,13px)] text-slate-600 leading-relaxed">
          {service.description}
        </p>

        {/* Technologies badges */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="flex flex-wrap gap-[clamp(2px,0.4vw,6px)] pt-1">
            {service.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-full border border-slate-300/80 bg-white/90 px-[clamp(4px,0.6vw,10px)] py-[clamp(1px,0.25vw,3px)] text-[clamp(6px,0.75vw,11px)] font-mono font-medium text-slate-700 shadow-xs whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Price & Order Action */}
      <div className="mt-[clamp(6px,1.5vw,24px)] flex items-center justify-between gap-1 border-t border-slate-200/80 pt-[clamp(4px,1vw,16px)] relative z-10">
        <div>
          <span className="block text-[clamp(6px,0.7vw,10px)] font-mono text-slate-500 uppercase tracking-wider">
            Pricing
          </span>
          <span className="text-[clamp(7px,0.85vw,13px)] font-bold text-slate-900 whitespace-nowrap">
            {service.priceType || 'Request a Quote'}
          </span>
        </div>

        <button
          onClick={() => onOrder(service)}
          className="inline-flex items-center gap-[clamp(2px,0.3vw,6px)] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-[clamp(6px,1vw,16px)] py-[clamp(2px,0.5vw,8px)] text-[clamp(6.5px,0.8vw,12px)] font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.35)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:scale-105 transition-all whitespace-nowrap"
        >
          <span>Order Now</span>
          <ArrowRight className="h-[clamp(8px,0.9vw,14px)] w-[clamp(8px,0.9vw,14px)] shrink-0" />
        </button>
      </div>

    </div>
  );
}
