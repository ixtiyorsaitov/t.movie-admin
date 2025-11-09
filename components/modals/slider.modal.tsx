import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sliderSchema } from "@/lib/validation";
import { useSliderModal } from "@/hooks/use-slider-modal";
import { Spinner } from "../ui/spinner";

const SliderModal = ({
  onSubmit,
  loading,
}: {
  onSubmit: (values: z.infer<typeof sliderSchema>) => void;
  loading: boolean;
}) => {
  const { open, setOpen, data } = useSliderModal();

  const form = useForm<z.infer<typeof sliderSchema>>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      id: data ? data._id : "",
    },
  });
  useEffect(() => {
    if (open) {
      if (data) {
        form.reset({
          id: data._id,
        });
      } else {
        form.reset({
          id: "",
        });
      }
    }
  }, [data, form, open]);
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!loading) {
          setOpen(val);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Slaydni o'zgartirish" : "Slayd qo'shish"}
          </DialogTitle>
          <DialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anime ning ID si</FormLabel>
                    <FormControl>
                      <Input disabled={loading} autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      {`Anime ning ID sini olish uchun animelar yoki filmlar
                      sahifasida animeni tanlab undagi ID ni nusxalash tugmasini
                      bosing va bu yerga id ni qo'ying`}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit" className="float-right">
                {data ? "O'zgartirish" : "Qo'shish"}
                {loading && <Spinner />}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SliderModal;
