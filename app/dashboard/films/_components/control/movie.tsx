"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IFilm } from "@/types";
import { FileVideo, Film, Save, Upload } from "lucide-react";
import React, { useState } from "react";

const MovieControl = ({ data }: { data: IFilm }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);

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
      }
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
            : true
            ? "dark:border-white/10 border-black/10"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {false ? (
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
              <h3 className="text-lg font-medium">Iblislar qotili</h3>
              <p>400 MB</p>
            </div>
            <button className="underline">
              Remove and upload different file
            </button>
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
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {}}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {true && (
        <div className="mt-6 flex justify-end">
          <Button>
            <Save className="w-4 h-4" />
            <span>Save Movie</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieControl;
