import { Button } from 'flowbite-react';
import { FaBoxes } from 'react-icons/fa';
import { FaMapLocationDot, FaVault, FaVial } from 'react-icons/fa6';

import { ViewTypes } from '@/types';

import usa from '@/public/icons/payments/usa.svg';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

import classNames from 'classnames';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';

const Facility = ({ facility, onDelete }: { facility: ViewTypes.Facility; onDelete: any }) => {
  const { t } = useTranslation('facilities');

  return (
    <div
      data-testid="facility-card"
      className="relative flex h-[300px] flex-col justify-between gap-1 rounded-lg border-[1px] p-5 text-base font-normal shadow-md transition md:max-w-[350px] dark:border-zinc-800 dark:bg-transparent dark:text-neutral-50 dark:hover:border-teal-400">
      <div className="flex items-center justify-between gap-2" data-testid="facility-header">
        <div className="gradient-border-mask !flex h-[25px] w-[25px] items-center justify-center">
          <div className="flex h-[25px] w-[25px] items-center justify-center" data-testid="facility-icon-box">
            <FaBoxes size={24} />
          </div>
        </div>

        <div
          data-testid="facility-delete-icon"
          onClick={() => onDelete(facility.id)}
          className={classNames(
            'absolute right-5 top-[28px] cursor-pointer rounded-full border border-neutral-600 p-1 text-white',
            { 'pointer-events-none opacity-15': facility?.vaultsCount > 0 }
          )}>
          <MdDelete />
        </div>
      </div>

      <div data-testid="facility-name">
        <div className="... truncate text-xl font-normal leading-[30px] text-white">{facility.name}</div>
      </div>
      <div className="flex items-center" data-testid="facility-address">
        <FaMapLocationDot size={24} className="mr-2 flex-shrink-0" />
        <p className="text-overflow-ellipsis flex-grow overflow-hidden truncate whitespace-nowrap">
          {`${facility.address?.street1}, ${facility.address?.city}`}
        </p>
      </div>

      <div className="flex gap-1" data-testid="facility-state-zipcode">
        <Image src={usa} priority alt="usa" />
        {facility.address?.state} {facility.address?.zipCode}
      </div>

      <div className="flex items-center" data-testid="facility-vaults-count">
        <FaVault size={24} className="mr-2" /> {facility?.vaultsCount} {t('numberOfVaults')}
      </div>

      <div className="flex items-center" data-testid="facility-canes-count">
        <FaVial size={24} className="mr-2" />
        {facility?.canesCount} {t('numberOfCanes')}
      </div>

      <Link href={`/admin/facilities/${facility.id}`}>
        <Button pill outline gradientDuoTone="primary" className="w-full" data-testid="facility-view-details-button">
          {t('common:viewDetails')}
        </Button>
      </Link>
    </div>
  );
};

export default Facility;
