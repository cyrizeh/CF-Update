import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { BsCurrencyDollar } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';

import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import EditableField from '@/components/Forms/EditableField/EditableField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { PriceBillingType, PriceBillingTypeTitle } from '@/constants/billing';
import { SUPPORT_CRYO_EMAIL } from '@/constants/support';
import { useScreenWidth } from '@/hooks';
import { getSortedGroupedServicePrices } from '@/utils/billingUtils';
import classNames from 'classnames';
import { Button, Spinner, Tooltip } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import PricingPlanBillingTable from './PricingPlanBillingTable';
import PricingPlanBillingTableMobile from './PricingPlanBillingTableMobile';
import PricingPlanFormDiscounts from './PricingPlanFormDiscounts';
import { useState } from 'react';
import { axiosInstance } from '@/api/axiosConfig';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import usePricingPlansMutation from '@/api/mutations/usePricingPlansMutation';

const PricingPlanForm: React.FC<{ isEditMode?: boolean }> = ({ isEditMode = false }) => {
  const {
    control,
    formState: { errors },
    ...formProps
  } = useFormContext<PricingPlanFormFields>();

  const { query } = useRouter();

  const { isSmallScreen } = useScreenWidth();

  const { fields, append, remove } = useFieldArray({ control, name: `form.values.discounts` });
  const { t } = useTranslation('billing');
  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: control,
    name: `form.values.servicePrices`,
  });

  const groupedServicePrices = getSortedGroupedServicePrices(serviceFields);

  const onAddNewService = () =>
    appendService({
      price: '',
      name: 'New service pricing',
      description: 'Custom charge',
      type: 'Other',
      isCustom: true,
    });

  const onAddNewDiscount = () => append({ type: 'FixedDiscount', amount: '', name: 'Discount' });

  const onRemoveDiscount = (index: number) => remove(index);
  let clinicTransferFeesShown = false;

  const getPriceBillingTooltip = (type: string) => {
    switch (type) {
      case PriceBillingType.Transfer:
        return (
          <div>
            <span>{t('billing.transferPricing')}</span>
            <a href={`mailto: ${SUPPORT_CRYO_EMAIL}`} className="underline underline-offset-2">
              {SUPPORT_CRYO_EMAIL}.
            </a>
          </div>
        );
      case PriceBillingType.ServiceGuarantee:
        return <p>{t('billing.serviceGarantees')}</p>;
      default:
        return null;
    }
  };

  return (
    <form>
      <section className="mb-3 flex flex-col gap-10 rounded-lg bg-[#1E2021] p-8 shadow md:gap-4">
        {!isEditMode && (
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <p className="w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-2xl font-semibold text-transparent">
              {t('pricingPlans:pricingPlanName')}
            </p>
            <div className="flex items-center justify-end gap-3 md:w-2/3">
              <ErrorValidationMessage
                touched={errors?.form?.values?.name}
                message={errors?.form?.values?.name?.message}
                style={{
                  container: {
                    width: '100%',
                  },
                }}>
                <TextInput
                  required
                  placeholder={`${t('pricingPlans:pricingPlanName')} *`}
                  register={formProps?.register('form.values.name')}
                  error={errors?.form?.values?.name}
                  className="h-[42px]"
                />
              </ErrorValidationMessage>
            </div>
          </div>
        )}
        {Object.keys(groupedServicePrices).map(type => (
          <>
            {!clinicTransferFeesShown && (type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide') && (
              <div className="flex flex-col items-start justify-start gap-2">
                <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent">
                  {t('clinicBillingType')}
                </p>
                {(clinicTransferFeesShown = true)}
                <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent text-sm font-normal leading-tight text-gray-300 ">
                  {t('billing.clinicToClinic')}
                </div>
              </div>
            )}
            {PriceBillingTypeTitle[type] && !!groupedServicePrices[type]?.length && (
              <div className="flex flex-col items-start justify-start gap-2">
                <p
                  className={classNames('bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent', {
                    'text-lg': type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide',
                  })}>
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
              <div
                key={field.id}
                className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-center md:gap-10">
                <div className="mb-4 inline-flex h-[21px] items-center justify-start gap-[5px] md:mb-0">
                  <div className="flex gap-3 text-sm font-normal leading-[21px] text-white">
                    {!field?.isCustom ? (
                      <Checkbox
                        register={formProps.register(
                          // @ts-ignore
                          `form.values.servicePrices.${field?.serviceIndex}.isEnabled`
                        )}
                        label={field.name}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          register={formProps.register(
                            // @ts-ignore
                            `form.values.servicePrices.${field?.serviceIndex}.isEnabled`
                          )}
                        />
                        <EditableField
                          error={
                            errors.form && errors?.form?.values?.servicePrices
                              ? errors?.form?.values?.servicePrices?.[field?.serviceIndex]?.name
                              : null
                          }
                          name={`form.values.servicePrices.${field?.serviceIndex}.name`}
                          control={control}
                          trigger={formProps?.trigger}
                        />
                        <MdDelete
                          color="white"
                          className="flex-shrink-0 cursor-pointer text-lg"
                          onClick={() => removeService(field?.serviceIndex)}
                        />
                      </div>
                    )}
                  </div>
                  {field?.description && (
                    <Tooltip content={field?.description} className="text-sm font-normal italic">
                      <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                    </Tooltip>
                  )}
                </div>
                <Controller
                  render={({ field: { onChange, name, value } }) => (
                    <div className="flex-shrink-0 md:w-[205px]">
                      {field?.priceType === 'Quoted' ? (
                        <span className="flex gap-3 text-base font-normal leading-[21px] text-white">
                          {field?.priceType}
                        </span>
                      ) : (
                        <ErrorValidationMessage
                          touched={errors?.form?.values?.servicePrices?.[field?.serviceIndex]?.price}
                          message={errors?.form?.values?.servicePrices?.[field?.serviceIndex]?.price?.message}>
                          <NumericFormat
                            allowNegative={false}
                            name={name}
                            error={
                              errors.form && errors?.form?.values?.servicePrices
                                ? errors?.form?.values?.servicePrices?.[field?.serviceIndex]?.price
                                : null
                            }
                            full={isSmallScreen}
                            value={value}
                            onValueChange={v => onChange(v.value)}
                            customInput={TextInput}
                            inputstyles="text-right text-sm font-normal uppercase leading-[21px] text-white"
                            adornments={{
                              svgClass: 'text-[#828282] w-5 h-5 z-[5]',
                              position: 'start',
                              content: BsCurrencyDollar,
                            }}
                          />
                        </ErrorValidationMessage>
                      )}
                    </div>
                  )}
                  name={`form.values.servicePrices.${field?.serviceIndex}.price`}
                  control={control}
                />
              </div>
            ))}
          </>
        ))}

        <div
          onClick={onAddNewService}
          className="inline-flex h-[53px] w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed border-neutral-600 px-8 py-6 transition hover:border-cryo-blue">
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.4989 10.8162V14.14M13.4989 14.14V17.4639M13.4989 14.14H16.8228M13.4989 14.14H10.175M23.4705 14.14C23.4705 15.4495 23.2125 16.7462 22.7114 17.956C22.2103 19.1658 21.4758 20.265 20.5499 21.191C19.6239 22.1169 18.5247 22.8514 17.3149 23.3525C16.105 23.8537 14.8084 24.1116 13.4989 24.1116C12.1894 24.1116 10.8928 23.8537 9.68295 23.3525C8.47315 22.8514 7.37389 22.1169 6.44795 21.191C5.522 20.265 4.7875 19.1658 4.28638 17.956C3.78527 16.7462 3.52734 15.4495 3.52734 14.14C3.52734 11.4954 4.57792 8.95909 6.44795 7.08906C8.31797 5.21903 10.8543 4.16846 13.4989 4.16846C16.1435 4.16846 18.6798 5.21903 20.5499 7.08906C22.4199 8.95909 23.4705 11.4954 23.4705 14.14Z"
              stroke="#828282"
              stroke-width="1.81556"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div className="text-sm font-normal leading-[21px] text-zinc-500">Add a new service pricing</div>
        </div>
      </section>

      {isSmallScreen ? <PricingPlanBillingTableMobile /> : <PricingPlanBillingTable />}

      <section className="mb-3 rounded-lg bg-[#1E2021] p-8 shadow">
        <div className="grid h-[50px] w-full grid-cols-2 bg-[#292B2C] p-4 md:grid-cols-[1fr_minmax(100px,_238px)]">
          <div className="text-sm font-normal uppercase leading-[21px] text-white">DISCOUNT TITLE</div>
          <div className="text-sm font-normal uppercase leading-[21px] text-white">AMOUNT</div>
        </div>

        <div className="p-4">
          {fields.map((field, discountIndex) => (
            <PricingPlanFormDiscounts
              key={field.id}
              field={field}
              discountIndex={discountIndex}
              control={control}
              setValue={formProps.setValue}
              register={formProps.register}
              watch={formProps.watch}
              remove={onRemoveDiscount}
            />
          ))}

          <div
            onClick={onAddNewDiscount}
            className="inline-flex h-[53px] w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed border-neutral-600 px-8 py-6 transition hover:border-cryo-blue">
            <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.4989 10.8162V14.14M13.4989 14.14V17.4639M13.4989 14.14H16.8228M13.4989 14.14H10.175M23.4705 14.14C23.4705 15.4495 23.2125 16.7462 22.7114 17.956C22.2103 19.1658 21.4758 20.265 20.5499 21.191C19.6239 22.1169 18.5247 22.8514 17.3149 23.3525C16.105 23.8537 14.8084 24.1116 13.4989 24.1116C12.1894 24.1116 10.8928 23.8537 9.68295 23.3525C8.47315 22.8514 7.37389 22.1169 6.44795 21.191C5.522 20.265 4.7875 19.1658 4.28638 17.956C3.78527 16.7462 3.52734 15.4495 3.52734 14.14C3.52734 11.4954 4.57792 8.95909 6.44795 7.08906C8.31797 5.21903 10.8543 4.16846 13.4989 4.16846C16.1435 4.16846 18.6798 5.21903 20.5499 7.08906C22.4199 8.95909 23.4705 11.4954 23.4705 14.14Z"
                stroke="#828282"
                stroke-width="1.81556"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-sm font-normal leading-[21px] text-zinc-500">Add a new discount</div>
          </div>
        </div>
      </section>
    </form>
  );
};

export default PricingPlanForm;
