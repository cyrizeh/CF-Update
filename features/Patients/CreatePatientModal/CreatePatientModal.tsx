import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';

import Footer from './components/Footer';

import Stepper from '@/components/Forms/Stepper/Stepper';
import useCreatePatient from './useCreatePatient.modal';

import { ViewTypes } from '@/types';
import { getValidationPatientSchema } from '@/validations/patients';

import arrowIcon from '@/public/icons/arrow-left.svg';
import closeIcon from '@/public/icons/close-button.svg';

import { EPatientCreationStep } from '@/types/Patients.enum';
import { Clinic } from '@/types/view';
import { Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';

interface AddNewPatientModalTypes {
  isOpen: boolean;
  onClose: () => void;
  patientCreationStep?: EPatientCreationStep;
  patient?: any;
  clinicData?: Clinic;
  refetchPatientData?: any;
}

const STEPS = Array(5).fill('');

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

const AddNewPatientModal = ({
  isOpen,
  onClose,
  patientCreationStep,
  patient,
  clinicData,
  refetchPatientData,
}: AddNewPatientModalTypes) => {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);

  const [skipPartner, setSkipPartner] = useState(false);
  const [skipEmergency, setSkipEmergency] = useState(false);

  const { step, setStep, stepClick, isLastStep, setPatientId, isLoading } = useCreatePatient(
    onCloseModal,
    handleError,
    handleSetValues,
    patient
  );

  const { handleSubmit, ...formProps } = useForm<ViewTypes.PatientFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationPatientSchema(step, skipPartner, skipEmergency)),
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      skipPartner: 'connect',
      skipEmergency: 'connectEmergency',
      patient: defaultPatientData,
      billingInfo: {},
    },
    reValidateMode: 'onChange',
  });

  function onCloseModal() {
    onClose();
    refetchPatientData?.();
    if (!patientCreationStep) setStep(1);
    formProps.reset({
      skipPartner: 'connect',
      skipEmergency: 'connectEmergency',
      patient: defaultPatientData,
      billingInfo: {},
    });
    setSkipPartner(false);
    setSkipEmergency(false);
    if (!patientCreationStep) setPatientId('');
  }

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
  }

  function handleSetValues(name: any, value: string) {
    formProps.setValue(name, value);
  }

  const onPrevStep = () => {
    if (step === 3 && patient?.partner) {
      setStep(prev => prev - 2);
    } else setStep(prev => prev - 1);
  };

  useEffect(() => {
    if (patientCreationStep) {
      switch (patientCreationStep) {
        case EPatientCreationStep.MainInfoAssigned:
          return setStep(1);

        case EPatientCreationStep.EmergencyContactAssigned:
          return setStep(4);

        case EPatientCreationStep.BillingInformationAssigned:
          return setStep(5);

        default:
          return setStep(1);
      }
    }
  }, [patientCreationStep, setStep]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className={classNames('h-5 w-5', { 'cursor-pointer': step !== 1 })}>
                <Image
                  priority
                  src={arrowIcon}
                  alt="Prev"
                  onClick={onPrevStep}
                  className={classNames({ hidden: step === 1 })}
                />
              </div>

              <div className="text-3xl font-light dark:text-white">{t('createModal.title')}</div>

              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)] md:w-[448px]">
              <div className="space-y-6">
                <Stepper steps={STEPS} currentStep={step} />

                <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <Step1 currentStep={step} patient={patient} />
                    <Step2
                      currentStep={step}
                      setSkipPartner={setSkipPartner}
                      partnerInfo={patient?.partner}
                      skipPartner={skipPartner}
                    />
                    <Step3
                      currentStep={step}
                      setSkipEmergency={setSkipEmergency}
                      patient={patient}
                      skipEmergency={skipEmergency}
                    />
                    <Step4 currentStep={step} partnerInfo={patient} clinicData={clinicData} />
                    <Step5 currentStep={step} patient={patient} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full p-5 pt-2">
                <Footer
                  onClose={onCloseModal}
                  isLastStep={isLastStep}
                  stepClick={stepClick}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewPatientModal;
