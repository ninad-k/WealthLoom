"use client";

import { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Package, CreditCard, UploadCloud, Settings, Plus, Check } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function CreatorDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("videos");
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  // Mock data for UI demonstration
  const mockVideos = [
    { id: 1, title: "Introduction to Advanced Algorithms", duration: "12:45" },
    { id: 2, title: "Mastering System Design", duration: "45:20" },
    { id: 3, title: "Database Sharding Deep Dive", duration: "30:15" }
  ];

  const handleVideoSelect = (id: number) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter(v => v !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const handleCreateCourse = () => {
    alert(`Generating Course with videos: ${selectedVideos.join(', ')}\n(This will call the .NET 10 gRPC CreateCourse endpoint)`);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/50 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold font-outfit text-primary tracking-tight">
            {SITE_CONFIG.name}
          </Link>
          <div className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Creator Studio
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab("videos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "videos" ? "bg-primary text-background shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"}`}
          >
            <Video className="w-4 h-4" /> Videos
          </button>
          <button 
            onClick={() => setActiveTab("courses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "courses" ? "bg-primary text-background shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"}`}
          >
            <Package className="w-4 h-4" /> Course Packages
          </button>
          <button 
            onClick={() => setActiveTab("pricing")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "pricing" ? "bg-primary text-background shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"}`}
          >
            <CreditCard className="w-4 h-4" /> Monetization
          </button>
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors">
            <UserButton afterSignOutUrl="/" />
            <div className="text-sm font-medium truncate">
              {user?.fullName || "Creator"}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-border/50 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-2xl font-bold font-outfit capitalize">
            {activeTab === "courses" ? "Course Builder" : activeTab}
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background transition-all rounded-lg font-medium text-sm">
            <Settings className="w-4 h-4" /> School Settings
          </button>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === "videos" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold">Video Library</h2>
                  <p className="text-muted-foreground text-sm">Upload and manage your raw video files.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <UploadCloud className="w-4 h-4" /> Upload New Video
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockVideos.map((video) => (
                  <div key={video.id} className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => handleVideoSelect(video.id)}>
                    <div className="aspect-video bg-muted rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <Video className="w-8 h-8 text-muted-foreground/30" />
                      {selectedVideos.includes(video.id) && (
                        <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center">
                          <div className="bg-primary text-background rounded-full p-2 shadow-lg">
                            <Check className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{video.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{video.duration}</p>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {selectedVideos.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 bg-card border border-border shadow-2xl p-4 rounded-2xl flex items-center gap-6 z-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {selectedVideos.length}
                      </div>
                      <span className="font-medium text-sm">videos selected</span>
                    </div>
                    <button 
                      onClick={handleCreateCourse}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-background rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Package into Course <Package className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "courses" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Courses Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Select multiple videos from your Video Library and package them together into a sellable course.</p>
              <button onClick={() => setActiveTab("videos")} className="px-6 py-3 border border-border rounded-xl font-medium hover:border-primary hover:text-primary transition-colors">
                Go to Video Library
              </button>
            </motion.div>
          )}

          {activeTab === "pricing" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <CreditCard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Stripe Monetization</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Create pricing tiers (e.g. $99/mo) and link them to your Course Packages.</p>
              <button className="px-6 py-3 bg-primary text-background rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mx-auto">
                <Plus className="w-4 h-4" /> Create Pricing Tier
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}


