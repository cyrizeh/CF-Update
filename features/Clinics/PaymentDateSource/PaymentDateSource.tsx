import useClinicMutation from '@/api/mutations/useClinicMutation';
import { ViewTypes } from '@/types';
import { PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import { Label, Radio } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentDateSourceRadioGroup = ({
  clinic,
  updateClinics,
}: {
  clinic: ViewTypes.Clinic;
  updateClinics: (data?: any) => Promise<any | undefined>;
}) => {
  const { t } = useTranslation('patients');
  const [paymentDateSource, setPaymentDateSource] = useState(clinic.onboardingConfiguration?.paymentDateSource || '');

  const { updatepaymentDateSource } = useClinicMutation();

  const onChangepaymentDateSource = (dateSource: string) => {
    updatepaymentDateSource({ clinicId: clinic.id as string, paymentDateSource: dateSource })
      .then(() => {
        // @ts-ignore
        setPaymentDateSource(dateSource);
        updateClinics({
          ...clinic,
          onboardingConfiguration: { ...clinic.onboardingConfiguration, paymentDateSource: dateSource },
        });
        toast.success('Payment date source updated successfully');
      })
      .catch(() => {
        toast.error('Error while updating clinic');
      });
  };

  return (
    <div className="flex flex-col gap-2 rounded-md bg-[#1E2021] p-8" data-testid="payment-date-source-group">
      <div className="mb-2 flex w-full justify-between" data-testid="payment-date-source-header">
        <div>
          <div className="text-2xl font-normal text-white">{t('step4.paymentDateSource')}</div>
        </div>
      </div>
      <Label
        htmlFor="specimenReceivedDate"
        className="flex items-center gap-2 pl-1"
        data-testid="payment-date-source-specimen-label">
        <Radio
          id="specimenReceivedDate"
          name="specimenReceivedDate"
          checked={paymentDateSource === PaymentDateSourceEnum.SpecimenReceivedDate}
          onClick={() => {
            onChangepaymentDateSource(PaymentDateSourceEnum.SpecimenReceivedDate);
          }}
          data-testid="payment-date-source-specimen-radio"
        />
        {t('step4.specimenReceivedDate')}
      </Label>

      <Label
        htmlFor="billingStartDate"
        className="flex items-center gap-2 pl-1"
        data-testid="payment-date-source-billing-label">
        <Radio
          id="billingStartDate"
          name="billingStartDate"
          checked={paymentDateSource === PaymentDateSourceEnum.BillingStartDate}
          onClick={() => onChangepaymentDateSource(PaymentDateSourceEnum.BillingStartDate)}
          data-testid="payment-date-source-billing-radio"
        />
        {t('step4.billingStartDate')}
      </Label>
    </div>
  );
};

export default PaymentDateSourceRadioGroup;
