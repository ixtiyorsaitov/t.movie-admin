import { GenresSelectModal } from "@/components/modals/genre.modal";
import SelectActorsModal from "@/components/modals/select-actors.modal";
import SelectTranslatorsModal from "@/components/modals/select-translator.modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useActorsSelectModal,
  useGenresSelectModal,
  useTranslatorsSelectModal,
} from "@/hooks/use-modals";
import { useCategories } from "@/hooks/useCategory";
import { useGenres } from "@/hooks/useGenre";
import { useMembers } from "@/hooks/useMembers";
import { generateSlug, getLettersOfName } from "@/lib/utils";
import { filmFormSchema } from "@/lib/validation";
import { FilmType, ICategory, MemberType } from "@/types";
import { IMember } from "@/types/member";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

interface Step1Props {
  form: UseFormReturn<z.infer<typeof filmFormSchema>>;
  setStep: (step: 1 | 2) => void;
  isPending: boolean;
}

const Step1 = ({ form, setStep, isPending }: Step1Props) => {
  const selectedTranslatorsModal = useTranslatorsSelectModal();
  const selectedActorsModal = useActorsSelectModal();
  const selectedGenresModal = useGenresSelectModal();

  const genresQuery = useGenres();
  const categoriesQuery = useCategories();
  const membersQuery = useMembers(100);

  useEffect(() => {
    if (!genresQuery.isLoading && genresQuery.data.success) {
      selectedGenresModal.setData(genresQuery.data.datas);
    }
  }, [genresQuery.data]);

  useEffect(() => {
    if (!membersQuery.isLoading && membersQuery.data.success) {
      selectedActorsModal.setData(
        membersQuery.data.datas.filter((m: IMember) =>
          m.type.includes(MemberType.ACTOR)
        )
      );
      selectedTranslatorsModal.setData(
        membersQuery.data.datas.filter((m: IMember) =>
          m.type.includes(MemberType.TRANSLATOR)
        )
      );
    }
  }, [membersQuery.data]);

  function onGenresChange(genres: string[]) {
    form.setValue("genres", genres);
  }
  function onActorChange(actors: string[]) {
    form.setValue("actors", actors);
  }
  function onTranslatorChange(translators: string[]) {
    form.setValue("translators", translators);
  }

  function onStep1Submit() {
    form.trigger(["title", "description", "type", "genres"]).then((isValid) => {
      if (!isValid) return;
      setStep(2);
    });
  }

  const selectedGenres = form.watch("genres");
  const selectedActors = form.watch("actors");
  const selectedTranslators = form.watch("translators");
  return (
    <>
      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onStep1Submit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Filmning nomini kiriting"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif *</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Filmga tavsif kiriting"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tur *</FormLabel>
                  <Select
                    disabled={isPending}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select film type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={FilmType.MOVIE}>Kino</SelectItem>
                      <SelectItem value={FilmType.SERIES}>Serial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actors"
              render={() => (
                <FormItem>
                  <FormLabel>Ovoz aktyorlari *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="outline"
                        onClick={() => selectedActorsModal.setOpen(true)}
                        className="w-full justify-start pl-3"
                      >
                        Ovoz aktyorlarini tanlash
                      </Button>

                      {selectedActors.length > 0 && (
                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                          {selectedActors.map((actorId) => {
                            const foundActor = selectedActorsModal.data.find(
                              (c) => c._id === actorId
                            );
                            return (
                              <Avatar key={actorId}>
                                <AvatarImage
                                  src={foundActor?.user.avatar || ""}
                                  alt={foundActor?.user.name}
                                />
                                <AvatarFallback>
                                  {getLettersOfName(
                                    foundActor?.user.name as string
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.actors && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.actors.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translators"
              render={() => (
                <FormItem>
                  <FormLabel>Tarjimonlar *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => selectedTranslatorsModal.setOpen(true)}
                        className="w-full justify-start pl-3"
                        disabled={isPending}
                      >
                        Tarjimonlarni tanlash
                      </Button>

                      {selectedTranslators.length > 0 && (
                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                          {selectedTranslators.map((translatorId) => {
                            const foundTranslator =
                              selectedTranslatorsModal.data.find(
                                (c) => c._id === translatorId
                              );
                            return (
                              <Avatar key={translatorId}>
                                <AvatarImage
                                  src={foundTranslator?.user.avatar || ""}
                                  alt={foundTranslator?.user.name}
                                />
                                <AvatarFallback>
                                  {getLettersOfName(
                                    foundTranslator?.user.name as string
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.actors && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.actors.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genres"
              render={() => (
                <FormItem>
                  <FormLabel>Janrlar *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => selectedGenresModal.setOpen(true)}
                        className="w-full justify-start pl-3"
                        disabled={isPending}
                      >
                        Janrlarni tanlash
                      </Button>

                      {selectedGenres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedGenres.map((genreId) => {
                            const foundGenre = selectedGenresModal.data.find(
                              (c) => c._id === genreId
                            );
                            return (
                              <Badge key={genreId} variant="secondary">
                                {foundGenre?.name}
                                {!foundGenre?.name && <Spinner />}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.genres && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.genres.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoriya *</FormLabel>
                  <FormControl>
                    <Select
                      disabled={categoriesQuery.isLoading || isPending}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            categoriesQuery.isLoading
                              ? "Yuklanyapti"
                              : "Kategoriya tanlang"
                          }
                        />
                      </SelectTrigger>
                      {!categoriesQuery.isLoading &&
                        categoriesQuery.data?.success && (
                          <SelectContent>
                            {categoriesQuery.data?.datas.map(
                              (cat: ICategory) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                  {cat.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        )}
                    </Select>
                  </FormControl>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slag (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>

                  <FormDescription>
                    {"Avtomatik yaratish uchun bo'sh qoldiring"}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disableComments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Izohlarni {"o'chirish"}</FormLabel>
                    <FormDescription>
                      Foydalanuvchilarning ushbu filmga fikr bildirishlariga
                      yo‘l qo‘ymaslik
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Nashr etish</FormLabel>
                    <FormDescription>
                      Ushbu filmni ommaga {"ko'rsating"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button disabled={isPending} type="submit" className="flex-1">
                Keyingi qadam
                <ArrowRight />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {!isPending && (
        <>
          <GenresSelectModal
            initialData={selectedGenres}
            onGenresChange={onGenresChange}
            loading={genresQuery.isLoading}
            error={genresQuery.isLoading ? undefined : genresQuery.data.error}
          />
          <SelectActorsModal
            initialData={selectedActors}
            onActorChange={onActorChange}
            loading={membersQuery.isLoading}
            error={membersQuery.isLoading ? undefined : membersQuery.data.error}
          />
          <SelectTranslatorsModal
            initialData={selectedTranslators}
            onTranslatorChange={onTranslatorChange}
            loading={membersQuery.isLoading}
            error={membersQuery.isLoading ? undefined : membersQuery.data.error}
          />
        </>
      )}
    </>
  );
};

export default Step1;
