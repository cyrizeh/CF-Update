import { Fragment, useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';

import { useGetPaymentPlan } from '@/api/queries/patient.queries';
import {
  PriceBillingType,
  PriceBillingTypeTitle,
  serviceOrder,
  StorageDurationNames,
  storageOrder,
} from '@/constants/billing';
import { getSortedGroupedServicePrices } from '@/utils/billingUtils';
import classNames from 'classnames';
import { Tooltip } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { SUPPORT_CRYO_EMAIL } from '@/constants/support';

const PatientBilling = () => {
  const { t } = useTranslation('billing');
  const { data: billingData } = useGetPaymentPlan();
  const [sortedStoragePrices, setSortedStoragePrices] = useState([]);
  const [sortedServicePrices, setSortedServicePrices] = useState<any[]>([]);
  const groupedServicePrices = getSortedGroupedServicePrices(sortedServicePrices);

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

  useEffect(() => {
    if (billingData) {
      const { clinicStoragePrices, servicePrices } = billingData;
      const clinicStoragePricesSorted = clinicStoragePrices.sort(
        (a: any, b: any) => storageOrder.indexOf(a.storageDuration) - storageOrder.indexOf(b.storageDuration)
      );
      const transferServices = servicePrices.filter((service: any) => service.type === 'Transfer');
      const otherServices = servicePrices.filter((service: any) => service.type !== 'Transfer');
      const servicePricesSorted = [
        ...transferServices.sort((a: any, b: any) => serviceOrder.indexOf(a.name) - serviceOrder.indexOf(b.name)),
        ...otherServices.sort((a: any, b: any) => serviceOrder.indexOf(a.name) - serviceOrder.indexOf(b.name)),
      ];

      setSortedStoragePrices(clinicStoragePricesSorted);
      setSortedServicePrices(servicePricesSorted);
    }
  }, [billingData]);

  let clinicTransferFeesShown = false;

  return (
    <Fragment>
      <h1 className="mb-4 w-[336px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent">
        Current Pricing
      </h1>

      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] grid grid-cols-1 gap-4 px-4  text-base font-normal transition md:grid-cols-2 md:px-0 dark:text-neutral-50">
        <div>
          <section className="mb-4 flex flex-col gap-4 rounded-lg bg-[#1E2021] p-4 shadow md:p-8">
            {billingData?.extraProtectionProgramStatus && (
              <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent">
                <span className="text-2xl">{t('extraProtectionProgramStatus')}</span>:{' '}
                <span className="text-xl">{billingData?.extraProtectionProgramStatus}</span>
              </p>
            )}

            {Object.keys(groupedServicePrices).map(type => (
              <>
                {!clinicTransferFeesShown &&
                  (type === 'ClinicToClinicLocal' || type === 'ClinicToClinicNationwide') && (
                    <div className="flex flex-col items-start justify-start gap-2">
                      <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-2xl text-transparent">
                        {t('clinicBillingType')}
                      </p>
                      {(clinicTransferFeesShown = true)}
                      <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent text-sm font-normal leading-tight text-gray-300 ">
                        {t('billing.clinicToClinic')}
                      </div>
                    </div>
                  )}
                {PriceBillingTypeTitle[type] && !!groupedServicePrices[type]?.length && (
                  <div className="flex  flex-col items-start justify-start gap-2">
                    <p
                      className={classNames(
                        'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-2xl text-transparent',
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
                {groupedServicePrices[type]?.map((price: any) => (
                  <div
                    key={price.id}
                    className="flex items-start items-center justify-between md:flex-row md:items-center">
                    <div className="flex items-center justify-start gap-[5px] md:mb-0">
                      <div className="flex w-full items-center justify-between gap-2 break-words text-sm font-normal leading-[21px] text-white">
                        {price.name}
                        {price?.description && (
                          <Tooltip content={price.description} className="text-sm font-normal italic">
                            <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className="min-w-[80px] text-end text-sm font-normal leading-[21px] text-gray-300 opacity-40">
                      {price?.priceType === 'Quoted' ? `${price?.priceType}` : `$${price.price}`}
                    </div>
                  </div>
                ))}
              </>
            ))}
          </section>

          {billingData?.discount && (
            <section className="flex flex-col gap-4 rounded-lg bg-[#1E2021] p-8 shadow">
              <div className="inline-flex h-[21px] items-center justify-between gap-[35px] md:mb-0">
                <div className="flex items-center gap-2 break-all text-sm font-normal leading-[21px] text-white">
                  {billingData.discount.name}
                </div>

                <div className="min-w-[80px] text-end text-sm font-normal leading-[21px] text-gray-300 opacity-40">
                  {billingData?.discount?.type === 'FixedDiscount' ? '$' : null}
                  {billingData.discount.amount}
                  {billingData?.discount?.type === 'PercentageDiscount' ? '%' : null}
                </div>
              </div>
            </section>
          )}
        </div>

        <div>
          <section className="mb-3 w-full overflow-y-scroll rounded-lg bg-[#1E2021] shadow md:block">
            <div className="mb-8">
              {billingData?.billingCriteria === 'Patient' && (
                <div className="grid grid-cols-2 gap-4 bg-[#292B2C]">
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">Patient price</div>
                </div>
              )}

              {billingData?.billingCriteria === 'NumberOfCanes' && (
                <div className="grid grid-cols-2 gap-4 bg-[#292B2C]">
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">Canes price</div>
                </div>
              )}

              {billingData?.billingCriteria === 'SpecimenTypes' && (
                <div className="grid grid-cols-4 gap-4 bg-[#292B2C]">
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">SPECIMEN PRICING</div>
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">Embryo</div>
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">Oocyte</div>
                  <div className="p-4 text-sm font-normal uppercase leading-[21px] text-white">Sperm</div>
                </div>
              )}

              {sortedStoragePrices?.map((storagePrice: any) => (
                <div
                  key={storagePrice.title}
                  className={classNames('grid items-center gap-4 border-b border-neutral-700', {
                    'grid-cols-4': billingData?.billingCriteria === 'SpecimenTypes',
                    'grid-cols-2': billingData?.billingCriteria !== 'SpecimenTypes',
                  })}>
                  <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                    {StorageDurationNames[storagePrice.storageDuration]}
                  </div>

                  {billingData?.billingCriteria === 'SpecimenTypes' && (
                    <>
                      <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                        ${storagePrice.embryoPrice}
                      </div>
                      <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                        ${storagePrice.oocytePrice}
                      </div>
                      <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                        ${storagePrice.spermPrice}
                      </div>
                    </>
                  )}

                  {billingData?.billingCriteria === 'Patient' && (
                    <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                      ${storagePrice.patientPrice}
                    </div>
                  )}

                  {billingData?.billingCriteria === 'NumberOfCanes' && (
                    <div className="p-4 text-sm font-normal leading-[21px] text-gray-300">
                      ${storagePrice.canePrice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default PatientBilling;
