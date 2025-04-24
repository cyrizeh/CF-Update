import { useRef, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import Image from 'next/image';

import { axiosPatient } from '@/api/queries/patient.queries';

import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';

const PatientBillingModal = ({ isOpen, setIsOpen }: ViewTypes.PatientBillingModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

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

    // Create the SetupIntent and obtain clientSecret
    const response = await axiosPatient(`/paymentMethod`, 'POST');

    const { clientSecret } = await response.data;

    // Confirm the SetupIntent using the details collected by the Payment Element
    const { error } = await stripe.confirmSetup({
      // @ts-ignore
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'https://cryofuture-dev.azurewebsites.net/patient/billing',
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the setup. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={setIsOpen}>
        <div className="flex items-center justify-between p-5">
          <div className="" />

          <div className="text-3xl font-light">Stripe</div>

          <div className="cursor-pointer" onClick={setIsOpen}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          {errorMessage && <div className="mb-2 text-sm">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="h-full max-h-[550px] overflow-scroll">
            <PaymentElement
              options={{
                layout: {
                  type: 'accordion',
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: false,
                },
              }}
            />
          </form>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={setIsOpen}>
            Cancel
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit} disabled={!stripe || loading}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientBillingModal;
