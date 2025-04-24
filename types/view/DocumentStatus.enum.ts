export enum DocumentStatus {
  NotStarted = 'NotStarted',
  PendingPatientSignature = 'PendingPatientSignature',
  PendingPartnerSignature = 'PendingPartnerSignature',
  PendingCryoFutureSignature = 'PendingCryoFutureSignature',
  Complete = 'Complete',
}

export const DocumentStatusTitleMap: Record<DocumentStatus, string> = {
  [DocumentStatus.NotStarted]: 'Not Started',
  [DocumentStatus.PendingPatientSignature]: 'Pending Patient Signature',
  [DocumentStatus.PendingPartnerSignature]: 'Pending Partner Signature',
  [DocumentStatus.PendingCryoFutureSignature]: 'Pending CryoFuture Signature',
  [DocumentStatus.Complete]: 'Complete',
};

export const getDocumentStatusTitle = (status: DocumentStatus): string => {
  return DocumentStatusTitleMap[status] || 'Unknown Status';
};
