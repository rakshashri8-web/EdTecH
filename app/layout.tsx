import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "AIMP — Learn Skills. Build Projects. Get Career Ready.",
  description: "Industry-focused AIMP platform offering hands-on projects, practical skills, and certificates in Data Analytics, Data Science, AI/ML, GenAI, and Agentic AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Navbar initialUser={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
