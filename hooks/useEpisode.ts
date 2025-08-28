import { addEpisode, deleteEpisode, updateEpisode } from "@/lib/api/episode";
import { removeVideo, uploadVideo } from "@/lib/supabase-utils";
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

export const useUpdateEpisode = ({
  videoFile,
  filmId,
}: {
  videoFile: File | null;
  filmId: string;
}) => {
  return useMutation({
    mutationFn: async ({
      values,
      oldVideoName,
      episodeId,
    }: {
      values: z.infer<typeof episodeSchmea>;
      oldVideoName: string;
      episodeId: string;
    }) => {
      if (videoFile) {
        const removed = await removeVideo(
          [oldVideoName as string],
          BUCKETS.EPISODES
        );
        if (!removed.success) {
          return { error: "Video ni o'chirishda xatolik" };
        }
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
        const response = await updateEpisode({
          values: formData,
          filmId,
          episodeId,
        });
        return response;
      } else {
        const response = await updateEpisode({
          values: values,
          filmId,
          episodeId,
        });
        return response;
      }
    },
  });
};

export const useDeleteEpisodeMutation = (filmId: string) => {
  return useMutation({
    mutationFn: async ({
      episodeId,
      videoName,
    }: {
      episodeId: string;
      videoName: string;
    }) => {
      const removed = await removeVideo([videoName], BUCKETS.EPISODES);
      if (!removed.success) {
        return { error: "Video ni o'chirishda xatolik" };
      }

      const data = await deleteEpisode({ episodeId, filmId });
      return data;
    },
  });
};
