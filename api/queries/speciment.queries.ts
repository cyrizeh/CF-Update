import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import { CaneDetails } from '@/types/view/Specimen.interface';
import { AxiosError } from 'axios';

const SPECIMEN_URL = '/Specimens';
const DEVICE_URL = '/Devices';
const CANES_URL = '/Canes';
const CANE_URL = '/Cane';
const BASE_URL = '/Inventory';
const PATIENT_URL = '/Patients';
const ADMIN_URL = '/Admin';
const CLINIC_ADMIN_URL = '/Clinics';
const ACCOUNT_ADMIN_URL = '/Accounts';
const RFID = '/RFID';
const IDENT = '/Ident';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetDevices = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(`${BASE_URL}${DEVICE_URL}/?${createQueryString(params)}`, fetcher,
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  });
};
const useGetPatientsDevices = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(`${ADMIN_URL}${PATIENT_URL}/${params.patientId}${DEVICE_URL}/?${createQueryString(params)}`, fetcher,
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  });
};

const useGetSpecimens = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(`${SPECIMEN_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetPatientsSpecimens = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(`${ADMIN_URL}${PATIENT_URL}/${params.patientId}/${SPECIMEN_URL}/?${createQueryString(params)}`, fetcher);
};


const useGetCanes = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.CanesResponse> => {
  
  return useSWR<ApiTypes.CanesResponse>(`${BASE_URL}${CANES_URL}/?${createQueryString(params)}`, fetcher,
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  });
};

const useGetAdminPatientsCanes = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.CanesResponse> => {
  
  return useSWR<ApiTypes.CanesResponse>(`${ADMIN_URL}${PATIENT_URL}/${params.patientId}${CANES_URL}/?${createQueryString(params)}`, fetcher,
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 3) return; 
    },
  });
};

const useGetCaneById = (caneId: string): ViewTypes.QueryData<CaneDetails> => {
  const shouldFetch = caneId && caneId.trim().length > 0;
  return useSWR<CaneDetails>(shouldFetch ? `${BASE_URL}${CANE_URL}/${caneId}` : null, fetcher);
};

const useGetPatientCanes = ({ params }: { params: ParamsProps }): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const url = `${PATIENT_URL}${CANES_URL}`;
  return useSWR<ApiTypes.SpecimensResponse>(`${url}?${createQueryString(params)}`, fetcher);
};

const useGetPatientDevices = ({ params }: { params: ParamsProps }): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const url = `${PATIENT_URL}${DEVICE_URL}`;
  return useSWR<ApiTypes.SpecimensResponse>(`${url}?${createQueryString(params)}`, fetcher);
};

const useGetPatientSpecimens = ({
  params,
}: {
  params: ParamsProps;
}): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const url = `${PATIENT_URL}${SPECIMEN_URL}`;
  return useSWR<ApiTypes.SpecimensResponse>(`${url}?${createQueryString(params)}`, fetcher);
};

const useGetSpecimensByCane = ({
  params,
  caneId,
}: {
  params: ParamsProps;
  caneId: string;
}): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(
    `${BASE_URL}${CANE_URL}/${caneId}${SPECIMEN_URL}/?${createQueryString(params)}`,
    fetcher
  );
};

const useGetDevicesByCane = ({
  params,
  caneId,
}: {
  params: ParamsProps;
  caneId: string;
}): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(
    `${BASE_URL}${CANE_URL}/${caneId}${DEVICE_URL}/?${createQueryString(params)}`,
    fetcher
  );
};

const useGetClinicCanes = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.CanesResponse> => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<ApiTypes.CanesResponse>(
    shouldFetch ? `${CLINIC_ADMIN_URL}/${params.id}${CANES_URL}/?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetClinicDevices = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<ApiTypes.SpecimensResponse>(
    shouldFetch ? `${CLINIC_ADMIN_URL}/${params.id}${DEVICE_URL}/?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetClinicSpecimens = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(
    `${CLINIC_ADMIN_URL}/${params.id}${SPECIMEN_URL}/?${createQueryString(params)}`,
    fetcher
  );
};
const useGetAccountCanes = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.CanesResponse> => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<ApiTypes.CanesResponse>(
    shouldFetch ? `${ACCOUNT_ADMIN_URL}/${params.id}${CANES_URL}/?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetAccountDevices = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<ApiTypes.SpecimensResponse>(
    shouldFetch ? `${ACCOUNT_ADMIN_URL}/${params.id}${DEVICE_URL}/?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetAccountSpecimens = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<ApiTypes.SpecimensResponse>(
    shouldFetch ? `${ACCOUNT_ADMIN_URL}/${params.id}${SPECIMEN_URL}/?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetRfidConfiguration = (isFetch = true): ViewTypes.QueryData<Record<string, string>> => {
  const url = `${BASE_URL}${RFID}${IDENT}`;
  return useSWR<Record<string, string>>(isFetch ? `${url}` : null, fetcher);
};

const useGetCanesStatistics = (): any => {
  return useSWR<ApiTypes.CanesResponse>(`${BASE_URL}/statistics`, fetcher);
};

const useGetAdminReceivedDates = (id: string, shouldFetch: boolean) => {
  const url = shouldFetch ? `${BASE_URL}/receivedDates/${id}` : null;
  return useSWR(url, fetcher);
};

const useGetCaneNotes = ({ params }: { params: ParamsProps & { caneId: string } }): ViewTypes.QueryData<any> => {
  return useSWR<any>(`${BASE_URL}${CANE_URL}/Notes/?${createQueryString(params)}`, fetcher);
};

const useGetCaneLocationHistory = ({
  params,
}: {
  params: ParamsProps & { caneId: string };
}): ViewTypes.QueryData<any> => {
  return useSWR<any>(`${BASE_URL}${CANE_URL}/location-histories/?${createQueryString(params)}`, fetcher);
};

export {
  useGetDevices,
  useGetCaneById,
  useGetCanes,
  useGetSpecimens,
  useGetPatientCanes,
  useGetSpecimensByCane,
  useGetDevicesByCane,
  useGetClinicCanes,
  useGetClinicDevices,
  useGetClinicSpecimens,
  useGetAccountCanes,
  useGetAccountDevices,
  useGetAccountSpecimens,
  useGetPatientDevices,
  useGetPatientSpecimens,
  useGetRfidConfiguration,
  useGetCanesStatistics,
  useGetAdminReceivedDates,
  useGetCaneNotes,
  useGetCaneLocationHistory,
  useGetAdminPatientsCanes,
  useGetPatientsDevices,
  useGetPatientsSpecimens
};
