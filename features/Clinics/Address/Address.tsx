import { Button } from 'flowbite-react';
import PlusIcon from '@/public/icons/PlusIcon';
import AddressComponent from '@/features/Clinics/Address/AddressComponent';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import AddAddressModal from './AddAddress';

const Address = ({
  address,
  billingAddress,
  updateClinics,
  onEditClinicAddress,
  onEditBillingAddress,
  isEditable,
}: {
  address?: ViewTypes.Address;
  billingAddress?: ViewTypes.Address;
  // eslint-disable-next-line no-unused-vars
  updateClinics: (data: any, option: any) => Promise<any>;
  onEditClinicAddress: () => void;
  onEditBillingAddress: () => void;
  isEditable?: boolean;
}) => {
  const { t } = useTranslation('clinics');
  const [open, toggle] = useState(false);

  return (
    <div className="rounded-md bg-[#1E2021] p-8">
      <AddAddressModal
        isOpen={open}
        updateClinics={updateClinics}
        // @ts-ignore
        clinic={{ address: address, billingAddress: billingAddress }}
        setIsOpen={() => toggle(!open)}
      />

      <div className={'flex flex-col gap-4'}>
        <div className="mb-3 flex justify-between text-2xl font-normal text-white">
          <div>{t('common:address')}</div>

          {!address && (
            <Button
              className="border-0 p-1 lg:block"
              onClick={() => toggle(!open)}
              size={'xs'}
              gradientDuoTone="primary">
              <div className="mr-2">
                <PlusIcon />
              </div>
              <div>{t('common:addNew')}</div>
            </Button>
          )}
        </div>

        {billingAddress && (
          <AddressComponent
            title={t('general.billingAddress')}
            address={billingAddress}
            onEdit={onEditBillingAddress}
            isEditable={isEditable}
            dataTestId="billing-address"
          />
        )}

        {address && (
          <AddressComponent
            title={t('general.clinicAddress')}
            address={address}
            onEdit={onEditClinicAddress}
            isEditable={isEditable}
            dataTestId="clinic-address"
          />
        )}
      </div>
    </div>
  );
};

export default Address;
