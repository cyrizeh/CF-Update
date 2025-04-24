import { axiosInstance } from '@/api/axiosConfig';
import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import { useGetPatientInfo } from '@/api/queries/patient.queries';
import { storageOrder } from '@/constants/billing';
import ExtraProtectionPrograms from '@/features/Onboarding/Plan/ExtraProtectionPrograms/ExtraProtectionPrograms';
import ServiceGaranteeStep from '@/features/Onboarding/Plan/StoragePrice/StoragePrices';
import TransferServiceGuarantees from '@/features/Onboarding/Plan/TransferServiceGuarantees/TransferServiceGuarantees';
import { ApiTypes, ViewTypes } from '@/types';
import { OnboardingResponse } from '@/types/api';
import { OnboardingFormValues } from '@/types/view/OnboardingFormValues.type';
import { OnboardingStepType } from '@/types/view/OnboardingStep.type';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import ContactUsPanel from '../ContactUsPanel';
import ActionButton from './ActionButton/ActionButton';
import { getPlanPageActions, shouldDisableNextStep } from './PlanPage.utils';

const getSortedSteps = (steps: ViewTypes.OnboardingStep[]) => {
  return steps.sort((a, b) => a.order - b.order);
};

function PlanPage({
  form,
  onboardingData,
  refetchOnboardingData,
  paymentInfo,
  refetchPaymentData,
  isDataLoading,
}: {
  form: UseFormReturn<OnboardingFormValues, any, undefined>;
  onboardingData: OnboardingResponse | undefined;
  refetchOnboardingData: (data?: OnboardingResponse | undefined) => Promise<OnboardingResponse | undefined>;
  paymentInfo: any;
  refetchPaymentData: any;
  isDataLoading: boolean;
}) {
  const { handleSubmit, ...formProps } = form;
  const router = useRouter();
  const { id: stepId } = router.query;
  //  utils
  const { t } = useTranslation('onboarding');
  // states
  const [isSignupPatient, setIsSignupPatient] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [paymentInfoData, setPaymentInfoData] = useState<ApiTypes.PaymentInfoResponse>();
  const [selectedPlanPrice, setPlanPrice] = useState('');
  const [calcLoading, setCalcLoading] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isUserAgrreedTransferGuarantee, setUserAgrreedTransferGuarantee] = useState(false);
  const [isUserAgreedEPP, setUserAgreedEPP] = useState(false);

  const [currentStep, setCurrentStep] = useState<ViewTypes.OnboardingStep>();
  const [steps, setSteps] = useState<ViewTypes.OnboardingStep[]>([]);
  // apis
  const { data: patient, isLoading: isPatientLoading } = useGetPatientInfo();

  const { updatePatientPlan, eppChoice, updateServiceGuarantee, defaultStoragePlan } = usePatientPaymentMutation();

  // hooks
  useEffect(() => {
    if (onboardingData) {
      setShowPlanSelection(onboardingData.showPlanSelection);
    }
  }, [onboardingData]);

  // check if user is signUp
  useEffect(() => {
    if (patient) {
      setIsSignupPatient(patient?.isSignup);
    }
  }, [patient]);

  useEffect(() => {
    if (paymentInfo) {
      const formatted = {
        ...paymentInfo,
        clinicStoragePrices: paymentInfo.clinicStoragePrices.sort(
          (a: any, b: any) => storageOrder.indexOf(a.storageDuration) - storageOrder.indexOf(b.storageDuration)
        ),
      };

      setPaymentInfoData(formatted);
    }
  }, [paymentInfo]);

  useEffect(() => {
    if (onboardingData) {
      setCurrentStep(onboardingData?.steps.find(step => step.id === stepId));
      setSteps(getSortedSteps(onboardingData?.steps));
    }
  }, [onboardingData, stepId]);

  // Each time the plan step changes, it is necessary to reset the states for disabling the button that navigates to other pages.
  //  This ensures that the patient fulfills all the conditions before being allowed to move to the next page.
  useEffect(() => {
    setIsVideoEnded(false);
    setUserAgreedEPP(false);
    setUserAgrreedTransferGuarantee(false);
  }, [currentStep, stepId]);

  const onSelectPlan = useCallback(
    (clinicStoragePriceId: string | null) => {
      setCalcLoading(true);

      axiosInstance
        .get(
          `/Patients/Payment/Calculate?clinicPlanId=${paymentInfo.clinicPlanId}&clinicStoragePriceId=${clinicStoragePriceId}`
        )
        .then(resp => {
          setTimeout(() => {
            setPlanPrice(resp.data);
            setCalcLoading(false);
          }, 350);
        })
        .catch(() => setCalcLoading(false));
    },
    [paymentInfo?.clinicPlanId]
  );

  const storagePriceId = formProps?.watch('storagePriceId');

  useEffect(() => {
    if (storagePriceId) {
      onSelectPlan(storagePriceId);
    }
  }, [storagePriceId, onSelectPlan]);

  const handleGetStartedClick = (submitData: OnboardingFormValues) => {
    const storageDuration = paymentInfoData?.clinicStoragePrices.find(
      (item: any) => item.id === submitData.storagePriceId
    )?.storageDuration;

    const nextStepId = onboardingData?.steps
      ? steps?.find(item => item?.order === Number(currentStep?.order) + 1)?.id
      : null;
    const route = nextStepId ? `/patient/onboarding/${nextStepId}` : `/patient/onboarding`;
    switch (currentStep?.type) {
      case OnboardingStepType.StoragePlanSelectionStep:
        if (isSignupPatient && !showPlanSelection) {
          defaultStoragePlan
            .trigger({})
            .then(() => {
              router.push(route);
              refetchOnboardingData();
              refetchPaymentData();
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        } else if (formProps.watch('storagePriceId')) {
          updatePatientPlan
            .trigger({
              storageDuration: storageDuration,
              transferServiceGuaranteeId: null,
              extraProtectionProgramId: null,
            })
            .then(() => {
              router.push(route);
              refetchOnboardingData();
              refetchPaymentData();
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        }
        break;

      case OnboardingStepType.ServiceGuaranteeStep:
        if (formProps.watch('transferServiceGuaranteeId') !== '') {
          updateServiceGuarantee
            .trigger({
              transferServiceGuaranteeId: submitData?.transferServiceGuaranteeId || null,
            })
            .then(() => {
              router.push(route);
              refetchOnboardingData();
              refetchPaymentData();
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        }
        break;

      case OnboardingStepType.EppAddonStep:
        if (formProps.watch('extraProtectionProgramId') !== '') {
          eppChoice
            .trigger({
              eppChoice: submitData?.extraProtectionProgramId ? 'Subscribe' : 'OptOut',
            })
            .then(() => {
              router.push(route);
              refetchOnboardingData();
              refetchPaymentData();
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        }
        break;

      default:
        break;
    }
  };

  // action buttons
  const actions = getPlanPageActions({
    onboardingData,
    currentStep,
    steps,
    router,
    isSignupPatient,
    showPlanSelection,
    handleSubmit,
    handleGetStartedClick,
  });

  // Checks whether the next step should be disabled based on the current plan step.
  const disableUserToGoToTheNextStep = useMemo(
    () =>
      shouldDisableNextStep({
        currentStep,
        formProps,
        isUserAgrreedTransferGuarantee,
        isUserAgreedEPP,
      }),
    [currentStep, formProps]
  );

  // content
  const renderStepContent = useMemo(() => {
    switch (currentStep?.type) {
      case OnboardingStepType.StoragePlanSelectionStep:
        return (
          <ServiceGaranteeStep
            onboardingData={onboardingData}
            isSignupPatient={isSignupPatient}
            showPlanSelection={showPlanSelection}
            setIsVideoEnded={setIsVideoEnded}
            handleSubmit={handleSubmit}
            formProps={formProps}
            paymentInfoData={paymentInfoData}
            selectedPlanPrice={selectedPlanPrice}
            onSelectPlan={onSelectPlan}
          />
        );
      case OnboardingStepType.ServiceGuaranteeStep:
        return (
          <TransferServiceGuarantees
            transferServiceGuarantees={paymentInfoData?.transferServiceGuarantees || []}
            agreed={() => {
              setUserAgrreedTransferGuarantee(true);
            }}
            currentStep={currentStep}
          />
        );
      case OnboardingStepType.EppAddonStep:
        return (
          <ExtraProtectionPrograms
            extraProtectionPrograms={paymentInfoData?.extraProtectionPrograms || []}
            agreed={() => {
              setUserAgreedEPP(true);
            }}
            currentStep={currentStep}
          />
        );
      default:
        return null;
    }
  }, [currentStep, paymentInfoData, selectedPlanPrice, onSelectPlan, formProps, t]);

  if (paymentInfo?.canSkipPayment) {
    router.push(`/patient/onboarding/congrats`);
  }

  // to prevent completed user to go to this page
  if (onboardingData?.status === 'Onboarded') {
    router.push(`/patient/overview`);
  }

  // Determine if the current step requires the agreement message
  const requiresAgreementMessage =
    (currentStep?.type === OnboardingStepType.ServiceGuaranteeStep && !isUserAgrreedTransferGuarantee) ||
    (currentStep?.type === OnboardingStepType.EppAddonStep && !isUserAgreedEPP);

  if (isDataLoading || isPatientLoading) {
    return (
      <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-lg bg-black/10 text-base font-normal	text-white backdrop-blur-sm">
        <div className="mb-[100px] flex items-center justify-center gap-2">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (
    paymentInfo &&
    paymentInfoData &&
    onboardingData &&
    !paymentInfo?.canSkipPayment &&
    onboardingData?.status !== 'Onboarded'
  )
    return (
      <div>
        <div className="grid grid-cols-1 gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:px-8 md:py-8 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50">
          {calcLoading && (
            <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
              <div className="mb-[100px] flex items-center justify-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
              </div>
            </div>
          )}
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            {renderStepContent}
          </FormProvider>
          <div className="order-last  flex flex-col">
            <div className="flex flex-row items-start justify-between">
              {actions?.map((action, index) => {
                // Check if this is the second button
                const isSecondButton = index === 1;

                return (
                  <div key={index + action.label} className="flex flex-row gap-10">
                    {isSecondButton && requiresAgreementMessage && (
                      <p className="hidden text-sm text-gray-600 md:flex md:items-center dark:text-gray-400">
                        To continue, please read the entire agreement.
                      </p>
                    )}
                    <ActionButton
                      action={action}
                      isSignupPatient={isSignupPatient}
                      showPlanSelection={showPlanSelection}
                      disableUserToGoToTheNextStep={disableUserToGoToTheNextStep}
                      index={index}
                    />
                  </div>
                );
              })}
            </div>
            {requiresAgreementMessage && (
              <p className="mt-2 flex justify-center text-sm text-gray-600 md:mt-0 md:hidden md:items-center dark:text-gray-400">
                To continue, please read the entire agreement.
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full justify-end">
          <ContactUsPanel />
        </div>
      </div>
    );
}

export default PlanPage;
