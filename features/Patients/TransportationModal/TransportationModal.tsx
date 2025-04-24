import { useGetPatientsById } from '@/api/queries/patient.queries';
import Stepper from '@/components/Forms/Stepper/Stepper';
import arrowIcon from '@/public/icons/arrow-left.svg';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { RequestCreationStep } from '@/types/Patients.enum';
import { getValidationTransportationSchema } from '@/validations/transportation';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ClinicInfo from './components/ClinicInfo';
import Footer from './components/Footer';
import PartnerInfo from './components/PartnerInfo';
import PatientInfo from './components/PatientInfo';
import ShipmentInfo from './components/ShipmentInfo';
import { defaultTransportationFormValues } from './components/TransportationModal.const';
import useTransportationModal from './useTransportationModal';
import { useGetTransportationInfo } from '@/api/queries/transportation.queries';
import { PatientPartnerDetails } from '@/types/view/PatientOverviewProps.interface';

interface RequestModalTypes {
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  refetchTransportationRequests?: () => void;
  transportationRequestData?: {
    requestId?: string;
    patientId?: string;
    hasPartner?: boolean;
    requestCreationStep?: any;
  };
}

const TransportationModal = ({
  isOpen,
  onClose,
  isEditMode,
  transportationRequestData,
  refetchTransportationRequests,
}: RequestModalTypes) => {
  const { t } = useTranslation('transportation');
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [partner, setPartner] = useState<PatientPartnerDetails>();

  const [skipPartner, setSkipPartner] = useState(false);

  // CURRENT STEP
  const [step, setStep] = useState<number>(1);

  // STEPPER
  const STEPS = Array(skipPartner ? 3 : 4).fill('');
  const [stepper, setStepper] = useState<string[]>(STEPS);

  const [shouldRecalculatePrice, setShouldRecalculatePrice] = useState(false);
  const { data: patient, mutate: refetchPatientInfo } = useGetPatientsById(
    transportationRequestData?.patientId ? transportationRequestData?.patientId : (router?.query?.id as string)
  );
  const {
    data: transportationInfo,
    isLoading,
    mutate,
  } = useGetTransportationInfo(transportationRequestData?.requestId || '');

  const { handleSubmit, ...formProps } = useForm<ViewTypes.TransportationFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationTransportationSchema(step, skipPartner)),
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    defaultValues: defaultTransportationFormValues,
  });

  const { stepClick, isLastStep, setTransportationRequestId, isSubmitting, transportationRequestId } =
    useTransportationModal(
      onCloseModal,
      handleError,
      step,
      setStep,
      formProps?.setValue,
      transportationRequestData?.requestId,
      skipPartner,
      setShouldRecalculatePrice,
      transportationInfo?.partnerId
    );

  useEffect(() => {
    if (patient?.partner) {
      setPartner(patient.partner);
      setSkipPartner(false);
    }
  }, [patient]);

  function onCloseModal() {
    onClose();
    // added to reset data and input values
    formProps.reset(defaultTransportationFormValues);
    // If it's in create mode, we reset to the first step for the next new requests.
    setStep(1);
    // If it's in create mode, we need to reset it so that the next time the modal opens,
    // it will create a new request instead of editing the last one.
    if (!transportationRequestData?.requestId) setTransportationRequestId('');
    // @ts-ignore
    refetchTransportationRequests?.();
    mutate(undefined, { revalidate: true });
    refetchPatientInfo();
  }

  function handleError(error: { field: any; error: { message: string } }) {
    formProps.setError(error.field, { ...error.error });
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

  useEffect(() => {
    if (transportationRequestData?.requestCreationStep) {
      switch (transportationRequestData?.requestCreationStep) {
        case RequestCreationStep.PatientAssigned:
          return setStep(1);

        case RequestCreationStep.PartnerAssigned:
          return setStep(2);

        case RequestCreationStep.FacilityAssigned:
          return setStep(3);

        case RequestCreationStep.SendingClinicAssigned:
          return setStep(3);

        case RequestCreationStep.ReceivingClinicAssigned:
          return setStep(3);

        case RequestCreationStep.DistanceUpdated:
          return setStep(4);

        case RequestCreationStep.SpecimenDetailsAssigned:
          return setStep(4);

        default:
          return setStep(1);
      }
    }
  }, [transportationRequestData?.requestCreationStep, setStep]);

  useEffect(() => {
    setSkipPartner(!formProps.watch('transportation.hasPartner'));
    if (formProps.watch('transportation.hasPartner')) {
      setStepper(Array(4).fill(''));
    } else {
      setStepper(Array(3).fill(''));
    }
  }, [formProps.watch('transportation.hasPartner')]);

  // If the user reopens the same request again after resetting data, we need to trigger retrieving
  // the information again about the current transportation requests.
  useEffect(() => {
    if (transportationRequestData?.requestId) {
      setTransportationRequestId(transportationRequestData?.requestId);
    }
    if (transportationRequestData?.patientId) {
      formProps?.setValue('transportation.patientId', transportationRequestData?.patientId);
    }
  }, [isOpen, transportationRequestData]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
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

          <div className="text-3xl font-light">{t('title')}</div>

          <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="mb-5 max-h-[calc(100vh-250px)] pt-0">
          <div className="space-y-6">
            <Stepper steps={stepper} currentStep={skipPartner && step > 1 ? step - 1 : step} />

            <div className="max-h-[470px] overflow-y-scroll md:h-[470px]" ref={scrollRef}>
              <FormProvider handleSubmit={handleSubmit} {...formProps}>
                {isEditMode && isLoading ? (
                  <div className="flex h-full justify-center rounded-lg">
                    <div className="flex  items-center justify-center gap-2 text-sm text-white">
                      <Spinner size="sm" className="mt-[-1px]" /> Loading...
                    </div>
                  </div>
                ) : (
                  <PatientInfo
                    currentStep={step}
                    patient={patient}
                    isEditMode={transportationRequestData?.patientId !== undefined}
                    isOpen={isOpen}
                    setSkipPartner={setSkipPartner}
                    hasPartner={transportationInfo ? transportationInfo?.hasPartner : !!partner}
                    setPartner={setPartner}
                  />
                )}

                <PartnerInfo currentStep={step} partner={transportationInfo?.partner || partner} isOpen={isOpen} />
                <ClinicInfo
                  currentStep={step}
                  requestId={transportationRequestId}
                  transportationInfo={transportationInfo}
                  setShouldRecalculatePrice={setShouldRecalculatePrice}
                />
                <ShipmentInfo
                  currentStep={step}
                  requestId={transportationRequestId}
                  transportationInfo={transportationInfo}
                  isEditMode={isEditMode}
                  shouldRecalculatePrice={shouldRecalculatePrice}
                  setShouldRecalculatePrice={setShouldRecalculatePrice}
                />
              </FormProvider>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-between pt-0">
          <Footer
            onClose={onCloseModal}
            isLastStep={isLastStep}
            stepClick={data => stepClick({ ...data, skipPartner })}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransportationModal;
