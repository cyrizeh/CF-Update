export interface BillingProps {
  clinicName: string;
  firstName: string;
  firstPaymentDate: string | null;
  lastName: string;
  nextPaymentDate: string;
  subscriptionStatus: string;
  id: string;

  // New props
  name: string;
  status: string;
  paymentDate: any;
  dueDate: string;
  grossAmount: string;
}
