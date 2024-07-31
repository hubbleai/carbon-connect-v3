import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@components/common/design-system/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "cc-flex cc-cursor-default cc-select-none cc-items-center cc-rounded-sm cc-px-2 cc-py-1.5 cc-text-sm cc-outline-none focus:cc-bg-white data-[state=open]:cc-bg-white",
      inset && "cc-pl-8",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "cc-z-50 cc-min-w-[8rem] cc-overflow-hidden cc-rounded-md cc-border cc-bg-surface-surface_1 cc-p-1 cc-text-high_em cc-shadow-e2 data-[state=open]:cc-animate-in data-[state=closed]:cc-animate-out data-[state=closed]:cc-fade-out-0 data-[state=open]:cc-fade-in-0 data-[state=closed]:cc-zoom-out-95 data-[state=open]:cc-zoom-in-95 data-[side=bottom]:cc-slide-in-from-top-2 data-[side=left]:cc-slide-in-from-right-2 data-[side=right]:cc-slide-in-from-left-2 data-[side=top]:cc-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "cc-z-50 cc-min-w-[8rem] cc-overflow-hidden cc-rounded-xl cc-font-semibold cc-text-xs cc-border cc-bg-white  cc-text-high_em cc-shadow-e3 data-[state=open]:cc-animate-in data-[state=closed]:cc-animate-out data-[state=closed]:cc-fade-out-0 data-[state=open]:cc-fade-in-0 data-[state=closed]:cc-zoom-out-95 data-[state=open]:cc-zoom-in-95 data-[side=bottom]:cc-slide-in-from-top-2 data-[side=left]:cc-slide-in-from-right-2 data-[side=right]:cc-slide-in-from-left-2 data-[side=top]:cc-slide-in-from-bottom-2 dark:cc-bg-dark-bg-black dark:cc-border-dark-border-color ",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "cc-relative cc-flex cc-cursor-default cc-select-none cc-items-center cc-rounded-sm !cc-px-[12px] cc-cursor-pointer cc-py-2 cc-text-sm cc-outline-none cc-transition-colors focus:cc-bg-accent data-[disabled]:cc-pointer-events-none data-[disabled]:cc-opacity-50 ",
      inset && "cc-pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "cc-relative cc-flex cc-cursor-default cc-select-none cc-items-center cc-rounded-sm cc-py-1.5 cc-pl-8 cc-pr-2 cc-text-sm cc-outline-none cc-transition-colors focus:cc-bg-surface-surface_1 focus:cc-text-high_em data-[disabled]:cc-pointer-events-none data-[disabled]:cc-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    {/* <span className="cc-absolute cc-left-2 cc-flex cc-h-3.5 cc-w-3.5 cc-items-center cc-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span> */}
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "cc-relative cc-flex cc-cursor-default cc-select-none cc-items-center cc-rounded-sm cc-py-1.5 cc-pl-8 cc-pr-2 cc-text-sm cc-outline-none cc-transition-colors focus:cc-bg-accent focus:cc-text-accent-foreground data-[disabled]:cc-pointer-events-none data-[disabled]:cc-opacity-50",
      className
    )}
    {...props}
  >
    {/* <span className="cc-absolute cc-left-2 cc-flex cc-h-3.5 cc-w-3.5 cc-items-center cc-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span> */}
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "cc-px-2 cc-py-1.5 cc-text-sm cc-font-semibold",
      inset && "cc-pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-cc-mx-1 cc-h-px cc-bg-outline-base_em", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "cc-ml-auto cc-text-xs cc-tracking-widest cc-opacity-60",
        className
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
