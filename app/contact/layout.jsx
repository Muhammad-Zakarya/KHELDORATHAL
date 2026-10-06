export const metadata = {
  title: 'Contact KELDORATHAL | Software Engineering Inquiries & Consultation',
  description:
    'Get in touch with KELDORATHAL and Muhammad Zakarya to discuss software engineering projects, web applications, API integrations, and custom digital solutions.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact KELDORATHAL | Software Engineering & Inquiries',
    description:
      'Connect with KELDORATHAL to start your software project, request a consultation, or discuss full-stack web and app engineering.',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'Contact KELDORATHAL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact KELDORATHAL | Software Engineering & Inquiries',
    description:
      'Start your next software or web development project with KELDORATHAL.',
    images: ['/images/logoo.png'],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
