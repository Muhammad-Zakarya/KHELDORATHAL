'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import ProjectCard from '@/components/ProjectCard';
import OrderModal from '@/components/OrderModal';
import {
  ArrowRight,
  Cpu,
  Phone,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Users2,
  Building2,
  MessageSquare,
  Compass,
  Rocket,
  MonitorCheck,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return { success: false, user: null };
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/services', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        } else {
          await fetch('/api/seed', { cache: 'no-store' }).catch(() => {});
          const retry = await fetch('/api/services', { cache: 'no-store' }).then((r) => r.json());
          if (retry.success && Array.isArray(retry.services)) setServices(retry.services);
        }
      })
      .catch((err) => console.error('Home services fetch error:', err));

    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        } else {
          await fetch('/api/seed', { cache: 'no-store' }).catch(() => {});
          const retry = await fetch('/api/projects', { cache: 'no-store' }).then((r) => r.json());
          if (retry.success && Array.isArray(retry.projects)) setProjects(retry.projects);
        }
      })
      .catch((err) => console.error('Home projects fetch error:', err));
  }, []);

  const handleOpenOrder = (service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-0 pb-20 bg-[#08041c]">
      
      {/* 1. HERO SECTION (Cosmic Dark with Sweeping Wave Divider) */}
      <Hero />

      {/* 2. LUMINOUS SECTION DIRECTLY BELOW WAVE (Inspired by Reference Image) */}
      <div className="bg-white text-slate-900 pt-[clamp(16px,3vw,32px)] pb-[clamp(32px,6vw,80px)] space-y-[clamp(32px,6vw,96px)]">
        
        {/* FOUR GLOWING CIRCULAR PODS (Directly matching the 4 circular pods in the reference image) */}
        <section className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)]">
          
          <div className="text-center space-y-[clamp(4px,0.8vw,12px)] max-w-3xl mx-auto mb-[clamp(16px,3.5vw,56px)]">
            <h2 className="text-[clamp(16px,2.8vw,36px)] font-extrabold text-slate-900 tracking-tight">
              Steps away from launching your digital solution!
            </h2>
            <p className="text-slate-500 text-[clamp(8.5px,1.15vw,16px)]">
              A structured and transparent approach from initial blueprint to final cloud release.
            </p>
          </div>

          {/* The 4 Glowing Circular Badges / Pods - Preserving Exact Single-Row Composition */}
          <div className="grid grid-cols-4 gap-[clamp(6px,2vw,36px)] max-w-5xl mx-auto">
            
            {/* Pod 1 - Blueprint & Strategy */}
            <Link
              href="/services"
              className="flex flex-col items-center text-center space-y-[clamp(4px,0.8vw,12px)] group cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full glow-pod group-hover:glow-pod-strong transition-all duration-300" />
                <div className="relative h-[clamp(44px,7.5vw,112px)] w-[clamp(44px,7.5vw,112px)] rounded-full bg-white shadow-xl border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="h-[clamp(16px,2.6vw,36px)] w-[clamp(16px,2.6vw,36px)] text-purple-600" />
                </div>
              </div>
              <span className="text-[clamp(7.5px,1vw,14px)] font-bold text-slate-800 group-hover:text-purple-600 transition-colors leading-tight">
                Blueprint & Strategy
              </span>
            </Link>

            {/* Pod 2 - Modern Web Apps */}
            <Link
              href="/services"
              className="flex flex-col items-center text-center space-y-[clamp(4px,0.8vw,12px)] group cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full glow-pod group-hover:glow-pod-strong transition-all duration-300" />
                <div className="relative h-[clamp(44px,7.5vw,112px)] w-[clamp(44px,7.5vw,112px)] rounded-full bg-white shadow-xl border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MonitorCheck className="h-[clamp(16px,2.6vw,36px)] w-[clamp(16px,2.6vw,36px)] text-blue-600" />
                </div>
              </div>
              <span className="text-[clamp(7.5px,1vw,14px)] font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                Modern Web Apps
              </span>
            </Link>

            {/* Pod 3 - Full-Stack Systems */}
            <Link
              href="/services"
              className="flex flex-col items-center text-center space-y-[clamp(4px,0.8vw,12px)] group cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full glow-pod group-hover:glow-pod-strong transition-all duration-300" />
                <div className="relative h-[clamp(44px,7.5vw,112px)] w-[clamp(44px,7.5vw,112px)] rounded-full bg-white shadow-xl border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Cpu className="h-[clamp(16px,2.6vw,36px)] w-[clamp(16px,2.6vw,36px)] text-fuchsia-600" />
                </div>
              </div>
              <span className="text-[clamp(7.5px,1vw,14px)] font-bold text-slate-800 group-hover:text-fuchsia-600 transition-colors leading-tight">
                Full-Stack Systems
              </span>
            </Link>

            {/* Pod 4 - Launch & Scale */}
            <Link
              href="/services"
              className="flex flex-col items-center text-center space-y-[clamp(4px,0.8vw,12px)] group cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full glow-pod group-hover:glow-pod-strong transition-all duration-300" />
                <div className="relative h-[clamp(44px,7.5vw,112px)] w-[clamp(44px,7.5vw,112px)] rounded-full bg-white shadow-xl border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Rocket className="h-[clamp(16px,2.6vw,36px)] w-[clamp(16px,2.6vw,36px)] text-indigo-600" />
                </div>
              </div>
              <span className="text-[clamp(7.5px,1vw,14px)] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                Launch & Scale
              </span>
            </Link>

          </div>

          {/* Connecting Subtext (Matching reference phrasing) */}
          <div className="mt-[clamp(16px,3.5vw,56px)] text-center max-w-2xl mx-auto">
            <p className="text-[clamp(8px,1vw,14px)] font-medium text-slate-500">
              We exist to take the complexity out of choosing and engineering your software solutions.
            </p>
          </div>

        </section>

        {/* 3. CORE SERVICES SECTION - Preserving 3 Cards Across */}
        <section className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)]">
          <div className="text-center space-y-[clamp(4px,0.8vw,12px)] max-w-3xl mx-auto mb-[clamp(16px,3vw,48px)]">
            <h2 className="text-[clamp(16px,2.6vw,32px)] font-extrabold text-slate-900 tracking-tight">
              Browse our specialized software development services.
            </h2>
            <p className="text-slate-600 text-[clamp(8px,1.05vw,14px)] leading-relaxed">
              High-performance full-stack solutions built using clean architecture, modern frameworks, and robust databases.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-[clamp(6px,2vw,32px)]">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service._id || service.slug} service={service} onOrder={handleOpenOrder} />
            ))}
          </div>

          <div className="mt-[clamp(14px,2.5vw,40px)] text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-[clamp(3px,0.5vw,8px)] rounded-full border border-purple-200 bg-purple-50/60 px-[clamp(10px,1.8vw,24px)] py-[clamp(4px,0.7vw,10px)] text-[clamp(7.5px,0.95vw,14px)] font-bold text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all shadow-sm"
            >
              <span>Explore All Services</span>
              <ArrowRight className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)]" />
            </Link>
          </div>
        </section>

        {/* 4. ABOUT THE COMPANY SECTION - Preserving Exact Side-by-Side Composition */}
        <section className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)]">
          <div className="rounded-[clamp(16px,2.5vw,32px)] border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-purple-50/40 p-[clamp(10px,3.5vw,64px)] shadow-[0_15px_40px_rgba(168,85,247,0.06)] relative overflow-hidden">
            <div className="grid grid-cols-12 gap-[clamp(8px,2.5vw,40px)] items-center">
              
              <div className="col-span-7 space-y-[clamp(6px,1.5vw,24px)]">
                <div className="inline-flex items-center gap-[clamp(3px,0.4vw,6px)] rounded-full border border-purple-200 bg-purple-50 px-[clamp(6px,1vw,14px)] py-[clamp(2px,0.3vw,4px)] text-[clamp(7px,0.85vw,12px)] font-mono font-medium text-purple-700">
                  <Building2 className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-purple-600" />
                  <span>ABOUT KELDORATHAL</span>
                </div>

                <h2 className="text-[clamp(13px,2.6vw,36px)] font-extrabold text-slate-900 leading-tight tracking-tight">
                  Crafting High-Performance Software for Real-World Demands
                </h2>

                <p className="text-slate-600 text-[clamp(7.5px,1.05vw,15px)] leading-relaxed">
                  <strong className="text-slate-900">KELDORATHAL</strong> is an independent software development studio focused on designing, building, and delivering production-ready web applications, mobile platforms, and backend systems.
                </p>

                <p className="text-slate-500 text-[clamp(7px,0.95vw,14px)] leading-relaxed">
                  We believe in clean code, transparent client communication, and reliable architecture. Every product we construct is developed with maintainability, high performance, and security at its core — ensuring our clients receive software that scales with their objectives.
                </p>

                {/* 3 Mini Cards in ONE ROW */}
                <div className="grid grid-cols-3 gap-[clamp(4px,1vw,16px)] pt-1">
                  <Link href="/services" className="rounded-[clamp(8px,1.2vw,16px)] border border-slate-200 bg-white p-[clamp(4px,1vw,16px)] space-y-[clamp(1px,0.3vw,4px)] shadow-sm hover:border-blue-400 hover:shadow-md transition-all group block">
                    <span className="text-[clamp(6.5px,0.85vw,12px)] font-mono font-semibold text-blue-600 group-hover:text-blue-700 uppercase flex items-center justify-between">
                      <span>Architecture</span>
                      <ArrowRight className="h-[clamp(6px,0.7vw,12px)] w-[clamp(6px,0.7vw,12px)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[clamp(6px,0.75vw,11px)] text-slate-600 leading-snug">Modern Next.js & React frameworks with clean modularity.</p>
                  </Link>
                  <Link href="/services" className="rounded-[clamp(8px,1.2vw,16px)] border border-slate-200 bg-white p-[clamp(4px,1vw,16px)] space-y-[clamp(1px,0.3vw,4px)] shadow-sm hover:border-fuchsia-400 hover:shadow-md transition-all group block">
                    <span className="text-[clamp(6.5px,0.85vw,12px)] font-mono font-semibold text-fuchsia-600 group-hover:text-fuchsia-700 uppercase flex items-center justify-between">
                      <span>Full-Stack</span>
                      <ArrowRight className="h-[clamp(6px,0.7vw,12px)] w-[clamp(6px,0.7vw,12px)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[clamp(6px,0.75vw,11px)] text-slate-600 leading-snug">Robust REST APIs and scalable MongoDB database structures.</p>
                  </Link>
                  <Link href="/services" className="rounded-[clamp(8px,1.2vw,16px)] border border-slate-200 bg-white p-[clamp(4px,1vw,16px)] space-y-[clamp(1px,0.3vw,4px)] shadow-sm hover:border-purple-400 hover:shadow-md transition-all group block">
                    <span className="text-[clamp(6.5px,0.85vw,12px)] font-mono font-semibold text-purple-600 group-hover:text-purple-700 uppercase flex items-center justify-between">
                      <span>Solutions</span>
                      <ArrowRight className="h-[clamp(6px,0.7vw,12px)] w-[clamp(6px,0.7vw,12px)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[clamp(6px,0.75vw,11px)] text-slate-600 leading-snug">Direct founder involvement on every project delivery.</p>
                  </Link>
                </div>
              </div>

              {/* Right Side: Engineering Standards Card */}
              <div className="col-span-5 flex flex-col gap-4">
                <div className="rounded-[clamp(12px,2vw,24px)] border border-purple-200/80 bg-white p-[clamp(8px,1.8vw,28px)] space-y-[clamp(4px,1vw,16px)] shadow-md">
                  <h3 className="text-[clamp(9px,1.2vw,16px)] font-bold text-slate-900 flex items-center gap-[clamp(3px,0.5vw,8px)]">
                    <Sparkles className="h-[clamp(10px,1.2vw,16px)] w-[clamp(10px,1.2vw,16px)] text-purple-600" />
                    <span>Our Engineering Standards</span>
                  </h3>
                  <ul className="space-y-[clamp(4px,0.8vw,12px)] text-[clamp(7px,0.9vw,14px)] text-slate-600">
                    <li className="flex items-start gap-[clamp(3px,0.6vw,10px)]">
                      <CheckCircle className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-emerald-500 shrink-0 mt-0.5" />
                      <span>Clean, readable and maintainable source code.</span>
                    </li>
                    <li className="flex items-start gap-[clamp(3px,0.6vw,10px)]">
                      <CheckCircle className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-emerald-500 shrink-0 mt-0.5" />
                      <span>Mobile-first responsive design across all screen sizes.</span>
                    </li>
                    <li className="flex items-start gap-[clamp(3px,0.6vw,10px)]">
                      <CheckCircle className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-emerald-500 shrink-0 mt-0.5" />
                      <span>Comprehensive security practices and session protection.</span>
                    </li>
                    <li className="flex items-start gap-[clamp(3px,0.6vw,10px)]">
                      <CheckCircle className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-emerald-500 shrink-0 mt-0.5" />
                      <span>Fast page loads with performance optimization.</span>
                    </li>
                  </ul>
                  <div className="pt-1">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-[clamp(2px,0.4vw,8px)] text-[clamp(7px,0.85vw,12px)] font-bold text-purple-600 hover:text-purple-800"
                    >
                      <span>Read more about our approach</span>
                      <ArrowRight className="h-[clamp(8px,0.9vw,14px)] w-[clamp(8px,0.9vw,14px)]" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. WHY CHOOSE KELDORATHAL - Preserving 4 Cards Across in One Row */}
        <section className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)]">
          <div className="text-center space-y-[clamp(4px,0.8vw,12px)] max-w-3xl mx-auto mb-[clamp(16px,3vw,48px)]">
            <div className="inline-flex items-center gap-[clamp(3px,0.4vw,6px)] rounded-full border border-purple-200 bg-purple-50 px-[clamp(6px,1vw,14px)] py-[clamp(2px,0.3vw,4px)] text-[clamp(7px,0.85vw,12px)] font-mono font-medium text-purple-700">
              <ShieldCheck className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-purple-600" />
              <span>VALUE & ADVANTAGE</span>
            </div>
            <h2 className="text-[clamp(14px,2.6vw,36px)] font-extrabold text-slate-900 tracking-tight">
              Why Choose KELDORATHAL
            </h2>
            <p className="text-slate-600 text-[clamp(8px,1.05vw,15px)] leading-relaxed">
              We focus on technical rigor, honest timelines, and long-term value for every digital product.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-[clamp(6px,1.5vw,24px)]">
            <div className="rounded-[clamp(10px,2vw,24px)] border border-slate-200/90 bg-white p-[clamp(6px,1.5vw,24px)] space-y-[clamp(3px,0.8vw,12px)] shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
              <div className="flex h-[clamp(22px,3.2vw,48px)] w-[clamp(22px,3.2vw,48px)] items-center justify-center rounded-[clamp(6px,1vw,16px)] bg-blue-50 text-blue-600 border border-blue-100">
                <Code2 className="h-[clamp(11px,1.6vw,24px)] w-[clamp(11px,1.6vw,24px)]" />
              </div>
              <h3 className="text-[clamp(8.5px,1.15vw,16px)] font-bold text-slate-900 leading-tight">Clean Development</h3>
              <p className="text-[clamp(6.5px,0.85vw,12px)] text-slate-600 leading-relaxed">
                Maintainable, modular codebases designed to be easily read, tested, and expanded in future iterations.
              </p>
            </div>

            <div className="rounded-[clamp(10px,2vw,24px)] border border-slate-200/90 bg-white p-[clamp(6px,1.5vw,24px)] space-y-[clamp(3px,0.8vw,12px)] shadow-sm hover:shadow-md hover:border-cyan-300 transition-all">
              <div className="flex h-[clamp(22px,3.2vw,48px)] w-[clamp(22px,3.2vw,48px)] items-center justify-center rounded-[clamp(6px,1vw,16px)] bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Cpu className="h-[clamp(11px,1.6vw,24px)] w-[clamp(11px,1.6vw,24px)]" />
              </div>
              <h3 className="text-[clamp(8.5px,1.15vw,16px)] font-bold text-slate-900 leading-tight">Modern Tech Stack</h3>
              <p className="text-[clamp(6.5px,0.85vw,12px)] text-slate-600 leading-relaxed">
                Built on industry-proven technologies including Next.js, React, Node.js, and MongoDB for peak reliability.
              </p>
            </div>

            <div className="rounded-[clamp(10px,2vw,24px)] border border-slate-200/90 bg-white p-[clamp(6px,1.5vw,24px)] space-y-[clamp(3px,0.8vw,12px)] shadow-sm hover:border-purple-300 transition-all">
              <div className="flex h-[clamp(22px,3.2vw,48px)] w-[clamp(22px,3.2vw,48px)] items-center justify-center rounded-[clamp(6px,1vw,16px)] bg-purple-50 text-purple-600 border border-purple-100">
                <Zap className="h-[clamp(11px,1.6vw,24px)] w-[clamp(11px,1.6vw,24px)]" />
              </div>
              <h3 className="text-[clamp(8.5px,1.15vw,16px)] font-bold text-slate-900 leading-tight">Responsive & Secure</h3>
              <p className="text-[clamp(6.5px,0.85vw,12px)] text-slate-600 leading-relaxed">
                Speed-optimized layouts that adapt seamlessly from phones to 4K screens with secure session mechanisms.
              </p>
            </div>

            <div className="rounded-[clamp(10px,2vw,24px)] border border-slate-200/90 bg-white p-[clamp(6px,1.5vw,24px)] space-y-[clamp(3px,0.8vw,12px)] shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="flex h-[clamp(22px,3.2vw,48px)] w-[clamp(22px,3.2vw,48px)] items-center justify-center rounded-[clamp(6px,1vw,16px)] bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Users2 className="h-[clamp(11px,1.6vw,24px)] w-[clamp(11px,1.6vw,24px)]" />
              </div>
              <h3 className="text-[clamp(8.5px,1.15vw,16px)] font-bold text-slate-900 leading-tight">Direct Communication</h3>
              <p className="text-[clamp(6.5px,0.85vw,12px)] text-slate-600 leading-relaxed">
                No endless middlemen. Communicate directly with the engineering lead from initial scope to deployment.
              </p>
            </div>
          </div>
        </section>

        {/* 6. FEATURED PROJECTS SECTION - Preserving 3 Cards Across in One Row */}
        <section className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)]">
          <div className="flex flex-row items-end justify-between gap-4 mb-[clamp(14px,2.5vw,40px)]">
            <div>
              <div className="inline-flex items-center gap-[clamp(3px,0.4vw,6px)] rounded-full border border-purple-200 bg-purple-50 px-[clamp(6px,1vw,14px)] py-[clamp(2px,0.3vw,4px)] text-[clamp(7px,0.85vw,12px)] font-mono font-medium text-purple-700 mb-2">
                <Cpu className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-purple-600" />
                <span>PORTFOLIO WORK</span>
              </div>
              <h2 className="text-[clamp(14px,2.6vw,36px)] font-extrabold text-slate-900 tracking-tight">
                Featured Software Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-[clamp(7.5px,1vw,14px)] font-bold text-purple-600 hover:text-purple-800 whitespace-nowrap"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-[clamp(8px,1vw,16px)] w-[clamp(8px,1vw,16px)]" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-[clamp(6px,2vw,32px)]">
            {projects.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </div>
        </section>

      </div>

      {/* 7. MEET THE FOUNDER SECTION - Preserving Exact Desktop Composition */}
      <section className="mx-auto max-w-4xl px-[clamp(8px,2.5vw,32px)] py-[clamp(16px,3vw,32px)]">
        <div className="rounded-[clamp(14px,2.5vw,28px)] border border-purple-500/25 bg-[#0e0728]/95 backdrop-blur-md p-[clamp(10px,2.5vw,32px)] shadow-2xl relative overflow-hidden">
          {/* Subtle cosmic accent glows */}
          <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-2xl pointer-events-none" />

          <div className="space-y-[clamp(4px,1vw,16px)]">
            <div className="inline-flex items-center gap-[clamp(3px,0.4vw,6px)] rounded-full border border-purple-500/30 bg-purple-950/40 px-[clamp(6px,1vw,12px)] py-[clamp(2px,0.3vw,4px)] text-[clamp(7px,0.85vw,11px)] font-mono font-medium text-cyan-300">
              <Sparkles className="h-[clamp(7px,0.9vw,12px)] w-[clamp(7px,0.9vw,12px)] text-cyan-400" />
              <span>LEADERSHIP</span>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-[clamp(14px,2.4vw,30px)] font-bold text-white tracking-tight">
                Muhammad Zakarya
              </h3>
              <p className="text-[clamp(9px,1.1vw,14px)] font-semibold text-cyan-400">
                Founder
              </p>
              <p className="text-[clamp(7.5px,0.95vw,13px)] font-mono text-purple-200/90 flex items-center gap-1.5 pt-0.5">
                <GraduationCap className="h-[clamp(9px,1vw,16px)] w-[clamp(9px,1vw,16px)] text-purple-400 shrink-0" />
                <span>Education: University of Azad Jammu and Kashmir, Software Engineering</span>
              </p>
            </div>

            <p className="text-[clamp(7.5px,0.95vw,13px)] text-purple-200/80 leading-relaxed max-w-2xl">
              Leading technical strategy and execution at KELDORATHAL. Dedicated to building clean, maintainable, and high-performance digital solutions tailored to modern business requirements.
            </p>

            {/* 2 Buttons Side-by-Side in ONE ROW */}
            <div className="pt-1 flex flex-row items-center gap-[clamp(6px,1.2vw,14px)]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-[clamp(8px,1.4vw,18px)] py-[clamp(4px,0.8vw,10px)] text-[clamp(7.5px,0.95vw,12px)] font-semibold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all text-center whitespace-nowrap"
              >
                <MessageSquare className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)]" />
                <span>Message Founder</span>
              </Link>
              <a
                href="https://wa.me/923278326788"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-[clamp(8px,1.4vw,18px)] py-[clamp(4px,0.8vw,10px)] text-[clamp(7.5px,0.95vw,12px)] font-semibold text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition-all text-center whitespace-nowrap"
              >
                <Phone className="h-[clamp(8px,1vw,14px)] w-[clamp(8px,1vw,14px)] text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION (CTA) BANNER - Preserving Exact Desktop Composition */}
      <section className="relative mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)] py-[clamp(20px,4vw,64px)]">
        <div className="rounded-[clamp(16px,2.5vw,28px)] border border-purple-500/30 bg-gradient-to-r from-[#0c0628] via-[#160a3d] to-[#1e0e52] p-[clamp(12px,3.5vw,56px)] text-center space-y-[clamp(6px,1.5vw,24px)] shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Cosmic Orb in Corner */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />

          <h2 className="text-[clamp(14px,2.8vw,36px)] font-extrabold text-white tracking-tight">
            Ready to Build Your Next Digital Product?
          </h2>
          <p className="text-purple-200 text-[clamp(8px,1.1vw,16px)] max-w-2xl mx-auto leading-relaxed">
            Whether you need a custom web app, mobile application, or backend API system, KELDORATHAL is ready to bring your project to reality with clean execution.
          </p>
          {/* 2 Buttons Side-by-Side in ONE ROW */}
          <div className="pt-1 flex flex-row items-center justify-center gap-[clamp(6px,1.5vw,16px)]">
            <Link
              href="/login"
              className="rounded-full bg-white px-[clamp(10px,2vw,32px)] py-[clamp(5px,1vw,14px)] text-[clamp(8px,1vw,14px)] font-bold text-slate-950 shadow-xl hover:bg-slate-100 hover:scale-105 transition-all text-center whitespace-nowrap"
            >
              Start a Project
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-purple-400/40 bg-purple-950/60 px-[clamp(10px,2vw,32px)] py-[clamp(5px,1vw,14px)] text-[clamp(8px,1vw,14px)] font-bold text-purple-200 hover:text-white hover:border-cyan-400 transition-all text-center whitespace-nowrap"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* 9. ORDER MODAL (Preserved 100% Functionality) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedService={selectedService}
        user={user}
      />
    </div>
  );
}
