import { axios, useGetTransportationInfo } from '@/api/queries/transportation.queries';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import Switch from '@/components/Forms/Switch/Switch';
import { PatientSpecimenTypes } from '@/constants/patients';
import { ViewTypes } from '@/types';
import { Label } from 'flowbite-react';
import { isEmpty } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { Tooltip } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import { Payer } from '@/types/view/Payer.enum';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { toast } from 'react-toastify';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { RequestCreationStep } from '@/types/Patients.enum';

const defaultPrices = [
  {
    columnTitle: 'Fee Description',
    service: 'Clinic - Clinic Transfer (Local to Cryofuture)',
    price: '-',
    key: 'price',
  },
  {
    columnTitle: 'Amount',
    service: 'Clinic - Clinic Transfer (Local) Expedited Delivery Additional Fee',
    price: '-',
    key: 'expeditedPrice',
  },
];

const ShipmentInfo = ({
  currentStep,
  requestId,
  transportationInfo,
  isEditMode,
  shouldRecalculatePrice,
  setShouldRecalculatePrice,
}: {
  currentStep: number;
  setShouldRecalculatePrice: any;
  requestId?: string;
  transportationInfo: any;
  isEditMode?: boolean;
  shouldRecalculatePrice?: boolean;
}) => {
  const { t } = useTranslation('transportation');
  const [servicePrices, setServicePrices] = useState<any[]>(defaultPrices);
  const [pricingType, setPricingType] = useState<string>('');
  const [creationStep, setCreationStep] = useState<string>('');

  const {
    register,
    control,
    watch,
    setValue,
    formState: {
      errors: { shipment: errors },
    },
  } = useFormContext<ViewTypes.TransportationFormValues>();

  useEffect(() => {
    if (transportationInfo && !isEmpty(transportationInfo)) {
      if (isEditMode) {
        setValue('shipment.requestingClinic', {
          id: transportationInfo.requestingClinic?.id || '',
          name: transportationInfo.requestingClinic?.name || '',
        });
        const selectedSpecimenTypes = PatientSpecimenTypes.filter(specimen =>
          transportationInfo.specimenTypes.includes(specimen.value)
        );
        setValue('shipment.typeOfSpecimen', selectedSpecimenTypes || []);
        setValue('shipment.expeditedDelivery', transportationInfo?.expeditedDelivery);
        setValue('shipment.payer', transportationInfo?.payer);
        setValue(
          'shipment.expeditedPrice',
          transportationInfo?.expeditedPrice?.price !== 0 ? transportationInfo?.expeditedPrice?.price : ''
        );
        setValue('shipment.witness', {
          id: transportationInfo?.witness?.id || '',
          name: transportationInfo?.witness?.name || '',
        });
      }
      setCreationStep(transportationInfo.creationStep);
    }
  }, [setValue, transportationInfo]);

  useEffect(() => {
    handleDistanceChange();
  }, [currentStep]);

  const handleDistanceChange = async () => {
    const response = await axios(`/${requestId}`, 'GET');
    const { price, expeditedPrice } = response.data;

    const servicePrices = [price, expeditedPrice];

    const newServicePrices = servicePrices.map((servicePrice, index) => ({
      service: servicePrice?.name || defaultPrices[index].service,
      price: servicePrice?.price || defaultPrices[index].price,
      key: index === 0 ? 'price' : 'expeditedPrice',
    }));
    setServicePrices(newServicePrices);
    setPricingType(expeditedPrice?.priceType === 'Quoted' ? 'Quoted' : '');
    if (shouldRecalculatePrice) {
      setValue('shipment.expeditedPrice', expeditedPrice?.price !== 0 ? expeditedPrice?.price : '');
    }
  };

  const updateRequestingClinic = async () => {
    const requestingClinicId = watch('shipment.requestingClinic')?.id;
    if (requestingClinicId) {
      setValue('shipment.isRequestinClinicValid', true);
      try {
        await axios(`/${requestId}/RequestingClinic`, 'PUT', {
          clinicId: requestingClinicId,
          transportationRequestId: requestId,
        });

        if (
          watch('clinicInfo.facility') &&
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
        }
        setValue('shipment.isRequestinClinicValid', false);
      }
    }
  };

  useEffect(() => {
    if (currentStep === 4) {
      if (watch('shipment.requestingClinic') === '') {
        setServicePrices(defaultPrices);
      }
      updateRequestingClinic();
    }
  }, [watch('shipment.requestingClinic'), watch('clinicInfo.sending.clinic'), watch('clinicInfo.receiving.clinic')]);

  return currentStep === 4 ? (
    <div className="mb-5 flex flex-col gap-1">
      <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('shipmentInfo.title')}</p>
      <Label className="mt-2 text-sm font-normal">{t('shipmentInfo.specimenTypes') + ' *'}</Label>
      <ErrorValidationMessage touched={errors?.typeOfSpecimen} message={errors?.typeOfSpecimen?.message}>
        <CustomSelect
          isMulti
          options={PatientSpecimenTypes}
          placeholder={t('shipmentInfo.selectSpecimens') + ' *'}
          control={control}
          name="shipment.typeOfSpecimen"
          error={errors?.typeOfSpecimen as FieldError}
          disabled={creationStep === RequestCreationStep.SpecimenDetailsAssigned}
        />
      </ErrorValidationMessage>

      <Label className="mt-2 text-sm font-normal">{t('shipmentInfo.requestingClinic') + ' *'}</Label>
      <ErrorValidationMessage touched={errors?.requestingClinic} message={errors?.requestingClinic?.message}>
        <Autocomplete2
          defaultValue={watch('shipment.requestingClinic')}
          url="/clinics"
          params={{
            Status: 'Created',
          }}
          control={control}
          error={errors?.requestingClinic}
          name="shipment.requestingClinic"
          placeholder={t('shipmentInfo.searchClinic') + ' *'}
          isPrefilled
          extraOptions={[
            {
              id: watch('clinicInfo.sending.clinic.id'),
              displayName: watch('clinicInfo.sending.clinic.name'),
              name: watch('clinicInfo.sending.clinic.name'),
            },
            {
              id: watch('clinicInfo.receiving.clinic.id'),
              displayName: watch('clinicInfo.receiving.clinic.name'),
              name: watch('clinicInfo.receiving.clinic.name'),
            },
          ]}
        />
      </ErrorValidationMessage>

      <div className="w-auto">
        <Label className="mt-2 text-sm font-normal">{t('shipmentInfo.payer') + ' *'}</Label>
        <ErrorValidationMessage touched={errors?.payer} message={errors?.payer?.message}>
          <CustomSelect
            options={Object.values(Payer).map(payer => ({ value: payer, label: `${payer} pays` }))}
            placeholder={'Select a payer' + ' *'}
            error={errors?.payer}
            control={control}
            name="shipment.payer"
          />
        </ErrorValidationMessage>
      </div>
      <div className="w-auto">
        <Label className="mt-2 text-sm font-normal">{'Witness *'}</Label>
        <ErrorValidationMessage touched={errors?.witness} message={errors?.witness?.message}>
          <Autocomplete2
            defaultValue={watch('shipment.witness')}
            url="/Witness"
            control={control}
            error={errors?.witness}
            name="shipment.witness"
            placeholder={'Select consent witness *'}
            isPrefilled
          />
        </ErrorValidationMessage>
      </div>

      <div className="w-[200px] pt-2">
        <Switch label={t('shipmentInfo.expeditedDelivery')} register={register('shipment.expeditedDelivery')} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 bg-[#292B2C]">
        {defaultPrices.map(prices => (
          <div
            key={prices.key + prices.columnTitle}
            className="p-2 text-sm font-normal uppercase leading-[21px] text-white">
            {prices.columnTitle}
          </div>
        ))}
      </div>
      <div key={servicePrices[0].key} className="grid grid-cols-2 items-center gap-2 border-b border-neutral-700">
        <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{servicePrices[0].service}</div>

        <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{servicePrices[0].price}</div>
      </div>

      {watch('shipment.expeditedDelivery') && (
        <div key={servicePrices[1]?.key} className="grid grid-cols-2 items-center gap-2 border-b border-neutral-700">
          <div className="flex flex-row p-2 text-sm font-normal leading-[21px] text-neutral-50">
            <p>{servicePrices[1]?.service}</p>
            {pricingType && (
              <Tooltip content={pricingType} className="text-sm font-normal italic">
                <HiInformationCircle className="relative h-5 w-5" color="#828282" />
              </Tooltip>
            )}
          </div>
          <TextInput
            value={watch('shipment.expeditedPrice')}
            className="rounded border-neutral-700 bg-transparent p-2 text-sm font-normal leading-[21px] text-neutral-50"
            onChange={e => {
              const value = e.target.value;
              if (!value || (Number(value) >= 0 && /^\d*$/.test(value))) {
                setValue('shipment.expeditedPrice', Number(value));
              }
              setShouldRecalculatePrice(false);
            }}
          />
        </div>
      )}
    </div>
  ) : null;
};

export default ShipmentInfo;
