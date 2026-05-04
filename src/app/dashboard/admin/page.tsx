import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrendingUp, Upload, FileVideo, CheckCircle2, AlertCircle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default async function AdminPage() {
  const { userId } = await auth();
  
  // In a real app, you would check for an 'admin' role here
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Nav */}
      <nav className="sticky top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-background w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-outfit">
                {SITE_CONFIG.brand.first}<span className="text-primary">{SITE_CONFIG.brand.second}</span> <span className="text-muted-foreground text-sm font-normal">| Creator Studio</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-outfit mb-2">Upload New Content</h1>
          <p className="text-muted-foreground">Add exclusive videos to your subscriber library.</p>
        </div>

        <div className="grid gap-8">
          {/* Monetization & Stripe Connect */}
          <div className="p-8 rounded-[2rem] border border-border bg-card shadow-sm">
            <h2 className="text-xl font-bold font-outfit mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </span>
              Monetization & Payments
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
              Connect your Stripe account to start accepting payments. Core Stream takes a 5% platform fee, and the rest goes directly to you.
            </p>
            
            <div className="bg-background rounded-2xl p-6 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.143-3.356-1.996 0-.649.626-1.22 1.637-1.22 1.83 0 3.327.818 4.316 1.492l1.62-3.666C16.89 2.87 14.774 2 12.345 2 7.784 2 4.707 4.757 4.707 8.358c0 5.485 7.153 5.405 7.153 7.643 0 .762-.757 1.428-1.928 1.428-1.85 0-3.69-.933-5.06-2.02l-1.635 3.66C4.85 20.375 7.42 21.36 10.15 21.36c4.93 0 8.04-2.73 8.04-6.42 0-5.63-7.2-5.74-7.2-7.83-1.02-3.04.98-3.04.98-3.04z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Stripe Connect</h3>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <button className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                Connect with Stripe
              </button>
            </div>
          </div>

          {/* Branding & Settings */}
          <div className="p-8 rounded-[2rem] border border-border bg-card shadow-sm">
            <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              School Branding
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Primary Color</label>
                <div className="flex items-center gap-4">
                  <input type="color" className="w-12 h-12 rounded-lg bg-background border border-border cursor-pointer" defaultValue="#f59e0b" />
                  <span className="text-sm font-mono">#f59e0b</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">School Logo</label>
                <div className="flex items-center gap-6 p-4 rounded-xl border border-border bg-background">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-primary w-6 h-6" />
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-secondary text-sm font-bold">Change Logo</button>
                  <p className="text-xs text-muted-foreground">PNG or SVG, max 500kb.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="p-8 rounded-[2rem] border border-border bg-card shadow-sm">
            <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload New Content
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Video Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Advanced Market Structures" 
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                    <option>Technical Analysis</option>
                    <option>Market Psychology</option>
                    <option>Strategy Deep Dive</option>
                    <option>Live Sessions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea 
                  placeholder="What will your members learn in this video?" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              {/* Mock File Upload Dropzone */}
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer group bg-primary/5">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-primary w-8 h-8" />
                </div>
                <h3 className="font-bold mb-1">Drag and drop your video file</h3>
                <p className="text-sm text-muted-foreground mb-4">MP4, WebM or MOV (Max 2GB)</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium">
                  <FileVideo className="w-4 h-4 text-primary" />
                  Select File
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-medium">
                  Uploading to <strong>Core Stream</strong> automatically applies your dynamic watermarking 
                  and anti-piracy encryption.
                </p>
              </div>

              <button className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Publish to Library
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
