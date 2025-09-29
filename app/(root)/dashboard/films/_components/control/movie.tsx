"use client";

import VideoPlayModal from "@/components/modals/video-play.modal";
import { UploadProgressDialog } from "@/components/modals/upload-progress-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePlayModal } from "@/hooks/use-play-modal";
import { removeVideo, uploadVideo } from "@/lib/supabase-utils";
import { cn, formatFileSize, getVideoDuration } from "@/lib/utils";
import { BUCKETS } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FileVideo, Film, Loader2, Play, Save, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { IFilm } from "@/types/film";

const MovieControl = ({ data }: { data: IFilm }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentData, setCurrentData] = useState<IFilm>(data);
  const [uploadProgress, setUploadProgress] = useState(0);

  const hasVideoUrl = !!currentData.video?.url;
  const videoModal = usePlayModal();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setFile(file);
        setUploadProgress(0); // Reset progress when a new file is selected
      }
    }
  };

  const handlePlay = useCallback(() => {
    if (hasVideoUrl) {
      videoModal.setVideoUrl(currentData.video!.url);
      videoModal.setOpen(true);
    }
  }, [currentData, videoModal, hasVideoUrl]);

  const uploadQuery = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file to upload");

      if (currentData.video?.url) {
        const removed = await removeVideo(
          [currentData.video.name],
          BUCKETS.EPISODES
        );
        if (!removed.success) {
          throw new Error("Video removal failed");
        }
      }

      // Pass the setUploadProgress callback to the uploadVideo function
      const uploaded = await uploadVideo(
        file,
        BUCKETS.EPISODES,
        setUploadProgress
      );
      if (!uploaded.success) {
        throw new Error(uploaded.error || "Video upload failed");
      }

      const videoDuration = await getVideoDuration(file);
      return {
        url: uploaded.videoUrl,
        name: uploaded.fileName,
        size: formatFileSize(file.size),
        duration: videoDuration,
      };
    },
    onSuccess: async (uploaded) => {
      setFile(null);
      setUploadProgress(0); // Reset progress on success
      const { data: response } = await axios.post(
        `/api/films/${currentData._id}/control/movie`,
        uploaded
      );
      if (response.success) {
        setCurrentData(response.data);
        toast.success("Uploaded successfully!");
      } else {
        toast.error(response.error || "Failed to update film data.");
      }
    },
    onError: (error) => {
      setUploadProgress(0); // Reset progress on error
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (file) {
      uploadQuery.mutate();
    }
  };

  return (
    <div className="w-full mx-2">
      <div className="flex items-center space-x-1 mb-6">
        <div className="p-2 rounded-lg">
          <Film className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Movie Upload</h2>
          <p>Upload a single movie file</p>
        </div>
      </div>
      <div
        className={`border-2 border-dashed rounded-xl py-12 text-center transition-all duration-200 ${
          dragActive
            ? "dark:border-white border-black"
            : "dark:border-white/10 border-black/10"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className={cn(
                  "p-4 rounded-full",
                  dragActive && "dark:bg-white/10 bg-black/10"
                )}
              >
                <FileVideo
                  className={cn(
                    "w-8 h-8 dark:text-white/10 text-black/10",
                    dragActive && "text-black dark:text-white"
                  )}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">{file.name}</h3>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <Button
              onClick={() => {
                setFile(null);
                setUploadProgress(0); // Reset progress when file is removed
              }}
              disabled={uploadQuery.isPending} // Disable remove button during upload
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className={cn(
                  "p-4 rounded-full",
                  dragActive && "dark:bg-white/10 bg-black/10"
                )}
              >
                <Upload className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                Drag and drop your movie file here
              </h3>
              <p>or click to browse</p>
            </div>
            <label htmlFor="video-upload" className={cn(buttonVariants())}>
              <Upload className="w-4 h-4 mr-2" />
              <span>Choose File</span>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile?.type.startsWith("video/")) {
                  setFile(selectedFile);
                  setUploadProgress(0); // Reset progress when a new file is selected
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Button
          onClick={handlePlay}
          disabled={!hasVideoUrl || uploadQuery.isPending}
        >
          <Play className="w-4 h-4 mr-2" />
          Play video
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={uploadQuery.isPending || !file}
        >
          {uploadQuery.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          <span>Save Movie</span>
        </Button>
      </div>
      <VideoPlayModal />
      {/* New Upload Progress Dialog */}
      <UploadProgressDialog
        isOpen={uploadQuery.isPending}
        progress={uploadProgress}
        fileName={file?.name || null}
      />
    </div>
  );
};

export default MovieControl;
