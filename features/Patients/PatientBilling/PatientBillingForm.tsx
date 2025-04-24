import { useState } from 'react';
import { Button } from 'flowbite-react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import Image from 'next/image';

import jbc from '@/public/icons/payments/JCB.svg';
import visa from '@/public/icons/payments/Visa.svg';
import cvc from '@/public/icons/payments/CVC Card.svg';
import diner from '@/public/icons/payments/Diners Club.svg';

import discover from '@/public/icons/payments/Discover.svg';
import union from '@/public/icons/payments/Union Pay.svg';
import am from '@/public/icons/payments/American Express.svg';
import master from '@/public/icons/payments/Mastercard.svg';

// Todo: This is stripe form, we do not use it, need to delete maybe
const PatientBillingForm = ({ payTime, total, handleDone }: { payTime: any; total: any; handleDone: any }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    if (elements) {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        handleError(submitError);
        return;
      }
    }
    // Trigger form validation and wallet collection

    // Confirm the SetupIntent using the details collected by the Payment Element
    const options = {
      elements,
      redirect: 'if_required',
      confirmParams: {
        // eslint-disable-next-line camelcase
        return_url: window.location.origin + '/onboarding/payment',
      },
    };

    // @ts-ignore
    const { error } = payTime === 'now' ? await stripe.confirmPayment(options) : await stripe.confirmSetup(options);

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the setup. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      handleDone();
    }
  };

  return (
    <div>
      {errorMessage && <div className="mb-2 text-sm">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="h-full max-h-[550px] overflow-scroll">
        <PaymentElement
          options={{
            layout: {
              type: 'tabs',
            },
          }}
        />
      </form>

      <div className="w-full justify-between pt-4">
        <Button
          type="submit"
          className={'w-full'}
          gradientDuoTone="primary"
          onClick={handleSubmit}
          disabled={!stripe || loading}>
          {payTime === 'now' ? `Pay now` : 'Schedule Payment'} - ${total}
        </Button>
      </div>

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

export default PatientBillingForm;
