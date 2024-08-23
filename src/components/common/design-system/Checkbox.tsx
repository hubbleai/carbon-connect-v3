import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import Checkmark from "@assets/svgIcons/checkmark.svg";

import { cn } from "@components/common/design-system/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "cc-peer cc-h-[18px]  cc-w-[18px] cc-shrink-0 !cc-opacity-100 !cc-rounded-[6px] !cc-border-2 !cc-border-low_em dark:!cc-border-dark-text-gray cc-ring-offset-background focus-visible:cc-outline-none focus-visible:cc-ring-2 focus-visible:cc-ring-ring focus-visible:cc-ring-offset-2 disabled:cc-cursor-not-allowed disabled:cc-opacity-50 data-[state=checked]:!cc-bg-surface-info_main data-[state=checked]:!cc-border-surface-info_main",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "!cc-flex !cc-items-center !cc-justify-center cc-text-current"
      )}
    >
      <img
        src={Checkmark}
        alt="Checkbox Icon"
        className="cc-h-[10px] cc-w-[10px]"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
