export type StatusPanel = {
  statuses: {
    label: string;
    value: string;
    disabled?:boolean;
  }[];
  status: string;
  disabled:boolean;
  handleChange: (value: string, id?:string) => void;
}