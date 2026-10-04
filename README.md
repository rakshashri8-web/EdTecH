# 🎓 EdTecH - Modern LMS & Educational Platform

A production-grade, enterprise Learning Management System (LMS) built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + RLS + Storage + Auth)**.

Designed for seamless course exploration, interactive video learning with real-time progress tracking, manual UPI payment enrollment verification, student dashboards, and a robust admin management portal.

---

## ✨ Features

- 🚀 **Next.js 14 App Router & React 18**: Server components, streaming, dynamic layouts, and static optimization.
- 🔐 **Supabase Authentication & Row-Level Security (RLS)**:
  - Role-based separation (`student`, `instructor`, `admin`).
  - Google OAuth & Email/Password authentication.
  - Strict database-level security policies and triggers ensuring students can never elevate privileges, tamper with payment statuses, or forge enrollment.
- 💳 **Seamless Manual UPI Enrollment**:
  - Dynamic QR code generation for UPI apps (GPay, PhonePe, Paytm, BHIM).
  - Transaction UTR submission & payment screenshot upload to private Supabase Storage.
  - Real-time pending enrollment status tracking.
- 🛡️ **Admin Portal**:
  - Live approval/rejection pipeline for pending UPI enrollments with instant image preview.
  - Course, module, lesson, quiz, and student management.
- 🎥 **Interactive Learning Experience**:
  - Video lesson player with responsive curriculum navigation.
  - Automated lesson completion tracking using `lesson_progress`.
  - Next/Previous lesson navigation and course progress calculation.
- 📱 **Mobile-First Responsive Design**:
  - Built with Tailwind CSS and Framer Motion for smooth micro-interactions.
  - Custom UI components with Lucide icons.
- 🌐 **SEO & Legal Ready**:
  - Dynamic `sitemap.xml` and `robots.txt` generation.
  - Full Privacy Policy, Terms, and comprehensive error handling (`404` and `500` error boundaries).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **QR Code**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** 18.17 or higher
- **npm** or **yarn** or **pnpm**
- A free **Supabase** project

### 2. Clone the Repository

```bash
git clone https://github.com/rakshashri8-web/EdTecH.git
cd EdTecH
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Manual UPI Payment Settings
NEXT_PUBLIC_UPI_ID=your-upi-id@bank
NEXT_PUBLIC_UPI_NAME=EdTech Academy
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to your GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
3. Import the `EdTecH` repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel deployment URL, e.g., `https://edtech.vercel.app`)
   - `NEXT_PUBLIC_UPI_ID`
   - `NEXT_PUBLIC_UPI_NAME`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
