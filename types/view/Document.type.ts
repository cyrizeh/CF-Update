export type Document = {
  topText?: string;
  belowText?: string;
  className?: string;
  checked?: boolean;
  toggleDocumentStatus: () => void;
};