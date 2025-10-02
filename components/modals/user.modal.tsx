import React, { Dispatch, SetStateAction, useEffect } from "react";
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
import { userSchema } from "@/lib/validation";
import { Loader2 } from "lucide-react";
import { useUserModal } from "@/hooks/use-modals";
import { IUser, ROLE } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { toast } from "sonner";

const UserModal = ({
  setDatas,
  setLoading,
  loading,
}: {
  setDatas: Dispatch<SetStateAction<IUser[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) => {
  const { open, setOpen, data, setData } = useUserModal();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: data ? data.name : "",
      email: data ? data.email : "",
      role: data ? data.role : ROLE.USER,
    },
  });
  useEffect(() => {
    if (open) {
      if (data) {
        form.reset({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } else {
        form.reset({
          name: "",
          email: "",
          role: ROLE.USER,
        });
      }
    }
  }, [data, form, open]);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    console.log(values);

    if (data) {
      updateMutation.mutate(
        {
          ...data,
          name: values.name,
          email: values.email,
          role: values.role as ROLE,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              setDatas((prev) =>
                prev.map((c) => {
                  if (c._id === data._id) {
                    return response.data;
                  }
                  return c;
                })
              );
              setOpen(false);
              setData(null);
              toast.success("Foydalanuvchi o'zgartirildi");
            } else {
              toast.error(response.error);
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          email: values.email,
          role: values.role as ROLE,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              setDatas((prev) => [response.data, ...prev]);
              setOpen(false);
              setData(null);
              toast.success("Foydalanuvchi qo'shildi");
            } else {
              toast.error(response.error);
            }
          },
        }
      );
    }
  };
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
            {data ? "Foydalanuvchini o'zgartirish" : "Foydalanuvchi qo'shish"}
          </DialogTitle>
          <DialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism</FormLabel>
                    <FormControl>
                      <Input
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        placeholder="Ozodbek Nazarov"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        defaultValue={ROLE.USER}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rolni tanlang" />
                        </SelectTrigger>
                        <SelectContent align="center">
                          <SelectGroup>
                            <SelectItem value={ROLE.USER}>
                              Oddiy foydalanuvchi
                            </SelectItem>
                            <SelectItem value={ROLE.MEMBER}>Xodim</SelectItem>
                            <SelectItem value={ROLE.ADMIN}>
                              Admin (custom)
                            </SelectItem>
                            {/* <SelectItem value={ROLE.SUPERADMIN}>
                              Super admin
                            </SelectItem> */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-1">
                <Button
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  type="button"
                  className="float-right"
                  variant={"secondary"}
                  onClick={() => {
                    setOpen(false);
                    setData(null);
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  type="submit"
                  className="float-right"
                >
                  {data ? "O'zgartirish" : "Qo'shish"}
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
