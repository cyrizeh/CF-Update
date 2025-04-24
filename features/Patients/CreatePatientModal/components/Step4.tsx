import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ViewTypes } from '@/types';

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import DateField from '@/components/Forms/DateField/DateField';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { useGetClinics } from '@/api/queries/clinic.queries';
import { useGetFacilities } from '@/api/queries/facility.queries';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Label, Radio, TextInput } from 'flowbite-react';
import { PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import useRole from '@/hooks/useRole';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import CustomSelect from '@/components/Forms/Select/Select';
import { Facility } from '@/types/view';
import { axiosInstance } from '@/api/axiosConfig';

const Step4 = ({
  currentStep,
  partnerInfo,
  clinicData,
}: {
  currentStep: number;
  partnerInfo?: any;
  clinicData?: any;
}) => {
  const { t } = useTranslation('patients');
  const { query } = useRouter();
  const [falilityOptions, setFacilityOptions] = useState<Facility[]>([]);
  const [isBillingDatePaymentSource, setIsBillingDatePaymentSource] = useState(
    clinicData?.onboardingConfiguration?.paymentDateSource === PaymentDateSourceEnum.BillingStartDate
  );

  const { setError, clearErrors, watch, setValue, control, formState, trigger } =
    useFormContext<ViewTypes.PatientFormValues>();

  const errors = formState.errors.billingInfo;

  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);

  useEffect(() => {
    if (query.id && !partnerInfo)
      setValue('billingInfo.clinicId', {
        id: query.id as string,
        name: '',
        onboardingConfiguration: { isPreTreatmentEnabled: false },
      });
  }, [query.id, setValue]);

  const clinicsResponse = useGetClinics({ q: partnerInfo?.clinicName || clinicData?.name || '' }, isCryoAdmin);
  const { data: clinics } = !clinicData ? clinicsResponse : { data: { items: [] } };
  const { data: facilities } = useGetFacilities({ pageSize: 100 });

  useEffect(() => {
    if (!_.isEmpty(clinics?.items)) {
      const clinic = clinics?.items.find((el: any) => el.name === partnerInfo?.clinicName || clinicData?.name);

      if (clinic) {
        setValue('billingInfo.clinicId', clinic);
      }
    }

    if (partnerInfo?.billingStartDate) {
      const formattedDate = dayjs(partnerInfo?.billingStartDate).format('MM/DD/YYYY');
      setValue('billingInfo.billingStartDate', formattedDate);
    }
  }, [clinicData, clinics?.items, partnerInfo, setValue, watch('billingInfo.clinicId.id')]);

  useEffect(() => {
    if (clinicData) {
      setValue('billingInfo.clinicId', clinicData);
      setIsBillingDatePaymentSource(
        clinicData?.onboardingConfiguration?.paymentDateSource === PaymentDateSourceEnum.BillingStartDate
      );
    }
  }, [clinicData]);

  useEffect(() => {
    if (facilities) {
      const facility = facilities.items.find((el: any) => el.name === partnerInfo?.locations[0]?.name) || {
        id: '',
        name: '',
      };
      setFacilityOptions(facilities.items);

      setValue('billingInfo.facilityId', facility.id);
    }
  }, [facilities, partnerInfo?.locations]);

  useEffect(() => {
    setValue('donorInfo.isPreTreatment', false);
    if (watch('billingInfo.clinicId.id')) {
      axiosInstance.get(`/clinics/${watch('billingInfo.clinicId.id')}`).then(resp => {
        if (resp?.data?.onboardingConfiguration?.paymentDateSource === PaymentDateSourceEnum.BillingStartDate) {
          setIsBillingDatePaymentSource(true);
        } else {
          setIsBillingDatePaymentSource(false);
          setValue('billingInfo.billingStartDate', null);
        }
      });
    }
  }, [watch('billingInfo.clinicId.id')]);

  return currentStep === 4 ? (
    <div className="flex flex-col gap-5">
      {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>}

      <div>
        <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">
          {t('step4.billingTitle', { ns: 'patients' })}
        </p>

        {clinicData ? (
          <TextInput type="text" placeholder={t('step4.clinic')} value={clinicData.name} disabled />
        ) : (
          <ErrorValidationMessage touched={errors?.clinicId} message={errors?.clinicId?.message}>
            <Autocomplete2
              defaultValue={watch('billingInfo.clinicId')}
              url="/clinics"
              control={control}
              name="billingInfo.clinicId"
              error={errors?.clinicId}
              placeholder={t('step4.clinic')}
            />
          </ErrorValidationMessage>
        )}
      </div>

      <ErrorValidationMessage touched={errors?.facilityId} message={errors?.facilityId?.message}>
        <CustomSelect
          control={control}
          name="billingInfo.facilityId"
          error={errors?.facilityId}
          options={falilityOptions?.map(el => ({ value: el.id, label: el.name })) || []}
          placeholder={t('step4.facility', { ns: 'patients' })}
          value={watch('billingInfo.facilityId')}
          onChange={(val: any) => {
            setValue('billingInfo.facilityId', val.value);
          }}
          stylesProps={{
            valueContainer: {
              paddingLeft: '14px',
            },
          }}
        />
      </ErrorValidationMessage>

      {isBillingDatePaymentSource ? (
        <ErrorValidationMessage touched={errors?.billingStartDate} message={errors?.billingStartDate?.message}>
          <DateField
            minDate={dayjs().subtract(6, 'month')}
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            name="billingInfo.billingStartDate"
            error={errors?.billingStartDate}
            placeholder={t('step4.billingStart', { ns: 'patients' })}
          />
        </ErrorValidationMessage>
      ) : null}
    </div>
  ) : null;
};

export default Step4;
