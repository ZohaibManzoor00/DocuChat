"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1.5;
    }
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        preload="metadata"
        poster="/placeholder.svg?height=600&width=1000"
      >
        <source src="/demo-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </div>
  );
}
