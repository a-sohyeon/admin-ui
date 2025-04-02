import { Title } from "@/components/Title";
import FormContainer from "./(container)/FormContainer";
import { TableData } from "@/consts/TableData";
import TableContainer from "./(container)/TableContainer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { splashApi } from "@/lib/http/api";
import { GetServerSidePropsContext } from "next";
import DrawerContainer from "./(container)/DrawerContainer";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const data = await splashApi.getSplash(context.query as FormSchemaType);
    return {
      props: { data },
    };
  } catch (error) {
    console.error("Failed to fetch splash data:", error);
    return {
      props: { data: [] },
    };
  }
};

const FormSchema = z.object({
  keyword: z.string().min(0, { message: "검색어를 입력해주세요." }).optional(),
  category: z.enum(["email", "name"], {
    message: "카테고리를 선택해주세요.",
  }),
  status: z
    .enum(["all", "active", "inactive"], {
      message: "노출여부를 선택해주세요.",
    })
    .optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

export default function Page({ data }: { data: TableData[] }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      category: "email",
      keyword: "",
      status: "all",
    },
  });

  return (
    <>
      <Title className="flex justify-between w-full">
        <DrawerContainer />
      </Title>

      <div className="rounded-lg bg-white py-[1.6rem] px-[4rem] mb-[1.6rem]">
        <FormContainer form={form} />
      </div>
      <TableContainer data={data} />
    </>
  );
}
