import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--black)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:ring-2 focus:ring-[rgba(27,67,50,0.12)]",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
