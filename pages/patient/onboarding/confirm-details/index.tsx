import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import useTranslation from 'next-translate/useTranslation';
import { FormProvider, useForm } from 'react-hook-form';
import { useRef } from 'react';
import router from 'next/router';
import { ViewTypes } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { confirmPatientDetailsSchema } from '@/validations/patients';
import { errorHandler } from '@/utils/errorHandler';
import { axiosPatient } from '@/api/queries/patient.queries';
import { useGetPatientInfo } from '@/api/queries/patient.queries';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';
import { Button, Modal } from 'flowbite-react';
import { formatDate } from '@/utils/formatDate';
import ConfirmPatientDetails from './ConfirmPatientDetails';

export const confirmDetails = async (patientInfo: any) => {
  return axiosPatient('/ConfirmData', 'POST', patientInfo);
};

function ConfirmDetails() {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);
  const { data: patient } = useGetPatientInfo();

  const { handleSubmit, setError, ...formProps } = useForm<ViewTypes.ConfirmDetailsFormValues>({
    // @ts-ignore
    resolver: yupResolver(confirmPatientDetailsSchema),
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ViewTypes.ConfirmDetailsFormValues) => {
    try {
      const responce = await confirmDetails({
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        middleName: data.middleName?.trim(),
        phoneNumber: addUSCountryCodeWithOutPlus(data.phoneNumber),
        dateOfBirth: data.dateOfBirth ? formatDate(new Date(data.dateOfBirth)) : null,
        address: data.address,
      });

      if (responce.data.succeeded) {
        await router.push(`/patient/onboarding/storage-plan`);
      }
    } catch (error: any) {
      errorHandler(error, setError, 'patient');
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={true} size="md" style={{ zIndex: 15 }}>
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
                <div className="flex w-full justify-end">
                  <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
                    {t('common:next')}
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
}

ConfirmDetails.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default ConfirmDetails;
