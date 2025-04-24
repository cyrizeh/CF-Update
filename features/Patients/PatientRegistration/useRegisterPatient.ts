/* eslint-disable no-case-declarations */
import {  useState } from 'react';
import { completeSignup, step1, step2, step3, updatePatient } from './api';
import { formatDate } from '@/utils/formatDate';
import { errorHandler } from '@/utils/errorHandler';
import router from 'next/router';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';

const useRegisterPatient = ( setError: any, setValue: any, refetchOnboardingData:any, refetchPatient: any) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientId, setPatientId] = useState('');
  const maxStep = 3;

  const stepClick = async (context: any) => {
    const { patient, partner, skipPartner, skipEmergency, emergencyInfo, billingInfo, donorInfo, hasPartner } = context;

    const handlePatientCreate = async () => {
      const number = patient.phoneNumber ? addUSCountryCodeWithOutPlus(patient.phoneNumber) : '';
      const address = patient.address?.street1 && patient.address?.street1 !== '' ? patient?.address : null;
      const date = patient.dateOfBirth ? formatDate(new Date(patient.dateOfBirth)) : null;
      try {
        if (patientId) {
          await updatePatient({
            ...patient,
            patientId,
            phoneNumber: number,
            dateOfBirth: date,
            address: address,
            hasPartner: hasPartner,
            
          });
        } else {
          const { data } = await step1({
            ...patient,
            phoneNumber: number,
            dateOfBirth: date,
            address: address,
            hasPartner: hasPartner,
          });
          setPatientId(data.id);
          refetchPatient?.();
        }
        if (skipPartner) {
          
          return setStep(3);
        } else {
          return setStep(2);
        }
      } catch (error: any) {
        errorHandler(error, setError, 'patient');
      }
    };

    const handlePartnerCreate = async () => {
      try {
        const data = {
          ...partner,
          patientId,
          phoneNumber: partner.phoneNumber ? addUSCountryCodeWithOutPlus(partner.phoneNumber) : '',
          dateOfBirth: partner.dateOfBirth ? formatDate(new Date(partner.dateOfBirth)) : null,
        };

        setValue('partner.temp.address.city', data?.address?.city || '');
        setValue('partner.temp.address.state', data?.address?.state || '');
        setValue('partner.temp.address.street1', data?.address?.street1 || '');
        setValue('partner.temp.address.street2', data?.address?.street2 || '');
        setValue('partner.temp.address.zipCode', data?.address?.zipCode || '');

        await step2(data);

        setStep(3);
      } catch (error: any) {
        errorHandler(error, setError, 'partner');
      }
    };

    const handleEmergencyInfoCreate = async () => {
      setIsSubmitting(true);
      try {
        await step3({ ...emergencyInfo, patientId });
        refetchOnboardingData(undefined, { revalidate: true });
        return router.push('/patient/onboarding/welcome');
      } catch (error: any) {
        errorHandler(error, setError, 'emergencyInfo');
        setIsSubmitting(false);
      }
    };

    const handleCompleteSignup = async () => {
      setIsSubmitting(true);
      try {
        await completeSignup();
        refetchOnboardingData(undefined, { revalidate: true });
        return router.push('/patient/onboarding/welcome');
      } catch (error: any) {
        errorHandler(error, setError, 'completeSignup');
        setIsSubmitting(false);
      }
    };

    switch (step) {
      case 1:
        handlePatientCreate();
        break;
      case 2:
          handlePartnerCreate();
          break;
      case 3:
        if (skipEmergency === 'skipEmergency') {
          handleCompleteSignup();
          break;
        } else {
          handleEmergencyInfoCreate();
          break;
        }
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
    setPatientId,
    isSubmitting,
  };
};

export default useRegisterPatient;
