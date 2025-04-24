import { Button } from 'flowbite-react';
import { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { toast } from 'react-toastify';

import Image from 'next/image';

import cvc from '@/public/icons/payments/CVC Card.svg';
import diner from '@/public/icons/payments/Diners Club.svg';
import jbc from '@/public/icons/payments/JCB.svg';
import visa from '@/public/icons/payments/Visa.svg';

import am from '@/public/icons/payments/American Express.svg';
import discover from '@/public/icons/payments/Discover.svg';
import master from '@/public/icons/payments/Mastercard.svg';
import union from '@/public/icons/payments/Union Pay.svg';

import { useUser } from '@auth0/nextjs-auth0/client';
import { darkModeCardStyle } from './PatientBiilingFormSquare.styles';

import { PaymentSquareRequest } from '@/types/view/PatientPaymentDateSource.type';
import useTranslation from 'next-translate/useTranslation';

const PatientBillingFormSquare = ({
  btnLabel,
  total,
  handleDone,
  handlePayment,
  isSignupPatient,
  isPaymentCompleted,
}: {
  btnLabel?: string;
  total: number | string | undefined;
  handleDone: () => void;
  handlePayment: ({ paymentMethodToken, verificationToken }: PaymentSquareRequest) => any;
  isSignupPatient?: boolean;
  isPaymentCompleted?: boolean;
}) => {
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('patients');
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID as string;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string;

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error);
  };

  const handleTokenResult = (data: any) => {
    const isSuccess = data?.succeeded;
    if (isSuccess) {
      handleDone();
    } else {
      const errorMessagesArray = data?.errors?.map((error: any) => error);
      if (errorMessagesArray) {
        const allErrorMessages = errorMessagesArray.join(', ');
        handleError(allErrorMessages);
      }
    }
  };

  const handleSubmit = async ({ token, verifiedBuyer }: { token: string; verifiedBuyer: string }) => {
    const response = await handlePayment({ paymentMethodToken: token, verificationToken: verifiedBuyer });
    if (response) {
      handleTokenResult(response?.data);
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      {errorMessage && <div className="mb-2 text-sm">{errorMessage}</div>}

      <PaymentForm
        applicationId={applicationId || ''}
        locationId={locationId || ''}
        cardTokenizeResponseReceived={(token, verifiedBuyer) => {
          if (token.status === 'OK') {
            handleSubmit({ token: token?.token || '', verifiedBuyer: verifiedBuyer?.token || '' });
          } else {
            const errorMessagesArray = token?.errors?.map(error => error.message);
            if (errorMessagesArray) {
              const allErrorMessages = errorMessagesArray.join(', ');
              handleError(allErrorMessages);
            }
          }
        }}
        createVerificationDetails={() => {
          setLoading(true);
          return {
            amount: total ? total?.toString() : undefined,
            currencyCode: 'USD',
            intent: 'STORE',
            billingContact: {
              email: user?.email || '',
            },
          };
        }}>
        <CreditCard
          includeInputLabels
          buttonProps={{
            css: {
              padding: 0,
            },
          }}
          style={darkModeCardStyle}>
          <Button
            type="submit"
            className={'w-full'}
            gradientDuoTone="primary"
            onClick={() => setLoading(true)}
            disabled={loading || isPaymentCompleted}>
            {isSignupPatient ? 'Schedule Payment' : btnLabel || `Pay`}
          </Button>
        </CreditCard>
      </PaymentForm>

      <div className="flex w-full flex-col items-start justify-between gap-[16.82px] pt-4 md:flex-row">
        <div className="flex h-[29.89px] w-[42.97px] items-center justify-center px-[0.38px]">
          <div className="relative h-[29.89px] w-[42.21px]">
            <Image src={jbc} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center p-[0.47px]">
          <div className="relative h-[28.96px] w-[43.91px]">
            <Image src={visa} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[31.76px] w-[44.84px] items-center justify-center">
          <div className="relative h-[31.76px] w-[44.84px]">
            <Image src={cvc} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center px-[0.47px]">
          <div className="relative h-[29.89px] w-[43.91px]">
            <Image src={diner} alt="stripe" />
          </div>
        </div>

        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center">
          <div className="relative h-[29.89px] w-[43.91px]">
            <Image src={discover} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center pb-[0.03px] pr-[1.47px]">
          <div className="relative h-[29.89px] w-[43.91px]">
            <Image src={union} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center">
          <div className="relative h-[29.89px] w-[43.91px]">
            <Image src={am} alt="stripe" />
          </div>
        </div>
        <div className="flex h-[29.89px] w-[44.84px] items-center justify-center">
          <div className="relative h-[29.89px] w-[43.91px]">
            <Image src={master} alt="stripe" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBillingFormSquare;
