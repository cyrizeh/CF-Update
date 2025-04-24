import { axiosInstance } from '@/api/axiosConfig';
import { axios, useGetTransportationInfo } from '@/api/queries/transportation.queries';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import { ClinicAddress } from '@/types/view/Clinic.interface';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Label, Spinner } from 'flowbite-react';
import _, { isEmpty } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

const formatContacts = (contactsReceiving: any) => {
  if (!contactsReceiving) {
    return 'N/A';
  }

  const { firstName, lastName, jobTitle } = contactsReceiving;
  const name = [firstName, lastName].filter(Boolean).join(' ').trim() || 'N/A';
  const title = jobTitle ? jobTitle.trim() : 'N/A';

  return `${name}, ${title}`;
};
const ClinicInfo = ({
  currentStep,
  requestId,
  transportationInfo,
  setShouldRecalculatePrice,
}: {
  currentStep: number;
  requestId?: string;
  transportationInfo: any;
  setShouldRecalculatePrice: any;
}) => {
  const { t } = useTranslation('transportation');

  const [sendingAddress, setSendingAddress] = useState<any>({});
  const [receivingAddress, setReceivingAddress] = useState<any>({});
  const [contactsReceiving, setContactsReceiving] = useState<any>({});
  const [contactsSending, setContactsSending] = useState<any>({});

  const {
    control,
    setValue,
    watch,
    formState: {
      errors: { clinicInfo: errors },
    },
    trigger,
  } = useFormContext<ViewTypes.TransportationFormValues>();

  const selectedFacility = watch('clinicInfo.facility');
  const selectedSendingClinic = watch('clinicInfo.sending.clinic');
  const selectedReceivingClinic = watch('clinicInfo.receiving.clinic');
  const isEditable = !!selectedFacility && !!selectedSendingClinic?.id && !!selectedReceivingClinic?.id;

  const distanceCryoToSending = watch('clinicInfo.distance.cryoToSending');
  const distanceSendingToRecieving = watch('clinicInfo.distance.sendingToRecieving');
  const distanceRecievingToCryo = watch('clinicInfo.distance.recievingToCryo');

  // Calculate the total distance using useMemo to prevent recalculations on every render
  const totalDistance = useMemo(
    () => (distanceCryoToSending || 0) + (distanceSendingToRecieving || 0) + (distanceRecievingToCryo || 0),
    [distanceCryoToSending, distanceSendingToRecieving, distanceRecievingToCryo]
  );

  function formatAddress(address: ClinicAddress): string {
    if (!address) return '';
    const { street1, street2, city, state, zipCode } = address;
    const parts = [street1, street2, city, state, zipCode].filter(part => !!part);

    return parts.join(', ');
  }

  useEffect(() => {
    const sendingClinic = watch('clinicInfo.sending.clinic');

    const fetchClinicAddress = async () => {
      if (!sendingClinic || !sendingClinic?.id) {
        setSendingAddress({});
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/Clinics/${sendingClinic?.id}/address`);
        if (data?.address) {
          setValue('clinicInfo.sending.address.address1', data.address?.street1 || '');
          setValue('clinicInfo.sending.address.address2', data.address?.street2 || '');
          setValue('clinicInfo.sending.address.state', data.address?.state || '');
          setValue('clinicInfo.sending.address.city', data.address?.city || '');
          setValue('clinicInfo.sending.address.zipCode', data.address?.zipCode || '');
          setSendingAddress(data.address);
        } else {
          setValue('clinicInfo.sending.address', null);
        }
        if (data?.contactDetails) {
          setContactsSending(data.contactDetails);
        }
      } catch (error) {
        toast.error('Error fetching clinic info');
      }
      // trigger validation
      trigger('clinicInfo.sending.clinic');
    };

    fetchClinicAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, watch('clinicInfo.sending.clinic'), currentStep]);

  useEffect(() => {
    const receivingClinic = watch('clinicInfo.receiving.clinic');

    const fetchClinicAddress = async () => {
      if (!receivingClinic || !receivingClinic?.id) {
        setReceivingAddress({});
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/Clinics/${receivingClinic?.id}/address`);

        if (data?.address) {
          setValue('clinicInfo.receiving.address.address1', data.address?.street1 || '');
          setValue('clinicInfo.receiving.address.address2', data.address?.street2 || '');
          setValue('clinicInfo.receiving.address.state', data.address?.state || '');
          setValue('clinicInfo.receiving.address.city', data.address?.city || '');
          setValue('clinicInfo.receiving.address.zipCode', data.address?.zipCode || '');
          setReceivingAddress(data.address);
        } else {
          setValue('clinicInfo.receiving.address', null);
        }
        if (data?.contactDetails) {
          setContactsReceiving(data.contactDetails);
        }
      } catch (error) {
        toast.error('Error fetching clinic info');
      }

      // trigger validation
      trigger('clinicInfo.receiving.clinic');
    };

    fetchClinicAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, watch('clinicInfo.receiving.clinic'), currentStep]);

  const columnTitles = [
    { key: 'description', title: 'Description' },
    { key: 'miles', title: 'Miles' },
  ];

  // Update sending clinic address
  const updateSendingClinic = async () => {
    const sendingClinicId = watch('clinicInfo.sending.clinic')?.id;
    if (sendingClinicId) {
      setValue('clinicInfo.sending.address.isValid', true);
      try {
        await axios(`/${requestId}/SendingClinic`, 'PUT', {
          clinicId: sendingClinicId,
          transportationRequestId: requestId,
        });
        if (
          watch('clinicInfo.facility.id') &&
          watch('clinicInfo.sending.clinic.id') &&
          watch('clinicInfo.receiving.clinic.id')
        ) {
          handleDistanceChange();
        }
      } catch (error: any) {
        if (
          error?.response?.data?.detail.includes('Locations must be valid') ||
          error?.response?.data?.detail.includes('No route found')
        ) {
          toast.error(error?.response?.data?.detail);
        } else {
          handleBackendErrors(error?.response?.data?.errors);
          setValue('clinicInfo.sending.address.isValid', false);
        }
      }
    } else {
      // if we delete clinic we clean a table
      setValue('clinicInfo.distance.cryoToSending', 0);
      setValue('clinicInfo.distance.sendingToRecieving', 0);
      setValue('clinicInfo.distance.recievingToCryo', 0);
    }
  };

  // Update receiving clinic address
  const updateReceivingClinic = async () => {
    const receivingClinicId = watch('clinicInfo.receiving.clinic')?.id;
    if (receivingClinicId) {
      setValue('clinicInfo.receiving.address.isValid', true);
      try {
        await axios(`/${requestId}/ReceivingClinic`, 'PUT', {
          clinicId: receivingClinicId,
          transportationRequestId: requestId,
        });
        if (
          watch('clinicInfo.facility.id') &&
          watch('clinicInfo.sending.clinic.id') &&
          watch('clinicInfo.receiving.clinic.id')
        ) {
          handleDistanceChange();
        }
      } catch (error: any) {
        if (
          error?.response?.data?.detail.includes('Locations must be valid') ||
          error?.response?.data?.detail.includes('No route found')
        ) {
          toast.error(error?.response?.data?.detail);
        } else {
          handleBackendErrors(error?.response?.data?.errors);
          setValue('clinicInfo.receiving.address.isValid', false);
        }
      }
    } else {
      // if we delete clinic we clean a table
      setValue('clinicInfo.distance.cryoToSending', 0);
      setValue('clinicInfo.distance.sendingToRecieving', 0);
      setValue('clinicInfo.distance.recievingToCryo', 0);
    }
  };
  // Handle facility and clinic selection
  const handleFacilityChange = async () => {
    const facilityId = watch('clinicInfo.facility')?.id;

    if (facilityId) {
      await axios(`/${requestId}/Facility`, 'PUT', {
        facilityId,
        transportationRequestId: requestId,
      });

      if (
        watch('clinicInfo.facility.id') &&
        watch('clinicInfo.sending.clinic.id') &&
        watch('clinicInfo.receiving.clinic.id')
      ) {
        handleDistanceChange();
      }
    } else {
      // if we delete facility we clean a table
      setValue('clinicInfo.distance.cryoToSending', 0);
      setValue('clinicInfo.distance.sendingToRecieving', 0);
      setValue('clinicInfo.distance.recievingToCryo', 0);
    }
  };

  // Handle distance and clinic selection
  const handleDistanceChange = async () => {
    const response = await axios(`/${requestId}`, 'GET');
    // Extract prices from the response
    const { cryoToSending, sendingToRecieving, recievingToCryo } = response.data;
    setValue('clinicInfo.distance.cryoToSending', cryoToSending);
    setValue('clinicInfo.distance.sendingToRecieving', sendingToRecieving);
    setValue('clinicInfo.distance.recievingToCryo', recievingToCryo);
    setShouldRecalculatePrice(true);
  };

  // Fetch transportation info and set initial values
  useEffect(() => {
    if (transportationInfo && !isEmpty(transportationInfo)) {
      setValue('clinicInfo.facility', {
        id: transportationInfo?.facilityId || '',
        name: transportationInfo?.facilityName || '',
      });
      setValue('clinicInfo.sending.clinic', {
        id: transportationInfo?.sendingClinic?.id || '',
        name: transportationInfo?.sendingClinic?.name || '',
      });
      setValue('clinicInfo.receiving.clinic', {
        id: transportationInfo?.receivingClinic?.id || '',
        name: transportationInfo?.receivingClinic?.name || '',
      });

      setValue('clinicInfo.distance.cryoToSending', transportationInfo?.cryoToSending);
      setValue('clinicInfo.distance.sendingToRecieving', transportationInfo?.sendingToRecieving);
      setValue('clinicInfo.distance.recievingToCryo', transportationInfo?.recievingToCryo);
    }
  }, [setValue, transportationInfo]);

  // Update addresses and handle API calls when clinics change
  useEffect(() => {
    // To prevent request when it is Edit Mode and step is 1
    if (currentStep === 3) {
      handleFacilityChange();
    }
  }, [watch('clinicInfo.facility')]);

  // Update addresses and handle API calls when clinics change
  useEffect(() => {
    if (currentStep === 3) {
      updateSendingClinic();
    }
  }, [watch('clinicInfo.sending.clinic.id')]);

  useEffect(() => {
    if (currentStep === 3) {
      updateReceivingClinic();
    }
  }, [watch('clinicInfo.receiving.clinic.id')]);

  return currentStep === 3 ? (
    <div className="flex flex-col ">
      <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('clinicInfo.title')}</p>
      <Label className="mt-2 text-sm font-normal">{`${t('clinicInfo.facility')} *`}</Label>
      <ErrorValidationMessage touched={errors?.facility} message={errors?.facility?.message}>
        <Autocomplete2
          defaultValue={watch('clinicInfo.facility')}
          url="/facilities"
          control={control}
          error={errors?.facility}
          name="clinicInfo.facility"
          placeholder={`${t('clinicInfo.facilityName')} *`}
          isPrefilled
        />
      </ErrorValidationMessage>
      <Label className="mt-2 text-sm font-normal">{`${t('clinicInfo.sendingClinic')} *`}</Label>
      <ErrorValidationMessage touched={errors?.sending?.clinic} message={errors?.sending?.clinic?.message}>
        <Autocomplete2
          defaultValue={watch('clinicInfo.sending.clinic')}
          url="/clinics"
          params={{
            Status: 'Created',
          }}
          control={control}
          name="clinicInfo.sending.clinic"
          error={errors?.sending}
          placeholder={`${t('sending.clinic')} *`}
          isPrefilled
        />
      </ErrorValidationMessage>
      {!_.isEmpty(sendingAddress) && (
        <div className="mb-4  mt-2 flex flex-col gap-2 text-sm font-normal leading-[21px] text-gray-50">
          <p>Address: {sendingAddress ? formatAddress(sendingAddress) : 'N/A'}</p>
          <p>Primary Contact: {formatContacts(contactsSending)}</p>
        </div>
      )}

      <Label className=" mt-2 text-sm font-normal">{t('clinicInfo.receivingClinic') + ' *'}</Label>
      <ErrorValidationMessage touched={errors?.receiving?.clinic} message={errors?.receiving?.clinic?.message}>
        <Autocomplete2
          defaultValue={watch('clinicInfo.receiving.clinic')}
          url="/clinics"
          params={{
            Status: 'Created',
          }}
          control={control}
          name="clinicInfo.receiving.clinic"
          error={errors?.receiving?.clinic}
          placeholder={`${t('sending.clinic')} *`}
          isPrefilled
        />
      </ErrorValidationMessage>
      {!_.isEmpty(receivingAddress) && (
        <div className="mb-4  mt-2 flex flex-col gap-2 text-sm font-normal leading-[21px] text-gray-50">
          <p>Address: {receivingAddress ? formatAddress(receivingAddress) : 'N/A'}</p>
          <p>Primary Contact: {formatContacts(contactsReceiving)}</p>
        </div>
      )}
      <ErrorValidationMessage
        touched={
          errors?.distance?.cryoToSending || errors?.distance?.recievingToCryo || errors?.distance?.sendingToRecieving
        }
        message={
          errors?.distance?.cryoToSending?.message ||
          errors?.distance?.recievingToCryo?.message ||
          errors?.distance?.sendingToRecieving?.message
        }></ErrorValidationMessage>
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2 bg-[#292B2C]">
          {columnTitles.map(column => (
            <div key={column.key} className="p-2 text-sm font-normal uppercase leading-[21px] text-white">
              {column.title}
            </div>
          ))}
        </div>

        <div className="my-1 grid grid-cols-2 items-center gap-2 border-b border-neutral-700">
          <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{'CF -> Sending'}</div>

          <TextInput
            value={watch('clinicInfo.distance.cryoToSending')}
            className="rounded border border-neutral-700 bg-transparent p-2 text-sm font-normal leading-[21px] text-neutral-50"
            onChange={e => {
              const value = e.target.value;
              if (!value || (Number(value) >= 0 && /^\d*$/.test(value))) {
                setValue('clinicInfo.distance.cryoToSending', Number(value));
                trigger('clinicInfo.distance.cryoToSending');
                setShouldRecalculatePrice(true);
              }
            }}
            disabled={!isEditable}
          />
        </div>
        <div className="my-1 grid grid-cols-2 items-center gap-2 border-b border-neutral-700">
          <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{'Sending -> Receiving'}</div>

          <TextInput
            value={watch('clinicInfo.distance.sendingToRecieving')}
            className="rounded border border-neutral-700 bg-transparent p-2 text-sm font-normal leading-[21px] text-neutral-50"
            onChange={e => {
              const value = e.target.value;
              if (!value || (Number(value) >= 0 && /^\d*$/.test(value))) {
                setValue('clinicInfo.distance.sendingToRecieving', Number(value));
                trigger('clinicInfo.distance.sendingToRecieving');
              }
              setShouldRecalculatePrice(true);
            }}
            disabled={!isEditable}
          />
        </div>
        <div className="my-1 grid grid-cols-2 items-center gap-2 border-b border-neutral-700">
          <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{'Receiving -> CF'}</div>

          <TextInput
            value={watch('clinicInfo.distance.recievingToCryo')}
            className="rounded border border-neutral-700 bg-transparent p-2 text-sm font-normal leading-[21px] text-neutral-50"
            onChange={e => {
              const value = e.target.value;
              if (!value || (Number(value) >= 0 && /^\d*$/.test(value))) {
                setValue('clinicInfo.distance.recievingToCryo', Number(value));
                trigger('clinicInfo.distance.recievingToCryo');
              }
              setShouldRecalculatePrice(true);
            }}
            disabled={!isEditable}
          />
        </div>

        <div className="flex justify-end p-2 text-sm font-bold leading-[21px] text-neutral-50">
          {totalDistance}
          {' miles'}
        </div>
      </div>
    </div>
  ) : null;
};

export default ClinicInfo;
