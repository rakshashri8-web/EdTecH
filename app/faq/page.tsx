import FAQ from "@/components/FAQ";

export const metadata = {
  title: "Frequently Asked Questions — EdTech LMS",
  description: "Find answers to common questions regarding course enrollments, payments, curriculum, and certificates.",
};

export default function FAQPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <FAQ />
    </div>
  );
}
