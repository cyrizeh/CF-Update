import { axiosInstance } from '@/api/axiosConfig';
import usePricingPlansMutation from '@/api/mutations/usePricingPlansMutation';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// eslint-disable-next-line no-unused-vars
const useEditPricingPlanNameModal = (onClose: any, plan: { id: string; name: string }, refetchData: any) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('pricingPlans');
  const { updatePricingPlanName } = usePricingPlansMutation();

  const [planName, setPlanName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const changePlanName = (e: any) => {
    setPlanName(e?.target?.value ?? e);
  };

  const updatePlanName = () => {
    setLoading(true);
    setError('');

    updatePricingPlanName
      .trigger({ name: planName, pricingPlanId: plan?.id })
      .then(() => {
        onClose();
        setError('');
        setPlanName('');
        const successMsg = t('toast.success_edit_name');
        toast.success(successMsg);
        refetchData();
      })
      .catch((error: any) => {
        if (error.response.data.detail?.includes('23505')) {
          const errorMsg = t('error_duplicate_edit_name');
          toast.error(errorMsg);
        } else {
          handleBackendErrors(error.response.data.errors || []);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (plan?.name) {
      setPlanName(plan?.name);
    }
  }, [plan]);

  return { planName, error, isLoading, changePlanName, setError, updatePlanName, rootRef };
};

export default useEditPricingPlanNameModal;
