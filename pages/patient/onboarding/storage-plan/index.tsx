import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Button, Spinner } from 'flowbite-react';
import classNames from 'classnames';
import Image from 'next/image';
import CustomSelect from '@/components/Forms/Select/Select';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import ContactUsPanel from '@/features/Onboarding/ContactUsPanel';
import { useGetComparePlans, useGetPaymentInfo, useGetStoragePlan } from '@/api/queries/patient.queries';
import { useEffect, useState } from 'react';
import DataGridTable from '@/components/DataGrid/DataGridTable';
import { TableData } from '@/components/DataGrid/TableComponents';
import { toast } from 'react-toastify';
import usePatientMutation from '@/api/mutations/usePatientMutation';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import { toPascalCase } from '@/utils/toPascalCase';
import { axiosInstance } from '@/api/axiosConfig';
import { storageOrder } from '@/constants/billing';

type TypeNames = {
  [key: string]: string;
};

export const StorageDurationLabels: TypeNames = {
  OneMonth: '1-Month',
  Quarter: 'Quarter',
  SixMonth: '6-Month',
  OneYear: '1-Year',
  TwoYears: '2-Year',
  ThreeYears: '3-Year',
  FiveYears: '5-Year',
  TenYears: '10-Year',
};

const ReviewStoragePlan = () => {
  const router = useRouter();
  const { t } = useTranslation('onboarding');
  const [isExtraProtection, setIsExtraProtection] = useState<any>(null);
  const [clinicStoragePlans, setClinicStoragePlans] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [specimens, setSpecimens] = useState<any>([]);
  const { data: onboardingData, isLoading: onboardingDataLoading } = useGetOnboardingData();
  const { data: storagePlan, mutate: refetchStoragePlan, isLoading } = useGetStoragePlan();
  const { data: plans, isLoading: isPlansLoading } = useGetComparePlans();
  const { selectStoragePlan } = usePatientMutation(storagePlan?.patientId);
  const { data: paymentInfo, isLoading: paymentInfoLoading } = useGetPaymentInfo();

  useEffect(() => {
    if (onboardingData) {
      setIsExtraProtection(onboardingData.steps.find(step => step.type === 'EppAddonStep'));
    }
  }, [onboardingData]);

  useEffect(() => {
    if (plans?.planOptions) {
      setClinicStoragePlans(plans?.planOptions);
    }
  }, [plans]);

  useEffect(() => {
    if (storagePlan?.items) {
      setSpecimens(
        storagePlan.items.map((item: any) => ({
          ...item,
          id: item.specimenType,
          nextPlan: item.storageDuration,
        }))
      );
      setSelectedPlan(storagePlan.items[0].storageDuration);
    }
  }, [storagePlan]);

  const handleChange = async (plan: string) => {
    setSelectedPlan(plan);
    try {
      const { data: nextPlan } = await axiosInstance.get(`/Patients/calculateNextPlan?storageDuration=${plan}`);
      if (nextPlan) {
        setSpecimens(
          nextPlan.items.map((item: any) => ({
            ...item,
            id: item.specimenType,
            nextPlan: plan,
          }))
        );
        toast.success('Billing plan updated successfully');
      }
    } catch (err) {
      toast.error('Error updating billing plan');
    }
  };

  const columns = [
    {
      headerName: 'Specimen Type',
      field: 'specimenType',
      align: 'center',
      show: true,
      wrapText: true,
      renderCell: (row: any) => toPascalCase(row.specimenType),
    },
    {
      headerName: 'Current Billing Plan',
      field: 'currentBillingPlan',
      align: 'center',
      show: true,
      renderCell: (row: any) => (row?.storageDuration ? StorageDurationLabels?.[row?.storageDuration] : '-'),
    },
    {
      headerName: 'Next Billing Plan',
      field: 'nextBillingPlan',
      renderCell: (row: any) => {
        const specimenPlans = clinicStoragePlans?.[row?.specimenType] || {};
        const options = Object.keys(specimenPlans)
          .map(key => ({
            value: key,
            label: `${StorageDurationLabels?.[key]} at $${specimenPlans[key].newPricePerYear}/year ${
              specimenPlans[key].discountPercentage == 0 ? '' : `(${specimenPlans[key].discountPercentage}% savings)`
            }`,
          }))
          .sort((a, b) => storageOrder.indexOf(a.value) - storageOrder.indexOf(b.value));

        return (
          <div className="min-w-[220px]">
            <CustomSelect
              options={options}
              value={options.find((item: { value: string; label: string }) => item.value === row.nextPlan)?.value}
              placeholder={'Select status...'}
              onChange={e => handleChange(e)}
            />
          </div>
        );
      },
      align: 'left',
      show: true,
    },
    {
      headerName: 'Plan Rate',
      field: 'planRate',
      align: 'center',
      show: true,
      renderCell: (row: any) => (row.planRate ? `$${row.planRate}` : '-'),
    },
    {
      headerName: 'Plan Total',
      field: 'planTotal',
      align: 'center',
      renderCell: (row: any) => (row.invoiceLine?.grossAmount ? `$${row.invoiceLine?.grossAmount}` : '-'),
    },
    {
      headerName: 'Billing Date',
      field: 'billingDate',
      align: 'center',
      show: true,
      renderCell: (row: any) => <TableData date={row.nextBillingDate} />,
    },
  ];

  if (isLoading || onboardingDataLoading || isPlansLoading || paymentInfoLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  const actionButtons = [
    {
      label: 'Back',
      onClick: () => {
        router.push(`/patient/onboarding/confirm-details`);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
    {
      label: 'Confirm Plan(s) and Continue',
      onClick: async () => {
        await selectStoragePlan({ storageDuration: selectedPlan })
          .then(() => {
            //optimistically update the data
            refetchStoragePlan(
              (currentData: any) => ({
                ...currentData,
                items: currentData.items.map((item: any) => ({
                  ...item,
                  storageDuration: selectedPlan,
                })),
              }),
              false
            );
          })
          .catch(() => {
            toast.error('Error updating billing plan');
          });
        if (isExtraProtection) {
          router.push(`/patient/onboarding/add-on`);
        } else {
          router.push(`/patient/onboarding/schedule-payment`);
        }
      },
      icon: arrowNextIcon,
      isIconPostfix: true,
      isFlat: false,
    },
  ];

  return (
    <>
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
        <div className="max-w-[450px]">
          <div className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
            {t('storagePlan.title')}
          </div>
        </div>
        <div>
          <div className="text-4 font-light">{`Please review ${
            paymentInfo?.clinicStoragePrices?.length > 1 ? 'or update' : 'and confirm'
          } your storage plan.`}</div>
          {paymentInfo?.clinicStoragePrices?.length > 1 ? (
            <div className="text-4 font-light">{t('storagePlan.description')}</div>
          ) : null}
        </div>
        <DataGridTable columns={columns} rows={specimens || []} isLoading={isLoading} />

        <div className="order-last mb-3 mt-3 flex flex-row items-end justify-between gap-8">
          {actionButtons?.map((action: any, index: number) => {
            return (
              <Button
                className={classNames('border-0 p-1 lg:block', { 'flex-row-reverse': action.isIconPostfix })}
                size="lg"
                gradientDuoTone={action.isFlat ? 'transparent' : 'primary'}
                onClick={action.onClick}
                key={index + action.label}
                isProcessing={action.isProcessing}>
                <div className={classNames('flex gap-2', { 'flex-row-reverse': action.isIconPostfix })}>
                  {!action.isProcessing && <Image priority src={action.icon} alt={action.label} />}
                  <div>{action.label}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end">
        <ContactUsPanel />
      </div>
    </>
  );
};

ReviewStoragePlan.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default ReviewStoragePlan;
