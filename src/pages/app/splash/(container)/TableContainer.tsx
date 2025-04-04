"use client";

import { useRef, useState } from "react";
import DataTable, { DataTableRef } from "../(table)/data-table";
import { splashApi } from "@/lib/http/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columns,
  SplashTableData,
  SplashTableUpdateData,
} from "../(table)/columns";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icons";
import { useSearchParams } from "next/navigation";
import { FormSchemaType } from "..";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TableContainer = ({
  data,
  isLoading,
}: {
  data: SplashTableData[];
  isLoading: boolean;
}) => {
  const params = useSearchParams();
  const tableRef = useRef<DataTableRef<SplashTableData>>(null);
  const [rowCount, setRowCount] = useState<number>(data.length);
  const [deleteState, setDeleteState] = useState<{
    id: string[];
    status: boolean;
  }>({
    id: [],
    status: false,
  });

  const queryClient = useQueryClient();

  const query = {
    category: params.get("category") ?? "email",
    keyword: params.get("keyword") ?? "",
    status: params.get("status") ?? "all",
  } as FormSchemaType;

  const { data: splashData } = useQuery({
    queryKey: ["splash", query],
    queryFn: () => splashApi.getSplash(query),
    initialData: data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SplashTableUpdateData }) =>
      splashApi.updateSplash(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splash"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string[]) => splashApi.deleteSplash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splash"] });
      setDeleteState({ id: [], status: false });
    },
    onError: () => {
      setDeleteState({ id: [], status: false });
    },
  });

  const handleFilterState = (value: string) => {
    if (value === "all") {
      tableRef.current?.table.setColumnFilters([]);
    } else {
      tableRef.current?.table.setColumnFilters([
        {
          id: "status",
          value: value === "active" ? true : false,
        },
      ]);
    }
  };

  const handleDataUpdate = async (id: string, data: SplashTableUpdateData) => {
    updateMutation.mutate({ id, data });
  };

  const handleDataDelete = async (id: string[]) => {
    setDeleteState({ id: [...deleteState.id, ...id], status: true });
    deleteMutation.mutate(id);
  };

  const handleDeleteSelected = () => {
    const selectedRows = tableRef.current?.table.getSelectedRowModel().rows;

    if (selectedRows) {
      const ids = selectedRows.map((row) => row.original.id);
      handleDataDelete([...ids]);
      tableRef.current?.table.toggleAllPageRowsSelected(false);
    }
  };

  return (
    <div className="flex flex-col gap-[1.6rem] rounded-lg bg-white py-[1.6rem] flex-1">
      <div className="flex justify-between items-end pl-[2.4rem] pr-[4rem]">
        <p className="text-[1.6rem] font-bold">
          총 <span className="text-states-red">{rowCount}</span>건
        </p>
        <div className="flex gap-[.8rem]">
          <Button
            type="button"
            variant={"secondary2"}
            onClick={handleDeleteSelected}
            size={"sm"}
          >
            선택 삭제
            <Icon type="trash" />
          </Button>
          <Select onValueChange={handleFilterState}>
            <SelectTrigger elSize={"sm"} className="min-w-[10rem]">
              <SelectValue placeholder="노출여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <DataTable
          data={splashData}
          columns={columns}
          ref={tableRef}
          onUpdateData={handleDataUpdate}
          onDeleteData={handleDataDelete}
          onRowCountChange={setRowCount}
          deleteState={deleteState}
        />
      )}
    </div>
  );
};

export default TableContainer;
