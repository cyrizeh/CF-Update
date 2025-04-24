export interface BillingTableProps {
  data: {
    clinicName: string;
    patient?:
      | {
          firstAndLast?: string | undefined;
        }
      | undefined;
    status: string;
    paymentDate: string;
    facilityName: string;
    paymentNumber: string;
    dueDate: string;
    name: string;
    grossAmount: string;
    discountAmount: string;
    processingFee: string;
    netAmount: string;
    note: string;
    nextBillingDate: string;
    firstName: string;
    firstPaymentDate: string | null;
    lastName: string;
    nextPaymentDate: string;
    subscriptionStatus: string;
  }[];
}
