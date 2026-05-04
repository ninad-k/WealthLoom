"use client";

import { Check, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { TenantConfig } from "@/lib/tenants";

export default function ClientCheckout({ tenant, selectedPlan }: { tenant: TenantConfig, selectedPlan: any }) {
  if (!tenant || !selectedPlan) return null;

  return (
    <div 
      className="min-h-screen bg-background flex flex-col md:flex-row"
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

      {/* Left Column - Product Details */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-r border-border">
        <div>
          <Link href={`/`} className="text-2xl font-bold tracking-tight font-outfit mb-12 block">
            {tenant.brand.first}<span className="text-primary">{tenant.brand.second}</span>
          </Link>
          
          <h1 className="text-3xl lg:text-5xl font-bold font-outfit mb-6">Complete your purchase</h1>
          <p className="text-muted-foreground text-lg mb-8">
            You are subscribing to the <strong>{selectedPlan.name}</strong> plan for {tenant.company}.
          </p>

          <ul className="space-y-4 mb-12">
            {selectedPlan.features.map((feature: string, j: number) => (
              <li key={j} className="flex items-center gap-3 text-lg">
                <Check className="w-5 h-5 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          Secure checkout provided by Stripe.
        </div>
      </div>

      {/* Right Column - Payment Form */}
      <div className="w-full md:w-1/2 bg-card p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-[2.5rem] bg-background border border-border shadow-2xl">
            <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
              <div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Due Today</div>
                <div className="text-4xl font-bold font-outfit">{selectedPlan.price}</div>
              </div>
              <div className="text-sm text-muted-foreground">/ month</div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Card Details</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="•••• •••• •••• ••••" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono tracking-widest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                  <input type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                Pay {selectedPlan.price}
              </button>
            </form>
            
            <p className="text-xs text-center text-muted-foreground mt-6">
              Payments are processed securely. {SITE_CONFIG.name} takes a platform fee from this transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
