import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PatientInfo from './components/PatientInfo';
import PartnerInfo from './components/PartnerInfo';
import EmergencyInfo from './components/EmergencyInfo';
import Footer from './components/Footer';
import Stepper from '@/components/Forms/Stepper/Stepper';
import useRegisterPatient from './useRegisterPatient';
import { ViewTypes } from '@/types';
import { getRegistrationPatientSchema } from '@/validations/patients';
import { Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';

interface PatientRegistrationProps {
  patient: any;
  refetchOnboardingData: any;
  refetchPatient: any;
}

const STEPS = Array(3).fill('');

const defaultPatientData = {
  firstName: '',
  middleName: '',
  dateOfBirth: null,
  lastName: '',
  email: '',
  note: '',
  phoneNumber: '',
  address: {
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  },
};

const PatientRegistration = ({ patient, refetchOnboardingData, refetchPatient }: PatientRegistrationProps) => {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);

  const [stepper, setStepper] = useState<string[]>(STEPS);
  const [isPartner, setIsPartner] = useState(false);

  const [skipPartner, setSkipPartner] = useState(false);
  const [skipEmergency, setSkipEmergency] = useState(false);

  const { step, setStep, stepClick, isLastStep, isSubmitting } = useRegisterPatient(
    handleError,
    handleSetValues,
    refetchOnboardingData,
    refetchPatient
  );

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return t('registerModal.patientInfoTitle');
      case 2:
        return t('registerModal.partnerInfoTitle');
      case 3:
        return t('registerModal.emergencyInfoTitle');
      default:
        return t('registerModal.patientInfoTitle');
    }
  };

  const { handleSubmit, ...formProps } = useForm<ViewTypes.PatientFormValues>({
    // @ts-ignore
    resolver: yupResolver(getRegistrationPatientSchema(step, skipPartner, skipEmergency)),
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      skipEmergency: 'connectEmergency',
      patient: defaultPatientData,
      hasPartner: patient?.signupSetup?.patient,
    },
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (patient) {
      setSkipPartner(!formProps.watch('hasPartner'));
      if (formProps.watch('hasPartner')) {
        setStepper(STEPS);
      } else {
        setStepper(Array(2).fill(''));
      }
    }
  }, [patient, formProps.watch('hasPartner')]);

  useEffect(() => {
    if (patient.partner && !patient.signupSetup?.hasPartner) {
      setIsPartner(true);
    }
  }, []);

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }

  function handleSetValues(name: any, value: string) {
    formProps.setValue(name, value);
  }

  const onPrevStep = () => {
    if (step === 3 && skipPartner) {
      setStep(prev => prev - 2);
    } else setStep(prev => prev - 1);
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={true} size="md" style={{ zIndex: 10 }}>
        <div className="h-full w-full  rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex flex-col items-center justify-center gap-4 px-4 pb-0 pt-5">
              <div className="text-3xl font-light dark:text-white">{getStepTitle(step)}</div>
              <div className="w-full px-4 ">
                <Stepper steps={stepper} currentStep={step} />
              </div>
            </div>

            <Modal.Body className="max-h-auto overflow-y-hidden md:max-h-[calc(100vh_-_250px)] md:w-[448px]">
              <div className="space-y-6">
                <div
                  className="custom-vertical-scrollbar mr-[-0.5rem] max-h-[450px] overflow-y-scroll pr-2 md:max-h-[calc(100vh_-_298px)]"
                  ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <PatientInfo
                      currentStep={step}
                      patient={patient}
                      setSkipPartner={setSkipPartner}
                      isPartner={isPartner}
                    />
                    <PartnerInfo currentStep={step} partner={patient?.partner} />
                    <EmergencyInfo
                      currentStep={step}
                      setSkipEmergency={setSkipEmergency}
                      patient={patient}
                      skipEmergency={skipEmergency}
                    />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full pb-5 pt-2">
                <Footer
                  onPrevStep={onPrevStep}
                  isLastStep={isLastStep}
                  step={step}
                  stepClick={data => stepClick({ ...data, skipPartner })}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientRegistration;
