import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ErrorTemplate = ({
  error,
  reset,
}: {
  error?: string;
  reset?: () => void;
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col space-y-2">
      <Image src={"/error.gif"} alt="Error" width={400} height={400} />
      <h1 className="text-2xl font-bold text-destructive">{`Xatolik yuz berdi`}</h1>
      {error && <p className="text-sm text-muted-foreground">{error}</p>}
      {reset && (
        <Button onClick={reset}>
          {"Qayta urinib ko'rish"}
          <RefreshCw />
        </Button>
      )}
    </div>
  );
};

export default ErrorTemplate;
