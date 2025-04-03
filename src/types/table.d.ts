import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    onUpdateData?: (id: string, data: Partial<TData>) => Promise<void>;
    onDeleteData?: (id: string[]) => Promise<void>;
  }
  interface TableState {
    deleteState?: {
      id: string[];
      status: boolean;
    };
  }
}
