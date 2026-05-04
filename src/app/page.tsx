"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap, Users, Rocket } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function PlatformLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Rocket className="text-background w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-outfit">
                {SITE_CONFIG.brand.first}<span className="text-primary">{SITE_CONFIG.brand.second}</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-primary transition-colors">Business Plans</Link>
              <Link href="/login" className="hover:text-primary transition-colors">Creator Login</Link>
            </div>

            <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20">
              Launch Your School
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <Zap className="w-3 h-3" />
                <span>The Future of Knowledge Monetization</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold font-outfit mb-8 leading-[1.1] tracking-tight">
                Turn Your Knowledge into a <br />
                <span className="gradient-text">Profitable Academy</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                The all-in-one platform for experts to build, market, and sell online video courses 
                with built-in anti-piracy and multi-tenant support.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/25 cursor-pointer">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl glass font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  View Demo School
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Multi-Tenant Features */}
        <section id="features" className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-outfit mb-4">Built for Serious Scaling</h2>
              <p className="text-muted-foreground">Everything you need to run a professional education business.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Custom Subdomains",
                  desc: "Every creator gets their own unique subdomain or custom domain for their school.",
                  icon: Globe
                },
                {
                  title: "Anti-Piracy Vault",
                  desc: "Protect your videos with dynamic watermarking and encrypted HLS streaming.",
                  icon: Shield
                },
                {
                  title: "Global Payments",
                  desc: "Accept payments from students anywhere in the world with Stripe Connect.",
                  icon: Users
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl glass border border-border/50">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-outfit">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Platform Footer */}
      <footer className="py-12 border-t border-border/50 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Rocket className="text-primary w-5 h-5" />
            <span className="text-lg font-bold font-outfit">{SITE_CONFIG.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 {SITE_CONFIG.name} Platform. Join 500+ creators today.</p>
        </div>
      </footer>
    </div>
  );
}
