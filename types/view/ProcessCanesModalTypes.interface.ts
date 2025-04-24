export interface ProcessCanesModalTypes {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  message: string;
  selectClinic?: boolean;
  validationSchema?: any;
  clinicName?: string;
}