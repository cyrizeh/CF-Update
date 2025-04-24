import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { SpecimenTypeList } from '@/constants/specimens';
import { ViewTypes } from '@/types';
import dayjs from 'dayjs';
import { Label } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';

const EditDevice: React.FC = () => {
  const { t } = useTranslation('specimens');
  const {
    formState: { errors },
    setError,
    clearErrors,
    control,
    register,
  } = useFormContext<ViewTypes.EditSpecimanModalFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <Label>
        {t('table.tissueType')}
        <ErrorValidationMessage touched={errors?.specimentype} message={errors?.specimentype?.message}>
          <CustomSelect
            options={SpecimenTypeList}
            name={`specimentype`}
            placeholder={`${t('table.tissueType')} *`}
            control={control}
          />
        </ErrorValidationMessage>
      </Label>

      <Label>
        {t('strawVialDetails.qty')}
        <ErrorValidationMessage touched={errors?.qty} message={errors?.qty?.message}>
          <TextInput
            required
            placeholder={`${t('strawVialDetails.qty')} *`}
            register={register('qty')}
            error={errors?.qty}
            type="number"
          />
        </ErrorValidationMessage>
      </Label>
      <Label>
        {t('modal.strawVialColor')}
        <ErrorValidationMessage touched={errors?.color} message={errors?.color?.message}>
          <TextInput
            required
            type="text"
            placeholder={`${t('modal.strawVialColor')}`}
            register={register('color')}
            error={errors?.color}
          />
        </ErrorValidationMessage>
      </Label>
      <Label>
        {t('modal.notes')}
        <ErrorValidationMessage touched={errors?.notes} message={errors?.notes?.message}>
          <TextInput
            required
            type="text"
            placeholder={`${t('modal.notes')}`}
            register={register('notes')}
            error={errors?.notes}
          />
        </ErrorValidationMessage>
      </Label>

      <Label>
        {t('strawVialDetails.strawVialNumberDescription')}
        <ErrorValidationMessage touched={errors?.description} message={errors?.description?.message}>
          <TextInput
            required
            type="text"
            placeholder={`${t('strawVialDetails.strawVialNumberDescription')}`}
            register={register('description')}
            error={errors?.description}
          />
        </ErrorValidationMessage>
      </Label>

      <Label>
        {t('modal.expectedNumberOfSpecimens')}
        <ErrorValidationMessage touched={errors?.numberOfSpecimens} message={errors?.numberOfSpecimens?.message}>
          <TextInput
            required
            type="number"
            max={99}
            min={1}
            placeholder={`${t('modal.expectedNumberOfSpecimens')} *`}
            register={register('numberOfSpecimens')}
            error={errors?.numberOfSpecimens}
          />
        </ErrorValidationMessage>
      </Label>
      <Label>
        {t('table.freezeDate')}
        <ErrorValidationMessage touched={errors?.freesedate} message={errors?.freesedate?.message}>
          <DateField
            maxDate={dayjs()}
            name={`freesedate`}
            placeholder={''}
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            error={errors?.freesedate}
          />
        </ErrorValidationMessage>
      </Label>
    </div>
  );
};

export default EditDevice;
