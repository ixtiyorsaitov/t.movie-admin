"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../ui/sonner";
import NextTopLoader from "nextjs-toploader";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="admin-theme"
      >
        <QueryProvider>
          <NextTopLoader />
          <Toaster />
          {children}
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
