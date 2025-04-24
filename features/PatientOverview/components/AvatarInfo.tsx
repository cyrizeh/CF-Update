import { StorageDurationNames } from '@/constants/billing';
import { OnboardingStatus, PatientOnboardingStatus } from '@/types/Patients.enum';
import { PatientOverviewProps } from '@/types/view';
import { onboardingDescriptions } from '@/types/view/OnBoardingType.type';
import { formatMemberSince } from '@/utils/formatMemberSince';
import { toPascalCase } from '@/utils/toPascalCase';
import useTranslation from 'next-translate/useTranslation';

const AvatarInfo = ({
  patient,
  isPatient,
  storageDuration,
}: PatientOverviewProps & {
  isPatient?: boolean;
  storageDuration?: string;
}) => {
  const { firstName, lastName, onboardingStatus, email, created, onboardingType, middleName } = patient;
  const initials = `${firstName[0]}${lastName[0]}`;
  const { t } = useTranslation('patients');

  return (
    <div className="flex min-w-full max-w-[370px] flex-col flex-wrap items-center gap-3 rounded-md border border-transparent p-4 sm:p-8 md:max-w-full md:flex-row md:items-start 2xl:flex-nowrap dark:bg-[#1E2021]">
      <div className="relative inline-flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-full  bg-gradient-to-r from-blue-600 to-teal-400">
        <span className="sensitive font-medium text-gray-600 dark:text-gray-300">{initials}</span>
      </div>
      <div className="flex flex-col  gap-1">
        <span className="overflow-wrap break-word sensitive text-2xl font-normal text-white">
          {toPascalCase(`${firstName || ''} ${middleName || ''} ${lastName || ''}`)}
        </span>

        <span className="sensitive break-all text-sm font-normal text-gray-300">{email}</span>
        {patient?.patientType !== 'Transportation' ? (
          <span className="text-xs font-medium  text-green-200">
            {'Onboarding Status'}:{' '}
            {isPatient
              ? PatientOnboardingStatus[onboardingStatus] === OnboardingStatus.Onboarded
                ? t('avatarInfo.complete')
                : t('avatarInfo.incomplete')
              : PatientOnboardingStatus[onboardingStatus]}
          </span>
        ) : null}
        {!!onboardingType && !isPatient && (
          <span className="text-xs font-medium  text-blue-200">
            {t('avatarInfo.onboadingType')}: {onboardingDescriptions[onboardingType]}
          </span>
        )}
        <span className="text-xs font-medium  text-orange-200">
          {t('avatarInfo.storageDuration')}:{' '}
          {storageDuration ? StorageDurationNames?.[storageDuration] : t('common:notSet')}
        </span>
        <span className="text-xs font-medium  text-[#828282]">{formatMemberSince(created)}</span>
      </div>
    </div>
  );
};

export default AvatarInfo;
