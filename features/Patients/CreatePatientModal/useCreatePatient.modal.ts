import { useEffect, useState } from 'react';
import { step1, step2, step3, step4, step5, updatePatient } from './api';
import { formatDate } from '@/utils/formatDate';
import { errorHandler } from '@/utils/errorHandler';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { addUSCountryCodeWithOutPlus } from '@/utils/normalizePhoneNumber';
import { PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import { toPascalCase } from '@/utils/toPascalCase';

const useCreatePatient = (onClose: any, setError: any, setValue: any, patientData: any) => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pathname, query } = useRouter();
  const [patientId, setPatientId] = useState('');
  const maxStep = 5;

  useEffect(() => {
    const id = query?.id as string;
    if ((pathname.includes('/admin/patients/[id]') || pathname.includes('/clinic/patients/[id]')) && id) {
      setPatientId(id);
    }
  }, [pathname, query.id]);

  const stepClick = async (context: any) => {
    setIsLoading(true);
    const { patient, partner, skipPartner, skipEmergency, emergencyInfo, billingInfo, donorInfo } = context;

    const handlePatientCreate = async () => {
      const number = patient.phoneNumber ? addUSCountryCodeWithOutPlus(patient.phoneNumber) : '';
      const address = patient.address?.street1 && patient.address?.street1 !== '' ? patient?.address : null;
      const date = patient.dateOfBirth ? formatDate(new Date(patient.dateOfBirth)) : null;
      const firstNamePatient = patient?.firstName ? toPascalCase(patient?.firstName) : '';
      const middleNamePatient = patient?.middleName ? toPascalCase(patient?.middleName) : '';
      const lastNamePatient = patient?.lastName ? toPascalCase(patient?.lastName) : '';
      try {
        if (patientId) {
          await updatePatient({
            ...patient,
            patientId,
            phoneNumber: number,
            dateOfBirth: date,
            address: address,
            firstName: firstNamePatient,
            middleName: middleNamePatient,
            lastName: lastNamePatient,
          });

          if (patientData?.partner) {
            return setStep(3);
          }
          setStep(2);
        } else {
          const { data } = await step1({
            ...patient,
            phoneNumber: number,
            dateOfBirth: date,
            address: address,
            firstName: firstNamePatient,
            middleName: middleNamePatient,
            lastName: lastNamePatient,
          });
          setPatientId(data.id);
          setStep(2);
        }
      } catch (error: any) {
        errorHandler(error, setError, 'patient');
      } finally {
        setIsLoading(false);
      }
    };

    const handlePartnerCreate = async () => {
      const firstNamePartner = partner?.firstName ? toPascalCase(partner?.firstName) : '';
      const middleNamePartner = partner?.middleName ? toPascalCase(partner?.middleName) : '';
      const lastNamePartner = partner?.lastName ? toPascalCase(partner?.lastName) : '';
      try {
        const data = {
          ...partner,
          patientId,
          phoneNumber: partner.phoneNumber ? addUSCountryCodeWithOutPlus(partner.phoneNumber) : '',
          dateOfBirth: partner.dateOfBirth ? formatDate(new Date(partner.dateOfBirth)) : null,
          firstName: firstNamePartner,
          middleName: middleNamePartner,
          lastName: lastNamePartner,
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
      } finally {
        setIsLoading(false);
      }
    };

    const handleEmergencyInfoCreate = async () => {
      try {
        await step3({ ...emergencyInfo, patientId });

        setStep(4);
      } catch (error: any) {
        errorHandler(error, setError, 'emergencyInfo');
      } finally {
        setIsLoading(false);
      }
    };

    const handleBillingCreate = async () => {
      const billingStartDate = billingInfo.billingStartDate ? formatDate(new Date(billingInfo.billingStartDate)) : null;
      try {
        const data = {
          clinicId: billingInfo.clinicId.id,
          facilityId: billingInfo.facilityId,
          billingStartDate: billingStartDate,
          patientId,
          paymentDateSource: billingInfo.paymentDateSource,
        };

        await step4(data);
        setStep(5);
      } catch (error) {
        errorHandler(error, setError, 'billingInfo');
        // @ts-ignore
        toast.error(error?.response?.data?.errors?.ClinicId[0]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDonorCreate = async () => {
      try {
        await step5({
          ...donorInfo,
          specimenTypes: donorInfo.specimenTypes.map((el: any) => el.value),
          patientId,
          witnessId: donorInfo?.witness?.id || null,
          isPreTreatment: donorInfo?.isPreTreatment || false,
        });

        setStep(1);
        onClose();
        toast.success('Patient created!');
      } catch (error) {
        errorHandler(error, setError, 'donorInfo');
      } finally {
        setIsLoading(false);
      }
    };

    switch (step) {
      case 1:
        await handlePatientCreate();
        break;
      case 2:
        if (skipPartner === 'skip') {
          setStep(3);
          setIsLoading(false);
          break;
        } else {
          await handlePartnerCreate();
          break;
        }
      case 3:
        if (skipEmergency === 'skipEmergency') {
          setStep(4);
          setIsLoading(false);
          break;
        } else {
          await handleEmergencyInfoCreate();
          break;
        }
      case 4:
        await handleBillingCreate();
        break;
      case 5:
        await handleDonorCreate();
        break;
      default:
        setStep(1);
        setIsLoading(false);
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
    isLoading,
  };
};

export default useCreatePatient;
