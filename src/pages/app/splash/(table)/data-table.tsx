"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Table as TableInstance,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { TablePagination } from "@/components/Table/table-pagination";

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  onUpdateData?: (id: string, data: Partial<TData>) => Promise<void>;
  onDeleteData?: (id: string[]) => Promise<void>;
  onRowCountChange?: (count: number) => void;
  deleteState?: {
    id: string[];
    status: boolean;
  };
}

export interface DataTableRef<TData> {
  getSelectedRows: () => TData[];
  table: TableInstance<TData>;
}

const DataTable = <TData, TValue>(
  {
    data,
    columns,
    onUpdateData,
    onDeleteData,
    onRowCountChange,
    deleteState,
  }: DataTableProps<TData, TValue>,
  ref: React.ForwardedRef<DataTableRef<TData>>
) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true, // 행 선택 활성화
    getCoreRowModel: getCoreRowModel(), // 기본 행 모델 가져오기
    getFilteredRowModel: getFilteredRowModel(), // 필터링된 행 모델 가져오기
    getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 행 모델 가져오기
    getSortedRowModel: getSortedRowModel(), // 정렬된 행 모델 가져오기
    onColumnFiltersChange: setColumnFilters, // 열 필터 변경 시 호출
    onRowSelectionChange: setRowSelection, // 행 선택 변경 시 호출
    onPaginationChange: setPagination, // 페이지네이션 변경 시 호출
    state: {
      columnFilters, // 열 필터 상태
      rowSelection, // 행 선택 상태
      pagination, // 페이지네이션 상태
      deleteState, // 삭제 상태
    },
    meta: {
      onUpdateData, // 데이터 업데이트 함수
      onDeleteData, // 데이터 삭제 함수
    },
    autoResetPageIndex: false,
  });

  useEffect(() => {
    if (onRowCountChange) {
      onRowCountChange(table.getRowCount());
    }
  }, [columnFilters, table, onRowCountChange, data]);

  useImperativeHandle(ref, () => ({
    getSelectedRows: () => {
      return table.getSelectedRowModel().rows.map((row) => row.original);
    },
    table: table,
  }));

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center py-[2rem]">
        <TablePagination table={table} pageCount={table.getPageCount()} />
      </div>
    </div>
  );
};

export default forwardRef(DataTable) as <TData, TValue>(
  props: DataTableProps<TData, TValue> & {
    ref?: React.ForwardedRef<DataTableRef<TData>>;
  }
) => JSX.Element;
