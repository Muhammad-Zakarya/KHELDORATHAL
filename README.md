# KELDORATHAL - Software Development Studio

**KELDORATHAL** is a full-stack software development company & freelancing web platform founded and led by **Muhammad Zakarya** (Founder & Full-Stack Web Developer).

Built with **Next.js App Router**, **React**, **JavaScript**, **Tailwind CSS**, and **MongoDB with Mongoose**.

---

## 🚀 Key Features

### Public Website
- **Hero Showcase**: Dark developer theme featuring a prominent portrait of founder **Muhammad Zakarya**, ambient blue/purple glowing badges, and action CTAs.
- **6 Core Services**: Web Development, Cross-Platform App Development, MERN Stack Development, API Development, Full-Stack Development, and Custom Software Solutions.
- **Portfolio Showcase**: Interactive project cards and dynamic SEO-friendly details pages (`/projects/[slug]`).
- **Direct Contact**: Integrated contact form, WhatsApp quick-link (`+923278326788`), email (`muhammadzak4rya@gmail.com`), GitHub, and LinkedIn profiles.

### Customer Portal (`/customer`)
- **Protected Session**: Secure JWT cookie-based session management.
- **Order Placement**: Select service, set title, description, budget (USD/PKR), deadline, and submit order directly to MongoDB.
- **Order Tracking**: Track real-time order status updates (*Pending*, *Reviewed*, *Accepted*, *In Progress*, *Completed*, *Rejected*).
- **Profile Management**: View account profile details.

### Admin Dashboard (`/admin`)
- **Exclusive Access**: Protected for founder **Muhammad Zakarya** (`role: "admin"`).
- **Business Analytics**: Overview statistics cards for total customers, services, projects, orders, pending requests, and contact messages.
- **Services CRUD**: Create, edit, and delete service offerings.
- **Projects CRUD**: Create, edit, and delete portfolio showcase projects.
- **Order Control**: Review order descriptions and update customer order status dynamically.
- **Customer List & Messages**: View registered customer accounts and incoming contact submissions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, JavaScript `.jsx`)
- **Styling**: Tailwind CSS v4 with custom dark theme, grid background, and glow effects
- **Database**: MongoDB via Mongoose connection caching (`lib/mongodb.js`)
- **Authentication**: JWT signed with `jose`, hashed with `bcryptjs`, and stored in HTTP-only cookies
- **Icons**: `lucide-react`
- **SEO**: Metadata API, JSON-LD structured data (Organization & Person), `robots.txt`, and `sitemap.xml`

---

## 🏃 Getting Started

### 1. Installation
Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/keldorathal
JWT_SECRET=keldorathal_super_secret_jwt_key_2026
```

### 3. Database Seeding & Admin Account
The application automatically seeds initial data on initial load via `/api/seed`.

- **Admin Email**: `muhammadzak4rya@gmail.com`
- **Admin Default Password**: `admin12345`

### 4. Development Server
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
app-[#05070e]/
├── layout.jsx            # Root layout with Navbar, Footer, and SEO metadata
├── page.jsx              # Impressive Homepage with Hero & Service/Project showcases
├── about/page.jsx        # Founder bio, skills, and company philosophy
├── services/page.jsx     # Service listings with Order Modal trigger
├── projects/
│   ├── page.jsx          # Portfolio projects list
│   └── [slug]/page.jsx   # Dynamic project details page
├── contact/page.jsx      # Contact form & WhatsApp integration
├── login/page.jsx        # User & Admin login
├── signup/page.jsx       # Customer registration
├── customer/             # Customer portal & order tracking
└── admin/                # Founder Admin dashboard & CRUD management
components/               # Reusable UI components
lib/                      # MongoDB connection & JWT Auth helpers
models/                   # Mongoose schemas (User, Service, Project, Order, Message)
public/images/            # Profile portrait of founder Muhammad Zakarya
```

---

## 📜 License & Copyright
© {new Date().getFullYear()} **KELDORATHAL**. Founded by **Muhammad Zakarya**. All rights reserved.
