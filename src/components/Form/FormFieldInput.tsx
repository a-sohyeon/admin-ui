import { Path, type UseFormReturn, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputHTMLAttributes } from "react";
import { Input, InputVariants } from "../ui/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const InputWrapVariants = cva(
  "flex items-center w-full transition-colors border rounded-sm border-input border-gray-2 bg-white focus-within:border-primary-cyan",
  {
    variants: {
      variant: {
        default: "",
        active: "border-primary-cyan",
        complete: "",
        error: "border-states-red focus-within:border-states-red",
      },
      elSize: {
        default: "pl-[1.6rem]",
        sm: "pl-[1.2rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      elSize: "default",
    },
  }
);

type FormFieldInputProps<T extends FieldValues, U> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "form"
> & {
  form: UseFormReturn<T, U, FieldValues | undefined>;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
  required?: boolean;
  className?: string;
} & VariantProps<typeof InputVariants>;

export default function FormFieldInput<T extends FieldValues, U>({
  form,
  name,
  label,
  type,
  placeholder,
  description,
  icon,
  button,
  elSize,
  required,
  className,
  ...props
}: FormFieldInputProps<T, U>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error, isDirty } }) => {
        let inputVariant: VariantProps<typeof InputVariants>["variant"] =
          "default";
        if (error) {
          inputVariant = "error";
        } else if (isDirty) {
          inputVariant = "complete";
        }
        return (
          <FormItem className={className}>
            {label && <FormLabel required={required}>{label}</FormLabel>}

            <FormControl>
              <div
                className={cn(
                  InputWrapVariants({ variant: inputVariant }),
                  props.disabled && "text-gray-4 bg-gray-0",
                  !icon && "pl-0"
                )}
              >
                {icon}
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type={type || "text"}
                  placeholder={placeholder || (label ? label + "..." : "")}
                  variant={inputVariant}
                  className={inputVariant}
                  elSize={elSize}
                  disabled={props.disabled}
                  defaultValue={props.defaultValue || field.value}
                  handleClear={() => {
                    field.onChange("");
                  }}
                  {...props}
                />
                {button}
              </div>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
