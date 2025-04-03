"use client";

import { useEffect, useRef, useState } from "react";
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

const TableContainer = ({ data }: { data: SplashTableData[] }) => {
  const params = useSearchParams();
  const [tableData, setTableData] = useState<SplashTableData[]>(data);
  const tableRef = useRef<DataTableRef<SplashTableData>>(null);
  const [rowCount, setRowCount] = useState<number>(tableData.length);
  const [deleteState, setDeleteState] = useState<{
    id: string[];
    status: boolean;
  }>({
    id: [],
    status: false,
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
    try {
      const res = await splashApi.updateSplash(id, data);
      if (res.success) {
        const query = {
          category: params.get("category") ?? "email",
          keyword: params.get("keyword") ?? "",
          status: params.get("status") ?? "all",
        } as FormSchemaType;
        const data = await splashApi.getSplash(query);
        setTableData(data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDataDelete = async (id: string[]) => {
    setDeleteState({ id: [...deleteState.id, ...id], status: true });
    try {
      const res = await splashApi.deleteSplash(id);
      if (res.success) {
        const query = {
          category: params.get("category") ?? "email",
          keyword: params.get("keyword") ?? "",
          status: params.get("status") ?? "all",
        } as FormSchemaType;
        const data = await splashApi.getSplash(query);
        setTableData(data);
      } else {
        setTableData([]);
        throw new Error("Failed to delete status");
      }
    } catch (error) {
      console.error("Failed to delete status:", error);
      setDeleteState({
        id: [],
        status: false,
      });
    } finally {
      setDeleteState({
        id: [],
        status: false,
      });
    }
  };

  const handleDeleteSelected = () => {
    const selectedRows = tableRef.current?.table.getSelectedRowModel().rows;

    if (selectedRows) {
      const ids = selectedRows.map((row) => row.original.id);
      handleDataDelete([...ids]);
      tableRef.current?.table.toggleAllPageRowsSelected(false);
    }
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-[1.6rem] rounded-lg bg-white py-[1.6rem]">
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
          <Select
            onValueChange={(value) => {
              handleFilterState(value);
            }}
          >
            <SelectTrigger elSize={"sm"} className="min-w-[10rem]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        data={tableData}
        columns={columns}
        ref={tableRef}
        onUpdateData={handleDataUpdate}
        onDeleteData={handleDataDelete}
        onRowCountChange={setRowCount}
        deleteState={deleteState}
      />
    </div>
  );
};

export default TableContainer;
