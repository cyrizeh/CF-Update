import { OnboardingFormValues } from '@/types/view/OnboardingFormValues.type';
import { useFormContext } from 'react-hook-form';
import BillingHeader from './BillingHeader';
import BillingRow from './BillingRow';
import BillingSummary from './BillingSummary';

const BillingTable = ({
  paymentInfoData,
  onSelectPlan,
  selectedPlanPrice,
}: {
  paymentInfoData: any;
  onSelectPlan: any;
  selectedPlanPrice: any;
}) => {
  const { setValue, watch } = useFormContext<OnboardingFormValues>();

  const handleSelectPlan = (storagePriceId: string) => {
    onSelectPlan(storagePriceId, null, null);
    setValue('storagePriceId', storagePriceId);
  };

  return (
    <section className="custom-vertical-scrollbar max-h-[600px] w-full overflow-y-scroll rounded-lg bg-[#1E2021] shadow">
      <BillingHeader criteria={paymentInfoData?.billingCriteria} />
      {paymentInfoData?.clinicStoragePrices.map((billing: any) => (
        <BillingRow
          key={billing?.id}
          billing={billing}
          criteria={paymentInfoData?.billingCriteria}
          isSelected={billing?.id === watch('storagePriceId')}
          onSelect={() => handleSelectPlan(billing?.id)}
        />
      ))}
      {selectedPlanPrice && (
        <BillingSummary
          pricingLines={selectedPlanPrice?.pricingLines}
          amountDue={selectedPlanPrice?.paymentAmount}
          invoiceLines={selectedPlanPrice?.invoiceLines || []}
          discount={paymentInfoData?.discount || null}
        />
      )}
    </section>
  );
};

export default BillingTable;
