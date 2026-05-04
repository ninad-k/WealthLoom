"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Check, Globe, Layout, Palette, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function CreatorSignupPage() {
  const [step, setStep] = useState(1);
  const [schoolName, setSchoolName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Rocket className="text-primary w-6 h-6" />
            <span className="text-2xl font-bold font-outfit">{SITE_CONFIG.name}</span>
          </Link>
          <h1 className="text-3xl font-bold font-outfit">Create your video academy</h1>
          <p className="text-muted-foreground mt-2">Launch your professional school in minutes.</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-12 relative px-8">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 -z-10" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                s <= step ? "bg-primary text-background" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-8 rounded-[2.5rem] bg-card border border-border shadow-2xl"
        >
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">School Name</label>
                <div className="relative">
                  <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input 
                    required
                    type="text" 
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Design Masterclass" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Choose Subdomain</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input 
                    required
                    type="text" 
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-school" 
                    className="w-full pl-12 pr-32 py-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                    .corestream.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground px-2">Letters, numbers, and dashes only.</p>
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Verify & Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Great! {schoolName} is ready.</h2>
              <p className="text-muted-foreground">We've reserved <strong>{subdomain}.corestream.com</strong> for you. Now, let's set up your first video and branding.</p>
              
              <div className="grid gap-4">
                <button 
                  onClick={() => window.location.href = `http://${subdomain}.localhost:3000/dashboard/admin`}
                  className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                >
                  Go to my Admin Dashboard
                </button>
                <button className="w-full py-4 rounded-2xl glass font-bold hover:bg-white/5 transition-all">
                  Browse Theme Gallery
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to Core Stream's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
