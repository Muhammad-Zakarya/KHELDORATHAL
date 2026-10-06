import Image from 'next/image';
import Link from 'next/link';
import { 
  Code2, 
  Layers, 
  Cpu, 
  Globe, 
  Database, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const metadata = {
  title: 'About KELDORATHAL | Software Development Studio & Founder',
  description:
    'Learn about KELDORATHAL and founder Muhammad Zakarya. Engineering high-performance web applications, cross-platform apps, MERN stack solutions, and scalable RESTful APIs.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About KELDORATHAL | Software Development Studio & Founder',
    description:
      'Learn about KELDORATHAL and founder Muhammad Zakarya. Engineering high-performance web applications, cross-platform apps, MERN stack solutions, and scalable RESTful APIs.',
    url: '/about',
    type: 'profile',
    images: [
      {
        url: '/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'About KELDORATHAL Software Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About KELDORATHAL | Software Development Studio',
    description:
      'Discover KELDORATHAL: full-stack software development, MERN architecture, and cross-platform apps.',
    images: ['/images/logoo.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen py-[clamp(16px,4vw,64px)] cosmic-stars overflow-hidden bg-[#08041c]">
      {/* Nebula Ambient Glows */}
      <div className="absolute top-10 left-10 h-[clamp(120px,24vw,320px)] w-[clamp(120px,24vw,320px)] rounded-full bg-fuchsia-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 h-[clamp(120px,26vw,340px)] w-[clamp(120px,26vw,340px)] rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)] space-y-[clamp(24px,5vw,72px)]">
        
        {/* 1. HERO / INTRODUCTION SECTION */}
        <div className="text-center space-y-[clamp(6px,1.5vw,20px)] max-w-3xl mx-auto">
          {/* Centered KELDORATHAL Logo Badge with Glowing Effect */}
          <div className="flex justify-center">
            <div className="relative inline-flex items-center justify-center p-[clamp(8px,1.4vw,16px)] rounded-[clamp(16px,2vw,28px)] border border-purple-500/30 bg-[#120934]/90 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
              <div className="relative h-[clamp(44px,6vw,84px)] w-[clamp(44px,6vw,84px)] overflow-hidden rounded-[clamp(10px,1.4vw,18px)]">
                <Image
                  src="/images/logoo.png"
                  alt="KELDORATHAL Logo"
                  fill
                  className="object-cover"
                  priority
                  sizes="84px"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-[clamp(4px,0.5vw,8px)] rounded-full border border-purple-500/40 bg-purple-950/50 px-[clamp(8px,1.2vw,16px)] py-[clamp(2px,0.4vw,6px)] text-[clamp(7.5px,0.9vw,12px)] font-mono font-medium text-cyan-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <Sparkles className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-cyan-400" />
            <span>KELDORATHAL SOFTWARE STUDIO</span>
          </div>

          <h1 className="text-[clamp(18px,3.5vw,48px)] font-extrabold text-white tracking-tight leading-tight">
            About KELDORATHAL
          </h1>

          <p className="text-purple-200/90 text-[clamp(8px,1.15vw,16px)] leading-relaxed max-w-2xl mx-auto">
            KELDORATHAL is a dedicated software development studio engineered to transform concepts into dependable, high-performance digital products. We architect modern web applications, cross-platform systems, and robust full-stack software built for long-term scalability.
          </p>
        </div>

        {/* 2. MAIN ABOUT CARD (Two-Column Side-by-Side: Purpose & Approach + Feature Grid) */}
        <div className="rounded-[clamp(16px,2.5vw,32px)] border border-purple-500/30 bg-[#120934]/90 p-[clamp(10px,2.5vw,40px)] shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="grid grid-cols-12 gap-[clamp(8px,2vw,32px)] items-center">
            
            {/* LEFT SIDE: Heading & Description */}
            <div className="col-span-5 space-y-[clamp(6px,1.2vw,18px)]">
              <span className="text-[clamp(6.5px,0.85vw,11px)] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Our Purpose & Approach
              </span>
              <h2 className="text-[clamp(12px,2.2vw,30px)] font-extrabold text-white tracking-tight leading-tight">
                Engineering Practical, Clean & Reliable Software
              </h2>
              <p className="text-purple-200/85 text-[clamp(7.5px,1vw,14px)] leading-relaxed">
                At KELDORATHAL, we believe great software starts with sound engineering decisions, clear architectural boundaries, and a relentless focus on real user needs.
              </p>
              <p className="text-purple-200/85 text-[clamp(7px,0.95vw,13px)] leading-relaxed">
                We reject bloated setups, superficial shortcuts, and unnecessary dependencies. Instead, every project we undertake is written with clean code standards, fast response times, robust data integrity, and intuitive interfaces.
              </p>
            </div>

            {/* RIGHT SIDE: Grid of 6 Smaller Feature Cards (2 cols x 3 rows) */}
            <div className="col-span-7 grid grid-cols-2 gap-[clamp(4px,1vw,12px)]">
              
              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <CheckCircle2 className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-cyan-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Engineering Excellence</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Rigorous development standards and validation designed for zero downtime.
                </p>
              </div>

              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <Layers className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-fuchsia-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Scalable Architecture</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Modular code structure, clear boundaries, and seamless feature scalability.
                </p>
              </div>

              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <ShieldCheck className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-indigo-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Security & Reliability</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Session protection, token encryption, and hardened data validation.
                </p>
              </div>

              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <Zap className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-pink-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Speed & Performance</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Optimized assets, fast SSR rendering, and swift server response times.
                </p>
              </div>

              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <Cpu className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-emerald-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Modern Technology</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Contemporary web and mobile stacks that guarantee agility and longevity.
                </p>
              </div>

              <div className="rounded-[clamp(8px,1.2vw,14px)] border border-purple-500/20 bg-[#0c0525] p-[clamp(5px,1vw,12px)] space-y-[clamp(1px,0.3vw,4px)] hover:border-purple-400/40 transition-all">
                <Code2 className="h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)] text-blue-400" />
                <h3 className="text-[clamp(7.5px,1vw,13px)] font-bold text-white leading-tight">Clean Code</h3>
                <p className="text-[clamp(6px,0.75vw,10.5px)] text-purple-200/70 leading-relaxed">
                  Readable, maintainable codebases with predictable error handling.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* 3. "WHAT KELDORATHAL BUILDS" SECTION (Grid of 6 Cards in 3 Columns) */}
        <div className="space-y-[clamp(12px,2.5vw,36px)]">
          <div className="text-center space-y-[clamp(3px,0.8vw,10px)] max-w-2xl mx-auto">
            <h2 className="text-[clamp(15px,2.6vw,36px)] font-extrabold text-white tracking-tight">
              What KELDORATHAL Builds
            </h2>
            <p className="text-purple-300/80 text-[clamp(7.5px,1vw,14px)] leading-relaxed">
              Our core engineering disciplines cover every layer of modern software development, from intuitive user interfaces to scalable cloud databases.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-[clamp(6px,1.8vw,24px)]">
            
            {/* Card 1: Modern Web Applications */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Globe className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">Modern Web Applications</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  Full-featured web applications built with Next.js and React. Designed with lightning-fast page loads, Server-Side Rendering (SSR), responsive layouts, and SEO-friendly architectures.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-cyan-300 font-medium pt-1 border-t border-purple-500/15">
                Next.js &bull; React &bull; Tailwind CSS
              </div>
            </div>

            {/* Card 2: Cross-Platform Applications */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                  <Layers className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">Cross-Platform Applications</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  Unified software solutions crafted to deliver consistent, fluid user experiences across mobile, tablet, and desktop viewports with singular codebase efficiency.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-fuchsia-300 font-medium pt-1 border-t border-purple-500/15">
                Responsive Platforms &bull; PWA &bull; React
              </div>
            </div>

            {/* Card 3: MERN Stack Solutions */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Database className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">MERN Stack Solutions</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  End-to-end full-stack architectures powered by MongoDB, Express, React, and Node.js. Efficient schema design, atomic transactions, and scalable data layers.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-emerald-300 font-medium pt-1 border-t border-purple-500/15">
                MongoDB &bull; Express &bull; React &bull; Node.js
              </div>
            </div>

            {/* Card 4: RESTful APIs & Integrations */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code2 className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">RESTful APIs & Integrations</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  Secure, versioned REST endpoints with token authentication, route validation, error telemetry, and seamless integration with external third-party APIs.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-blue-300 font-medium pt-1 border-t border-purple-500/15">
                REST Endpoints &bull; JWT Auth &bull; Microservices
              </div>
            </div>

            {/* Card 5: Custom Business Software */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Cpu className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">Custom Business Software</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  Bespoke administration dashboards, client management portals, ordering workflows, and tailored automated tooling built strictly around business operations.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-purple-300 font-medium pt-1 border-t border-purple-500/15">
                Portals &bull; Workflows &bull; Custom Systems
              </div>
            </div>

            {/* Card 6: Production-Ready Solutions */}
            <div className="rounded-[clamp(10px,1.8vw,24px)] border border-purple-500/25 bg-[#120934]/90 p-[clamp(8px,1.8vw,24px)] flex flex-col justify-between space-y-[clamp(4px,1vw,14px)] shadow-xl hover:border-purple-400/40 transition-all">
              <div className="space-y-[clamp(3px,0.8vw,10px)]">
                <div className="h-[clamp(22px,3.2vw,44px)] w-[clamp(22px,3.2vw,44px)] flex items-center justify-center rounded-[clamp(6px,1vw,14px)] bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <ShieldCheck className="h-[clamp(12px,1.6vw,22px)] w-[clamp(12px,1.6vw,22px)]" />
                </div>
                <h3 className="text-[clamp(8.5px,1.2vw,17px)] font-bold text-white leading-tight">Production-Ready Solutions</h3>
                <p className="text-[clamp(6.5px,0.85vw,12px)] text-purple-200/80 leading-relaxed">
                  Every system is engineered for longevity: clean project directory structure, strict type consistency, predictable error handling, and zero extraneous dependencies.
                </p>
              </div>
              <div className="text-[clamp(6px,0.75vw,11px)] font-mono text-pink-300 font-medium pt-1 border-t border-purple-500/15">
                Maintainability &bull; Quality Assurance &bull; Security
              </div>
            </div>

          </div>
        </div>

        {/* 4. FINAL CALL TO ACTION */}
        <div className="rounded-[clamp(14px,2.5vw,32px)] border border-purple-500/30 bg-gradient-to-r from-[#160b3a] via-[#10072b] to-[#160b3a] p-[clamp(12px,3vw,48px)] text-center space-y-[clamp(6px,1.5vw,20px)] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-[clamp(14px,2.6vw,36px)] font-extrabold text-white tracking-tight break-words">
            Ready to Build With KELDORATHAL?
          </h2>
          <p className="text-purple-200/80 text-[clamp(7.5px,1vw,15px)] max-w-xl mx-auto leading-relaxed">
            Whether you need a full-scale web application, a custom software platform, or technical consultation, we are ready to bring your vision to reality.
          </p>
          <div className="flex flex-row items-center justify-center gap-[clamp(6px,1.5vw,16px)] pt-1">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-[clamp(3px,0.5vw,8px)] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-[clamp(8px,1.8vw,28px)] py-[clamp(4px,0.9vw,12px)] text-[clamp(7.5px,0.95vw,14px)] font-bold text-white shadow-lg shadow-blue-600/30 hover:scale-105 transition-all text-center whitespace-nowrap"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)] shrink-0" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-[clamp(3px,0.5vw,8px)] rounded-full border border-purple-400/40 bg-purple-950/60 px-[clamp(8px,1.8vw,28px)] py-[clamp(4px,0.9vw,12px)] text-[clamp(7.5px,0.95vw,14px)] font-bold text-purple-200 hover:text-white hover:border-cyan-400 transition-all text-center whitespace-nowrap"
            >
              <MessageSquare className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)] text-cyan-400 shrink-0" />
              <span>Contact KELDORATHAL</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
