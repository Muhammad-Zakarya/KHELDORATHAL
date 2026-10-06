import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/15 bg-[#060317] text-slate-400">
      <div className="mx-auto max-w-7xl px-[clamp(8px,2.5vw,32px)] py-[clamp(16px,3vw,48px)]">
        <div className="grid grid-cols-12 gap-[clamp(8px,2vw,32px)] mb-[clamp(16px,3vw,48px)]">
          
          {/* Col 1: Company info (6 cols) */}
          <div className="col-span-6 space-y-[clamp(4px,1vw,16px)]">
            <Link href="/" className="flex items-center gap-[clamp(4px,0.8vw,12px)] group">
              <div className="relative h-[clamp(18px,2.2vw,32px)] w-[clamp(18px,2.2vw,32px)] overflow-hidden rounded-[clamp(6px,0.8vw,12px)] border border-purple-500/30 bg-purple-950/40 shrink-0">
                <Image
                  src="/images/logoo.png"
                  alt="KELDORATHAL Logo"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-[clamp(11px,1.5vw,20px)] font-bold font-mono text-white tracking-wider flex items-center">
                KELDORATHAL
                <span className="inline-block h-[clamp(3px,0.4vw,6px)] w-[clamp(3px,0.4vw,6px)] rounded-full bg-cyan-400 ml-[clamp(2px,0.3vw,4px)] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              </span>
            </Link>
            <p className="text-[clamp(7.5px,1vw,14px)] text-purple-200/80 max-w-md leading-relaxed">
              Software development agency delivering modern web platforms, mobile apps, and custom full-stack digital architectures.
            </p>
            <div className="pt-1 space-y-0.5">
              <p className="text-[clamp(6.5px,0.85vw,11px)] text-cyan-400 font-semibold tracking-wide uppercase">
                Founded & Led by
              </p>
              <p className="text-[clamp(8px,1vw,14px)] font-semibold text-white">
                Muhammad Zakarya
              </p>
              <p className="text-[clamp(6.5px,0.85vw,11px)] text-purple-300/70">
                Founder
              </p>
            </div>
          </div>

          {/* Col 2: Navigation (3 cols) */}
          <div className="col-span-3">
            <h3 className="text-[clamp(7px,0.85vw,12px)] font-semibold uppercase tracking-wider text-purple-200 mb-[clamp(6px,1vw,16px)] font-mono">
              Quick Links
            </h3>
            <ul className="space-y-[clamp(3px,0.6vw,10px)] text-[clamp(7.5px,0.95vw,13px)]">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About KELDORATHAL
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-300 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-300 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Social details (3 cols) */}
          <div className="col-span-3">
            <h3 className="text-[clamp(7px,0.85vw,12px)] font-semibold uppercase tracking-wider text-purple-200 mb-[clamp(6px,1vw,16px)] font-mono">
              Direct Contact
            </h3>
            <ul className="space-y-[clamp(4px,0.8vw,12px)] text-[clamp(7.5px,0.95vw,13px)]">
              <li>
                <a
                  href="https://wa.me/923278326788"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[clamp(3px,0.5vw,8px)] hover:text-emerald-300 transition-colors group"
                >
                  <Phone className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-emerald-400 shrink-0" />
                  <span className="whitespace-nowrap">+92 327 8326788</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:muhammadzak4rya@gmail.com"
                  className="flex items-center gap-[clamp(3px,0.5vw,8px)] hover:text-cyan-300 transition-colors group"
                >
                  <Mail className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-cyan-400 shrink-0" />
                  <span className="break-all">muhammadzak4rya@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/muhammad.zakarya.khan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[clamp(3px,0.5vw,8px)] hover:text-pink-400 transition-colors group"
                >
                  <InstagramIcon className="h-[clamp(10px,1.1vw,16px)] w-[clamp(10px,1.1vw,16px)] text-pink-400 shrink-0" />
                  <span className="break-all">@muhammad.zakarya.khan</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/15 pt-[clamp(8px,1.5vw,24px)] flex flex-row items-center justify-between text-[clamp(7px,0.85vw,12px)] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} KELDORATHAL. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400 whitespace-nowrap">
            <span className="text-purple-300 font-medium">Made by KELDORATHAL</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
