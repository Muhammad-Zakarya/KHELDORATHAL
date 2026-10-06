export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://keldorathal.com';

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'KELDORATHAL',
    url: baseUrl,
    logo: `${baseUrl}/images/logoo.png`,
    image: `${baseUrl}/images/logoo.png`,
    description:
      'KELDORATHAL is a full-stack software development company providing modern web applications, cross-platform apps, MERN stack development, and API architectures.',
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#founder`,
      name: 'Muhammad Zakarya',
      jobTitle: 'Founder & Lead Software Engineer',
      sameAs: [
        'https://github.com/muhammad-zakarya',
        'https://www.instagram.com/muhammad.zakarya.khan/',
      ],
    },
    sameAs: [
      'https://github.com/muhammad-zakarya',
      'https://www.instagram.com/muhammad.zakarya.khan/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+923278326788',
      contactType: 'customer support',
      email: 'muhammadzak4rya@gmail.com',
      availableLanguage: ['English', 'Urdu'],
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'KELDORATHAL',
    description: 'High-performance web applications, cross-platform apps, and full-stack software engineering solutions.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };

  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#service`,
    name: 'KELDORATHAL Software Development',
    url: `${baseUrl}/services`,
    parentOrganization: {
      '@id': `${baseUrl}/#organization`,
    },
    description:
      'Engineering custom software solutions, full-stack web platforms, mobile applications, and high-performance REST APIs.',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Wire Transfer',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description: 'Fast, responsive Next.js and React web applications optimized for SEO and conversion.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cross-Platform App Development',
            description: 'Mobile and desktop applications for iOS, Android, and Web using React Native and Flutter.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'MERN Stack Development',
            description: 'End-to-end web apps leveraging MongoDB, Express.js, React, and Node.js.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'RESTful & GraphQL API Development',
            description: 'Secure, scalable APIs designed for seamless third-party and mobile integration.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Software Architecture',
            description: 'Tailored enterprise software and workflow automation systems.',
          },
        },
      ],
    },
  };

  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#founder`,
    name: 'Muhammad Zakarya',
    jobTitle: 'Founder & Full-Stack Developer',
    worksFor: {
      '@id': `${baseUrl}/#organization`,
    },
    url: `${baseUrl}/about`,
    sameAs: [
      'https://github.com/muhammad-zakarya',
      'https://www.instagram.com/muhammad.zakarya.khan/',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
    </>
  );
}
