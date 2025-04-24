import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { AxiosError } from 'axios';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetOnboardingData = (isPatient = true): ViewTypes.QueryData<ApiTypes.OnboardingResponse> => {
  return useSWR<ApiTypes.OnboardingResponse>(isPatient ? `/Patients/Onboarding` : null, fetcher, 
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  }
)};

const useGetOnboardingDataByAdmin = (patientId:string): ViewTypes.QueryData<ApiTypes.OnboardingResponse> => {
  return useSWR<ApiTypes.OnboardingResponse>(`admin/Patients/${patientId}/Onboarding`, fetcher, 
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  }
)};



export { useGetOnboardingData, useGetOnboardingDataByAdmin };
