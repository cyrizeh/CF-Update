import ServicePrices from '@/pages/patient/onboarding/ServicePrices';
import { renderDescription } from '@/utils/renderDescription';
import useTranslation from 'next-translate/useTranslation';
import { FormProvider } from 'react-hook-form';
import ReactPlayer from 'react-player';
import BillingTable from './BillingTable/BillingTable';

const ServiceGaranteeStep = ({
  onboardingData,
  isSignupPatient,
  showPlanSelection,
  setIsVideoEnded,
  handleSubmit,
  formProps,
  paymentInfoData,
  selectedPlanPrice,
  onSelectPlan,
}: {
  onboardingData: any;
  isSignupPatient: boolean;
  showPlanSelection: boolean;
  setIsVideoEnded: (ended: boolean) => void;
  handleSubmit: any;
  formProps: any;
  paymentInfoData: any;
  selectedPlanPrice: string;
  onSelectPlan: (
    clinicStoragePriceId: string | null,
    extraProtectionProgramId: string | null,
    transferServiceGuaranteeId: string | null
  ) => void;
}) => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid grid-cols-1 gap-8 rounded-lg px-4 text-base font-normal md:grid-cols-2">
      <div className="max-w-[433px]">
        <div className="mb-3 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center">
          {onboardingData.paymentScreen?.title}
        </div>

        {isSignupPatient && !showPlanSelection ? (
          <div className="text-4 mb-3 font-light">{renderDescription(onboardingData.paymentScreen?.description)}</div>
        ) : (
          <>
            <div className="text-4 font-light">{renderDescription(onboardingData.paymentScreen?.description)}</div>
            <div className="relative max-h-[434px] max-w-[747px]">
              <ReactPlayer
                controls
                playsinline
                url={`${onboardingData.paymentScreen?.videoUrl}`}
                width="100%"
                onEnded={() => {
                  setIsVideoEnded(true);
                }}
                height={320}
              />
            </div>
          </>
        )}
      </div>

      <div className="md:row-span-2">
        <div className="relative w-full max-w-[666px]">
          {isSignupPatient && !showPlanSelection ? (
            <ServicePrices />
          ) : (
            <FormProvider handleSubmit={handleSubmit} {...formProps}>
              <BillingTable
                paymentInfoData={paymentInfoData}
                selectedPlanPrice={selectedPlanPrice}
                onSelectPlan={onSelectPlan}
              />
            </FormProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceGaranteeStep;
