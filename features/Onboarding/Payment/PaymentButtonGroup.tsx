import { Button } from "flowbite-react";
import useTranslation from "next-translate/useTranslation";
import { PaymentButtonGroupProps } from "./StoragePlan.types";

export const PaymentButtonGroup: React.FC<PaymentButtonGroupProps> = ({
  payTime,
  setPayTime,
  payNowEnabled,
  schedulePaymentEnabled,
  isSignupPatient,
}) => {
  const { t } = useTranslation('onboarding');

  return isSignupPatient ? (
    <div className="mb-3 flex justify-start bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center">
      <p>Schedule payment</p>
    </div>
  ) : (
    <div className="mb-5">
      {payNowEnabled && schedulePaymentEnabled ? (
        <Button.Group className="w-full">
          <Button
            size="sm"
            className="h-[53px] w-full p-0 ring-0 focus:ring-0"
            gradientDuoTone={payTime === 'now' ? 'primary' : 'inactiveTab'}
            onClick={() => setPayTime('now')}>
            <div>{t('payNowHeader')}</div>
          </Button>

          <Button
            size="sm"
            className="h-[53px] w-full p-0 ring-0 focus:ring-0"
            gradientDuoTone={payTime === 'schedule' ? 'primary' : 'inactiveTab'}
            onClick={() => setPayTime('schedule')}>
            <div>{t('schedulePaymentHeader')}</div>
          </Button>
        </Button.Group>
      ) : (
        <Button
          size="sm"
          className="h-[53px] w-full p-0 ring-0 focus:ring-0"
          gradientDuoTone={'primary'}
          onClick={() => {}}>
          <div>{payNowEnabled ? t('payNowHeader') : t('schedulePaymentHeader')}</div>
        </Button>
      )}
    </div>
  );
};