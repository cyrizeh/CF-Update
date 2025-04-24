import { Button, Spinner } from 'flowbite-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import usePricingPlansMutation from '@/api/mutations/usePricingPlansMutation';
import { useGetPricingPlanById } from '@/api/queries/pricingPlans.queries';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { pricingPlanValidationSchema } from '@/validations/pricingPlans';
import { yupResolver } from '@hookform/resolvers/yup';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import PricingPlanForm from '../PricingPlanForm/PricingPlanForm';
import { INITIAL_VALUES } from '../PricingPlansPage.const';
import { PricingPlanFormFields } from './PricingPlanDetailsPage.types';
import FormButtons from './PricingPlanDetailsPageFormButtons';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { NotFound } from '@/features/NotFound/NotFound';

const PricingPlanDetailsPage = () => {
  const { t } = useTranslation('pricingPlans');
  const [isLoadingChangeName, setLoadingChangeName] = useState(false);

  const { query, replace } = useRouter();

  const [stateValues, setValues] = useState<PricingPlanFormFields>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PricingPlanFormFields>({
    defaultValues: INITIAL_VALUES,
    values: stateValues,
    // @ts-ignore
    resolver: yupResolver(pricingPlanValidationSchema()),
  });

  const editPricingPlanNameScheme = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const editPlanForm = useForm<{ name: string }>({
    defaultValues: {},
    resolver: yupResolver(editPricingPlanNameScheme),
  });

  const { data, mutate, isLoading, error } = useGetPricingPlanById(query.id as string);
  const { createPricingPlan } = usePricingPlansMutation();

  const { updatePricingPlanName } = usePricingPlansMutation();

  const updatePlanName = () => {
    setLoadingChangeName(true);

    updatePricingPlanName
      .trigger({
        name: editPlanForm?.watch('name'),
        pricingPlanId: query.id as string,
      })
      .then(() => {
        const successMsg = t('pricingPlans:toast.success_edit_name');
        toast.success(successMsg);
      })
      .catch((error: any) => {
        if (error.response.data.detail?.includes('23505')) {
          const errorMsg = t('pricingPlans:toast.error_duplicate_edit_name');
          toast.error(errorMsg);
        } else {
          handleBackendErrors(error.response.data.errors || []);
        }
      })
      .finally(() => {
        setLoadingChangeName(false);
      });
  };

  const getStoragePrices = (data: any, duration: string) => ({
    embryoPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.embryoPrice || 0,
    canePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.canePrice || 0,
    patientPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.patientPrice || 0,
    spermPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.spermPrice || 0,
    oocytePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.oocytePrice || 0,
    isEnabled: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.isEnabled || false,
  });

  useEffect(() => {
    if (data && !isLoading) {
      {
        const services = data ?? INITIAL_VALUES.form.values;

        const mappedData = {
          form: {
            ...INITIAL_VALUES.form,
            values: {
              ...INITIAL_VALUES.form.values,
              ...services,
              chargeType: data?.billingCriteria || 'SpecimenTypes',
              subscriptionType: data?.subscriptionType || 'Consolidated',
              storagePrices: {
                OneMonth: getStoragePrices(data, 'OneMonth'),
                Quarter: getStoragePrices(data, 'Quarter'),
                SixMonth: getStoragePrices(data, 'SixMonth'),
                OneYear: getStoragePrices(data, 'OneYear'),
                TwoYears: getStoragePrices(data, 'TwoYears'),
                ThreeYears: getStoragePrices(data, 'ThreeYears'),
                FiveYears: getStoragePrices(data, 'FiveYears'),
                TenYears: getStoragePrices(data, 'TenYears'),
              },
            },
          },
        };
        setValues(mappedData);
        editPlanForm?.setValue('name', data?.name);
      }

      setTimeout(() => setIsPageLoading(false), 350);
    }
    if (error) {
      setIsPageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, error]);

  const onSubmit = (formData: PricingPlanFormFields) => {
    const mapped = {
      pricingPlanId: data?.originalPlanId || '',
      name: formData?.form.values.name || '',
      billingCriteria: formData?.form.values.chargeType || '',
      subscriptionType: formData?.form.values.subscriptionType || '',
      servicePrices: formData?.form.values.servicePrices?.map((el: any) => ({
        ...el,
        price: el.price === null ? 0 : el.price,
      })),
      discounts: formData?.form.values.discounts
        ?.filter((el: { amount: any }) => el.amount !== null)
        .map((el: { type: string; amount: any; name: string }) => ({
          ...el,
          amount: Number(el.amount),
        })),
      storagePrices: Object.keys(formData?.form.values.storagePrices || []).map((el: any) => ({
        storageDuration: el,
        isEnabled: formData?.form.values.storagePrices[el].isEnabled,
        embryoPrice: Number(formData?.form.values.storagePrices[el].embryoPrice) || 0,
        spermPrice: Number(formData?.form.values.storagePrices[el].spermPrice) || 0,
        oocytePrice: Number(formData?.form.values.storagePrices[el].oocytePrice) || 0,
        patientPrice: Number(formData?.form.values.storagePrices[el].patientPrice) || 0,
        canePrice: Number(formData?.form.values.storagePrices[el]?.canePrice) || 0,
      })),
    };

    setIsSaving(true);

    createPricingPlan
      .trigger(mapped)
      .then(response => {
        setIsSaving(false);
        toast.success('Billing saved!');

        const newId = response?.data?.id;
        replace(`/admin/pricing-plans/${newId}`, undefined, { shallow: true });
        // @ts-ignore
        mutate(true, undefined, { revalidate: true });
      })
      .catch(error => {
        setIsSaving(false);
        if (error.response.data.detail?.includes('23505') && error.response.data.detail?.includes('discounts')) {
          const errorMsg = 'Duplicate discount names cannot be created. Please check and correct the discount names.';
          toast.error(errorMsg);
        }
        if (error.response.data.errors) {
          handleBackendErrors(error.response.data.errors);
        }
      });
  };

  if (isPageLoading)
    return (
      <div>
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      </div>
    );

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:pricingPlanNotFound')} />;
  }

  return (
    <div>
      <div className="relative">
        {isLoading && (
          <div className="absolute z-20 flex h-full w-full items-start justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
            <div className="flex items-start justify-center gap-2 pt-24 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px] " /> {t('common:loadingWithDots')}
            </div>
          </div>
        )}

        <h1 className="mb-4 w-[500px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text py-2 text-3xl font-light text-transparent md:text-5xl">
          {t('planDetails')}
        </h1>
        <section className="flex flex-col rounded-lg bg-[#1E2021] pt-8">
          {
            <div className="flex flex-col justify-between gap-4 px-8 sm:flex-row">
              <p className="w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-2xl font-semibold text-transparent">
                {t('pricingPlans:pricingPlanName')}
              </p>
              <div className="flex items-center justify-end gap-3 md:w-2/3">
                <ErrorValidationMessage
                  touched={editPlanForm?.formState?.errors?.name}
                  message={editPlanForm?.formState?.errors?.name?.message}
                  style={{
                    container: {
                      width: '100%',
                    },
                  }}>
                  <TextInput
                    required
                    placeholder={`${t('pricingPlans:pricingPlanName')} *`}
                    register={editPlanForm?.register('name')}
                    error={editPlanForm?.formState?.errors?.name}
                    className="h-[42px]"
                  />
                </ErrorValidationMessage>

                <Button
                  gradientDuoTone="primary"
                  onClick={editPlanForm?.handleSubmit(updatePlanName)}
                  disabled={isLoadingChangeName}
                  className="h-[43.5px] w-[200px] p-0">
                  {isLoadingChangeName ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
                    </div>
                  ) : (
                    `${t('common:save')}`
                  )}
                </Button>
              </div>
            </div>
          }
          <FormProvider {...form}>
            <PricingPlanForm isEditMode />
          </FormProvider>
        </section>

        <FormButtons isSaving={isSaving} onSave={form.handleSubmit(onSubmit)} disabled={!form.formState.isDirty} />
      </div>
    </div>
  );
};

export default PricingPlanDetailsPage;
