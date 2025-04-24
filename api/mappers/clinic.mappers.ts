import { ApiTypes, ViewTypes } from '@/types';
import { AffiliateDuration } from '@/types/clinics.enum';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';

export const createClinicMapper = (data: ViewTypes.ClinicFormValues): ApiTypes.CreateClinicRequest => {
  const phoneNumber = data?.details?.contactDetails?.phoneNumber;
  const { contactDetails, secondaryContactDetails } = data.details;
  return {
    name: data.details.name,
    type: data.details.clinicType,
    accountId: data.details.accountId.id,
    contactDetails: {
      firstName: contactDetails.firstName || null,
      email: contactDetails.email || null,
      jobTitle: contactDetails.jobTitle || null,
      lastName: contactDetails.lastName || null,
      phoneNumber: phoneNumber ? addUSCountryCodeWithOutPlus(phoneNumber) : null,
    },
    secondaryContactDetails: {
      firstName: secondaryContactDetails.firstName || null,
      email: secondaryContactDetails.email || null,
      jobTitle: secondaryContactDetails.jobTitle || null,
      lastName: secondaryContactDetails.lastName || null,
      phoneNumber: secondaryContactDetails.phoneNumber
        ? addUSCountryCodeWithOutPlus(secondaryContactDetails.phoneNumber)
        : null,
    },
  };
};

export const editClinicDetailsMapper = (data: ViewTypes.ClinicFormValues): ApiTypes.CreateClinicRequest => ({
  name: data.details.name,
  type: data.details.clinicType,
  accountId: data.details.accountId?.id || null,
  contactDetails: {
    firstName: data.details.contactDetails.firstName || null,
    email: data.details.contactDetails.email || null,
    jobTitle: data.details.contactDetails.jobTitle || null,
    lastName: data.details.contactDetails.lastName || null,
    phoneNumber: data.details.contactDetails.phoneNumber
      ? addUSCountryCodeWithOutPlus(data.details.contactDetails.phoneNumber)
      : null,
  },
  secondaryContactDetails: {
    firstName: data.details.secondaryContactDetails.firstName || null,
    email: data.details.secondaryContactDetails.email || null,
    jobTitle: data.details.secondaryContactDetails.jobTitle || null,
    lastName: data.details.secondaryContactDetails.lastName || null,
    phoneNumber: data.details.secondaryContactDetails.phoneNumber
      ? addUSCountryCodeWithOutPlus(data.details.secondaryContactDetails.phoneNumber)
      : null,
  },
});

export const editClinicAddressMapper = (
  data: ViewTypes.ClinicFormValues,
  clinicId: string
): ApiTypes.UpdateClinicAddressRequest => ({
  address: {
    city: data.address.address?.city,
    state: data.address.address?.state,
    street1: data.address.address?.street1,
    zipCode: data.address.address?.zipCode,
    street2: data.address.address?.street2,
  },
  billingAddress: {
    city: data.address.billingAddress?.city,
    state: data.address.billingAddress?.state,
    street1: data.address.billingAddress?.street1,
    zipCode: data.address.billingAddress?.zipCode,
    street2: data.address.billingAddress?.street2,
  },
  clinicId,
});

export const updateClinicAddressMapper = (
  data: ViewTypes.ClinicFormValues,
  clinicId: string
): ApiTypes.UpdateClinicAddressRequest => ({
  address: {
    city: data.address.address?.city,
    state: data.address.address?.state,
    street1: data.address.address?.street1,
    zipCode: data.address.address?.zipCode,
    street2: data.address.address?.street2,
  },
  billingAddress: data.address?.address?.sameBilling
    ? {
        city: data.address.address?.city,
        state: data.address.address?.state,
        street1: data.address.address?.street1,
        zipCode: data.address.address?.zipCode,
        street2: data.address.address?.street2,
      }
    : {
        city: data.address.billingAddress?.city,
        state: data.address.billingAddress?.state,
        street1: data.address.billingAddress?.street1,
        zipCode: data.address.billingAddress?.zipCode,
        street2: data.address.billingAddress?.street2,
      },
  clinicId,
});

export const updateClinicAffiliateMapper = (
  data: ViewTypes.ClinicFormValues,
  clinicId: string
): ApiTypes.UpdateClinicAffiliateRequest => ({
  ...data.affiliate,
  // @ts-ignore TODO: Remove ignore
  storagePrices: data.affiliate.storagePrices.map((el, index) => ({
    price: el.price,
    storageDuration: AffiliateDuration[index],
  })),
  clinicId,
});
