import { axios } from '@/api/queries/transportation.queries';

export type Step1RequestData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  alternativeEmail?: string;
  note: string;
  phoneNumber: string;
  dateOfBirth?: any; // TODO: Check if we need it
  address?: any; // TODO: Check if we need it
  hasPartner: boolean;
  patientId?: string;
};

type Step1EditRequestData = Step1RequestData & {
  transportationRequestId: string;
};

type Step2RequestData = {
  patientId: string|null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transportationRequestId: string;
};

type Step2EditRequestData =  {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transportationRequestId: string;
};

export type Step3RequestData = {
  transportationRequestId: string;
  cryoToSending: number;
  sendingToRecieving: number;
  recievingToCryo: number;
};

type Step4RequestData = {
  requestingClinicId: string;
  specimenTypes: string[];
  payer: string;
  witnessId: string;
  expeditedDelivery: boolean;
  expeditedPrice?: number;
};

// Define the functions with types
export const step1 = async (data: Step1RequestData): Promise<any> => {
  return axios('', 'POST', data);
};

export const step1Edit = async (data: Step1EditRequestData): Promise<any> => {
  return axios(`/${data.transportationRequestId}`, 'PUT', data);
};

export const step2 = async (data: Step2RequestData, id: string): Promise<any> => {
  return axios(`/${id}/Partner`, 'POST', data);
};

export const step2Edit = async (data: Step2EditRequestData): Promise<any> => {
  return axios(`/${data.transportationRequestId}/Partner`, 'PUT', data);
};

export const step3 = async (data: Step3RequestData, id: string): Promise<any> => {
  return axios(`/${id}/Distance`, 'PUT', {
    cryoToSending: data.cryoToSending,
    sendingToRecieving: data.sendingToRecieving,
    recievingToCryo: data.recievingToCryo,
    transportationRequestId: data.transportationRequestId,
  });
};

export const step4 = async (data: Step4RequestData, id: string): Promise<any> => {
  return axios(`/${id}/BaseDetails`, 'PUT', data);
};
