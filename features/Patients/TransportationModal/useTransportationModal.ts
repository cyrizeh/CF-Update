import { ViewTypes } from '@/types';
import { TransportationFormPatient, TransportationFormValues } from '@/types/view';
import { errorHandler } from '@/utils/errorHandler';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { step1, step1Edit, Step1RequestData, step2, step2Edit, step3, step4 } from './api';
import { toPascalCase } from '@/utils/toPascalCase';

const useTransportationModal = (
  onClose: any,
  setError: any,
  step: any,
  setStep: any,
  setFormValue?: UseFormSetValue<TransportationFormValues>,
  requestId?: string,
  skipPartner?: boolean,
  setShouldRecalculatePrice?: any,
  transportationPartnerId?: string | null
) => {
  const maxStep = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transportationRequestId, setTransportationRequestId] = useState('');
  const [editPartner, setEditPartner] = useState<boolean>(false);

  useEffect(() => {
    if (requestId) {
      setTransportationRequestId(requestId);
    }
  }, [requestId]);

  const stepClick = async (context: ViewTypes.TransportationFormValues) => {
    const { transportation, partner, shipment, clinicInfo } = context;

    const createTransportationPatient = async () => {
      if (!transportation || isSubmitting) return;
      setIsSubmitting(true);
      try {
        const firstNamePatient = transportation?.firstName ? toPascalCase(transportation?.firstName) : '';
        const lastNamePatient = transportation?.lastName ? toPascalCase(transportation?.lastName) : '';

        if (transportationRequestId) {
          await step1Edit({
            ...transportation,
            phoneNumber: addUSCountryCodeWithOutPlus(transportation.phoneNumber),
            patientId: transportation?.patientId || '',
            transportationRequestId,
            firstName: firstNamePatient,
            lastName: lastNamePatient,
          });
        } else {
          const { data } = await step1(
            mapToStep1RequestData({
              ...transportation,
              phoneNumber: addUSCountryCodeWithOutPlus(transportation.phoneNumber),
              ...(transportation?.patientId && { patientId: transportation?.patientId || '' }),
              firstName: firstNamePatient,
              lastName: lastNamePatient,
            })
          );
          setTransportationRequestId(data.id);
          setFormValue?.('transportation.patientId', data.partnerId);
        }

        skipPartner ? setStep(3) : setStep(2);
        
      } catch (error: any) {
        errorHandler(error, setError, 'transportation');
      } finally {
        setIsSubmitting(false);
      }
    };

    const addPartnerInfo = async () => {
      if (!partner || !transportation || isSubmitting) return;
      setIsSubmitting(true);

      try {
        const { email, firstName, lastName, phoneNumber, partnerId, isAutocomplete } = partner;
        const firstNamePatient = firstName ? toPascalCase(firstName) : '';
        const lastNamePatient = lastName ? toPascalCase(lastName) : '';
        if ((partnerId && transportationPartnerId) || editPartner) {
          await step2Edit({
            email,
            transportationRequestId,
            phoneNumber:  addUSCountryCodeWithOutPlus(phoneNumber),
            firstName: firstNamePatient,
            lastName: lastNamePatient,
          });
        } else {
          const { data } = await step2(
            {
              email: email,
              lastName: lastNamePatient,
              firstName: firstNamePatient,
              phoneNumber: phoneNumber,
              patientId: partnerId || null,
              transportationRequestId: transportationRequestId,
            },
            transportationRequestId
          );
          setFormValue?.('partner.isAutocomplete', false);
          setFormValue?.('partner.partnerId', data.id);
          setEditPartner(true);
        }

        setStep(3);
      } catch (error: any) {
        errorHandler(error, setError, 'partner');
      } finally {
        setIsSubmitting(false);
      }
    };

    const addClinicInfo = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const { distance } = clinicInfo;

        await step3(
          {
            cryoToSending: distance?.cryoToSending || 0,
            recievingToCryo: distance?.recievingToCryo || 0,
            sendingToRecieving: distance?.sendingToRecieving || 0,
            transportationRequestId: transportationRequestId,
          },
          transportationRequestId
        );

        setStep(4);
      } catch (error: any) {
        errorHandler(error, setError, 'clinicInfo');
      } finally {
        setIsSubmitting(false);
      }
    };

    const addShipmentInfo = async () => {
      if (!shipment || isSubmitting) return;
      setIsSubmitting(true);
      try {
        const { typeOfSpecimen, payer, requestingClinic, expeditedDelivery, expeditedPrice, witness } = shipment;
        await step4(
          {
            specimenTypes: typeOfSpecimen?.map((item: { value: string }) => item.value),
            requestingClinicId: requestingClinic?.id || '',
            payer: payer,
            expeditedDelivery: expeditedDelivery,
            expeditedPrice: Number(expeditedPrice),
            witnessId: witness?.id
          },
          transportationRequestId
        );

        setShouldRecalculatePrice(false);

        setStep(1);
        onClose();
      } catch (error: any) {
        errorHandler(error, setError, 'shipment');
      } finally {
        setIsSubmitting(false);
        setEditPartner(false);
      }
    };

    switch (step) {
      case 1:
        createTransportationPatient();
        break;
      case 2:
        addPartnerInfo();
        break;
      case 3:
        addClinicInfo();
        break;
      case 4:
        addShipmentInfo();
        break;
      default:
        setStep(1);
    }
  };

  const isLastStep = step === maxStep;

  return {
    step,
    setStep,
    maxStep,
    stepClick,
    isLastStep,
    setTransportationRequestId,
    isSubmitting,
    transportationRequestId,
  };
};

export default useTransportationModal;

const mapToStep1RequestData = (patient: TransportationFormPatient): Step1RequestData => {
  return {
    ...(patient.patientId && { patientId: patient.patientId }),
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    note: patient.note,
    phoneNumber: patient.phoneNumber,
    hasPartner: patient.hasPartner,
  };
};
