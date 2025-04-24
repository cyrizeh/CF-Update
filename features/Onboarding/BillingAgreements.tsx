import { SUPPORT_CRYO_EMAIL } from '@/constants/support';
import { PaymentDateSource, PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import useTranslation from 'next-translate/useTranslation';
interface BillingAgreementsProps {
  isPayNow: boolean;
  paymentdateSource: PaymentDateSource;
  isPreTreatment: boolean;
  isSignupPatient: boolean;
  hasSpecimens?: boolean;
}

export const BillingAgreements: React.FC<BillingAgreementsProps> = ({
  isPayNow: payNow,
  paymentdateSource,
  isPreTreatment,
  isSignupPatient,
  hasSpecimens,
}) => {
  return (
    <>
      {payNow ? (
        <PayNowAgreement paymentdateSource={paymentdateSource} />
      ) : (
        <SchedulePaymentAgreement
          paymentdateSource={paymentdateSource}
          isPreTreatment={isPreTreatment}
          isSignupPatient={isSignupPatient}
          hasSpecimens={hasSpecimens}
        />
      )}
    </>
  );
};

const PayNowAgreement: React.FC<{ paymentdateSource: PaymentDateSource }> = ({ paymentdateSource }) => {
  const { t } = useTranslation('onboarding');
  return (
    <>
      <div className="text-4 mb-3 font-light">
        <span>{t('payments.payNow.1stPart')}</span>
        <span className="italic">{t('payments.payNow.2ndPart')}</span>
        <span>{t('payments.payNow.3rdPart')}</span>
        <a href={`mailto: ${SUPPORT_CRYO_EMAIL}`} className="underline underline-offset-2">
          {SUPPORT_CRYO_EMAIL}
        </a>
      </div>
      <div className="text-4 mb-3 font-light">
        <span>{t('payments.payNow.4thPart')}</span>
        <span>
          {paymentdateSource === PaymentDateSourceEnum.SpecimenReceivedDate
            ? t('payments.payNow.payNowspecimenReceived')
            : t('payments.payNow.payNowbillingDate')}
        </span>
        <span>{t('payments.payNow.5thPart')}</span>
      </div>
    </>
  );
};

const SchedulePaymentAgreement: React.FC<{
  paymentdateSource: PaymentDateSource;
  isPreTreatment: boolean;
  isSignupPatient: boolean;
  hasSpecimens?: boolean;
}> = ({ paymentdateSource, isPreTreatment, isSignupPatient, hasSpecimens }) => {
  const { t } = useTranslation('onboarding');
  return (
    <>
      <div className="text-4 mb-3 font-light">
        {isSignupPatient ? (
          <>
            <p>
              {hasSpecimens
                ? t('payments.schedulePayment.isSignupPatientWithSpecimens')
                : t('payments.schedulePayment.isSignupPatientNoSpecimens')}
            </p>
            <br />
          </>
        ) : (
          !!isPreTreatment && (
            <>
              <p>{t('payments.schedulePayment.isPreTreatment')}</p>
              <br />
            </>
          )
        )}

        <span>{t('payments.schedulePayment.1stPart')}</span>
        <span>
          {paymentdateSource === PaymentDateSourceEnum.SpecimenReceivedDate
            ? t('payments.schedulePayment.payNowspecimenReceived1stPart')
            : t('payments.schedulePayment.payNowbillingDate1stPart')}
        </span>
        <span>{t('payments.schedulePayment.2ndPart')}</span>
        <span className="italic">{t('payments.schedulePayment.3rdPart')}</span>
        <span>{t('payments.schedulePayment.4thPart')}</span>
        <a href={`mailto: ${SUPPORT_CRYO_EMAIL}`} className="underline underline-offset-2">
          {SUPPORT_CRYO_EMAIL}
        </a>
      </div>
      {!isSignupPatient && (
        <div className="text-4 mb-3 font-light">
          <span>{t('payments.schedulePayment.6thPart')}</span>
          <span>
            {paymentdateSource !== PaymentDateSourceEnum.SpecimenReceivedDate
              ? t('payments.schedulePayment.payNowspecimenReceived2ndPart')
              : t('payments.schedulePayment.payNowbillingDate2ndPart')}
          </span>
          <span>{t('payments.schedulePayment.7thPart')}</span>
        </div>
      )}
    </>
  );
};
