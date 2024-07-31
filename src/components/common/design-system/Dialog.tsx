import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import CrossIcon from "@assets/svgIcons/cross-icon.svg";

import { cn } from "./utils";
import { ActiveStep } from "src/typing/shared";

import CarbonContext from "src/context/CarbonContext";

import { useCarbon } from "../../../context/CarbonContext";


const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;



type DialogTitleProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
> & {
  justifyModification?: boolean;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      " cc-text-dark-text-white cc-fixed cc-inset-0 cc-z-50 cc-bg-black/40 data-[state=open]:cc-animate-in data-[state=closed]:cc-animate-out data-[state=closed]:cc-fade-out-0 data-[state=open]:cc-fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  activeState: ActiveStep;
  
  
}
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
  >(({ className, children, activeState, ...props }, ref) => {
  const { zIndex } = useCarbon();
  const { slackActive } = React.useContext(CarbonContext);


  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(

          `cc-modal cc-rootStyle dark:cc-bg-dark-bg-black cc-h-[703px] cc-font-manrope cc-antialiased cc-fixed cc-flex cc-flex-col cc-left-1/2 cc-top-1/2 cc-z-50 cc-overflow-auto -cc-translate-x-1/2 -cc-translate-y-1/2 cc-border cc-border-outline-base_em cc-bg-white cc-text-high_em cc-shadow-lg cc-rounded-[20px] md:cc-rounded-[0px] sm:cc-min-h-0 dark:cc-border-dark-border-color md:cc-w-full dark:cc-shadow-[#00000033] cc-overflow-hidden ${  activeState === "CONNECT"
            ? "sm:cc-w-[415px]"
            : activeState === "SLACK" && slackActive
            ? "sm:cc-w-[464px] md:!cc-h-[100vh] sm:!cc-h-auto md:cc-w-full": "cc-w-full cc-max-w-[784px]" }`,
          className
        )}

        {...props}

        style={{ zIndex: zIndex }}

      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  closeButtonClass,
  onCloseModal,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  closeButtonClass?: string;
  onCloseModal?: () => void;
}) => (
  <div
    className={cn(
      "cc-flex dark:cc-text-dark-text-white dark:cc-bg-dark-bg-black cc-items-center cc-gap-3 cc-text-center sm:cc-text-left cc-p-[0.75rem_1rem] md:cc-p-[.47rem_1rem] cc-bg-[#0000000A] sm:cc-rounded-t-2xl dark:cc-border-b-dark-border-color",
      className
    )}
    {...rest}
  >
    {children}
    <DialogPrimitive.Close
      onClick={onCloseModal}
      className={cn(
        "md:cc-hidden cc-rounded-xl cc-h-10 cc-w-10 cc-shrink-0 cc-flex cc-items-center cc-justify-center cc-opacity-70 cc-ring-offset-background cc-transition-opacity hover:cc-opacity-100 focus:cc-outline-none focus:cc-ring-2 focus:cc-ring-ring focus:cc-ring-offset-2 disabled:cc-pointer-events-none data-[state=open]:cc-bg-accent data-[state=open]:cc-text-muted-foreground cc-ml-auto",
        closeButtonClass
      )}
    >
      <img
        src={CrossIcon}
        alt="CrossIcon"
        className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
      />
    </DialogPrimitive.Close>
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "cc-p-4 cc-border-t cc-bg-white dark:cc-bg-dark-bg-black cc-border-outline-low_em sm:cc-shadow-modal-footer-top dark:cc-shadow-[0px_-3px_8px_-2px_#ffffff1F]",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, justifyModification, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      `cc-text-xl cc-font-semibold cc-leading-none  cc-tracking-tight  cc-h-10 cc-flex ${
        justifyModification ? "md:cc-justify-center" : "md:cc-justify-start"
      } cc-items-center md:cc-text-center`,
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("cc-text-sm cc-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
