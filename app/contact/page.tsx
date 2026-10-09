"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, Send, CheckCircle2, AlertCircle, MessageSquare, QrCode, ExternalLink, ArrowRight } from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES, DEFAULT_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [statusState, setStatusState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const whatsappUrl = getWhatsAppLink(WHATSAPP_MESSAGES.general);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setErrorText("Please fill out all required fields.");
      setStatusState("error");
      return;
    }

    setStatusState("sending");
    setErrorText("");

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: "new",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Contact message submission error:", error);
        setStatusState("error");
        setErrorText("Unable to send message. Please try again.");
      } else {
        setStatusState("success");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setStatusState("error");
      setErrorText("Unable to send message. Please try again.");
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-white/10 text-center space-y-3">
          <span className="px-3.5 py-1 bg-brand-blue/20 text-brand-blue text-xs font-black rounded-full uppercase tracking-wider border border-brand-blue/30 inline-block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Contact Us</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about our courses, enrollment or learning programs? Get in touch with us directly on WhatsApp or submit a message below.
          </p>
        </div>

        {/* SECTION: CONNECT WITH US ON WHATSAPP */}
        <section aria-labelledby="whatsapp-heading" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider border border-emerald-200">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Direct Contact
            </div>
            <h2 id="whatsapp-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              Connect with Us on WhatsApp
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Have questions about our courses or enrollment?<br className="hidden sm:inline" />
              {" "}Scan the QR code to contact us directly on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
            {/* Left: Actual QR Code Image */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative p-3 bg-white rounded-3xl shadow-lg border border-slate-200 w-full max-w-[280px]">
                <Image
                  src="/images/whatsapp-qr.png"
                  alt="Anwar - WhatsApp Contact QR Code"
                  width={288}
                  height={512}
                  priority
                  className="w-full h-auto rounded-2xl object-contain mx-auto block"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-3 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                Scan using WhatsApp Camera
              </span>
            </div>

            {/* Right: Action & Scanning Instructions */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Direct WhatsApp Number
                </span>
                <p className="text-2xl font-black text-slate-900">
                  +91 93906 69648
                </p>
                <p className="text-xs text-slate-500">
                  Contact Mentor: <strong className="text-slate-700">Shaik Anwar</strong>
                </p>
              </div>

              {/* Open WhatsApp Chat Button */}
              <div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>
                <p className="text-[11px] text-slate-400 mt-2">
                  Opens WhatsApp with a prefilled general enquiry. You can edit and send the message manually.
                </p>
              </div>

              {/* Instructions */}
              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  How to Scan the QR Code:
                </h3>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>Open <strong>WhatsApp</strong> on your mobile phone.</li>
                  <li>Tap the <strong>Camera</strong> icon or go to <strong>Settings</strong> and tap the <strong>QR code icon</strong> next to your name.</li>
                  <li>Point your phone camera at the QR code on the left to start a direct chat.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT: CONTACT INFO + FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900">Direct Contact Details</h2>

              <div className="space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3.5 bg-emerald-50 hover:bg-emerald-100/70 rounded-2xl border border-emerald-200/80 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">WhatsApp & Phone</span>
                    <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">+91 93906 69648</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Click to chat →</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Email</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 break-all">anwarshaik7288@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                Our support team typically responds to all course inquiries and enrollment questions within a few hours on WhatsApp.
              </div>
            </div>
          </div>

          {/* Right: Working Contact Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-blue" />
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and your message will be delivered directly to our support team.
              </p>
            </div>

            {statusState === "success" && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Message sent successfully. We will get back to you soon.
              </div>
            )}

            {statusState === "error" && (
              <div className="p-4 bg-red-50 text-red-900 rounded-2xl border border-red-200 flex items-center gap-3 text-xs sm:text-sm font-bold">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                {errorText || "Unable to send message. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9390669648"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Course enrollment question"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>

              <button
                type="submit"
                disabled={statusState === "sending"}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {statusState === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
