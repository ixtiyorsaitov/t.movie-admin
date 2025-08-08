"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const useBreadcrumbs = () => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "admin") {
      return [];
    }

    const pathArray = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      return {
        label: formatSegment(segment),
        href,
      };
    });

    return [
      {
        label: "Home",
        href: "/",
      },
      ...pathArray,
    ];
  }, [pathname]);

  return breadcrumbs;
};
