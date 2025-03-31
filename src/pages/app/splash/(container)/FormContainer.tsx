import FormFieldInput from "@/components/Form/FormFieldInput";
import FormFieldRadio from "@/components/Form/FormFieldRadio";
import { Icon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "../index";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";
import FormFieldSelect from "@/components/Form/FormFieldSelect";

const FormLow = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="flex items-center w-full gap-[.8rem]">
      <p className="text-gray-9 text-[1.4rem] font-bold min-w-[11.3rem]">
        {label}
      </p>
      <div className="flex items-start w-full gap-[.8rem]">{children}</div>
    </div>
  );
};

const FormContainer = ({ form }: { form: UseFormReturn<FormSchemaType> }) => {
  const router = useRouter();
  const handleSubmit = (data: FormSchemaType) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    router.replace(`/app/splash?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-[.4rem]"
      >
        <div className="flex flex-col gap-[1.6rem] w-full">
          <FormLow label="검색어">
            <FormFieldSelect
              form={form}
              name="category"
              className="min-w-[13rem]"
              options={[
                { label: "이메일", value: "email" },
                { label: "이름", value: "name" },
              ]}
            />
            <FormFieldInput
              form={form}
              name={"keyword"}
              placeholder="검색어를 입력해주세요."
              elSize={"sm"}
              className="w-full"
              defaultValue={router.query.keyword}
            />
          </FormLow>
          <FormLow label="노출여부">
            <FormFieldRadio
              form={form}
              name="status"
              options={[
                { label: "전체", value: "all" },
                { label: "활성화", value: "active" },
                { label: "비활성화", value: "inactive" },
              ]}
            />
          </FormLow>
        </div>
        <Button variant={"secondary1"} type="submit" size={"md"}>
          검색
          <Icon type="search" />
        </Button>
        <Button
          variant={"secondary2"}
          size={"md"}
          onClick={() => {
            form.reset();
            router.replace("/app/splash");
          }}
        >
          <Icon type="return" />
        </Button>
      </form>
    </Form>
  );
};

export default FormContainer;
