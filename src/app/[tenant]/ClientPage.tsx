"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Shield, Mail, Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import { TenantConfig } from "@/lib/tenants";
import { SITE_CONFIG } from "@/lib/constants";

export default function TenantClientPage({ tenant }: { tenant: TenantConfig }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div 
      className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary"
      style={{ 
        // @ts-ignore
        '--primary': tenant.brand.primary_color || tenant.brand.primaryColor,
        '--background': tenant.brand.secondary_color || tenant.brand.secondaryColor 
      }}
    >
      <style jsx global>{`
        :root {
          --primary: ${tenant.brand.primary_color || tenant.brand.primaryColor};
          --background: ${tenant.brand.secondary_color || tenant.brand.secondaryColor};
        }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="text-background w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-outfit">
                {tenant.brand.first}<span className="text-primary">{tenant.brand.second}</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="#newsletter" className="hover:text-primary transition-colors">Newsletter</Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <Show when="signed-out">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="px-5 py-2.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium cursor-pointer">
                      Log in
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-all text-sm font-medium shadow-lg shadow-primary/20 cursor-pointer">
                      Join Free
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-all text-sm font-medium shadow-lg shadow-primary/20 cursor-pointer">
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </Show>
              </div>

              <button 
                className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="#features" className="block text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link href="#pricing" className="block text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                <Link href="#newsletter" className="block text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Newsletter</Link>
                <hr className="border-border" />
                <div className="flex flex-col gap-3">
                  <Show when="signed-out">
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <button className="w-full py-3 rounded-xl border border-border text-center font-medium cursor-pointer">Log in</button>
                    </SignInButton>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <button className="w-full py-3 rounded-xl bg-primary text-background text-center font-bold cursor-pointer">Join Free</button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <Link href="/dashboard" className="w-full py-3 rounded-xl bg-primary text-background text-center font-bold block cursor-pointer">Dashboard</Link>
                  </Show>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <Zap className="w-3 h-3" />
                <span>{tenant.description}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-outfit mb-6 md:mb-8 leading-[1.1] tracking-tight">
                Welcome to <br />
                <span className="gradient-text">{tenant.name}</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                Access exclusive content curated by {tenant.company} to help you master your skills.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                <Show when="signed-out">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/25 cursor-pointer">
                      Start Learning Free
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/25 cursor-pointer">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Show>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-outfit mb-4">Pricing Plans</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              {tenant.pricing.map((plan: any, i: number) => (
                <div key={i} className="p-8 rounded-[2.5rem] border border-border bg-card">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-4">{plan.price}</div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={`/checkout`}
                    className="w-full py-4 rounded-2xl bg-primary text-background font-bold text-center block hover:bg-primary/90 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {tenant.company}. Powered by {SITE_CONFIG.name}.</p>
        </div>
      </footer>
    </div>
  );
}
