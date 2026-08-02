import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-[var(--line)] bg-[var(--warm-white)]",
        className,
      )}
      {...props}
    />
  );
}
