import Counter from "@/components/Counter";
import FormFieldInput from "@/components/Form/FormFieldInput";
import FormFieldRadio from "@/components/Form/FormFieldRadio";
import { Icon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { splashApi } from "@/lib/http/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
  email: z.string().email({ message: "이메일 형식으로 입력해주세요." }),
  status: z.enum(["active", "inactive"], {
    message: "상태를 선택해주세요.",
  }),
  amount: z.number().min(0, { message: "금액을 입력해주세요." }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function DrawerContainer({
  startLoading,
  stopLoading,
}: {
  startLoading: () => void;
  stopLoading: () => void;
}) {
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormSchemaType) => {
      const _data = {
        ...data,
        id: Math.random().toString(36).substring(2, 10),
        status: data.status === "active",
      };
      return splashApi.createSplash(_data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splash"] });
      form.reset();
      router.replace("/app/splash");
    },
    onSettled: () => {
      stopLoading();
    },
    onError: (error) => {
      console.error("Failed to create splash:", error);
    },
  });

  const handleSubmit = async (data: FormSchemaType) => {
    startLoading();
    createMutation.mutate(data);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant={"default"} type="button" size={"lg"}>
          신규등록
          <Icon type="plus" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DrawerHeader>
              <DrawerTitle>신규등록</DrawerTitle>
              <DrawerDescription>신규 스플래시를 등록합니다.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-[3.2rem] py-[2.4rem]">
              <FormFieldInput
                form={form}
                name="name"
                label="이름"
                type="text"
                placeholder="이름을 입력해주세요."
                elSize={"sm"}
              />
              <FormFieldInput
                form={form}
                name="email"
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요."
                elSize={"sm"}
              />
              <FormFieldRadio
                form={form}
                name="status"
                label="상태"
                options={[
                  { label: "활성", value: "active" },
                  { label: "비활성", value: "inactive" },
                ]}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>금액</FormLabel>
                    <FormControl>
                      <Counter
                        value={field.value}
                        onChange={field.onChange}
                        min={0}
                        max={100000000}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant={"secondary2"} type="button" size={"lg"}>
                  취소
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant={"default"} type="submit" size={"lg"}>
                  등록
                  <Icon type="plus" />
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
