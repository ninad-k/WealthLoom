"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface SecureVideoPlayerProps {
  src: string;
  poster?: string;
}

export default function SecureVideoPlayer({ src, poster }: SecureVideoPlayerProps) {
  const { user } = useUser();
  const [watermarkPos, setWatermarkPos] = useState({ top: "10%", left: "10%" });

  // Move the watermark randomly every 5 seconds to prevent cropping/masking
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 80) + 10}%`,
        left: `${Math.floor(Math.random() * 80) + 10}%`,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const watermarkText = user?.primaryEmailAddress?.emailAddress || user?.id || "WealthLoom Member";

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border">
      {/* 
        controlsList="nodownload" hides the download button in browsers that support it.
        onContextMenu={e => e.preventDefault()} disables right-click -> save as.
      */}
      <video
        src={src}
        poster={poster}
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-cover"
        disablePictureInPicture
      >
        Your browser does not support the video tag.
      </video>

      {/* Dynamic Watermark Overlay */}
      {user && (
        <motion.div
          animate={watermarkPos}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute pointer-events-none z-10 opacity-30 select-none mix-blend-overlay"
        >
          <div className="transform -rotate-12">
            <span className="text-white text-sm md:text-lg font-mono tracking-widest font-bold drop-shadow-md">
              {watermarkText}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
