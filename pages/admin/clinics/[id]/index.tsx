/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from '@/components/Alert/Alert';
import ClinicTabs from '@/features/Clinics/ClinicTabs/ClinicTabs';
import ImportCSVModal from '@/features/Clinics/ImportCSVModal/importCSV.modal';
import AddNewPatientModal from '@/features/Patients/CreatePatientModal/CreatePatientModal';
import { Button, Spinner } from 'flowbite-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiInformationCircle } from 'react-icons/hi';

import useToggleModal from '@/hooks/useToggleModal';

import { useGetClinicById } from '@/api/queries/clinic.queries';

import PlusIcon from '@/public/icons/PlusIcon';
import { TbFileImport } from 'react-icons/tb';

import useClinicMutation from '@/api/mutations/useClinicMutation';
import bookmark from '@/public/icons/bookmark.svg';
import bookmarkActive from '@/public/icons/bookmarkActive.svg';
import { ViewTypes } from '@/types';
import { hasPermission } from '@/utils';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { NotFound } from '@/features/NotFound/NotFound';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { toast } from 'react-toastify';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const LayoutWithNoSSR = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });

const ClinicPage = () => {
  return null;
};

export const NestedLayout = ({ children }: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const clinicId = router.query.id;
  const { userPermissions } = usePermissions();
  const isUserCanCreatePatients = hasPermission(userPermissions, 'create:patients');

  const [hasBillingPlan, setHasBillingPlan] = useState(false);

  const {
    data: clinicData,
    isLoading: clinicDataLoading,
    mutate: updateClinics,
    error,
  } = useGetClinicById(clinicId as string);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

  const childrenProps = { clinic, updateDetails, updateClinicAddress, updateClinics };

  useEffect(() => {
    if (!clinicDataLoading) {
      setHasBillingPlan(!!clinicData?.pricingPlanId);
    }
  }, [clinicData, clinicDataLoading]);

  const {
    onOpenModal: onOpenAddNewPatientModal,
    isModalOpen: isAddNewPatientModalOpen,
    onCloseModal: onCloseAddNewPatientModal,
  } = useToggleModal();

  const {
    onOpenModal: onOpenImportPatientCSVModal,
    isModalOpen: isOpenImportPatientCSVModal,
    onCloseModal: onCloseImportPatientCSVModal,
  } = useToggleModal();

  const handleOnAddNewPatient = () => {
    if (!hasBillingPlan) {
      setIsAlertOpen(true);
    } else {
      onOpenAddNewPatientModal();
    }
  };

  const handleOnImportPatients = () => {
    if (!hasBillingPlan) {
      setIsAlertOpen(true);
    } else {
      onOpenImportPatientCSVModal();
    }
  };

  const handleClose = () => {
    setIsAlertOpen(false);
  };

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

  if (clinicDataLoading) {
    return (
      <LayoutWithNoSSR>
        <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
          </div>
        </div>
      </LayoutWithNoSSR>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return (
      <LayoutWithNoSSR>
        <NotFound text={t('notFound:clinicNotFound')} />
      </LayoutWithNoSSR>
    );
  }

  return (
    <LayoutWithNoSSR>
      <DynamicNamespaces namespaces={['patients']} fallback="Loading...">
        <AddNewPatientModal
          isOpen={isAddNewPatientModalOpen}
          onClose={onCloseAddNewPatientModal}
          clinicData={clinicData}
        />
      </DynamicNamespaces>

      <ImportCSVModal isOpen={isOpenImportPatientCSVModal} onClose={onCloseImportPatientCSVModal} />

      <div className="flex flex-col gap-8">
        <div className="mb-4 flex flex-col justify-between gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
          <>
            <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-transparent ">
              {clinic?.name}
            </p>
          </>

          {clinic ? (
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

        <div className="flex flex-wrap items-center justify-between">
          <ClinicTabs clinicId={clinic?.id} />

          <div className="grid w-full grid-cols-1 gap-2.5 pt-3  md:flex md:w-auto md:justify-end md:pt-0">
            {isUserCanCreatePatients && (
              <Button
                className="mb-3 h-[38px] w-full self-center md:mb-0 md:max-w-[135px]"
                size={'xs'}
                gradientDuoTone="primary"
                onClick={handleOnAddNewPatient}>
                <div className="mr-2">
                  <PlusIcon />
                </div>
                <div className="text-sm font-medium leading-[150%]">Add patient</div>
              </Button>
            )}

            <div className="flex justify-center gap-2.5">
              <Button
                gradientDuoTone="primary"
                outline
                onClick={handleOnImportPatients}
                size="sm"
                className="w-full md:w-[136px]">
                <TbFileImport className="mr-2 text-lg" />
                Import CSV
              </Button>
              {/* <Button color={'outlineOne'} size="sm" className="w-full md:w-[126px]">
                <HiArrowUpTray className="mr-2 text-lg" />
                Export
              </Button> */}
            </div>
          </div>
        </div>

        {isAlertOpen && (
          <Alert variant="warning" icon={HiInformationCircle} onDismiss={handleClose}>
            <p>
              You need to set up your billing plan before adding patients. You can do this{' '}
              <Link className="underline" href={`/admin/clinics/${clinicId}/billing`}>
                here
              </Link>
              .
            </p>
          </Alert>
        )}

        {clinic && React.cloneElement(children, childrenProps)}
      </div>
    </LayoutWithNoSSR>
  );
};

export const ClinicPageLayout = (page: any) => <NestedLayout>{page}</NestedLayout>;

ClinicPage.getLayout = ClinicPageLayout;

export default ClinicPage;
