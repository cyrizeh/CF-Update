import { axiosInstance } from '@/api/axiosConfig';
import usePatientMutation from '@/api/mutations/usePatientMutation';
import { useGetBillingInfo } from '@/api/queries/billing.queries';
import { useGetPatientsBilling } from '@/api/queries/patient.queries';
import { useGetPricingPlanById } from '@/api/queries/pricingPlans.queries';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import DateField from '@/components/Forms/DateField/DateField';
import EditableField from '@/components/Forms/EditableField/EditableField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Pagination from '@/components/Pagination/Pagination';
import { PriceBillingType, PriceBillingTypeTitle } from '@/constants/billing';
import { SUPPORT_CRYO_EMAIL } from '@/constants/support';
import { PricingPlanFormFields } from '@/features/PricingPlans/PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import PricingPlanBillingTable from '@/features/PricingPlans/PricingPlanForm/PricingPlanBillingTable';
import PricingPlanBillingTableMobile from '@/features/PricingPlans/PricingPlanForm/PricingPlanBillingTableMobile';
import { INITIAL_VALUES } from '@/features/PricingPlans/PricingPlansPage.const';
import { useScreenWidth } from '@/hooks';
import useRole from '@/hooks/useRole';
import { useTableControls } from '@/hooks/useTableControls';
import { BillingResponse } from '@/types/api';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import { getSortedGroupedServicePrices } from '@/utils/billingUtils';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { customChargeSchema } from '@/validations/billings';
import { pricingPlanClinicScheme } from '@/validations/clinics';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Button, Spinner, Tooltip } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

type PatientPlanForm = { plan: { id: string; name: string; version?: string } };

