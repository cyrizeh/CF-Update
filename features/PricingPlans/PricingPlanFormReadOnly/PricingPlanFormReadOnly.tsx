import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiInformationCircle } from 'react-icons/hi';

import { PriceBillingType, PriceBillingTypeTitle } from '@/constants/billing';
import { SUPPORT_CRYO_EMAIL } from '@/constants/support';
import { useScreenWidth } from '@/hooks';
import { getSortedGroupedServicePrices } from '@/utils/billingUtils';
import classNames from 'classnames';
import { Tooltip } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import PricingPlanBillingTable from '../PricingPlanForm/PricingPlanBillingTable';
import PricingPlanBillingTableMobile from '../PricingPlanForm/PricingPlanBillingTableMobile';
import PricingPlanFormDiscounts from '../PricingPlanForm/PricingPlanFormDiscounts';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';

const PricingPlanFormReadOnly = () => {
  const { control, formState, watch, ...formProps } = useFormContext<PricingPlanFormFields>();

  const { isSmallScreen } = useScreenWidth();

  const { fields, remove } = useFieldArray({ control, name: `form.values.discounts` });
  const { t } = useTranslation('billing');
  const { fields: serviceFields } = useFieldArray({
    control: control,
    name: `form.values.servicePrices`,
  });

  const groupedServicePrices = getSortedGroupedServicePrices(serviceFields);

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
      <section className="mb-3 flex flex-col gap-4 rounded-lg bg-[#1E2021] p-8 shadow">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <p className="w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-3xl font-semibold text-transparent">
            {t('pricingPlans:pricingPlanName')}
          </p>

          <div className="flex items-center gap-2 text-xl font-normal text-white">{watch('form.values.name')}</div>
        </div>

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
              <div key={field.id} className="flex items-start justify-between gap-3 md:flex-row md:items-center">
                <div className="mb-4 inline-flex h-[21px] items-center justify-start gap-[5px] md:mb-0">
                  <Checkbox
                    register={formProps.register(
                      // @ts-ignore
                      `form.values.servicePrices.${field?.serviceIndex}.isEnabled`
                    )}
                    disabled
                  />
                  <div className="flex gap-3 text-sm font-normal leading-[21px] text-white">{field.name}</div>
                  {field?.description && (
                    <Tooltip content={field?.description} className="text-sm font-normal italic">
                      <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                    </Tooltip>
                  )}
                </div>
                <div className="flex min-w-[80px] items-center gap-2 text-base font-normal text-white">
                  $ {watch(`form.values.servicePrices.${field?.serviceIndex}.price`)}
                </div>
              </div>
            ))}
          </>
        ))}
      </section>

      {isSmallScreen ? (
        <PricingPlanBillingTableMobile isReadOnly={true} />
      ) : (
        <PricingPlanBillingTable isReadOnly={true} />
      )}

      <section className="mb-3 rounded-lg bg-[#1E2021] p-8 shadow">
        <div className="grid w-full grid-cols-2  justify-between bg-[#292B2C] p-4 md:h-[50px] md:grid-cols-[1fr_minmax(100px,_238px)]">
          <div className="text-sm font-normal uppercase leading-[21px] text-white">DISCOUNT TITLE</div>
          <div className="text-sm font-normal uppercase leading-[21px] text-white">AMOUNT</div>
        </div>

        <div className="p-4">
          {!!fields.length ? (
            fields.map((field, discountIndex) => (
              <PricingPlanFormDiscounts
                key={field.id}
                field={field}
                discountIndex={discountIndex}
                control={control}
                setValue={formProps.setValue}
                register={formProps.register}
                watch={watch}
                remove={onRemoveDiscount}
                isReadOnly
              />
            ))
          ) : (
            <div className="flex  h-[100px] w-full items-center justify-center rounded-lg bg-black/10 text-sm text-white backdrop-blur-sm">
              {t('pricingPlans:noDiscounts')}
            </div>
          )}
        </div>
      </section>
    </form>
  );
};

export default PricingPlanFormReadOnly;
