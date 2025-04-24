import { formatToUSAPhoneFormat, hasPermission } from '@/utils';
import { PatientOverviewProps } from '@/types/view';

import PatientComponentLayout from './PatientComponentLayout';
import { Button } from 'flowbite-react';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import EditPatientModal from './EditPatientModal';
import useToggleModal from '@/hooks/useToggleModal';
import usePatientMutation from '@/api/mutations/usePatientMutation';
import useTranslation from 'next-translate/useTranslation';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { PatientAddress } from '@/types/view/PatientOverviewProps.interface';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const PersonalDetails = ({ patient, refetchPatientInfo, isReadonly }: PatientOverviewProps) => {
  const { firstName, lastName, address, phoneNumber, alternativeEmail, dateOfBirth } = patient;
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { updatePatientProfile } = usePatientMutation('');
  const { t } = useTranslation('patients');

  const { userPermissions } = usePermissions();
  const isUserCanEditPatients = !isReadonly && hasPermission(userPermissions, 'create:patients');
  // &&
  // patientStatus === PatientStatus.Created &&
  // patientType === 'Storage';

  function formatAddress(address: PatientAddress): string {
    const { street1, street2, city, state, zipCode } = address;
    const parts = [street1, street2, city, state, zipCode].filter(part => !!part);

    return parts.join(', ');
  }

  const details = [
    {
      name: 'Name',
      value: `${firstName} ${lastName}`,
      dataTestId: 'personal-details-patient-name',
    },
    {
      name: 'Date of Birth',
      value: dateOfBirth ? formatDateWithSlashSeparator(dateOfBirth) : '',
      dataTestId: 'personal-details-patient-date-of-birth',
    },
    {
      name: 'Address',
      value: address ? formatAddress(address) : '',
      dataTestId: 'personal-details-patient-address',
    },
    {
      name: 'Phone number',
      value: formatToUSAPhoneFormat(phoneNumber),
      dataTestId: 'personal-details-patient-phone-number',
    },
    {
      name: 'Alternative email',
      value: alternativeEmail,
      dataTestId: 'personal-details-patient-alternative-email',
    },
  ];

  const onClose = (isSubmitted?: boolean) => {
    if (isSubmitted && refetchPatientInfo) {
      refetchPatientInfo(undefined, { revalidate: true });
    }
    onCloseModal();
  };

  return (
    <PatientComponentLayout col>
      <div className="mb-6 flex items-center justify-between">
        <span className=" text-2xl font-normal text-white">Personal details</span>
        {isUserCanEditPatients && (
          <Button gradientDuoTone="primary" onClick={onOpenModal}>
            {t('common:edit')}
          </Button>
        )}
      </div>
      {details.map(
        ({ name, value, dataTestId }: any) =>
          value && (
            <div
              key={name}
              className="sensitive my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
              <div>{name}</div>
              <div data-testid={dataTestId}>{value}</div>
            </div>
          )
      )}
      <DynamicNamespaces namespaces={['patients']}>
        <EditPatientModal
          patient={patient}
          updateDetails={updatePatientProfile}
          isOpen={isModalOpen}
          onClose={onClose}
        />
      </DynamicNamespaces>
    </PatientComponentLayout>
  );
};

export default PersonalDetails;
