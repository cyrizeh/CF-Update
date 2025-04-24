import classNames from 'classnames';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FaHospital, FaPerson } from 'react-icons/fa6';
import { IconButton } from '@mui/material';
import { ViewTypes } from '@/types';

import Image from 'next/image';
import usa from '@/public/icons/payments/usa.svg';
import useTranslation from 'next-translate/useTranslation';
import { Tooltip } from '@mui/material';
import bookmark from '@/public/icons/bookmark.svg';
import bookmarkActive from '@/public/icons/bookmarkActive.svg';
import useClinicMutation from '@/api/mutations/useClinicMutation';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Props = {
  clinic: ViewTypes.Clinic;
  userRole?: string;
  updateClinics: any;
};

const Clinic = ({ clinic, updateClinics, userRole }: Props) => {
  const { t } = useTranslation('clinics');

  const router = useRouter();
  const { addToFavorites, deleteFromFavorites } = useClinicMutation();

  const getClinicLink = () => {
    switch (userRole) {
      case 'AccountAdmin':
        return `/account/clinics/${clinic.id}`;
      case 'ClinicAdmin':
        return `/clinic/general`;
      default:
        return `/admin/clinics/${clinic.id}/general`;
    }
  };

  const handleOnAddFavorite = () => {
    addToFavorites({ clinicId: clinic.id as string })
      .then(() => {
        updateClinics(undefined, { revalidate: true });
      })
      .catch(() => {
        toast.error('Error while marking clinic as favorite');
      });
  };
  const handleOnDeleteFavorite = () => {
    deleteFromFavorites({ clinicId: clinic.id as string })
      .then(() => {
        updateClinics(undefined, { revalidate: true });
      })
      .catch(() => {
        toast.error('Error while marking clinic as favorite');
      });
  };

  return (
    <div
      data-testid="clinic-card"
      className={classNames(
        'flex h-[300px] flex-col justify-between gap-1 rounded-lg border-[1px] p-5 text-base font-normal shadow-md transition md:max-w-[350px] dark:border-zinc-800 dark:bg-transparent dark:text-neutral-50 dark:hover:border-teal-400',
        {
          grayscale: clinic.status === 'Draft',
        }
      )}>
      <div data-testid="clinic-header" className="flex items-center justify-between gap-2">
        <div className="gradient-border-mask !flex h-[25px] w-[25px] items-center justify-center">
          <div className="flex h-[25px] w-[25px] items-center justify-center">
            <FaHospital size={24} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-1 ">
          {clinic.status === 'Draft' ? (
            <div
              data-testid="clinic-status"
              className="inline-flex h-[22px] w-[76px] items-center justify-center gap-1 rounded-md border border-neutral-600 px-2.5 py-0.5">
              <div className="text-center text-xs font-medium leading-[18px] text-green-200">Incomplete</div>
            </div>
          ) : null}
          {clinic.isFavorite ? (
            <IconButton
              size="small"
              onClick={handleOnDeleteFavorite}
              className="text-white"
              sx={{ color: 'white' }}
              data-testid="remove-favorite-button">
              <Image src={bookmarkActive} alt="bookmark" className=" text-lg" />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={handleOnAddFavorite}
              className="text-white"
              sx={{ color: 'white' }}
              data-testid="add-favorite-button">
              <Image src={bookmark} alt="bookmark" className=" text-lg" />
            </IconButton>
          )}
        </div>
      </div>

      <div data-testid="clinic-info" className="flex flex-col">
        <div className="text-xl font-normal leading-[30px] text-white">
          <Tooltip title={clinic.name} arrow placement="top">
            <div data-testid="clinic-name" className="overflow-hidden truncate">
              {clinic.name}
            </div>
          </Tooltip>
        </div>

        <div data-testid="clinic-parent-company" className="truncate text-base font-normal leading-tight text-stone-50">
          {clinic.parentCompany}
        </div>
      </div>

      <div data-testid="clinic-location" className="flex gap-1">
        <Image src={usa} priority alt="usa" />
        {clinic.address?.state} {clinic.address?.zipCode}
      </div>

      <div data-testid="clinic-patients" className="flex items-center">
        <FaPerson size={24} className="mr-2" /> {clinic.patientsCount} {t('common:entity.patients')}
      </div>

      {/* <div className="flex items-center">
        <FaFileContract size={24} className="mr-2" /> {clinic.contractsCount} {t('signedContracts')}
      </div> */}
      <Link data-testid="clinic-details-link" href={getClinicLink()}>
        <Button data-testid="view-details-button" pill outline gradientDuoTone="primary" className="w-full">
          {t('common:viewDetails')}
        </Button>
      </Link>
    </div>
  );
};

export default Clinic;
