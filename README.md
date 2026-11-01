# 🎓 AIMP - Modern LMS & Educational Platform

A production-grade, enterprise Learning Management System (LMS) built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + RLS + Storage + Auth)**.

Includes a **secure Google Drive video streaming proxy** with HTTP Range scrubbing, **automatic video duration detection**, **manual UPI payment enrollment verification**, student dashboards, and a robust admin management portal.

---

## ✨ Features

- 🚀 **Next.js 14 App Router & React 18**: Server components, streaming, dynamic layouts, and static optimization.
- 🎥 **Google Drive Secure Video Streaming Engine**:
  - Streams private Google Drive videos via secure server-side proxy (`/api/videos/[lessonId]/stream`).
  - Supports HTTP `206 Partial Content` Range headers for instant video seeking and scrubbing without buffering the entire file.
  - Keeps Google Drive file IDs and raw links hidden from students.
  - Automatic video duration detection (`videoMediaMetadata.durationMillis`).
  - Free Preview vs. Locked lesson access controls.
- 🔐 **Supabase Authentication & Row-Level Security (RLS)**:
  - Role-based separation (`student`, `instructor`, `admin`, `super_admin`).
  - Google OAuth & Email/Password authentication with automatic profile synchronization.
  - Strict database-level security policies ensuring students cannot elevate privileges or tamper with payment records.
- 💳 **Seamless Manual UPI Enrollment**:
  - Dynamic QR code generation for UPI apps (GPay, PhonePe, Paytm, BHIM).
  - Transaction UTR submission & payment screenshot upload to private Supabase Storage.
  - Real-time pending enrollment status tracking.
- 🛡️ **Admin Portal**:
  - Live approval/rejection pipeline for pending UPI enrollments with instant image preview.
  - Course, module, lesson, and video management with drag-and-drop sequencing.
  - One-click Google Drive OAuth authorization.
  - Super Admin administrator delegation.
- 📱 **Mobile-First Responsive Design**:
  - Dark-mode optimized classroom interface with 16:9 responsive video layout.
  - Clean lesson sidebar navigation with automatic completion checkmarks.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL with RLS & Triggers)
- **Storage**: Supabase Storage (`payment-proofs`) & Google Drive API v3 (Video hosting)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** 18.17 or higher
- **npm** or **yarn** or **pnpm**
- A **Supabase** project
- A **Google Cloud Console** project with Google Drive API enabled

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_SITE_URL=https://edtech-eight-chi.vercel.app

# Google Drive Video Storage Integration
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret
GOOGLE_DRIVE_REDIRECT_URI=https://edtech-eight-chi.vercel.app/api/admin/drive/callback

# Manual UPI Payment Settings
NEXT_PUBLIC_UPI_ID=your-upi-id@bank
NEXT_PUBLIC_UPI_NAME=AIMP Academy
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture & Structure

```
edtech/
├── app/                        # Next.js 14 App Router
│   ├── (public)/               # Public pages (about, faq, pricing, contact)
│   ├── admin/                  # Admin portal (courses, lessons, payments, admins)
│   ├── api/                    # API routes
│   │   ├── admin/              # Admin CRUD, Google Drive OAuth & duration detection
│   │   └── videos/             # Secure Google Drive range streaming proxy
│   ├── courses/                # Course catalog and course detail pages
│   ├── dashboard/              # Student dashboard & enrolled courses
│   ├── learn/[courseId]/       # Interactive classroom video player & curriculum
│   ├── payment/                # Manual UPI payment & screenshot upload
│   └── layout.tsx              # Root layout & global providers
├── components/                 # Reusable React components
│   ├── admin/                  # Admin course and lesson managers
│   ├── ClassroomPlayer.tsx     # Responsive 16:9 lesson video player
│   ├── CurriculumAccordion.tsx # Curriculum module list with lock & preview badges
│   ├── Navbar.tsx              # Top navigation with Google profile sync
│   └── PaymentModal.tsx        # UPI payment modal & QR generator
├── lib/                        # Core utilities & server libraries
│   ├── auth.ts                 # Auth helpers, role checking & profile resolution
│   ├── google-drive.ts         # Google Drive OAuth & range-based streaming
│   ├── video-duration.ts       # Video duration auto-detection engine
│   └── supabase/               # Supabase browser, server, and admin clients
└── supabase/                   # Database schemas and migrations
    ├── migrations/             # Incremental SQL migrations
    └── schema.sql              # Base database schema & RLS policies
```

---

## 📄 License

This project is licensed under the MIT License.
