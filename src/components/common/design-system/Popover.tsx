import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";
import { useCarbon } from "src/context/CarbonContext";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { zIndex } = useCarbon();
  const finalIndex = (zIndex !== undefined ? zIndex : 50) + 15;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        style={{ zIndex: finalIndex }}
        className={cn(
          "cc-popover-content cc-z-50 cc-w-72 cc-rounded-xl cc-border cc-border-outline-low_em cc-bg-white cc-p-4 cc-text-high_em cc-shadow-md cc-outline-none dark:cc-bg-dark-bg-black dark:cc-border-dark-border-color dark:cc-shadow-[0px_8px_24px_-4px_#00000052]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
