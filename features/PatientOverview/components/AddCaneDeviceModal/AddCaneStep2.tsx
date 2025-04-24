import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { IdLabResultList, ReactiveTypeList } from '@/constants/specimens';
import { ViewTypes } from '@/types';
import { FDAEligibilityType, IdLabResultType } from '@/types/view/AddSpecimanModal.type';
import { Label, Radio } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { requiredNotesLabResults } from './useAddCaneDeviceModal';

interface Step2Props {
  currentStep: number;
}

const AddCaneStep2: React.FC<Step2Props> = ({ currentStep }) => {
  const { t } = useTranslation('specimens');
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
    register,
  } = useFormContext<ViewTypes.AddSpecimanModalFormValues>();

  return currentStep === 2 ? (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <Label>
        {t('table.idLabResult')}
        <ErrorValidationMessage
          touched={errors?.caneData?.idLabResult}
          message={errors?.caneData?.idLabResult?.message}>
          <CustomSelect
            dataTestId="add-cane-idLabResult"
            control={control}
            options={IdLabResultList}
            name={`caneData.idLabResult`}
            placeholder={`${t('table.idLabResult')} *`}
            error={errors?.caneData?.idLabResult}
            onChange={() => {
              setValue('caneData.notes', '');
              if (watch('caneData.idLabResult') === IdLabResultType.IncompleteTesting) {
                setValue('caneData.FDAEligibility', null);
                setValue('caneData.reactivity', null);
                setValue('caneData.reactive', '');
              }
            }}
          />
        </ErrorValidationMessage>
      </Label>

      {requiredNotesLabResults.includes(watch('caneData.idLabResult')) && (
        <Label>
          {t('modal.notes')}
          <ErrorValidationMessage touched={errors?.caneData?.notes} message={errors?.caneData?.notes?.message}>
            <TextInput
              data-testid="add-cane-notes"
              placeholder={`${t('modal.notes')} *`}
              register={register('caneData.notes')}
              error={errors?.caneData?.notes}></TextInput>
          </ErrorValidationMessage>
        </Label>
      )}

      {watch('caneData.idLabResult') !== IdLabResultType.IncompleteTesting && (
        <>
          <Label>
            {t('modal.FDAEligibility')}
            <div className="flex flex-row gap-2">
              <Label htmlFor="FDAEligibility-yes" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-FDAEligibility-yes"
                  id="FDAEligibility-yes"
                  checked={watch('caneData.FDAEligibility') === FDAEligibilityType.Yes}
                  onChange={() => {
                    setValue('caneData.FDAEligibility', FDAEligibilityType.Yes);
                    trigger('caneData.FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.yes')}
              </Label>
              <Label htmlFor="FDAEligibility-no" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-FDAEligibility-no"
                  id="FDAEligibility-no"
                  checked={watch('caneData.FDAEligibility') === FDAEligibilityType.No}
                  onChange={() => {
                    setValue('caneData.FDAEligibility', FDAEligibilityType.No);
                    trigger('caneData.FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.no')}
              </Label>

              <Label htmlFor="FDAEligibility-na" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-FDAEligibility-na"
                  id="FDAEligibility-na"
                  checked={watch('caneData.FDAEligibility') === FDAEligibilityType.NA}
                  onChange={() => {
                    setValue('caneData.FDAEligibility', FDAEligibilityType.NA);
                    trigger('caneData.FDAEligibility');
                  }}
                />
                {t('modal.FDAEligibilityType.na')}
              </Label>
            </div>

            <ErrorValidationMessage
              touched={errors?.caneData?.FDAEligibility}
              message={errors?.caneData?.FDAEligibility?.message}
            />
          </Label>
          <Label>
            {t('modal.reactivity')}
            <div className="flex flex-row gap-2">
              <Label htmlFor="reactivity-yes" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-reactivity-yes"
                  id="reactivity-yes"
                  checked={watch('caneData.reactivity') === true}
                  onChange={() => {
                    setValue('caneData.reactivity', true);
                    setValue('caneData.reactive', '');
                    trigger('caneData.reactivity');
                  }}
                />
                {t('modal.FDAEligibilityType.yes')}
              </Label>
              <Label htmlFor="reactivity-no" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-reactivity-no"
                  id="reactivity-no"
                  checked={watch('caneData.reactivity') === false}
                  onChange={() => {
                    setValue('caneData.reactivity', false);
                    setValue('caneData.reactive', '');
                    trigger('caneData.reactivity');
                  }}
                />
                {t('modal.FDAEligibilityType.no')}
              </Label>
            </div>
            <ErrorValidationMessage
              touched={errors?.caneData?.reactivity}
              message={errors?.caneData?.reactivity?.message}
            />
          </Label>
          {watch('caneData.reactivity') && (
            <Label>
              {t('modal.reactive')}
              <ErrorValidationMessage touched={errors?.caneData?.reactive} message={errors?.caneData?.reactive?.message}>
                <CustomSelect
                  dataTestId="add-cane-reactive"
                  control={control}
                  options={ReactiveTypeList}
                  name={`caneData.reactive`}
                  placeholder={`${t('modal.reactive')} *`}
                  error={errors?.caneData?.reactive}
                />
              </ErrorValidationMessage>
            </Label>
          )}
        </>
      )}
    </div>
  ) : null;
};

export default AddCaneStep2;
