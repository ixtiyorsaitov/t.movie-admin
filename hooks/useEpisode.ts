import { addEpisode } from "@/lib/api/episode";
import { uploadVideo } from "@/lib/supabase-utils";
import { formatFileSize, getVideoDuration } from "@/lib/utils";
import { episodeSchmea } from "@/lib/validation";
import { BUCKETS } from "@/types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const useAddEpisode = ({
  videoFile,
  filmId,
}: {
  videoFile: File | null;
  filmId: string;
}) => {
  return useMutation({
    mutationFn: async (values: z.infer<typeof episodeSchmea>) => {
      if (!videoFile) return;
      const videoSize = formatFileSize(videoFile.size);
      const videoDuration = await getVideoDuration(videoFile);

      const uploadedVideo = await uploadVideo(videoFile, BUCKETS.EPISODES);
      if (!uploadedVideo?.success) {
        return { error: "Video ni yuklashda xatolik" };
      }
      const formData = {
        ...values,
        video: {
          url: uploadedVideo.videoUrl,
          size: videoSize,
          duration: videoDuration,
          name: uploadedVideo.fileName,
        },
      };
      const response = await addEpisode({ episode: formData, filmId });
      return response;
    },
  });
};
