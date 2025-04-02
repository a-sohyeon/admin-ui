import * as React from "react";

import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { Icon } from "./Icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type CounterProps<T extends FieldValues> = ControllerRenderProps<
  T,
  (string | undefined) & Path<T>
> & {
  error?: FieldError | undefined;
  min?: number;
  max?: number;
};

const Counter = React.forwardRef<HTMLInputElement, CounterProps<FieldValues>>(
  ({ value, onChange, error, disabled, min, max, ...props }, ref) => {
    return (
      <div className="flex items-center gap-[.4rem] w-max">
        <Button
          variant={"outline"}
          type="button"
          size={"sm"}
          className="p-[.7rem] rounded-full disabled:text-gray-4 disabled:bg-gray-0"
          disabled={disabled}
          onClick={() => {
            if (min !== undefined && value <= min) return;
            onChange(value - 1);
          }}
        >
          <Icon type="minus" />
        </Button>
        <Input
          type="number"
          className={cn(
            "text-center p-0 w-max [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error && "border-b border-states-red"
          )}
          elSize={"sm"}
          disabled={disabled}
          value={value ?? 0}
          onChange={(e) => {
            const newValue = e.target.value;
            if (min !== undefined && parseInt(newValue) <= min)
              return onChange(min);
            if (max !== undefined && parseInt(newValue) >= max)
              return onChange(max);
            onChange(newValue);
          }}
          handleClear={() => {
            onChange(0);
          }}
          ref={ref}
          {...props}
        />
        <Button
          variant={"outline"}
          type="button"
          size={"sm"}
          className="p-[.7rem] rounded-full disabled:text-gray-4 disabled:bg-gray-0"
          disabled={disabled}
          onClick={() => {
            if (max !== undefined && value >= max) return;
            onChange(value + 1);
          }}
        >
          <Icon type="plus" />
        </Button>
      </div>
    );
  }
);

Counter.displayName = "Counter";

export default Counter;
