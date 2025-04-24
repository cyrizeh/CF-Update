import { ReactNode } from "react";

export type Panel = {
  title: string;
  isEditable?: boolean;
  children: ReactNode
  onEdit?: () => void;
};