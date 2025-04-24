export type CreatePatientPaymentRequest = {
  paymentMethodToken: string;
  verificationToken: string;
};

export type CreatePatientPaymentRequestByAdmin = {
  paymentMethodToken: string;
  verificationToken: string;
  patientId: string;
};

export type CreateTransportationsPatientPaymentRequest = CreatePatientPaymentRequest & {
  transportationRequestId: string;
};
