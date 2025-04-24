export interface DataTableProps {
  headers: string[];
  isAllChecked?: boolean
  onCheckAll?: () => void;
  children: React.ReactNode;
}
