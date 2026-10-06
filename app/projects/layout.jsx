export const metadata = {
  title: 'Featured Software Portfolio & SaaS Case Studies | KELDORATHAL',
  description:
    'Browse production software projects, intelligent SaaS workspaces, e-commerce platforms, and real-time CRM analytics dashboards engineered by KELDORATHAL.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Featured Software Portfolio | KELDORATHAL',
    description:
      'Browse production software projects, intelligent SaaS workspaces, and e-commerce ecosystems engineered by KELDORATHAL.',
    url: '/projects',
    type: 'website',
    images: [
      {
        url: '/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'KELDORATHAL Software Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured Software Portfolio | KELDORATHAL',
    description:
      'Browse production software projects, intelligent SaaS workspaces, and e-commerce ecosystems engineered by KELDORATHAL.',
    images: ['/images/logoo.png'],
  },
};

export default function ProjectsLayout({ children }) {
  return children;
}
