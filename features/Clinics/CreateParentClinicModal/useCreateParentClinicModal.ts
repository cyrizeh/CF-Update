import { axiosInstance } from '@/api/axiosConfig';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

// eslint-disable-next-line no-unused-vars
const useCreateParentClinicModal = (setIsOpen: (value: boolean) => any) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [clinic, setClinic] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const changeClinicName = (e: any) => {
    setClinic(e?.target?.value ?? e);
  };

  const createNewClinic = () => {
    setLoading(true);
    setError('');

    axiosInstance
      .post('/Accounts', { name: clinic })
      .then(() => {
        setLoading(false);
        setIsOpen(false);
        setError('');
        setClinic('');
        toast.success('Account created successfully!');
      })
      .catch((reason: any) => {
        setLoading(false);

        if (reason.response.data?.errors?.Name) {
          setError(reason.response.data?.errors?.Name[0]);
          toast.error(reason.response.data?.errors?.Name[0]);
        } else {
          toast.error('Failed created company!');
        }
      });
  };

  return { clinic, error, isLoading, changeClinicName, setError, createNewClinic, rootRef };
};

export default useCreateParentClinicModal;
