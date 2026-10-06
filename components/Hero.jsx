import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Code2, MessageSquare } from 'lucide-react';

export default function Hero() {

  return (
    <section className="relative overflow-hidden bg-[#08041c] pt-[clamp(16px,4vw,80px)] pb-0 cosmic-stars">
      {/* 1. Main Home Page Visual Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home-hero-bg.png"
          alt="KELDORATHAL Studio Background"
          fill
          priority
          className="object-cover object-[86%_35%]"
          sizes="100vw"
        />
        {/* Left-to-right gradient ensuring text readability over the image across all scales */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08041c] via-[#08041c]/85 to-transparent" />

        {/* Ambient cosmic nebula touches */}
        <div className="absolute -bottom-10 -left-20 h-[clamp(150px,28vw,380px)] w-[clamp(180px,32vw,450px)] rounded-full bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 md:right-28 h-[clamp(100px,18vw,250px)] w-[clamp(100px,18vw,250px)] rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)] pb-[clamp(16px,4vw,96px)]">
        <div className="grid grid-cols-12 gap-[clamp(8px,2vw,32px)] items-center">
          
          {/* Left Text Column - Company Focused with Reference Typography */}
          <div className="col-span-7 space-y-[clamp(6px,1.5vw,24px)] text-left">
            
            {/* Top Company Badge with Soft Glow */}
            <div className="inline-flex items-center gap-[clamp(3px,0.5vw,8px)] rounded-full border border-purple-500/40 bg-purple-950/70 px-[clamp(6px,1.2vw,16px)] py-[clamp(2px,0.4vw,6px)] text-[clamp(7px,0.9vw,12px)] font-mono font-medium text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <Sparkles className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-cyan-400 animate-pulse" />
              <span>KELDORATHAL SOFTWARE STUDIO</span>
            </div>

            {/* Main Headline with Reference Lettering Weight */}
            <h1 className="text-[clamp(14px,3.8vw,60px)] font-extrabold tracking-tight text-white leading-[1.12]">
              Building Digital <br />
              <span className="text-white">
                Solutions for a <br />
                Connected World
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-[clamp(8px,1.1vw,16px)] text-purple-200/90 leading-relaxed font-normal">
              We design and engineer modern web applications, cross-platform mobile platforms, custom software, and scalable backend systems built for speed and reliability.
            </p>

            {/* Primary Action CTAs - Preserving Exact Single-Row Composition */}
            <div className="pt-[clamp(2px,0.6vw,8px)] flex flex-row items-center gap-[clamp(4px,1vw,14px)] flex-nowrap">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-[clamp(2px,0.4vw,8px)] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-[clamp(6px,1.4vw,24px)] py-[clamp(3px,0.8vw,12px)] text-[clamp(7.5px,1vw,14px)] font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all text-center whitespace-nowrap"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)] shrink-0" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-[clamp(2px,0.4vw,8px)] rounded-full border border-purple-500/40 bg-purple-950/50 backdrop-blur-md px-[clamp(6px,1.4vw,24px)] py-[clamp(3px,0.8vw,12px)] text-[clamp(7.5px,1vw,14px)] font-semibold text-purple-200 hover:text-white hover:border-cyan-400/60 hover:bg-purple-900/50 transition-all shadow-md text-center whitespace-nowrap"
              >
                <span>Start a Project</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-[clamp(2px,0.4vw,8px)] rounded-full border border-cyan-400/50 bg-[#0c142c]/80 backdrop-blur-md px-[clamp(6px,1.4vw,24px)] py-[clamp(3px,0.8vw,12px)] text-[clamp(7.5px,1vw,14px)] font-semibold text-cyan-300 hover:text-white hover:border-cyan-300 hover:bg-cyan-950/80 transition-all shadow-md shadow-cyan-500/15 text-center whitespace-nowrap"
              >
                <MessageSquare className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)] text-cyan-400 shrink-0" />
                <span>Chat with KELDORATHAL</span>
              </Link>
            </div>

            {/* Feature Highlights with Cosmic Accents - Preserving Single-Row Composition */}
            <div className="pt-[clamp(6px,1.5vw,24px)] border-t border-purple-500/20 max-w-xl">
              <div className="flex flex-row items-center gap-[clamp(6px,1.5vw,20px)] text-purple-200 flex-nowrap">
                <div className="flex items-center gap-[clamp(2px,0.4vw,8px)]">
                  <Code2 className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-cyan-400 shrink-0" />
                  <span className="text-[clamp(7px,0.95vw,12px)] font-medium whitespace-nowrap">Clean Code</span>
                </div>
                <div className="flex items-center gap-[clamp(2px,0.4vw,8px)]">
                  <Zap className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-pink-400 shrink-0" />
                  <span className="text-[clamp(7px,0.95vw,12px)] font-medium whitespace-nowrap">Fast Performance</span>
                </div>
                <div className="flex items-center gap-[clamp(2px,0.4vw,8px)]">
                  <ShieldCheck className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-indigo-400 shrink-0" />
                  <span className="text-[clamp(7px,0.95vw,12px)] font-medium whitespace-nowrap">Secure & Reliable</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Exact Desktop Subject Positioning & Floating Technical Badge */}
          <div className="col-span-5 relative flex flex-col items-end justify-between min-h-[clamp(140px,28vw,440px)]">
            {/* Glowing Celestial Star/Orb */}
            <div className="self-end mr-[clamp(4px,2vw,40px)]">
              <div className="h-[clamp(12px,2.5vw,40px)] w-[clamp(12px,2.5vw,40px)] rounded-full bg-white glow-orb animate-pulse" />
            </div>

            {/* Subtle Translucent Technical Badge (Over founder chest) */}
            <div className="mt-auto rounded-[clamp(8px,1.5vw,16px)] border border-purple-400/25 bg-[#0c0525]/70 backdrop-blur-md p-[clamp(5px,1vw,14px)] shadow-2xl space-y-[clamp(2px,0.3vw,4px)] w-full max-w-[clamp(130px,25vw,320px)] text-left">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-[clamp(2px,0.4vw,8px)]">
                  <span className="h-[clamp(3px,0.5vw,8px)] w-[clamp(3px,0.5vw,8px)] rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[clamp(7px,0.9vw,11px)] font-mono text-cyan-300 font-bold uppercase tracking-wider">KELDORATHAL</span>
                </div>
                <span className="text-[clamp(6px,0.8vw,10px)] font-mono text-purple-400/70">PROD READY</span>
              </div>
              <p className="text-[clamp(6.5px,0.85vw,11px)] text-purple-200/90 font-medium leading-snug">
                Web &bull; Mobile &bull; Cloud Backend Systems
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SWEEPING ORGANIC CURVED WAVE TRANSITION */}
      <div className="w-full overflow-hidden leading-none relative -mb-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[clamp(24px,7vw,112px)] text-white preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C280,96 480,-16 720,42 C960,100 1200,10 1440,32 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
