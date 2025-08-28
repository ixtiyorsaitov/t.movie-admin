"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { usePlayModal } from "@/hooks/use-play-modal";
import Hls from "hls.js";
import VideoPlayerSimple from "../ui/custom-player";

const VideoPlayModal = () => {
  const { open, setOpen, videoUrl } = usePlayModal();

  return (
    videoUrl && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:min-w-[800px] min-w-auto md:w-auto w-full max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Video Player</DialogTitle>
            <DialogDescription>Enjoy your video</DialogDescription>

            <VideoPlayerSimple videoUrl={videoUrl} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  );
};

export default VideoPlayModal;
