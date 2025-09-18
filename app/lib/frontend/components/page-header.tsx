"use client";

import type React from "react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="grid gap-4 p-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2.5">
                {index > 0 && <BreadcrumbSeparator />}
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      {(title || description || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {(title || description) && (
            <div className="space-y-1">
              {title && <h1 className="text-xl font-semibold">{title}</h1>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
