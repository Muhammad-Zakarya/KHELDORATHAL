import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Service from '@/models/Service';
import Project from '@/models/Project';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    // 1. Seed Admin User (Muhammad Zakarya)
    const adminEmail = 'muhammadzak4rya@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await hashPassword('admin12345');
      admin = await User.create({
        name: 'Muhammad Zakarya',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
    }

    // 2. Seed Services
    const initialServices = [
      {
        title: 'Web Development',
        slug: 'web-development',
        description: 'Modern, fast, and responsive websites tailored for business growth, optimized for SEO and conversion.',
        technologies: ['Next.js', 'React', 'Tailwind CSS', 'JavaScript', 'HTML5/CSS3'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-web.jpg',
      },
      {
        title: 'Cross-Platform App Development',
        slug: 'cross-platform-app-development',
        description: 'High-performance mobile and desktop applications built to run seamlessly on iOS, Android, and Web.',
        technologies: ['React Native', 'Flutter', 'JavaScript', 'REST APIs'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-app.jpg',
      },
      {
        title: 'MERN Stack Development',
        slug: 'mern-stack-development',
        description: 'End-to-end web app development leveraging MongoDB, Express, React, and Node.js for robust performance.',
        technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Mongoose'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-mern.jpg',
      },
      {
        title: 'API Development',
        slug: 'api-development',
        description: 'Secure, scalable, and well-documented RESTful & GraphQL APIs designed for seamless software integration.',
        technologies: ['Node.js', 'Express', 'Next.js API Routes', 'JWT', 'MongoDB'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-api.jpg',
      },
      {
        title: 'Full-Stack Development',
        slug: 'full-stack-development',
        description: 'Comprehensive digital solution engineering from intuitive UI design to database architecture and deployment.',
        technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-fullstack.jpg',
      },
      {
        title: 'Custom Software Solutions',
        slug: 'custom-software-solutions',
        description: 'Tailored software architectures designed to solve unique business challenges and automate workflows.',
        technologies: ['Custom Stack', 'Micro-Architectures', 'MongoDB', 'Cloud Infrastructure'],
        priceType: 'Request a Quote',
        price: 'Project Dependent',
        currency: 'USD',
        image: '/images/service-custom.jpg',
      },
    ];

    for (const service of initialServices) {
      await Service.findOneAndUpdate({ slug: service.slug }, service, { upsert: true, new: true });
    }

    // 3. Seed Projects
    const initialProjects = [
      {
        title: 'Nexus AI - Intelligent SaaS Workspace',
        slug: 'nexus-ai-workspace',
        description: 'A full-stack SaaS platform featuring real-time document collaboration, AI insights, and custom workspace dashboards.',
        image: '/images/project-saas.jpg',
        technologies: ['Next.js', 'React', 'Tailwind CSS', 'MongoDB', 'Mongoose'],
        githubUrl: 'https://github.com/muhammad-zakarya',
        liveUrl: 'https://keldorathal.com',
        featured: true,
      },
      {
        title: 'Apex E-Commerce Ecosystem',
        slug: 'apex-ecommerce-platform',
        description: 'Modern full-stack e-commerce experience built with dynamic product management, customer dashboards, and high speed page rendering.',
        image: '/images/project-ecommerce.jpg',
        technologies: ['Next.js', 'React', 'MongoDB', 'Tailwind CSS'],
        githubUrl: 'https://github.com/muhammad-zakarya',
        liveUrl: 'https://keldorathal.com',
        featured: true,
      },
      {
        title: 'Pulse Analytics & CRM Dashboard',
        slug: 'pulse-analytics-crm',
        description: 'Enterprise data visualization software providing real-time metrics tracking, user role management, and customer reporting.',
        image: '/images/project-crm.jpg',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        githubUrl: 'https://github.com/muhammad-zakarya',
        liveUrl: 'https://keldorathal.com',
        featured: true,
      },
    ];

    for (const proj of initialProjects) {
      await Project.findOneAndUpdate({ slug: proj.slug }, proj, { upsert: true, new: true });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with Admin account, Core Services, and Portfolio Projects.',
      adminEmail: adminEmail,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
