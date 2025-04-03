import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const SwitchVariants = cva(
  "peer inline-flex h-[2.2rem] w-[3.4rem] shrink-0 cursor-pointer items-center rounded-full border-[.1rem] border-gray-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed data-[state=checked]:bg-primary-cyan data-[state=checked]:border-primary-cyan-dark data-[state=unchecked]:bg-input disabled:bg-gray-1 disabled:border-gray-2 disabled:bg-gray-1 disabled:data-[state=checked]:!bg-gray-1 disabled:data-[state=checked]:!border-gray-2",
  {
    variants: {
      variant: {
        default: "",
        error:
          "border-states-red [&>span]:bg-states-red data-[state=checked]:bg-states-red data-[state=checked]:border-states-red",
      },
      size: {
        sm: "h-[1.8rem] w-[2.6rem] [&>span]:h-[1.2rem] [&>span]:w-[1.2rem] [&>span]:data-[state=checked]:translate-x-[1rem]",
        md: "h-[2.2rem] w-[3.4rem] [&>span]:h-[1.6rem] [&>span]:w-[1.6rem] [&>span]:data-[state=checked]:translate-x-[1.4rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    VariantProps<typeof SwitchVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(SwitchVariants({ variant, size, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[1.6rem] w-[1.6rem] rounded-full bg-gray-4 ring-0 transition-transform data-[state=checked]:bg-white data-[state=unchecked]:translate-x-[.2rem] data-[disabled]:bg-white"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
