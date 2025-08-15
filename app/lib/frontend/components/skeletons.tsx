"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid grid-cols-[repeat(var(--cols),1fr)] gap-2 p-2"
          style={{ "--cols": String(cols) } as React.CSSProperties}
        >
          {[...Array(cols)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        {[...Array(rows)].map((_, rIdx) => (
          <div
            key={rIdx}
            className="grid grid-cols-[repeat(var(--cols),1fr)] items-center gap-2 border-t p-2"
            style={{ "--cols": String(cols) } as React.CSSProperties}
          >
            {[...Array(cols)].map((__, cIdx) => (
              <Skeleton key={cIdx} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function ErrorState({
  message = "Algo deu errado.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry ? (
          <button
            className="text-foreground underline underline-offset-4"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    </div>
  );
}
