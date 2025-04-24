/* eslint-disable react-hooks/exhaustive-deps */
import { useCompleteDocumentSigningMutation, useDocumentsMutation } from '@/api/mutations/useDocumentsMutation';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import { useGetPaymentInfo } from '@/api/queries/patient.queries';
import { Alert } from '@/components/Alert/Alert';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import OnboardingCard from '@/features/Onboarding/OnboardingCard';
import OnboardingPayment from '@/features/Onboarding/Payment/OnboardingPayment';
import PlanPage from '@/features/Onboarding/Plan/PlanPage';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import pencilIcon from '@/public/icons/pencil.svg';
import { ViewTypes } from '@/types';
import { OnboardingFormValues } from '@/types/view/OnboardingFormValues.type';
import { OnboardingStepType } from '@/types/view/OnboardingStep.type';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next/types';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { HiCheckCircle } from 'react-icons/hi';

const docusignFailedStatuses = [
  'access_code_failed',
  'cancel',
  'decline',
  'exception',
  'fax_pending',
  'session_timeout',
  'ttl_expired',
];

function OnboardingStep() {
  const { t } = useTranslation('onboarding');
  const router = useRouter();
  const { id: stepId, event } = router.query;

  const { data: onboardingData, mutate: refetchOnboardingData, isLoading } = useGetOnboardingData();
  const { data: paymentInfo, mutate: refetchPaymentData } = useGetPaymentInfo();
  const [currentStep, setCurrentStep] = useState<ViewTypes.OnboardingStep>();
  const [steps, setSteps] = useState<ViewTypes.OnboardingStep[]>([]);
  const [signingStatus, setSigningStatus] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [actionButtons, setActionButtons] = useState<any[]>([]);

  // form
  const formProps = useForm<OnboardingFormValues>({
    defaultValues: {
      storagePriceId: null,
      transferServiceGuaranteeId: '', // use empty string because 'OPT OUT' has null id
      extraProtectionProgramId: '',
    },
  });

  const getSortedSteps = (steps: ViewTypes.OnboardingStep[]) => {
    return steps.sort((a, b) => a.order - b.order);
  };

  const { data: signingData, trigger: startDocumentSigning, isMutating } = useDocumentsMutation();
  const {
    data: skippedSigningData,
    trigger: skipDocumentSigning,
    isMutating: skipDocumentSigningMutating,
  } = useCompleteDocumentSigningMutation(currentStep?.id as string);

  useEffect(() => {
    if (onboardingData) {
      setCurrentStep(onboardingData?.steps.find(step => step.id === stepId));
      setSteps(getSortedSteps(onboardingData?.steps));
    }
  }, [onboardingData, stepId]);

  useEffect(() => {
    if (event === 'signing_complete') {
      setIsAlertOpen(true);
      setSigningStatus('completed');
    } else if (docusignFailedStatuses.includes(event as string)) {
      setIsAlertOpen(true);
      setSigningStatus('error');
    } else {
      setSigningStatus('pending');
    }
  }, [event]);

  useEffect(() => {
    setActionButtons([
      {
        label: t('back'),
        onClick: handleBackClick,
        icon: arrowBackIcon,
        isIconPostfix: false,
        isFlat: true,
        isDisabled: false,
      },
      currentStep?.status === 'Completed' || signingStatus === 'completed'
        ? {
            label: t('next'),
            onClick: handleNextClick,
            icon: arrowNextIcon,
            isIconPostfix: true,
            isFlat: false,
          }
        : currentStep?.patientDocument === null
        ? {
            label: t('next'),
            onClick: handleSkipSignDocumentClick,
            icon: arrowNextIcon,
            isIconPostfix: true,
            isFlat: false,
            isDisabled: false,
            isProcessing: skipDocumentSigningMutating,
          }
        : {
            label: t('sign_document'),
            onClick: handleSignDocumentClick,
            icon: pencilIcon,
            isIconPostfix: false,
            isFlat: false,
            isDisabled: false,
            isProcessing: isMutating,
          },
    ]);
  }, [currentStep, signingStatus]);

  useEffect(() => {
    if (!onboardingData || !paymentInfo) return;

    const storageStep = onboardingData.steps.find(
      step => step.type === OnboardingStepType.StoragePlanSelectionStep && step.status === 'Completed'
    );
    if (storageStep && paymentInfo.storagePrice) {
      formProps.setValue('storagePriceId', paymentInfo.storagePrice.id);
    }

    const serviceGuaranteeStep = onboardingData.steps.find(
      step => step.type === OnboardingStepType.ServiceGuaranteeStep && step.status === 'Completed'
    );
    if (serviceGuaranteeStep) {
      formProps.setValue('transferServiceGuaranteeId', paymentInfo.transferServiceGuaranteeId);
    }

    const eppAddonStepCompleted = onboardingData.steps.find(
      step => step.type === OnboardingStepType.EppAddonStep && step.status === 'Completed'
    );
    const eppAddonSteInCompleted = onboardingData.steps.find(
      step => step.type === OnboardingStepType.EppAddonStep && step.status === 'Assigned'
    );
    if (eppAddonStepCompleted) {
      formProps.setValue('extraProtectionProgramId', paymentInfo.extraProtectionProgramId);
    } else if (eppAddonSteInCompleted) {
      const eppId = paymentInfo?.extraProtectionPrograms?.find((item: any) => !!item?.id)?.id;
      formProps?.setValue('extraProtectionProgramId', eppId);
    }
  }, [onboardingData, paymentInfo, formProps]);

  const handleSkipSignDocumentClick = () => {
    skipDocumentSigning();
  };

  const handleSignDocumentClick = () => {
    const mapped: any = {
      patientDocumentId: currentStep?.patientDocument.id,
      callbackUrl: window.location.href,
    };

    startDocumentSigning(mapped);
  };

  useEffect(() => {
    if (signingData && !isMutating) {
      window.location.assign(signingData?.signingUrl);
    }
  }, [signingData, isMutating]);

  useEffect(() => {
    if (skippedSigningData && !skipDocumentSigningMutating) {
      const currentStepIndex = steps.findIndex(step => step.id === currentStep?.id);
      if (currentStep && currentStepIndex !== steps.length - 1) {
        const nextStep = steps[currentStepIndex + 1];
        router.push(`/patient/onboarding/${nextStep?.id}`);
      } else {
        const storagePlanStep = steps.find(step => step.type === OnboardingStepType.StoragePlanSelectionStep);
        if (storagePlanStep) {
          router.push(`/patient/onboarding/${storagePlanStep.id}`);
        }
      }
    }
  }, [skippedSigningData, skipDocumentSigningMutating]);

  const handleNextClick = async () => {
    setIsAlertOpen(false);
    const currentStepIndex = steps.findIndex(step => step.id === currentStep?.id);
    if (currentStep && currentStepIndex !== steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      router.push(`/patient/onboarding/${nextStep?.id}`);
    } else {
      router.push('/patient/onboarding/congrats');
    }
  };

  const handleBackClick = () => {
    setIsAlertOpen(false);
    const currentStepIndex = steps.findIndex(step => step.id === currentStep?.id);
    const prevStep = steps[currentStepIndex - 1];
    if (currentStep && currentStepIndex !== 0) {
      router.push(`/patient/onboarding/${prevStep?.id}`);
    } else {
      router.push(`/patient/onboarding/welcome`);
    }
  };

  const handleClose = () => {
    setIsAlertOpen(false);
  };

  const renderStepContent = () => {
    if (currentStep?.type === OnboardingStepType.DocumentSigningStep) {
      return (
        <OnboardingCard
          key={currentStep.id}
          title={currentStep.name}
          description={currentStep.description}
          videoUrl={currentStep.videoUrl}
          actions={actionButtons}
          showNewWindow={
            currentStep?.patientDocument !== null &&
            currentStep?.status !== 'Completed' &&
            signingStatus !== 'completed' &&
            currentStep.order === 1
          }
          withContacts={!!currentStep?.patientDocument}
          supportContact={onboardingData?.supportContact}
        />
      );
    }

    if (
      currentStep?.type === OnboardingStepType.StoragePlanSelectionStep ||
      currentStep?.type === OnboardingStepType.ServiceGuaranteeStep ||
      currentStep?.type === OnboardingStepType.EppAddonStep
    ) {
      return (
        <FormProvider {...formProps}>
          <PlanPage
            form={formProps}
            onboardingData={onboardingData}
            refetchOnboardingData={refetchOnboardingData}
            paymentInfo={paymentInfo}
            refetchPaymentData={refetchPaymentData}
            isDataLoading={isLoading}
          />
        </FormProvider>
      );
    }

    if (currentStep?.type === OnboardingStepType.PaymentMethodAssignmentStep) {
      return <OnboardingPayment />;
    }

    return <></>;
  };

  // to prevent completed user to go to this page
  if (onboardingData?.status === 'Onboarded') {
    router.push(`/patient/overview`);
  }

  return (
    currentStep && (
      <>
        {isAlertOpen && (
          <div className="absolute top-0 w-full md:top-8">
            <Alert
              variant={signingStatus === 'completed' ? 'success' : 'failure'}
              icon={HiCheckCircle}
              onDismiss={handleClose}
              message={signingStatus === 'completed' ? t('success_status_message') : t('error_status_message')}
            />
          </div>
        )}
        {renderStepContent()}
      </>
    )
  );
}

export default OnboardingStep;

OnboardingStep.getLayout = (page: any) => (
  <OnboardingLayoutWithNoSSR className="lg:!pt-[60px]">{page}</OnboardingLayoutWithNoSSR>
);

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
