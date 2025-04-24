import { axiosInstance } from '@/api/axiosConfig';
import { toast } from 'react-toastify';
import { useGetClinics } from '@/api/queries/clinic.queries';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


const useImportCSVModal = () => {
  const router = useRouter();
  const [value, setValue] = useState<any>({ name: '', size: '' });

  const onChange = (e: any) => {
    setValue(e[0]);
  };

  const removeUploadFile = () => {
    setValue({ name: '', size: '' });
  };

  const { data: clinics } = useGetClinics({ pageSize: 100 });

  const [clinic, setClinic] = useState<string>('');
  const [clinicError, setClinicError] = useState<string>('');

  useEffect(() => {
    if (clinic) {
      const isClinicHasBillingForCurrentYear = clinics?.items.find(
        item => item.id === clinic && item.hasBillingForCurrentYear
      );
      setClinicError(
        isClinicHasBillingForCurrentYear ? '' : 'You need to set up your billing plan before adding patients.'
      );
    }
  }, [clinic, clinics]);

  useEffect(() => {
    if (clinics?.items[0]?.id) {
      setClinic((router.query?.id as string) || '');
    }
  }, [clinics, router]);

  const uploadFile = async () => {
    if (value) {
      const formData = new FormData();
      formData.append('file', value);
      formData.append('clinicId', clinic);

      try {
        const res = await axiosInstance.post('/imports', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
          },
        });

        const headers = JSON.stringify(res.data.headers);
        const availableFields = JSON.stringify(res.data.availableFields);

        localStorage.setItem('availableFields', availableFields);
        localStorage.setItem('headers', headers);
        localStorage.setItem('id', res.data.importDataId);

        return router.push(`/admin/clinics/import`);
      } catch (err: any) {
        toast.error(err?.response.data?.errors?.File[0] || err?.response.data);
      }
    }
  };

  return { router, value, onChange, uploadFile, clinic, clinics, setClinic, removeUploadFile, clinicError };
};

export default useImportCSVModal;
