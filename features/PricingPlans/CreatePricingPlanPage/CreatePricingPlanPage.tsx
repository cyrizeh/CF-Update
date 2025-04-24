import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import usePricingPlansMutation from '@/api/mutations/usePricingPlansMutation';
import { useGetPricingPlanServices } from '@/api/queries/pricingPlans.queries';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { pricingPlanValidationSchema } from '@/validations/pricingPlans';
import { yupResolver } from '@hookform/resolvers/yup';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import FormButtons from '../PricingPlanDetailsPage/PricingPlanDetailsPageFormButtons';
import PricingPlanForm from '../PricingPlanForm/PricingPlanForm';
import { INITIAL_VALUES } from '../PricingPlansPage.const';
import { useRouter } from 'next/router';
import { buildAdminPricingPlanDetailsPageRoute } from '@/constants/buildRoutes';

const CreatePricingPlan = () => {
  const { t } = useTranslation('pricingPlans');
  const [isSaving, setIsSaving] = useState(false);
  const [stateValues, setValues] = useState<PricingPlanFormFields>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();

  const { data, isLoading } = useGetPricingPlanServices();

  const form = useForm<PricingPlanFormFields>({
    defaultValues: INITIAL_VALUES,
    values: stateValues,
    // @ts-ignore
    resolver: yupResolver(pricingPlanValidationSchema()),
  });

  const { createPricingPlan } = usePricingPlansMutation();

  const onSubmit = (data: PricingPlanFormFields) => {
    const mapped = {
      name: data?.form?.values?.name,
      billingCriteria: data?.form.values.chargeType,
      subscriptionType: data?.form.values.subscriptionType,
      servicePrices: data?.form.values.servicePrices?.map((el: any) => ({
        ...el,
        price: el.price === null ? 0 : el.price,
      })),
      discounts: data?.form.values.discounts
        ?.filter((el: { amount: any }) => el.amount !== null)
        .map((el: { type: string; amount: any; name: string }) => ({
          ...el,
          amount: Number(el.amount),
        })),
      storagePrices: Object.keys(data?.form.values.storagePrices || []).map((el: any) => ({
        storageDuration: el,
        isEnabled: data?.form.values.storagePrices[el].isEnabled,
        embryoPrice: Number(data?.form.values.storagePrices[el].embryoPrice) || 0,
        spermPrice: Number(data?.form.values.storagePrices[el].spermPrice) || 0,
        oocytePrice: Number(data?.form.values.storagePrices[el].oocytePrice) || 0,
        patientPrice: Number(data?.form.values.storagePrices[el].patientPrice) || 0,
        canePrice: Number(data?.form.values.storagePrices[el]?.canePrice) || 0,
      })),
    };

    setIsSaving(true);

    createPricingPlan
      .trigger(mapped)
      .then(response => {
        setIsSaving(false);
        toast.success('Billing saved!');

        if (response?.data?.id) {
          router.push(buildAdminPricingPlanDetailsPageRoute(response?.data?.id));
        }
        // @ts-ignore
        mutate(true, undefined, { revalidate: true });
      })
      .catch(error => {
        setIsSaving(false);
        if (error.response.data.detail?.includes('23505') && error.response.data.detail?.includes('discounts')) {
          const errorMsg = 'Duplicate discount names cannot be created. Please check and correct the discount names.';
          toast.error(errorMsg);
        }
        if (error?.response?.data?.errors) {
          handleBackendErrors(error.response.data.errors);
        }
      });
  };

  useEffect(() => {
    if (data && !isLoading) {
      let newData = {
        form: {
          ...INITIAL_VALUES,
          values: {
            ...INITIAL_VALUES.form.values,
            servicePrices: data.map((service: any) => ({
              ...service,
              serviceId: service.id,
            })),
          },
        },
      };

      setValues(newData);

      setTimeout(() => setIsPageLoading(false), 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  if (isPageLoading)
    return (
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner example" />
      </div>
    );

  return (
    <div>
      <h1 className="mb-4 w-[500px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text py-2 text-3xl font-light text-transparent md:text-5xl">
        {t('create')}
      </h1>
      <FormProvider {...form}>
        <PricingPlanForm />
      </FormProvider>

      <FormButtons isSaving={isSaving} onSave={form.handleSubmit(onSubmit)} />
    </div>
  );
};

export default CreatePricingPlan;
