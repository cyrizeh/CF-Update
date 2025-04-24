import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import dayjs from 'dayjs';
import { Label } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
interface EditCaneDiseaseProps {
  currentStep: number;
}

const EditCaneMainInfo: React.FC<EditCaneDiseaseProps> = ({ currentStep }) => {
  const { t } = useTranslation('specimens');
  const {
    control,
    register,
    formState: { errors },
    setError,
    watch,
    clearErrors,
  } = useFormContext<ViewTypes.EditCaneModalFormValues>();

  return currentStep === 1 ? (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('table.Cane')}</p>
          <Label>
            {t('modal.dateOfFreezing')}
            <ErrorValidationMessage touched={errors?.receiptDate} message={errors?.receiptDate?.message}>
              <DateField
                setError={setError}
                clearErrors={clearErrors}
                control={control}
                name="receiptDate"
                error={errors?.receiptDate}
                placeholder={'MM/DD/YYYY'}
                maxDate={dayjs()}
              />
            </ErrorValidationMessage>
          </Label>
          <Label>
            {t('modal.primaryIdentifier')}
            <ErrorValidationMessage touched={errors?.primaryIdentifier} message={errors?.primaryIdentifier?.message}>
              <Autocomplete2
                defaultValue={watch('primaryIdentifier')}
                url="/specimenIdentifiers"
                control={control}
                name="primaryIdentifier"
                placeholder={`${t('modal.primaryIdentifier')} *`}
                isPrefilled
                error={errors?.primaryIdentifier}
                customOptionField="email"
              />
            </ErrorValidationMessage>
          </Label>
          <Label>
            {'Device Quantity'}
            <ErrorValidationMessage touched={errors?.deviceNumber} message={errors?.deviceNumber?.message}>
              <TextInput
                required
                type="number"
                max={99}
                min={1}
                placeholder={`Device Quantity *`}
                register={register('deviceNumber')}
                error={errors?.deviceNumber}
                inputstyles="!pl-4"
              />
            </ErrorValidationMessage>
          </Label>
        </div>
        <Label>
          {t('table.caneLabel')}
          <ErrorValidationMessage touched={errors?.caneLabel} message={errors?.caneLabel?.message}>
            <TextInput
              required
              type="text"
              placeholder={`${t('table.caneLabel')}`}
              register={register('caneLabel')}
              error={errors?.caneLabel}
              inputstyles="!pl-4"
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {t('table.cane_description')}
          <ErrorValidationMessage touched={errors?.caneColor} message={errors?.caneColor?.message}>
            <TextInput
              required
              type="text"
              placeholder={`${t('table.cane_description')}`}
              register={register('caneColor')}
              error={errors?.caneColor}
              inputstyles="!pl-4"
            />
          </ErrorValidationMessage>
        </Label>
      </div>
    </div>
  ) : null;
};

export default EditCaneMainInfo;
