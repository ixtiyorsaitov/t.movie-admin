import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileVideo, Save, Upload } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setEnable: Dispatch<SetStateAction<boolean>>;
}

const EpisodeForm = ({ setEnable }: Props) => {
  return (
    <div className="border-t pt-6">
      <h4 className="text-lg font-medium mb-4">Add New Episode</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Episode Number</Label>
            <Input type="number" />
          </div>
          <div>
            <Label className="mb-2">Episode Title</Label>
            <Input type="text" placeholder="Enter episode title" />
          </div>
        </div>
        <div>
          <Label className="mb-2">Description</Label>
          <Textarea placeholder="Enter episode description" rows={3} />
        </div>
        <div>
          <Label className="mb-2">Video File</Label>
          <Label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
            <div className="text-center">
              {true ? (
                <div className="space-y-2">
                  <FileVideo className="w-8 h-8 mx-auto" />
                  <p className="text-sm font-medium">File name</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto" />
                  <p className="text-sm">Click to upload video</p>
                </div>
              )}
            </div>
            <input type="file" accept="video/*" className="hidden" />
          </Label>
        </div>
        <div className="flex justify-end space-x-3">
          <Button onClick={() => setEnable(false)} variant={"outline"}>
            Cancel
          </Button>
          <Button>
            <Save className="w-4 h-4" />
            <span>Save & Continue</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeForm;
