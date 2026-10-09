"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";
import { Course, Enrollment } from "@/lib/types";
import { QrCode, Upload, CheckCircle2, Clock, MessageSquare, ShieldCheck, AlertCircle } from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

interface PaymentFormProps {
  course: Course;
  userEmail: string;
  userName: string;
  existingEnrollment?: Enrollment | null;
}

export default function PaymentForm({
  course,
  userEmail,
  userName,
  existingEnrollment,
}: PaymentFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [phone, setPhone] = useState(existingEnrollment?.phone || "");
  const [utr, setUtr] = useState(existingEnrollment?.utr || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(
    existingEnrollment || null
  );

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "edtech.learn@upi";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "AIMP Learning";

  // Generate UPI Payment String
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${course.price}&cu=INR&tn=${encodeURIComponent(`Enrollment for ${course.title}`)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    if (!utr.trim()) {
      setErrorMsg("Please enter your 12-digit UPI UTR Transaction Reference ID.");
      return;
    }

    if (!file && !currentEnrollment?.screenshot_url) {
      setErrorMsg("Please upload your payment confirmation screenshot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirectTo=/payment/${course.id}`);
        return;
      }

      let screenshotUrl = currentEnrollment?.screenshot_url || "";

      // Upload file to Supabase Storage if a new file was provided
      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("payment-screenshots")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          screenshotUrl = filePath;
        } else {
          screenshotUrl = filePath;
        }
      }

      // Upsert enrollment into Supabase
      const { data: enrollment, error: dbError } = await supabase
        .from("enrollments")
        .upsert({
          id: currentEnrollment?.id || undefined,
          user_id: user.id,
          course_id: course.id,
          name: userName || user.email?.split("@")[0] || "Student",
          phone: phone,
          email: userEmail || user.email || "",
          amount: course.price,
          utr: utr,
          screenshot_url: screenshotUrl || "uploaded-screenshot-ref",
          status: "pending",
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Record in payments table (student INSERT trigger enforces user_id == auth.uid() and status == 'pending')
      try {
        await supabase.from("payments").insert({
          user_id: user.id,
          course_id: course.id,
          enrollment_id: enrollment.id,
          amount: course.price,
          currency: "INR",
          provider: "upi",
          utr: utr,
          status: "pending",
        });
      } catch (payErr) {
        console.warn("Payments record creation note:", payErr);
      }

      setCurrentEnrollment(enrollment as Enrollment);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Top Course Price Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-dark text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Enrollment Summary
          </span>
          <h2 className="text-2xl font-black mt-1">{course.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Instructor: {course.instructor_name} ({course.instructor_role})
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Price</span>
          <span className="text-3xl font-black text-emerald-400">
            ₹{course.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Payment Timeline Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
          Verification Process
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className={`p-3 rounded-xl border ${
            currentEnrollment ? "bg-blue-50 border-blue-200 text-brand-blue" : "bg-slate-50 border-slate-200 text-slate-400"
          }`}>
            <span className="block mb-1">1. Submitted</span>
            <CheckCircle2 className="w-4 h-4 mx-auto" />
          </div>
          <div className={`p-3 rounded-xl border ${
            currentEnrollment?.status === "pending"
              ? "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
              : currentEnrollment?.status === "approved"
              ? "bg-blue-50 border-blue-200 text-brand-blue"
              : "bg-slate-50 border-slate-200 text-slate-400"
          }`}>
            <span className="block mb-1">2. Under Verification</span>
            <Clock className="w-4 h-4 mx-auto" />
          </div>
          <div className={`p-3 rounded-xl border ${
            currentEnrollment?.status === "approved"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-slate-50 border-slate-200 text-slate-400"
          }`}>
            <span className="block mb-1">3. Course Unlocked</span>
            <ShieldCheck className="w-4 h-4 mx-auto" />
          </div>
        </div>
      </div>

      {currentEnrollment?.status === "pending" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
          <Clock className="w-12 h-12 text-amber-600 mx-auto animate-bounce" />
          <h3 className="text-xl font-black text-amber-900">
            Payment Verification in Progress
          </h3>
          <p className="text-sm text-amber-800 max-w-lg mx-auto">
            Your UTR reference <span className="font-mono font-bold">{currentEnrollment.utr}</span> has been submitted. Our team is verifying your payment manually. Once your payment is verified and enrollment is confirmed, your course access will be unlocked.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href={getWhatsAppLink(`Hello! I submitted payment for ${course.title} with UTR: ${currentEnrollment.utr}. Please verify my enrollment.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp for Fast Track
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Dynamic UPI QR Code & Instructions */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-brand-blue text-xs font-extrabold rounded-lg">
              <QrCode className="w-4 h-4" /> Scan & Pay via any UPI App
            </div>

            <div className="flex justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl w-fit mx-auto shadow-inner">
              <QRCodeSVG
                value={upiString}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-bold text-slate-800">UPI ID:</span> {upiId}</p>
              <p><span className="font-bold text-slate-800">Payee Name:</span> {upiName}</p>
              <p><span className="font-bold text-slate-800">Amount:</span> ₹{course.price}</p>
            </div>

            <div className="pt-2 text-left bg-slate-50 p-4 rounded-xl text-xs space-y-2 text-slate-600 border border-slate-200/60">
              <p className="font-bold text-slate-800">Payment Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Scan the QR code using Google Pay, PhonePe, Paytm, or BHIM.</li>
                <li>Pay the exact amount of <span className="font-bold">₹{course.price}</span>.</li>
                <li>Copy the 12-digit UTR / UPI Transaction Reference Number.</li>
                <li>Upload the payment confirmation screenshot on the right.</li>
              </ol>
            </div>
          </div>

          {/* Right Column: UTR & Screenshot Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Submit Payment Details
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Student Name
              </label>
              <input
                type="text"
                disabled
                value={userName || userEmail}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Required for WhatsApp Updates)
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                12-Digit UTR / Transaction Ref ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 427819203847"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Upload Payment Screenshot
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-brand-blue/50 rounded-2xl p-4 text-center bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-brand-blue mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-700 block">
                    {file ? file.name : "Click to choose screenshot image"}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Supports PNG, JPG, WEBP (Max 5MB)
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Submitting Payment..." : "Submit Payment for Verification"}
            </button>

            <a
              href={getWhatsAppLink(WHATSAPP_MESSAGES.enrollment)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Need Assistance? Chat on WhatsApp
            </a>

          </form>

        </div>
      )}

    </div>
  );
}
