"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Error = ({ error }: { error: Error }) => {
  const router = useRouter();
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      {/* Image */}
      <div className="relative w-72 h-72 mb-6">
        <Image
          src="/not-found1.jpg"
          alt="404 Error"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Xatolik!
      </h1>

      {/* Error message */}
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message ||
          "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o‘chirib yuborilgan."}
      </p>

      {/* Button */}
      <Button onClick={() => router.back()} size="lg" className="shadow-md">
        <ArrowLeft className="mr-2 h-5 w-5" /> Orqaga qaytish
      </Button>
    </div>
  );
};

export default Error;
