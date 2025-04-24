import { axiosPatient } from '@/api/queries/patient.queries';

export const step1 = async (patientInfo: any) => {
  return axiosPatient('/GeneralInfo', 'POST', patientInfo);
};

export const step2 = async (partnerInfo: any) => {
  return axiosPatient('/SignupPartner ', 'POST', partnerInfo);
};

export const step3 = async (emergencyInfo: any) => {
  return axiosPatient('/EmergencyContact', 'POST', emergencyInfo);
};

export const completeSignup = async () => {
  return axiosPatient('/CompleteSignup', 'POST', {});
};


export const updatePatient = async (patientInfo: any) => {
  return axiosPatient(`/${patientInfo.patientId}`, 'PUT', patientInfo);
};
