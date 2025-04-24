export type CreateClinicRequest = {
  name: string;
  accountId: string | null;
  type: string;
  contactDetails: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    jobTitle: string | null;
  } | null;
  secondaryContactDetails: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    jobTitle: string | null;
  } | null;
};
