import { axios } from '@/api/queries/patient.queries';

export const step1 = async (patientInfo: any) => {
  return axios('', 'POST', patientInfo);
};

export const step2 = async (partnerInfo: any) => {
  return axios('/Partner', 'POST', partnerInfo);
};

export const step3 = async (emergencyInfo: any) => {
  return axios('/EmergencyContact', 'POST', emergencyInfo);
};

export const step4 = async (billingInfo: any) => {
  return axios('/Billing', 'POST', billingInfo);
};

export const step5 = async (donorInfo: any) => {
  return axios('/DonorInformation', 'POST', donorInfo);
};

export const updatePatient = async (patientInfo: any) => {
  return axios(`/${patientInfo.patientId}`, 'PUT', patientInfo);
};
