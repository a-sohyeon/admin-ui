import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type FormFieldRadioProps<T extends FieldValues, U> = {
  form: UseFormReturn<T, U, FieldValues | undefined>;
  name: Path<T>;
  label?: string;
  options: { label: string; value: string }[];
  required?: boolean;
  description?: string;
};

export default function FormFieldRadio<T extends FieldValues, U>({
  form,
  name,
  label,
  options,
  description,
  required,
}: FormFieldRadioProps<T, U>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel required={required}>{label}</FormLabel>}

            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                {options.map((option) => (
                  <FormItem
                    className="flex items-center gap-[.8rem]"
                    key={option.value}
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className="mb-0">{option.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
