import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08041c',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://keldorathal.com';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'KELDORATHAL | Software Development & Digital Solutions',
    template: '%s | KELDORATHAL',
  },
  description:
    'KELDORATHAL is a modern software development studio founded by Muhammad Zakarya. Specializing in high-performance web applications, custom software engineering, cross-platform apps, MERN stack, and scalable RESTful APIs.',
  keywords: [
    'KELDORATHAL',
    'Muhammad Zakarya',
    'Software Development Company',
    'Full-Stack Development',
    'Web Development Studio',
    'Next.js Developer',
    'React Development',
    'MERN Stack Development',
    'Custom Software Architecture',
    'Cross-Platform App Development',
    'API Development',
  ],
  authors: [{ name: 'Muhammad Zakarya', url: 'https://github.com/muhammad-zakarya' }],
  creator: 'Muhammad Zakarya',
  publisher: 'KELDORATHAL',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logoo.png',
    shortcut: '/images/logoo.png',
    apple: '/images/logoo.png',
  },
  openGraph: {
    title: 'KELDORATHAL | Software Development & Digital Solutions',
    description:
      'High-performance websites, custom software engineering, cross-platform applications, and robust API architectures designed for business growth.',
    url: baseUrl,
    siteName: 'KELDORATHAL',
    images: [
      {
        url: '/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'KELDORATHAL Software Studio Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KELDORATHAL | Software Development & Digital Solutions',
    description:
      'Custom web platforms, cross-platform apps, and full-stack software architectures built by KELDORATHAL.',
    images: ['/images/logoo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05070e] text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        <JsonLd />
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
