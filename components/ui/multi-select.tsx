"use client";

import { X, Search } from "lucide-react";
import { Button } from "./button";
import { useSelectGenre } from "@/hooks/use-select-genre";
import { Checkbox } from "./checkbox";
import { useQuery } from "@tanstack/react-query";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IGenre } from "@/types";
import axios from "axios";
import { getGenres } from "@/lib/api/genres";
import { toast } from "sonner";

interface Props {
  selectedGenres: string[];
  setSelectedGenres: Dispatch<SetStateAction<string[]>>;
}

const MultiSelect = ({ selectedGenres, setSelectedGenres }: Props) => {
  const { open, setOpen } = useSelectGenre();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentSelectedGenres, setCurrentSelectedGenres] = useState<string[]>([
    ...selectedGenres,
  ]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      const result = await getGenres();
      if (result.success) {
        setGenres(result.datas);
      } else {
        toast.error("Janrlarni olishda xatolik");
      }
      setIsLoading(false);
    };
    fetchGenres();
  }, []);

  const filteredGenres = useMemo(() => {
    if (!genres) return [];
    return genres.filter((genre: IGenre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, genres]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const onChange = (genre: IGenre, checked: boolean) => {
    setCurrentSelectedGenres((prev) =>
      checked ? [...prev, genre._id] : prev.filter((id) => id !== genre._id)
    );
  };

  const onCancel = () => {
    if (!isLoading) setCurrentSelectedGenres([...selectedGenres]);
    setOpen(false);
  };

  return (
    <>
      {/* Content */}
      <div className="overflow-y-auto max-h-[70vh] h-full">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative flex items-center justify-start gap-2">
            <Search className="w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              className="w-full text-sm border-none outline-none"
              placeholder="Janrni qidirish uchun"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search genres"
              name="search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(20)].map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-white/5 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGenres.map((genre: IGenre) => (
              <GenreItem
                key={genre._id}
                genre={genre}
                selected={currentSelectedGenres.includes(genre._id)}
                onChange={onChange}
              />
            ))}
          </div>
        )}

        {filteredGenres.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Bu kalitga oid janr topilmadi {`"${searchTerm}"`}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t ">
        <Button variant="outline" onClick={onCancel} className="px-6">
          Bekor qilish
        </Button>
        <Button
          onClick={() => {
            // Handle selection logic here
            setSelectedGenres(currentSelectedGenres);
            setOpen(false);
          }}
          className="px-6"
        >
          Tasdiqlash
        </Button>
      </div>
    </>
  );
};

export default MultiSelect;

const GenreItem = ({
  genre,
  selected,
  onChange,
}: {
  genre: IGenre;
  selected: boolean;
  onChange: (genre: IGenre, checked: boolean) => void; // ✅ to‘g‘ri
}) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer">
    <Checkbox
      checked={selected}
      onCheckedChange={(checked: boolean) => onChange(genre, checked)}
    />
    <label className="text-sm font-medium cursor-pointer flex-1">
      {genre.name}
    </label>
  </div>
);
