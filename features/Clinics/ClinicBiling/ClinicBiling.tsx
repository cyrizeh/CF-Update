import useClinicMutation from '@/api/mutations/useClinicMutation';
import { useGetPricingPlanById } from '@/api/queries/pricingPlans.queries';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { PricingPlanFormFields } from '@/features/PricingPlans/PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import PricingPlanFormReadOnly from '@/features/PricingPlans/PricingPlanFormReadOnly/PricingPlanFormReadOnly';
import { ViewTypes } from '@/types';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { pricingPlanClinicScheme } from '@/validations/clinics';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { INITIAL_VALUES } from './ClinicBiling.utils';

type Props = {
  clinic: ViewTypes.Clinic;
  updateDetails: () => Promise<any>;
  updateClinicAddress: () => Promise<any>;
  updateClinics: () => Promise<any>;
};

type ClinicPlanForm = { plan: { id: string; name: string; version?: string } };

const ClinicBilling: React.FC<Props> = ({ clinic, updateClinics }) => {
  const { t } = useTranslation('pricingPlans');

  const [stateValues, setValues] = useState<PricingPlanFormFields>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const form = useForm<PricingPlanFormFields>({
    defaultValues: INITIAL_VALUES,
    values: stateValues,
  });

  const clinicPlanForm = useForm<ClinicPlanForm>({
    defaultValues: {},
    resolver: yupResolver(pricingPlanClinicScheme),
  });

  const { data, isLoading } = useGetPricingPlanById(clinic?.pricingPlanId || '');
  const { updateClinicBilling } = useClinicMutation();

  const getStoragePrices = (data: any, duration: string) => ({
    embryoPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.embryoPrice || 0,
    canePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.canePrice || 0,
    patientPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.patientPrice || 0,
    spermPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.spermPrice || 0,
    oocytePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.oocytePrice || 0,
    isEnabled: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.isEnabled || false,
  });

  const onSubmit = async (data: ClinicPlanForm) => {
    setIsButtonLoading(true);
    try {
      await updateClinicBilling.trigger({
        clinicId: clinic?.id,
        pricingPlanId: data?.plan?.id,
      });
      toast.success('Plan was changed');
      await updateClinics();
    } catch (reason: any) {
      if (reason?.response?.data?.errors) {
        handleBackendErrors(reason.response.data.errors);
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

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
      }

      setTimeout(() => setIsPageLoading(false), 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  useEffect(() => {
    if (data) {
      clinicPlanForm?.setValue('plan.id', data?.id);
      clinicPlanForm?.setValue('plan.name', data?.name);
      clinicPlanForm?.setValue('plan.version', data?.version.toString());
    }
  }, [data]);

  if (isPageLoading)
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner aria-label="Center-aligned spinner example" size="sm" className="mt-[-1px]" />
          {t('common:loadingWithDots')}
        </div>
      </div>
    );

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

        {/* <h1 className="mb-4 w-[500px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text py-2 text-5xl font-light text-transparent">
          {t('planDetails')}
        </h1> */}
        <div className="my-5 flex w-full items-center justify-between gap-10">
          <div className="w-full md:w-[500px]">
            <ErrorValidationMessage
              touched={clinicPlanForm?.formState?.errors?.plan?.id}
              message={clinicPlanForm?.formState?.errors?.plan?.id?.message}
              style={{
                container: {
                  width: '100%',
                },
              }}>
              <Autocomplete2
                defaultValue={clinicPlanForm?.watch('plan')}
                url="/PricingPlans"
                control={clinicPlanForm?.control}
                name="plan"
                error={clinicPlanForm?.formState?.errors?.plan?.id}
                placeholder={t('clinics:chooseplan')}
                isPrefilled
              />
            </ErrorValidationMessage>
          </div>
          <Button
            gradientDuoTone="primary"
            onClick={clinicPlanForm?.handleSubmit(onSubmit)}
            disabled={isButtonLoading}
            className="h-[43.5px] w-[100px]">
            {isButtonLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
              </div>
            ) : (
              `${t('common:save')}`
            )}
          </Button>
        </div>

        <FormProvider {...form}>
          <PricingPlanFormReadOnly />
        </FormProvider>
      </div>
    </div>
  );
};

export default ClinicBilling;
