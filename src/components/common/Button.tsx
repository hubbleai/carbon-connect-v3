import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@components/common/utils";

const buttonVariants = cva(
  "cc-flex cc-items-center cc-justify-center cc-whitespace-nowrap cc-rounded-md cc-text-sm cc-font-extrabold cc-ring-info_em/30 cc-transition-all focus-visible:cc-outline-none focus-visible:cc-ring-4 cc-focus-visible:cc-ring-ring cc-disabled:cc-pointer-events-none disabled:cc-bg-surface-disabled_low_em",
  {
    variants: {
      variant: {
        primary:
          "cc-text-white cc-bg-surface-info_main hover:cc-bg-surface-info_main/90",
        "neutral-white":
          "cc-text-black cc-bg-white cc-border cc-border-black/10 hover:cc-bg-black/5",
        gray: "cc-text-high_em cc-bg-surface-surface_2 hover:cc-bg-surface-surface_3",
      },
      size: {
        xs: "cc-h-6 cc-rounded-md cc-px-2 gap-1",
        sm: "cc-h-8 cc-rounded-lg cc-px-2 cc-gap-1.5",
        md: "cc-h-10 cc-rounded-xl cc-px-3 cc-gap-2",
        lg: "cc-h-12 cc-rounded-xl cc-px-4 cc-gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
