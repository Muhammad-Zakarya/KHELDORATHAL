export const metadata = {
  title: 'Software & Web Development Services | KELDORATHAL',
  description:
    'Explore software engineering and web development services by KELDORATHAL: Next.js web applications, cross-platform apps, MERN stack development, REST APIs, and custom software systems.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Software & Web Development Services | KELDORATHAL',
    description:
      'Explore software engineering and web development services by KELDORATHAL: Next.js web applications, cross-platform apps, MERN stack, REST APIs, and custom software systems.',
    url: '/services',
    type: 'website',
    images: [
      {
        url: '/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'KELDORATHAL Core Offerings & Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software & Web Development Services | KELDORATHAL',
    description:
      'Custom web platforms, cross-platform apps, and full-stack software architectures built by KELDORATHAL.',
    images: ['/images/logoo.png'],
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
