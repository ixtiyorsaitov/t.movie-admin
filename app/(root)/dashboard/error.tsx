"use client";

import ErrorTemplate from "@/components/shared/error";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    toast.error(error.message);
  }, []);
  return <ErrorTemplate error={error.message} reset={reset} />;
}
