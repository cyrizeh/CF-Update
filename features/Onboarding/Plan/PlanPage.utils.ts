import { ApiTypes, ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import check from '@/public/icons/check.svg';
import { OnboardingStepType } from '@/types/view/OnboardingStep.type';

export const getPlanPageActions = ({
  onboardingData,
  currentStep,
  steps,
  router,
  isSignupPatient,
  showPlanSelection,
  handleSubmit,
  handleGetStartedClick,
}: {
  onboardingData: any | undefined;
  currentStep: ViewTypes.OnboardingStep | undefined;
  steps: ViewTypes.OnboardingStep[];
  router: any;
  isSignupPatient: boolean;
  showPlanSelection: boolean;
  handleSubmit: any;
  handleGetStartedClick: (data: any) => void;
}) => {
  const t = useTranslation('onboarding').t;

  return [
    {
      label: t('common:back'),
      onClick: () => {
        const lastStepId = onboardingData?.steps
          ? steps?.find(item => item?.order === Number(currentStep?.order) - 1)?.id
          : null;
        const route = lastStepId ? `/patient/onboarding/${lastStepId}` : `/patient/onboarding/welcome`;
        router.push(route);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
    {
      label: isSignupPatient && !showPlanSelection ? 'Next' : 'Choose & Agree',
      onClick: handleSubmit(handleGetStartedClick),
      icon: isSignupPatient && !showPlanSelection ? arrowNextIcon : check,
      isIconPostfix: isSignupPatient && !showPlanSelection,
      isFlat: false,
    },
  ];
};

export const shouldDisableNextStep = ({
  currentStep,
  formProps,
  isUserAgreedEPP,
  isUserAgrreedTransferGuarantee,
}: {
  currentStep: ViewTypes.OnboardingStep | undefined;
  formProps: any;
  isUserAgrreedTransferGuarantee: boolean;
  isUserAgreedEPP: boolean;
}): boolean | null | undefined => {
  switch (currentStep?.type) {
    case OnboardingStepType.StoragePlanSelectionStep:
      return !formProps.watch('storagePriceId'); // for 1-st step need to watch video and select plan
    case OnboardingStepType.ServiceGuaranteeStep:
      return formProps.watch('transferServiceGuaranteeId') === '' || !isUserAgrreedTransferGuarantee;
    case OnboardingStepType.EppAddonStep:
      return formProps.watch('extraProtectionProgramId') === '' || !isUserAgreedEPP;
    default:
      return null;
  }
};
