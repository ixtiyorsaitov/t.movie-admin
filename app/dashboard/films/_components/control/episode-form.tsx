import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadVideo } from "@/lib/supabase-utils";
import { formatFileSize, getVideoDuration } from "@/lib/utils";
import { episodeSchmea } from "@/lib/validation";
import { BUCKETS, IEpisode } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FileVideo, Save, Upload } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  filmId: string;
  seasonId: string;
  datas: IEpisode[];
  setEnable: Dispatch<SetStateAction<boolean>>;
  setDatas: Dispatch<SetStateAction<IEpisode[]>>;
}

const EpisodeForm = ({ setEnable, filmId, setDatas, seasonId }: Props) => {
  const [loadingStep, setLoadingStep] = useState<1 | 2 | "final" | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof episodeSchmea>>({
    resolver: zodResolver(episodeSchmea),
    defaultValues: {
      title: "",
      description: "",
      episodeNumber: "",
    },
  });
  useEffect(() => {
    console.log(loadingStep);
  }, [loadingStep]);
  const addEpisodeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof episodeSchmea>) => {
      if (!videoFile) return;
      setLoadingStep(1);
      const videoSize = formatFileSize(videoFile.size);
      const videoDuration = await getVideoDuration(videoFile);

      const uploadedVideo = await uploadVideo(videoFile, BUCKETS.SERIES);
      if (!uploadedVideo?.success) {
        return toast.error("Error uploading video");
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
      console.log(formData);

      const { data: response } = await axios.post(
        `/api/film/${filmId}/control/episode?season=${seasonId}`,
        formData
      );
      if (response.success) {
        setDatas((prev) => [...prev, response.data]);
        toast.success("Episode created successfuly!");
        form.reset();
        setVideoFile(null);
      }
      console.log(response);
    },
  });

  function onSubmit(values: z.infer<typeof episodeSchmea>) {
    if (videoFile) {
      addEpisodeMutation.mutate(values);
    }
  }
  return (
    <div className="border-t pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h4 className="text-lg font-medium mb-4">Add New Episode</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="episodeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episode Number</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episode Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter episode title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter episode description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label className="mb-2">Video File</Label>
              <Label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="text-center">
                  {videoFile ? (
                    <div className="space-y-2">
                      <FileVideo className="w-8 h-8 mx-auto" />
                      <p className="text-sm font-medium">{videoFile.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto" />
                      <p className="text-sm">Click to upload video</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoFile(file);
                    }
                  }}
                />
              </Label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button onClick={() => setEnable(false)} variant={"outline"}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4" />
                <span>Save & Continue</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EpisodeForm;
