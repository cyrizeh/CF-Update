export interface SpecimensDataRowProps {
  specimens: any[]; 
  checkedIds?: string[];
  onCheck?: (id: string) => void;
}