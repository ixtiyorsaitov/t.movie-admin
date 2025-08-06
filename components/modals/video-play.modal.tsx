import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { usePlayModal } from "@/hooks/use-play-modal";

const VideoPlayModal = () => {
  const { open, setOpen, videoUrl } = usePlayModal();
  return videoUrl ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <video src={videoUrl} controls />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default VideoPlayModal;
