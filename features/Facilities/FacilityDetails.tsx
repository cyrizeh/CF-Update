import { Facility } from '@/types/view';
import useTranslation from 'next-translate/useTranslation';
import { Fragment } from 'react';

type Props = {
  facility: Facility;
};

const FacilityDetails = ({ facility }: Props) => {
  const { name, address, canesCount, devicesCount, specimensCount, reservedSlots } = facility;
  const { t } = useTranslation('facilities');

  function formatAddress(address: any): string {
    const { street1, street2, city, zipCode } = address;
    const parts = [street1, street2, city, zipCode].filter(part => !!part);

    return parts.join(', ');
  }

  const details = [
    {
      name: t('facilityDetailsPage.name'),
      value: name,
      dataTestId: 'facility-name',
    },
    {
      name: t('facilityDetailsPage.address'),
      value: address ? formatAddress(address) : '',
      dataTestId: 'facility-address',
    },
    {
      name: t('facilityDetailsPage.state'),
      value: address.state,
      dataTestId: 'facility-state',
    },
    {
      name: t('facilityDetailsPage.canesCount'),
      value: canesCount,
      dataTestId: 'facility-canes-count',
    },
    {
      name: t('facilityDetailsPage.devicesCount'),
      value: devicesCount,
      dataTestId: 'facility-devices-count',
    },
    {
      name: t('facilityDetailsPage.specimensCount'),
      value: specimensCount,
      dataTestId: 'facility-specimens-count',
    },
    {
      name: t('facilityDetailsPage.reservedSlots'),
      value: reservedSlots,
      dataTestId: 'facility-reserved-slots',
    },
  ];

  return (
    <Fragment>
      <span
        className="mb-6 text-2xl font-normal text-white"
        data-testid="facility-details-title">
        {t('facilityDetails')}
      </span>

      {details.map(({ name, value, dataTestId }) => (
        <div
          key={dataTestId}
          className="my-2 flex justify-between gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]"
          data-testid={dataTestId}>
          <div data-testid={`${dataTestId}-name`}>{name}</div>
          <div className="w-auto break-all" data-testid={`${dataTestId}-value`}>
            {value}
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default FacilityDetails;