const PatientBilling = ({
  patient,
  isReadonly,
  refetchPatientInfo,
}: {
  patient: any;
  isReadonly: boolean;
  refetchPatientInfo: any;
}) => {
  let clinicTransferFeesShown = false;
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('patients');
  const { t: tbilling } = useTranslation('billing');
  const { query } = useRouter();
  const { isSmallScreen } = useScreenWidth();

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [billingValues, setBillingValues] = useState<any>(null);
  const [discountOptions, setDiscountOptions] = useState<any[]>([]);
  const [addCustom, setAddCustom] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [billingsList, setBillingsList] = useState<BillingResponse | null>(null);
  const { pagination } = useTableControls(billingsList, {});

  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const { data } = useGetPricingPlanById(isCryoAdmin ? patient?.pricingPlanId || '' : '');
  const [stateValues, setValues] = useState<PricingPlanFormFields>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const form = useForm<PricingPlanFormFields>({
    defaultValues: INITIAL_VALUES,
    values: stateValues,
  });

  const { handleSubmit, watch, register, control, ...formProps } = useForm<any>({ values: billingValues });

  const customChargeForm = useForm<any>({
    defaultValues: {
      customPayment: {
        name: 'Custom charge',
        description: 'Custom charge',
        date: null,
        price: '',
      },
    },
    resolver: yupResolver(customChargeSchema),
  });

  const clinicPlanForm = useForm<PatientPlanForm>({
    defaultValues: {},
    resolver: yupResolver(pricingPlanClinicScheme),
  });

  const { fields } = useFieldArray({ name: 'servicePrices', control });
  const groupedServicePrices = getSortedGroupedServicePrices(fields);

  const getPriceBillingTooltip = (type: string) => {
    switch (type) {
      case PriceBillingType.Transfer:
        return (
          <div>
            <span>{tbilling('billing.transferPricing')}</span>
            <a href={`mailto: ${SUPPORT_CRYO_EMAIL}`} className="underline underline-offset-2">
              {SUPPORT_CRYO_EMAIL}.
            </a>
          </div>
        );
      case PriceBillingType.ServiceGuarantee:
        return <p>{tbilling('billing.serviceGarantees')}</p>;
      default:
        return null;
    }
  };

  const {
    data: planData,
    isLoading,
    mutate: refetchPlanData,
  } = useGetPricingPlanById(!isReadonly && patient?.pricingPlanId);
  const {
    data: billingData,
    mutate: updateBilling,
    isLoading: isLoadingBillingData,
  } = useGetBillingInfo(
    {
      patientId: query.id as string,
      pageSize: pagination.size,
      pageNumber: pagination.currentPage,
    },
    isCryoAdmin // fetch only for Cryo Admin
  );

  const {
    data: patientBillingData,
    isLoading: activeLoading,
    isValidating,
    mutate: refetchPatientBillingData,
  } = useGetPatientsBilling(query.id as string);

  const { updatePatientBilling } = usePatientMutation(query.id as string);

  const getStoragePrices = (data: any, duration: string) => ({
    embryoPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.embryoPrice || 0,
    canePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.canePrice || 0,
    patientPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.patientPrice || 0,
    spermPrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.spermPrice || 0,
    oocytePrice: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.oocytePrice || 0,
    isEnabled: data?.storagePrices?.find((el: any) => el.storageDuration === duration)?.isEnabled || false,
  });

  useEffect(() => {
    if (data) {
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
    } else {
      setIsPageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  useEffect(() => {
    if (!isLoading && !activeLoading) {
      // Map discount for select
      if (planData) {
        setDiscountOptions(
          planData?.discounts?.map((el: any) => ({
            ...el,
            value: el.id,
            label: `${el.name} (${el.type === 'PercentageDiscount' ? '%' : '$'} ${el.amount})`,
          }))
        );
      }

      // Map data if clinic and patient have billing info
      setBillingValues({
        name: patientBillingData?.name,
        discount: patientBillingData?.discount?.id || '',
        discountName: patientBillingData?.discount?.name
          ? `${patientBillingData?.discount?.name} (${
              patientBillingData?.discount?.type === 'PercentageDiscount' ? '%' : '$'
            } ${patientBillingData?.discount?.amount})`
          : '',
        discountSelected: !!patientBillingData?.discount?.id,
        servicePrices: patientBillingData?.servicePrices,
        customCharges: patientBillingData?.servicePrices?.find((el: any) => el.type === 'Custom')
          ? [
              {
                ...patientBillingData.servicePrices?.find((el: any) => el.type === 'Custom'),
                isEnabled: true,
                billingSchedule: 'OneTime',
              },
            ]
          : [{ name: 'Custom change', isEnabled: false, price: '', billingSchedule: 'OneTime' }],
      });
    }
  }, [isLoading, planData, currentYear, activeLoading, patientBillingData]);

  const onSubmitCustomPayment = (data: any) => {
    setCustomLoading(true);

    axiosInstance
      .post('/Payments', {
        ...data.customPayment,
        date: dayjs(data.customPayment.date).format('YYYY-MM-DD'),
        patientId: query.id,
      })
      .then(() => {
        toast.success('Custom charge scheduled!');
        updateBilling(undefined);
        setCustomLoading(false);
        customChargeForm?.reset();
        setAddCustom(false);
      })
      .catch(() => {
        toast.error('Failed to schedule custom charge');
        setCustomLoading(false);
      });
  };

  const onSubmit = async (submitData: any) => {
    const mappedData = {
      patientId: query.id,
      pricingPlanId: planData?.id,
      discountId: submitData.discountSelected
        ? discountOptions?.find(el => el.label === submitData.discountName)?.id
        : undefined,
    };

    updatePatientBilling
      .trigger(mappedData)
      .then(() => {
        toast.success('Billing applied for this user!');
        // @ts-ignore
        refetchPatientBillingData(true, undefined, { revalidate: true });
      })
      .catch(() => {
        toast.error('Failed to apply billing for this user!');
      });
  };

  const onSubmitPlan = async (submitData: PatientPlanForm) => {
    setIsButtonLoading(true);
    try {
      const mappedData = {
        patientId: query.id,
        pricingPlanId: submitData?.plan?.id,
        discountId: null,
      };

      await updatePatientBilling.trigger({
        ...mappedData,
      });
      toast.success('Plan was changed');
      refetchPatientInfo();
      // @ts-ignore
      refetchPlanData(true, undefined, { revalidate: true });
      // @ts-ignore
      refetchPatientBillingData(true, undefined, { revalidate: true });
    } catch (reason: any) {
      if (reason?.response?.data?.errors) {
        handleBackendErrors(reason.response.data.errors);
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingBillingData && billingData) {
      setBillingsList(billingData);
    }
  }, [isLoading, billingData]);

  useEffect(() => {
    if (planData) {
      clinicPlanForm?.setValue('plan.id', planData?.id);
      clinicPlanForm?.setValue('plan.name', planData?.name);
      clinicPlanForm?.setValue('plan.version', planData?.version?.toString());
    }
  }, [planData]);

  if (activeLoading || isPageLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (!patientBillingData && !activeLoading && !fields.length) {
    return (
      <div className="pb-8">
        {!patientBillingData && (
          <div className="mb-5 rounded bg-[#fff4e5] p-4">
            <p className="text-sm text-[#663c00]">{t('noBilling')}</p>
          </div>
        )}
      </div>
    );
  }

  if (!patientBillingData?.servicePrices?.length && !activeLoading && !fields.length) {
    return (
      <div className="mb-5 rounded bg-[#fff4e5] p-4">
        <p className="text-sm text-[#663c00]">
          {
            <>
              <span>{t('billings.empty_biiling_1')}</span>
              <Link href={`/admin/clinics/${patient?.clinicId}/billing`}>
                {<span className="font-extrabold">{t('billings.empty_biiling_2')}</span>}
              </Link>
              <span>{t('billings.empty_biiling_3')}</span>
            </>
          }
        </p>
      </div>
    );
  }

  if (fields.length)
    return (
      <div className="pb-8">
        {!patientBillingData && (
          <div className="mb-5 rounded bg-[#fff4e5] p-4">
            <p className="text-sm text-[#663c00]">{t('noBilling')}</p>
          </div>
        )}

        {!isReadonly && (
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
                  placeholder={t('chooseplan')}
                  isPrefilled
                />
              </ErrorValidationMessage>
            </div>
            <Button
              className="h-[43.5px] w-[100px]"
              gradientDuoTone="primary"
              onClick={clinicPlanForm?.handleSubmit(onSubmitPlan)}
              disabled={isButtonLoading}>
              {isButtonLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
                </div>
              ) : (
                `${t('common:save')}`
              )}
            </Button>
          </div>
        )}

        {!isReadonly ? (
          <form>
            <section className="mb-4 flex flex-col gap-8 rounded-lg bg-[#1E2021] p-8 shadow md:gap-4">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <p className="mb-4 w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-3xl font-semibold text-transparent">
                  {t('pricingPlans:pricingPlanName')}
                </p>

                <div className="flex items-center gap-2 text-xl font-normal text-white">{watch('name')}</div>
              </div>
              {Object.keys(groupedServicePrices).map(type => (
                <>
                  {!clinicTransferFeesShown &&
                    (type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide') && (
                      <div className="justify-star flex flex-col items-start gap-2">
                        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent">
                          {tbilling('clinicBillingType')}
                        </p>
                        {(clinicTransferFeesShown = true)}
                        <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent text-sm font-normal leading-tight text-gray-300 ">
                          {tbilling('billing.clinicToClinic')}
                        </div>
                      </div>
                    )}
                  {PriceBillingTypeTitle[type] && !!groupedServicePrices[type]?.length && (
                    <div className="flex flex-col items-start justify-start gap-2">
                      <p
                        className={classNames(
                          'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent',
                          {
                            'text-lg': type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide',
                          }
                        )}>
                        {PriceBillingTypeTitle[type]}
                      </p>
                      {getPriceBillingTooltip(type) && (
                        <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent text-sm font-normal leading-tight text-gray-300 ">
                          {getPriceBillingTooltip(type)}
                        </div>
                      )}
                    </div>
                  )}
                  {groupedServicePrices[type]?.map((field: any) => (
                    <div key={field.id} className="flex items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="mb-4 inline-flex h-[21px] items-center justify-start gap-[5px] md:mb-0">
                        <div className="flex gap-3 text-sm font-normal leading-[21px] text-white">
                          <div className="flex items-center gap-2 text-sm font-normal leading-[21px] text-white">
                            <Checkbox
                              register={register(
                                // @ts-ignore
                                `servicePrices.${field?.serviceIndex}.isEnabled`
                              )}
                              disabled
                            />
                            <div className="flex w-full items-center justify-between gap-6">
                              {field.name}
                              {field.description && (
                                <Tooltip content={field.description} className="text-sm font-normal italic">
                                  <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-[50px] text-sm font-normal leading-[21px] text-gray-300">
                        {'$ '}
                        {field.price}
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </section>
            <FormProvider {...form}>
              {isSmallScreen ? (
                <PricingPlanBillingTableMobile isReadOnly={true} />
              ) : (
                <PricingPlanBillingTable isReadOnly={true} />
              )}
            </FormProvider>
            <section className="relative mb-4 flex flex-col gap-8 rounded-lg bg-[#1E2021] p-8 shadow md:gap-4">
              <div
                className={`flex items-center justify-between md:flex-row md:items-center ${
                  isValidating ? 'opacity-50' : ''
                }`}>
                <Checkbox
                  register={register('discountSelected')}
                  label={<div className="text-sm font-normal leading-[21px] text-white">Discount applied</div>}
                />

                <div className="max-w-[350px]">
                  <div className="w-full min-w-[200px]">
                    <CustomSelect
                      disabled={!watch('discountSelected')}
                      placeholder={'None'}
                      control={control}
                      name={'discount'}
                      onChangeByName={(val: any) => {
                        formProps.setValue('discountName', val);
                      }}
                      optionBy={watch('discountName')}
                      options={discountOptions}
                      stylesProps={{
                        option: {
                          wordBreak: 'break-all',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {isValidating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
                  </div>
                </div>
              )}
            </section>

            <div className="mb-3 flex w-full justify-end gap-4 p-2">
              <Button
                className="mb-3 h-[38px] w-full cursor-pointer self-center md:mb-0 md:max-w-[165px]"
                size={'xs'}
                onClick={() => setAddCustom(!addCustom)}
                gradientDuoTone="primary">
                <div className="text-sm font-medium leading-[150%]">Add custom charge</div>
              </Button>

              <Button
                className="mb-3 h-[38px] w-full cursor-pointer self-center md:mb-0 md:max-w-[135px]"
                size={'xs'}
                onClick={handleSubmit(onSubmit)}
                gradientDuoTone="primary">
                <div className="text-sm font-medium leading-[150%]">
                  {updatePatientBilling.isMutating ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" className="mt-[-1px]" /> Loading...
                    </div>
                  ) : (
                    'Save'
                  )}
                </div>
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <section className="mb-4 flex flex-col gap-4 rounded-lg bg-[#1E2021] p-8 shadow">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <p className="mb-4 w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-3xl font-semibold text-transparent">
                  {t('pricingPlans:pricingPlanName')}
                </p>

                <div className="flex items-center gap-2 text-xl font-normal text-white">{watch('name')}</div>
              </div>
              {Object.keys(groupedServicePrices).map(type => (
                <>
                  {PriceBillingTypeTitle[type] && !!groupedServicePrices[type].length && (
                    <div className="flex items-center gap-2">
                      <p
                        className={classNames(
                          'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent',
                          {
                            'text-lg': type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide',
                          }
                        )}>
                        {PriceBillingTypeTitle[type]}
                      </p>
                      {getPriceBillingTooltip(type) && (
                        <Tooltip content={getPriceBillingTooltip(type)} className="text-sm font-normal italic">
                          <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                        </Tooltip>
                      )}
                    </div>
                  )}
                  {groupedServicePrices[type]?.map((field: any) => (
                    <div
                      key={field.id}
                      className="flex flex-col items-start justify-between md:flex-row md:items-center">
                      <div className="mb-4 inline-flex h-[21px] items-center justify-start gap-[5px] md:mb-0">
                        <div className="flex gap-3 text-sm font-normal leading-[21px] text-white">
                          {field.name}
                          {field.description && (
                            <Tooltip content={field.description} className="text-sm font-normal italic">
                              <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-normal leading-[21px] text-gray-300">${field.price}</div>
                    </div>
                  ))}
                </>
              ))}
            </section>
          </div>
        )}

        {addCustom && (
          <>
            <section className="mb-3 flex flex-col items-center justify-between gap-4 rounded-lg bg-[#1E2021] p-8 shadow">
              <form className="flex w-full">
                <div className="grid w-full items-center justify-between gap-10 md:grid-cols-2">
                  <div className="inline-flex h-[21px] items-center justify-start gap-[5px] md:mb-0">
                    <div className="flex gap-3">
                      <EditableField
                        // @ts-ignore
                        error={customChargeForm?.formState?.errors?.customPayment?.name}
                        control={customChargeForm?.control}
                        name={'customPayment.name'}
                        trigger={customChargeForm?.trigger}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 text-sm font-normal leading-[21px] text-gray-300">
                    <ErrorValidationMessage
                      // @ts-ignore
                      touched={!!customChargeForm?.formState?.errors?.customPayment?.date}
                      // @ts-ignore
                      message={customChargeForm?.formState?.errors?.customPayment?.date?.message}>
                      <DateField
                        setError={customChargeForm.setError}
                        clearErrors={customChargeForm.clearErrors}
                        control={customChargeForm.control}
                        minDate={dayjs()}
                        name={`customPayment.date`}
                        // @ts-ignore
                        error={!!customChargeForm?.formState?.errors?.customPayment?.date}
                      />
                    </ErrorValidationMessage>

                    <Controller
                      defaultValue=""
                      name={`customPayment.price`}
                      control={customChargeForm.control}
                      render={({ field: { onChange, name, value } }) => (
                        <ErrorValidationMessage
                          // @ts-ignore
                          touched={!!customChargeForm?.formState?.errors?.customPayment?.price}
                          // @ts-ignore
                          message={customChargeForm?.formState?.errors?.customPayment?.price?.message}>
                          <NumericFormat
                            allowNegative={false}
                            name={name}
                            value={value}
                            onValueChange={v => onChange(v.value)}
                            customInput={TextInput}
                            inputstyles="text-right text-sm font-normal uppercase leading-[21px] text-white"
                            // @ts-ignore
                            error={!!customChargeForm?.formState?.errors?.customPayment?.price}
                            adornments={{
                              position: 'start',
                              content: BsCurrencyDollar,
                            }}
                          />
                        </ErrorValidationMessage>
                      )}
                    />
                  </div>
                </div>
              </form>
            </section>
            <div className="mb-3 flex w-full justify-end gap-4 p-2">
              <Button
                className="mb-3 h-[38px] w-full cursor-pointer self-center md:mb-0 md:max-w-[135px]"
                size={'xs'}
                onClick={customChargeForm.handleSubmit(onSubmitCustomPayment)}
                gradientDuoTone="primary">
                <div className="text-sm font-medium leading-[150%]">
                  {customLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" className="mt-[-1px]" /> Loading...
                    </div>
                  ) : (
                    'Save'
                  )}
                </div>
              </Button>
            </div>
          </>
        )}

        {!_.isEmpty(billingsList?.items)
          ? billingsList?.items.map((el: any) => (
              <div
                key={el.id}
                className="mb-2 flex w-full justify-between rounded-lg bg-[#1E2021] p-4 px-8 text-sm font-light shadow dark:text-white">
                <div>{el.name}</div>
                <div className="flex">
                  <div className="w-[100px] text-right">{el.status}</div>
                  <div className="w-[100px] text-right">
                    {el.paymentDate
                      ? dayjs(el.paymentDate).format('MM/DD/YYYY')
                      : dayjs(el.dueDate).format('MM/DD/YYYY')}
                  </div>
                  <div className="w-[100px] text-right">{el?.grossAmount}</div>
                </div>
              </div>
            ))
          : null}

        {!_.isEmpty(billingsList?.items) ? (
          <div className="flex justify-end pb-8">
            <Pagination {...pagination} />
          </div>
        ) : null}
      </div>
    );
  else return <></>;
};

export default PatientBilling;
