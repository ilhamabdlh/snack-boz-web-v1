import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--green)] text-[var(--white)] shadow-[var(--shadow-sm)] hover:bg-[var(--green-mid)] hover:text-[var(--white)] hover:shadow-[var(--shadow)]",
        secondary:
          "bg-[var(--black)] text-[var(--white)] hover:bg-[#2a2a2a] hover:text-[var(--white)]",
        ghost:
          "bg-transparent text-[var(--black)] hover:bg-[rgba(27,67,50,0.06)]",
        outline:
          "border border-[rgba(27,67,50,0.14)] bg-[var(--white)] text-[var(--black)] hover:border-[var(--green)] hover:text-[var(--green)]",
        accent:
          "bg-[var(--yellow)] text-[var(--black)] shadow-[var(--shadow-sm)] hover:bg-[var(--yellow-bright)] hover:text-[var(--black)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-10 px-5",
        lg: "h-11 px-6 text-[0.9375rem]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
