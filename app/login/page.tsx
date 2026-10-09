"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Mail, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = redirectTo;
      }
    });
  }, [supabase, redirectTo]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setIsUnconfirmed(false);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const errorMsgLower = (error.message || "").toLowerCase();
        if (
          errorMsgLower.includes("invalid login credentials") ||
          errorMsgLower.includes("invalid credential")
        ) {
          setErrorMsg(
            "Invalid email or password. Please verify your credentials. If you previously registered using Google, please click 'Sign In with Google' above."
          );
        } else if (
          errorMsgLower.includes("email not confirmed") ||
          (error as any).code === "email_not_confirmed"
        ) {
          setIsUnconfirmed(true);
          setErrorMsg(
            "Your email has not been confirmed yet. Please check your email inbox (and spam folder) for the verification link, or click below to resend it. You can also sign in with Google for instant access."
          );
        } else if (errorMsgLower.includes("rate limit")) {
          setErrorMsg(
            "Rate limit reached. Please wait a few moments before trying again, or use 'Sign In with Google'."
          );
        } else {
          setErrorMsg(error.message);
        }
        setIsLoading(false);
      } else if (data.user) {
        let role = (data.user.user_metadata?.role as string) || "student";
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle();
          if (profile?.role) {
            role = profile.role;
          }
        } catch {
          // Fallback
        }

        const dest = role === "admin" ? "/admin" : redirectTo;
        setSuccessMsg(`Signed in successfully! Redirecting to ${role === "admin" ? "Admin Panel" : "Dashboard"}...`);
        
        router.refresh();
        setTimeout(() => {
          window.location.href = dest;
        }, 300);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg("Please enter your email address to resend the verification link.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Verification link resent! Please check your email inbox and spam folder.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (resetEmail || email).trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setIsResetLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          setErrorMsg("Password reset email rate limit reached. Please wait a few minutes, or sign in directly with Google.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setSuccessMsg("Password reset email sent! Check your inbox for the reset link.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset email.");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
      
      {/* Logo Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-black text-lg shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            AIMP
          </span>
        </Link>
        <h1 className="text-xl font-black text-slate-900">Sign In to Your Account</h1>
        <p className="text-xs text-slate-500">Access your enrolled LMS courses & dashboard</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Unconfirmed Email Action */}
      {isUnconfirmed && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <p className="text-xs text-amber-800 font-semibold">
            Didn&apos;t receive the verification email? Click below to send a fresh link:
          </p>
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Resending..." : "Resend Verification Link"}
          </button>
        </div>
      )}

      {showForgotPassword ? (
        /* Forgot Password View */
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Reset Your Password</h2>
          </div>
          <p className="text-xs text-slate-500">
            Enter your email and we will send you a secure link to create a new password.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={resetEmail || email}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full py-3 px-4 font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isResetLoading ? "Sending Link..." : "Send Password Reset Link"}
            </button>
          </form>
        </div>
      ) : (
        /* Standard Login View */
        <>
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl font-extrabold text-xs text-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
              Or Sign in with Email
            </span>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[11px] font-bold text-brand-blue hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-xl shadow-md shadow-brand-blue/20 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 font-semibold pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-blue font-extrabold hover:underline">
              Create an account
            </Link>
          </div>
        </>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm font-bold text-slate-500">Loading auth...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
