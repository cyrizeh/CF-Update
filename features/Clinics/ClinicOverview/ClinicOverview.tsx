import ClinicDetails from '../ClinicDetails/ClinicDetails';
import Address from '../Address/Address';
import useToggleModal from '@/hooks/useToggleModal';
import EditClinicModal from '../EditClinicModal/EditClinicModal';
import EditClinicAddressModal from '../EditClinicModal/EditClinicAddressModal';
import EditBillingAddressModal from '../EditClinicModal/EditBillingAddressModal';
import { useGetClinicById } from '@/api/queries/clinic.queries';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import { useEffect, useState } from 'react';
import React from 'react';
import useClinicMutation from '@/api/mutations/useClinicMutation';
import { ViewTypes } from '@/types';
import _ from 'lodash';
import bookmarkActive from '@/public/icons/bookmarkActive.svg';
import bookmark from '@/public/icons/bookmark.svg';
import { Button } from 'flowbite-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

type Props = {
  clinicId: string;
  userRole?: string;
};

const ClinicOverview = ({ clinicId, userRole }: Props) => {
  const { data: clinicData, isLoading: clinicDataLoading, mutate: updateClinics } = useGetClinicById(clinicId);

  const [clinic, setClinic] = useState<ViewTypes.Clinic>();

  const {
    updatedClinicData,
    updateDetails,
    updatedClinicAddress,
    updateClinicAddress,
    addToFavorites,
    deleteFromFavorites,
  } = useClinicMutation();

  useEffect(() => {
    if (clinicData) {
      setClinic(clinicData);
    }
  }, [clinicData]);

  useEffect(() => {
    if (!clinicDataLoading && updatedClinicData) {
      const mergedClinic = { ...clinic, ...updatedClinicData.data };
      setClinic(mergedClinic);
    }
  }, [updatedClinicData]);

  useEffect(() => {
    if (!clinicDataLoading && updatedClinicAddress) {
      const mergedClinic = { ...clinic, ...updatedClinicAddress.data };
      setClinic(mergedClinic);
    }
  }, [updatedClinicAddress]);

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

  const handleOnAddFavorite = () => {
    addToFavorites({ clinicId: clinicId as string })
      .then(() => {
        // @ts-ignore
        updateClinics(undefined, { revalidate: true });
      })
      .catch(() => {
        toast.error('Error while marking clinic as favorite');
      });
  };
  const handleOnDeleteFavorite = () => {
    deleteFromFavorites({ clinicId: clinicId as string })
      .then(() => {
        // @ts-ignore
        updateClinics(undefined, { revalidate: true });
      })
      .catch(() => {
        toast.error('Error while marking clinic as favorite');
      });
  };

  if (!clinic) return null;
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-col justify-between gap-4  text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <>
          <p className="mb-8 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent">
            {clinic?.name}
          </p>
        </>
        {userRole !== 'ClinicAdmin' ? (
          clinic.isFavorite ? (
            <Button
              gradientDuoTone="primary"
              outline
              onClick={handleOnDeleteFavorite}
              size="sm"
              className="min-w-[220px] max-w-full">
              <div className="flex flex-row items-center">
                <Image src={bookmarkActive} alt="bookmark" className="mr-2 text-lg" />
                Remove from favorites
              </div>
            </Button>
          ) : (
            <Button
              gradientDuoTone="primary"
              outline
              onClick={handleOnAddFavorite}
              size="sm"
              className="min-w-[220px] max-w-full">
              <div className="flex flex-row items-center">
                <Image src={bookmark} alt="bookmark" className="mr-2 text-lg" />
                Add to favorites
              </div>
            </Button>
          )
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-grow flex-col gap-2.5 self-stretch">
          <ClinicDetails
            contactDetails={clinic?.contactDetails}
            secondaryContactDetails={clinic?.secondaryContactDetails}
            name={clinic?.name}
            parentCompany={clinic?.accountName}
            type={clinic?.type}
            onEdit={onOpenModal}
            isEditable={userRole === 'ClinicAdmin'}
          />
        </div>

        <div className="flex flex-col gap-2.5 self-stretch">
          <Address
            address={clinic?.address}
            updateClinics={updateClinics}
            billingAddress={clinic?.billingAddress}
            onEditClinicAddress={onOpenEditClinicAddress}
            onEditBillingAddress={onOpenEditBillingAddress}
            isEditable={userRole === 'ClinicAdmin'}
          />
        </div>
      </div>
      {userRole === 'ClinicAdmin' && (
        <DynamicNamespaces namespaces={['clinics']} fallback="Loading...">
          <EditClinicModal
            clinic={clinic}
            updateDetails={updateDetails}
            isOpen={isModalOpen}
            onClose={onCloseModal}
            canEditParentClinic={false}
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
      )}
    </div>
  );
};

export default ClinicOverview;
