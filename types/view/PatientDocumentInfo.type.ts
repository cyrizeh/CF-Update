import { DocumentStatus } from "./DocumentStatus.enum";

export type PatientDocumentInfo = {
  id:  string;
  name:  string;
  status:  DocumentStatus;
  type?:  string;
};