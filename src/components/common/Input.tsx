import * as React from "react";

import { cn } from "@components/common/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "cc-transition-all cc-flex cc-h-10 cc-w-full cc-rounded-xl cc-font-semibold cc-border cc-border-transparent cc-bg-surface-surface_2 cc-px-3 cc-py-2 cc-text-sm cc-ring-offset-background file:cc-border-0 file:cc-bg-transparent file:cc-text-sm file:cc-font-medium placeholder:cc-text-disabledtext cc-ring-blue-400/40 focus-visible:cc-outline-none focus-visible:cc-bg-white focus-visible:cc-ring-4 focus-visible:cc-ring-ring disabled:cc-text-disabledtext disabled:cc-cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
