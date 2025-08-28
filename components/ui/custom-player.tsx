"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayerSimple = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    // HLS faylini o'ynatish
    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = videoUrl;
      }
    } else {
      // mp4 yoki boshqa video
      videoRef.current.src = videoUrl;
    }
  }, [videoUrl]);

  return (
    <video ref={videoRef} controls className="w-full rounded-lg bg-black" />
  );
};

export default VideoPlayerSimple;
