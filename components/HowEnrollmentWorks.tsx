import { 
  CreditCard, 
  FileCheck2, 
  CheckCircle2, 
  Laptop, 
  GraduationCap, 
  Lock, 
  ArrowRight, 
  ArrowDown,
  Sparkles
} from "lucide-react";

interface HowEnrollmentWorksProps {
  className?: string;
  showCardWrapper?: boolean;
}

export default function HowEnrollmentWorks({ 
  className = "", 
  showCardWrapper = true 
}: HowEnrollmentWorksProps) {
  const steps = [
    {
      number: "1",
      flowLabel: "Payment",
      title: "1. Complete the course payment",
      desc: "Choose your course and complete the payment using the provided payment method.",
      icon: CreditCard,
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-50 border-blue-200 text-brand-blue",
    },
    {
      number: "2",
      flowLabel: "Payment Verification",
      title: "2. Payment verification",
      desc: "Submit your payment details/UTR and payment screenshot. Your payment will be verified manually.",
      icon: FileCheck2,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      number: "3",
      flowLabel: "Enrollment Confirmation",
      title: "3. Enrollment confirmation",
      desc: "Once your payment is verified, your enrollment will be confirmed.",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      number: "4",
      flowLabel: "Course Access",
      title: "4. Get course access",
      desc: "You will receive access to the private course portal and/or private YouTube content.",
      icon: Laptop,
      color: "from-purple-500 to-violet-600",
      accentBg: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      number: "5",
      flowLabel: "Classes & Recordings",
      title: "5. Attend classes & watch recordings",
      desc: "Class links and recordings will be shared regularly. You can watch the recordings whenever required during your access period.",
      icon: GraduationCap,
      color: "from-brand-blue to-brand-purple",
      accentBg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
  ];

  const content = (
    <div className={`space-y-10 ${className}`}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Clear & Transparent Process
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Enrollment Works
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          The enrollment process is simple and straightforward 😊
        </p>
      </div>

      {/* Visual Process Flow (Horizontal on lg screens, Vertical on smaller) */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
        <div className="text-center mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400">
            Visual Step-by-Step Flow
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="flex flex-col lg:flex-row items-center w-full lg:w-auto flex-1">
                <div className="flex items-center gap-3 lg:flex-col lg:text-center w-full lg:w-auto p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block lg:mt-1">
                      Step {step.number}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white block">
                      {step.flowLabel}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="my-2 lg:my-0 lg:mx-2 text-slate-400 shrink-0 flex justify-center items-center">
                    {/* Down arrow on mobile / tablet, Right arrow on desktop */}
                    <ArrowDown className="w-4 h-4 lg:hidden text-blue-400" />
                    <ArrowRight className="w-4 h-4 hidden lg:block text-blue-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed 5-Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border ${step.accentBg}`}>
                    {step.number}
                  </span>
                  <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-brand-blue transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Phase {step.number} of 5</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Private Access Note */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-start sm:items-center gap-3.5 max-w-3xl mx-auto shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-extrabold text-slate-900 block sm:inline mr-1">
            Private Access Notice:
          </span>
          Please keep your course access details private and do not share them with others.
        </div>
      </div>
    </div>
  );

  if (showCardWrapper) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {content}
        </div>
      </section>
    );
  }

  return content;
}
