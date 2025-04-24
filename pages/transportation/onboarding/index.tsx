// @ts-nocheck
import { useGetPartnerTransportations, useGetTransportations } from '@/api/queries/patient.queries';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { Payer } from '@/types/view/Payer.enum';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function OnboardingPage() {
  const router = useRouter();
  const [partnerTransportations, setPartnerTransportations] = useState<any[] | null>(null);
  const [currentPatientTransportation, setCurrentPatientTransportation] = useState<any>(null);

  const { data: patientData, isLoading } = useGetTransportations();

  const { data: partnerData, isLoading: partnerDataLoading } = useGetPartnerTransportations();

  useEffect(() => {
    if (patientData?.items?.length > 0) {
      setCurrentPatientTransportation(
        patientData.items.find(
          (item: any) =>
            item.documentStatus === 'DocumentSigning' ||
            (item.paymentStatus === 'Unpaid' && item.payer === Payer.Patient)
        )
      );
    }
  }, [patientData]);

  useEffect(() => {
    setPartnerTransportations(partnerData?.items);
  }, [partnerData]);

  if (isLoading || partnerDataLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  } else {
    if (partnerTransportations && partnerTransportations.length > 0) {
      const currentPartnerTransportation = partnerTransportations?.find(
        (item: any) => item.documentStatus === 'DocumentSigning'
      );
      const id = currentPartnerTransportation?.transportationRequestId;
      if (currentPartnerTransportation && id) {
        router.push(`/transportation/onboarding/confirm-details/${id}`);
        return;
      } else if (!currentPatientTransportation) {
        router.push(`/transportation/overview`);
        return;
      }
    }
    if (currentPatientTransportation) {
      const { transportationRequestId: id, documentStatus, paymentStatus, payer } = currentPatientTransportation;

      if (documentStatus === 'DocumentSigning' && id) {
        router.push(`/transportation/onboarding/confirm-details/${id}`);
        return;
      } else if (paymentStatus === 'Unpaid') {
        router.push(
          payer === Payer.Patient ? `/transportation/onboarding/payment` : `/transportation/onboarding/noPayment`
        );
        return;
      } else {
        router.push(`/transportation/overview`);
        return;
      }
    } else if (patientData) {
      router.push(`/transportation/overview`);
      return;
    }
  }
}

OnboardingPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default OnboardingPage;
