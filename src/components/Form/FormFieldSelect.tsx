import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectVariants,
} from "../ui/select";
import { SelectHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";

type FormFieldSelectProps<T extends FieldValues, U> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "form"
> & {
  form: UseFormReturn<T, U, FieldValues | undefined>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: { label: string; value: string }[];
} & VariantProps<typeof SelectVariants>;

export default function FormFieldSelect<T extends FieldValues, U>({
  form,
  name,
  label,
  placeholder,
  description,
  elSize,
  options,
  className,
  ...props
}: FormFieldSelectProps<T, U>) {
  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <Select
                onValueChange={(value) => {
                  if (value === "none") {
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value?.toString()}
                value={field.value?.toString()}
                disabled={props.disabled}
              >
                <FormControl>
                  <SelectTrigger
                    elSize={elSize}
                    variant={error ? "error" : "default"}
                    className={className}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"none"}>
                    <span className="text-gray-4">선택</span>
                  </SelectItem>
                  {options.map((option) => (
                    <SelectItem
                      key={`${name}-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {description && <FormDescription>{description}</FormDescription>}
            </FormItem>
          );
        }}
      />
    </>
  );
}
