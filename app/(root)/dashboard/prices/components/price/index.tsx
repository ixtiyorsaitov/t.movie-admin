"use client";

import type { IPrice } from "@/types/price";
import { priceSchema } from "@/lib/validation";
import { PeriodType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PriceCardPreview } from "@/components/core/price-card-preview";
import { FeaturesInput } from "@/components/core/feature-price-input";
import { Switch } from "@/components/ui/switch";
import { useCreatePrice, useUpdatePrice } from "@/hooks/usePrices";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  data: null | IPrice;
}

const PricePageMain = ({ data: defaultData }: Props) => {
  const [data, setData] = useState<IPrice | null>(defaultData);

  const form = useForm<z.infer<typeof priceSchema>>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      name: data?.name ?? "",
      price: String(data?.price) ?? 0,
      period: data?.period ?? PeriodType.MONTHLY,
      expiresPeriodCount: String(data?.expiresPeriodCount) ?? 1,
      description: data?.description ?? "",
      features: data?.features ?? [],
      buttonText: data?.buttonText ?? "Sotib olish",
      buttonVariant: data?.buttonVariant ?? "default",
      recommended: data?.recommended ?? false,
    },
  });

  const formValues = form.watch();
  const period = form.watch("period");

  const createMutation = useCreatePrice();
  const updateMutation = useUpdatePrice();

  function onSubmit(values: z.infer<typeof priceSchema>) {
    if (data === null) {
      createMutation.mutate(values, {
        onSuccess: (res) => {
          console.log(res);
          if (res.success) {
            setData(res.data);
            toast.success("Ta'rif qo'shildi!");
          } else {
            toast.error(res.error || "Ta'rifni qo'shishda xatolik!");
          }
        },
      });
    } else {
      console.log(values);

      updateMutation.mutate(
        {
          data: values,
          priceId: data._id,
        },
        {
          onSuccess: (res) => {
            console.log(res);
            if (res.success) {
              setData(res.data);
              toast.success("Ta'rif muvaffaqiyatli yangilandi!");
            } else {
              toast.error(res.error || "Ta'rifni yangilashda xatolik!");
            }
          },
        }
      );
    }
  }
  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {data === null ? "Yangi tarif yaratish" : "Tarifni tahrirlash"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {data === null
            ? "Yangi tarif rejasini yarating"
            : "Mavjud tarifni tahrirlang"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
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
                        placeholder="Tarif nomi..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Label>Narxi {"(so'm)"}</Label>
                    <FormControl>
                      <Input
                        disabled={loading}
                        autoComplete="off"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Select Period */}
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <Label>Vaqti</Label>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Vaqti" />
                        </SelectTrigger>
                        <SelectContent align="center">
                          <SelectGroup>
                            <SelectItem value={PeriodType.MONTHLY}>
                              Oylik
                            </SelectItem>
                            <SelectItem value={PeriodType.YEARLY}>
                              Yillik
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ExpiresPeriodCount */}
              <FormField
                control={form.control}
                name="expiresPeriodCount"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Muddati (necha{" "}
                      {period === PeriodType.YEARLY ? "yil" : "oy"})
                    </Label>
                    <FormControl>
                      <Input
                        disabled={loading}
                        autoComplete="off"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tavsif</Label>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        autoComplete="off"
                        placeholder="Tarifga tavsif..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Features */}
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <Label>Xususiyatlari</Label>
                    <FormControl>
                      <FeaturesInput
                        disabled={loading}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Xususiyatlarini kiriting va Enter ni bosing..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button Text */}
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tugmadagi yozuv</Label>
                    <FormControl>
                      <Input
                        disabled={loading}
                        autoComplete="off"
                        placeholder="Sotib olish"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button Variant */}
              <FormField
                control={form.control}
                name="buttonVariant"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tugma turi</Label>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tugma varianti" />
                        </SelectTrigger>
                        <SelectContent align="center">
                          <SelectGroup>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recommended */}
              <FormField
                control={form.control}
                name="recommended"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <Switch
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label>Tavsiya qilasizmi</Label>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button disabled={loading} type="submit" className="w-full">
                {data === null ? "Yaratish" : "Yangilash"}
                {loading && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>

        {/* Live Preview Section */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{"Ko'rinish"}</h2>
            </div>
            <div className="flex justify-start">
              <PriceCardPreview data={formValues} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePageMain;
