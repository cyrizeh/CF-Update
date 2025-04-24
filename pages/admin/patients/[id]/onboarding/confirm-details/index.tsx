import useTranslation from 'next-translate/useTranslation';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { ViewTypes } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { confirmPatientDetailsSchema } from '@/validations/patients';
import { errorHandler } from '@/utils/errorHandler';
import { useGetPatientsById } from '@/api/queries/patient.queries';
import ConfirmPatientDetails from './ConfirmPatientDetails';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';
import { Button, Modal, Spinner } from 'flowbite-react';
import { formatDate } from '@/utils/formatDate';
import { axios } from '@/api/queries/patient.queries';
import { PatientProfilePageLayout } from '../..';
import { useGetOnboardingDataByAdmin } from '@/api/queries/onboarding.queries';
import OnboardingLastStep from '../congrats/OnboardingLastStep';
import { useRef } from 'react';
import Image from 'next/image';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';

export const updatePatient = async (patientId: string, patientInfo: any) => {
  return axios(`/${patientId}`, 'PUT', patientInfo);
};

function ConfirmDetails() {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data: patient } = useGetPatientsById(router?.query?.id as string);
  const patientId = router?.query?.id as string;
  const { data: onboardingData, isLoading: onboardingDataLoading } = useGetOnboardingDataByAdmin(patientId);
  const { handleSubmit, setError, ...formProps } = useForm<ViewTypes.ConfirmDetailsFormValues>({
    // @ts-ignore
    resolver: yupResolver(confirmPatientDetailsSchema),
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ViewTypes.ConfirmDetailsFormValues) => {
    try {
      const responce = await updatePatient(patientId, {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        middleName: data.middleName?.trim(),
        phoneNumber: addUSCountryCodeWithOutPlus(data.phoneNumber),
        dateOfBirth: data.dateOfBirth ? formatDate(new Date(data.dateOfBirth)) : null,
        address: data.address,
        email: data.email,
      });

      if (responce.data) {
        await router.push(`/admin/patients/${patient?.id}/onboarding/storage-plan`);
      }
    } catch (error: any) {
      errorHandler(error, setError, 'patient');
    }
  };

  if (onboardingDataLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (onboardingData?.status === 'Onboarded') {
    router.push(`/admin/patients/${patientId}/onboarding/congrats`);
    return;
  }

  return onboardingData?.status !== 'Onboarded' ? (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={true} size="md">
        <div className="h-full w-full  rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex flex-col items-center justify-center gap-4 px-4 pb-0 pt-5">
              <div className="text-3xl font-light dark:text-white">Confirm Profile</div>
            </div>
            <Modal.Body className="max-h-auto overflow-y-hidden md:max-h-[calc(100vh_-_250px)] md:w-[448px]">
              <div className="space-y-6">
                <div
                  className="custom-vertical-scrollbar mr-[-0.5rem] max-h-[450px] overflow-y-scroll pr-2 md:max-h-[calc(100vh_-_298px)]"
                  ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} setError={setError} {...formProps}>
                    <ConfirmPatientDetails patient={patient} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full pb-5 pt-2">
                <div className="flex w-full justify-between">
                  <Button
                    gradientDuoTone="transparent"
                    onClick={() => {
                      router.push(`/admin/patients/${patientId}/general`);
                    }}>
                    <div className={'flex gap-2'}>
                      <Image priority src={arrowBackIcon} alt={'back'} />
                      <div> {t('common:back')}</div>
                    </div>
                  </Button>
                  <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
                    <div className={'flex gap-2'}>
                      <div> {t('common:next')}</div>
                      <Image priority src={arrowNextIcon} alt={'next'} />
                    </div>
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <OnboardingLastStep />
  );
}

ConfirmDetails.getLayout = PatientProfilePageLayout;

export default ConfirmDetails;
