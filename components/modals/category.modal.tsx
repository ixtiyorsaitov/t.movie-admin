import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ICategory } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { deleteSchema, categorySchema } from "@/lib/validation";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Loader2, PlusIcon, SaveIcon, Trash2 } from "lucide-react";
import { useDeleteCategory, useCategoryModal } from "@/hooks/use-modals";
import {
  useCreateCategory,
  useDeleteCategoryMutation,
  useUpdateCategory,
} from "@/hooks/useCategory";
import { Spinner } from "../ui/spinner";

interface Props {
  setDatas: Dispatch<SetStateAction<ICategory[]>>;
}

const CategoryModal = ({ setDatas }: Props) => {
  const categoryModal = useCategoryModal();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categoryModal.data ? categoryModal.data.name : "",
    },
  });
  useEffect(() => {
    if (categoryModal.data) {
      form.reset({ name: categoryModal.data.name });
    } else {
      form.reset({ name: "" });
    }
  }, [categoryModal.data]);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  function onSubmit(values: z.infer<typeof categorySchema>) {
    if (categoryModal.data) {
      updateMutation.mutate(
        { values, categoryId: categoryModal.data._id },
        {
          onSuccess: (response) => {
            if (response.success) {
              categoryModal.setOpen(false);
              setDatas((prev) =>
                prev.map((c) =>
                  c._id === response.data._id ? response.data : c
                )
              );
              toast.success("Kategoriya muvaffaqiyatli yangilandi!");
              categoryModal.setData(null);
              form.reset();
            } else {
              toast.error(response.error || "Kategoriya yangilashda xatolik");
            }
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: (response) => {
          if (response.success) {
            categoryModal.setOpen(false);
            setDatas((prev) => [...prev, response.data]);
            toast.success("Kategoriya muvaffaqiyatli qo'shildi!");
            form.reset();
            categoryModal.setData(null);
          } else {
            toast.error(response.error || "Kategoriya qo'shishda xatolik");
          }
        },
      });
    }
  }
  const loading = createMutation.isPending || updateMutation.isPending;
  return (
    <AlertDialog open={categoryModal.open} onOpenChange={categoryModal.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {categoryModal.data === null
              ? "Kategoriya qo'shish"
              : "Kategoriya yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos,{" "}
            {categoryModal.data
              ? "kategoriya yangilash"
              : "kategoriya qo'shish"}{" "}
            uchun kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Nomi</Label>
                  <FormControl>
                    <Input
                      disabled={loading}
                      autoComplete="off"
                      placeholder="Kategoriya nomi..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  categoryModal.setData(null);
                  categoryModal.setOpen(false);
                }}
                disabled={loading}
                type="button"
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    {categoryModal.data ? "Saqlanyapti" : "Qo'shilyapti"}
                    <Spinner />
                  </>
                ) : categoryModal.data ? (
                  <>
                    Saqlash
                    <SaveIcon />
                  </>
                ) : (
                  <>
                    {"Qo'shish"}
                    <PlusIcon />
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryModal;

export function CategoryDeleteModal({
  setList,
}: {
  setList: Dispatch<SetStateAction<ICategory[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteCategory();

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  const deleteMutation = useDeleteCategoryMutation();

  function onSubmit() {
    if (data?._id) {
      deleteMutation.mutate(data?._id, {
        onSuccess: (response) => {
          if (response.success) {
            setList((prev) => prev.filter((c) => c._id !== data?._id));
            setData(null);
            toast.success("Kategoriya o'chirildi");
            setOpen(false);
            form.reset();
          } else {
            toast.error(
              response.error || "Kategoriya o'chirishda xatolik yuz berdi"
            );
          }
        },
      });
    }
  }

  return data ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Siz "${data.name}" kategoriyasini o'chirmoqchiligingizga aminmisiz?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`Bu buyruqni orqaga qaytarib bo'lmaydi. Kategoriya o'chgandan keyin
            shu kategoriya bilan bog'liq barcha filmlardan`}
            <span className="font-medium text-foreground">{` "${data.name}" `}</span>
            kategoriya olib tashlanadi
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="confirmText"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Tasdiqlash uchun, pastga{" "}
                    <span className="font-bold text-red-500">{"'DELETE'"}</span>
                    deb yozing:
                  </Label>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={deleteMutation.isPending}
                      placeholder="DELETE deb yozing"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-end gap-1">
              <Button
                variant={"outline"}
                disabled={deleteMutation.isPending}
                type="button"
                onClick={() => {
                  setData(null);
                  setOpen(false);
                }}
              >
                Bekor qilish
              </Button>
              <Button
                disabled={deleteMutation.isPending}
                type="submit"
                className="!bg-red-900"
                variant={"destructive"}
              >
                {deleteMutation.isPending ? <Spinner /> : <Trash2 />}
                {"O'chirish"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}

// export function CategoryFilmsModal() {
//   const modal = useCategoryFilmsModal();
//   const getDataQuery = useGetCategoryFilms(modal.data?._id);

//   return (
//     <Dialog open={modal.open} onOpenChange={modal.setOpen}>
//       <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
//         <DialogHeader className="space-y-4 pb-4 border-b">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10">
//               <Film className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <DialogTitle className="text-xl font-semibold">
//                 {modal.data?.name || "Kategoriya"} {"bo'yicha filmlar"}
//               </DialogTitle>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Ushbu kategoriya tegishli barcha filmlar {"ro'yxati"}
//               </p>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="space-y-4">
//           <Accordion type="single" collapsible defaultValue="item-1">
//             <AccordionItem value="item-1" className="border-none">
//               <AccordionTrigger className="hover:no-underline bg-muted/50 hover:bg-muted px-4 py-3 rounded-lg transition-colors">
//                 <div className="flex items-center gap-2">
//                   {getDataQuery.isPending ? (
//                     <Skeleton className="h-4 w-20" />
//                   ) : (
//                     <>
//                       <Badge variant="secondary" className="font-medium">
//                         {getDataQuery.data?.datas?.length || 0}
//                       </Badge>
//                       <span className="text-sm font-medium">
//                         {(getDataQuery.data?.datas?.length || 0) === 1
//                           ? "film"
//                           : "filmlar"}
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </AccordionTrigger>

//               <AccordionContent className="pt-4">
//                 <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
//                   {getDataQuery.isPending ? (
//                     Array.from({ length: 4 }).map((_, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
//                       >
//                         <div className="flex items-center gap-3 flex-1">
//                           <Skeleton className="h-10 w-10 rounded-md" />
//                           <div className="space-y-2 flex-1">
//                             <Skeleton className="h-4 w-3/4" />
//                             <Skeleton className="h-3 w-1/2" />
//                           </div>
//                         </div>
//                         <Skeleton className="h-8 w-16 rounded-md" />
//                       </div>
//                     ))
//                   ) : getDataQuery.data?.datas?.length > 0 ? (
//                     getDataQuery.data.datas.map(
//                       (item: IFilm, index: number) => (
//                         <div
//                           key={item._id}
//                           className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 group"
//                         >
//                           <div className="flex items-center gap-3 flex-1 min-w-0">
//                             <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                               <Film className="h-4 w-4 text-primary" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
//                                 {item.title}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 Film #{index + 1}
//                               </p>
//                             </div>
//                           </div>
//                           <Link
//                             href={`/dashboard/films/${item._id}`}
//                             className="ml-3"
//                           >
//                             <Badge
//                               variant="outline"
//                               className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer gap-1"
//                             >
//                               <Eye className="h-3 w-3" />
//                               {"Ko'rish"}
//                             </Badge>
//                           </Link>
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <div className="text-center py-8 space-y-3">
//                       <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto">
//                         <Film className="h-6 w-6 text-muted-foreground" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-muted-foreground">
//                           Filmlar topilmadi
//                         </p>
//                         <p className="text-sm text-muted-foreground/80">
//                           Ushbu kategoriya uchun filmlar hali {"qo'shilmagan"}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
