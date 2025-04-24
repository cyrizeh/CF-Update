import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { Label } from 'flowbite-react';

import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';

const AddSpecimen = () => {
  const { t } = useTranslation('specimens');
  const {
    formState: { errors },
    register,
  } = useFormContext<ViewTypes.AddSpecimenToStrawFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <Label>
        {t('table.tissueType')}
        <ErrorValidationMessage touched={errors?.specimentype} message={errors?.specimentype?.message}>
          <TextInput
            name={`specimentype`}
            placeholder={`${t('table.tissueType')} *`}
            register={register('specimentype')}
            disabled={true}
          />
        </ErrorValidationMessage>
      </Label>
      <Label>
        {t('modal.embryoOocyteCount')}
        <ErrorValidationMessage touched={errors?.embryoOocyteCount} message={errors?.embryoOocyteCount?.message}>
          <TextInput
            required
            type="number"
            max={99}
            min={1}
            placeholder={`${t('modal.embryoOocyteCount')}`}
            register={register('embryoOocyteCount')}
          />
        </ErrorValidationMessage>
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <Label>
          {t('modal.gradeMaturity')}
          <ErrorValidationMessage touched={errors?.gradeMaturity} message={errors?.gradeMaturity?.message}>
            <TextInput
              required
              type="text"
              placeholder={`${t('modal.gradeMaturity')}`}
              register={register('gradeMaturity')}
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {t('specimenTable.strawPTGRezults')}
          <ErrorValidationMessage touched={errors?.PGTResults} message={errors?.PGTResults?.message}>
            <TextInput
              required
              type="text"
              placeholder={t('specimenTable.strawPTGRezults')}
              register={register('PGTResults')}
            />
          </ErrorValidationMessage>
        </Label>
      </div>   
    </div>
  );
};

export default AddSpecimen;
