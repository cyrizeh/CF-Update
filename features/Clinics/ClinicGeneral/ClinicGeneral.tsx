import ClinicDetails from '../ClinicDetails/ClinicDetails';
import Address from '../Address/Address';
import PatientsOverview from '../PatientsOverview/PatientsOverview';

import { ViewTypes } from '@/types';
import useToggleModal from '@/hooks/useToggleModal';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import EditClinicModal from '../EditClinicModal/EditClinicModal';
import EditClinicAddressModal from '../EditClinicModal/EditClinicAddressModal';
import EditBillingAddressModal from '../EditClinicModal/EditBillingAddressModal';
import PaymentDateSourceRadioGroup from '../PaymentDateSource/PaymentDateSource';

type Props = {
  clinic: ViewTypes.Clinic;
  updateDetails: () => Promise<any>;
  updateClinicAddress: () => Promise<any>;
  updateClinics: () => Promise<any>; // refetch clinic data
};

const ClinicGeneral = ({ clinic, updateDetails, updateClinicAddress, updateClinics }: Props) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const {
    isModalOpen: isEditClinicAddressOpen,
    onCloseModal: onCloseEditClinicAddress,
    onOpenModal: onOpenEditClinicAddress,
  } = useToggleModal();
  const {
    isModalOpen: isEditBillingAddressOpen,
    onCloseModal: onCloseEditBillingAddress,
    onOpenModal: onOpenEditBillingAddress,
  } = useToggleModal();

  if (!clinic) return null;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-grow flex-col gap-2.5 self-stretch">
          <ClinicDetails
            contactDetails={clinic?.contactDetails}
            secondaryContactDetails={clinic?.secondaryContactDetails}
            name={clinic?.name}
            parentCompany={clinic?.parentCompany}
            type={clinic?.type}
            onEdit={onOpenModal}
            isEditable={true}
          />

          <Address
            address={clinic?.address}
            updateClinics={updateClinics}
            billingAddress={clinic?.billingAddress}
            onEditClinicAddress={onOpenEditClinicAddress}
            onEditBillingAddress={onOpenEditBillingAddress}
            isEditable
          />
        </div>

        <div className="flex flex-col gap-2.5 self-stretch">
          <PatientsOverview clinic={clinic} />
          <PaymentDateSourceRadioGroup clinic={clinic} updateClinics={updateClinics} />
        </div>
      </div>

      <DynamicNamespaces namespaces={['clinics']} fallback="Loading...">
        <EditClinicModal
          clinic={clinic}
          updateDetails={updateDetails}
          isOpen={isModalOpen}
          onClose={onCloseModal}
          canEditParentClinic={true}
          refetchClinicData={updateClinics}
        />

        <EditClinicAddressModal
          clinic={clinic}
          updateDetails={updateClinicAddress}
          isOpen={isEditClinicAddressOpen}
          onClose={onCloseEditClinicAddress}
        />

        <EditBillingAddressModal
          clinic={clinic}
          updateDetails={updateClinicAddress}
          isOpen={isEditBillingAddressOpen}
          setIsOpen={onCloseEditBillingAddress}
        />
      </DynamicNamespaces>
    </>
  );
};

export default ClinicGeneral;
