import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { IdLabResultList, ReactiveTypeList } from '@/constants/specimens';
import { ViewTypes } from '@/types';
import { FDAEligibilityType, IdLabResultType } from '@/types/view/AddSpecimanModal.type';
import { Label, Radio } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { FieldError, useFormContext } from 'react-hook-form';

interface EditCaneDiseaseProps {
  currentStep: number;
}

const EditCaneDisease: React.FC<EditCaneDiseaseProps> = ({ currentStep }) => {
  const { t } = useTranslation('specimens');
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<ViewTypes.EditCaneModalFormValues>();

  return currentStep === 2 ? (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <Label>
        {t('table.idLabResult')}
        <ErrorValidationMessage touched={errors?.idLabResult} message={errors?.idLabResult?.message}>
          <CustomSelect
            control={control}
            options={IdLabResultList}
            name={`idLabResult`}
            placeholder={`${t('table.idLabResult')} *`}
            error={errors?.idLabResult}
            onChange={() => {
              if (watch('idLabResult') === IdLabResultType.IncompleteTesting) {
                setValue('FDAEligibility', null);
                setValue('reactivity', null);
                setValue('reactive', '');
              }
            }}
          />
        </ErrorValidationMessage>
      </Label>

      {watch('idLabResult') !== IdLabResultType.IncompleteTesting && (
        <>
          <Label>
            {t('modal.FDAEligibility')}
            <div className="flex flex-row gap-2">
              <Label htmlFor="FDAEligibility-yes" className="flex items-center gap-2 pl-1">
                <Radio
                  id="FDAEligibility-yes"
                  checked={watch('FDAEligibility') === FDAEligibilityType.Yes}
                  onChange={() => {
                    setValue('FDAEligibility', FDAEligibilityType.Yes);
                    trigger('FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.yes')}
              </Label>
              <Label htmlFor="FDAEligibility-no" className="flex items-center gap-2 pl-1">
                <Radio
                  id="FDAEligibility-no"
                  checked={watch('FDAEligibility') === FDAEligibilityType.No}
                  onChange={() => {
                    setValue('FDAEligibility', FDAEligibilityType.No);
                    trigger('FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.no')}
              </Label>

              <Label htmlFor="FDAEligibility-na" className="flex items-center gap-2 pl-1">
                <Radio
                  id="FDAEligibility-na"
                  checked={watch('FDAEligibility') === FDAEligibilityType.NA}
                  onChange={() => {
                    setValue('FDAEligibility', FDAEligibilityType.NA);
                    trigger('FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.na')}
              </Label>
            </div>

            <ErrorValidationMessage touched={errors?.FDAEligibility} message={errors?.FDAEligibility?.message} />
          </Label>
          <Label>
            {t('modal.reactivity')}
            <div className="flex flex-row gap-2">
              <Label htmlFor="reactivity-yes" className="flex items-center gap-2 pl-1">
                <Radio
                  id="reactivity-yes"
                  checked={watch('reactivity') === true}
                  onChange={() => {
                    setValue('reactivity', true);
                    setValue('reactive', '');
                    trigger('reactivity');
                  }}
                />
                {t('modal.FDAEligibilityType.yes')}
              </Label>
              <Label htmlFor="reactivity-no" className="flex items-center gap-2 pl-1">
                <Radio
                  id="reactivity-no"
                  checked={watch('reactivity') === false}
                  onChange={() => {
                    setValue('reactivity', false);
                    setValue('reactive', '');
                    trigger('reactivity');
                  }}
                />
                {t('modal.FDAEligibilityType.no')}
              </Label>
            </div>

            <ErrorValidationMessage touched={errors?.reactivity} message={errors?.reactivity?.message} />
          </Label>
          {watch('reactivity') && (
            <Label>
              {t('modal.reactive')}
              <ErrorValidationMessage touched={errors?.reactive} message={errors?.reactive?.message}>
                <CustomSelect
                  control={control}
                  options={ReactiveTypeList}
                  name={`reactive`}
                  placeholder={`${t('modal.reactive')} *`}
                  error={errors?.reactive as FieldError}
                />
              </ErrorValidationMessage>
            </Label>
          )}
        </>
      )}
    </div>
  ) : null;
};

export default EditCaneDisease;
