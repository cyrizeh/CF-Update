// Types
export interface PaymentButtonGroupProps {
  payTime: string;
  setPayTime: (time: string) => void;
  payNowEnabled: boolean;
  schedulePaymentEnabled: boolean;
  isSignupPatient?: boolean;
}

export interface PaymentSummaryProps {
  paymentAmount: any;
  payTime: string;
}

export interface ExtraProtectionProps {
  extraProtection: any;
  payTime: string;
}

export interface ActionButtonProps {
  actions: any[];
}
