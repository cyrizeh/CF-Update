export type UpdateClinicRequest = {
  name: string;
  accountId: string;
  type: string;
  contactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
  } | null;
  clinicId: string;
};
