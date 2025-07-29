"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/user-breadcrumb";

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const current = breadcrumbs[breadcrumbs.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList className="hidden sm:flex">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={crumb.href} className="flex items-center gap-1">
              <BreadcrumbItem className="text-[13px]">
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
      <BreadcrumbList className="flex sm:hidden">
        <BreadcrumbItem>
          <BreadcrumbPage>{current?.label || "Overview"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
