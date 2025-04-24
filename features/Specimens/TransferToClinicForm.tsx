/* eslint-disable complexity */
// @ts-nocheck
import { ViewTypes } from '@/types';
import { Label } from 'flowbite-react';
import DateField from '@/components/Forms/DateField/DateField';
import TextInput from '@/components/Forms/TextInput/TextInput';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const TransferToClinicForm = ({ isOpen, clinicName }: { isOpen: string }) => {
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    register,
    ...formProps
  } = useFormContext<ViewTypes.TransferToClinicFormValues>();

  useEffect(() => {
    formProps.reset({
      notes: '',
      receivingClinic: clinicName,
      initials: '',
    });
  }, [isOpen]);

  return (
    <div className="flex flex-col">
      <Label>
        Receiving clinic
        <div className="mt-1">
          <ErrorValidationMessage touched={errors?.receivingClinic} message={errors?.receivingClinic?.message}>
            <TextInput
              type="text"
              value={clinicName}
              placeholder={clinicName}
              disabled={true}
              error={errors?.receivingClinic}
              register={register('receivingClinic')}
            />
          </ErrorValidationMessage>
        </div>
      </Label>
      <Label className="mt-4">
        Notes
        <div className="mt-1">
          <ErrorValidationMessage touched={errors?.notes} message={errors?.notes?.message}>
            <TextInput type="text" placeholder="Notes *" register={register('notes')} error={errors?.notes} />
          </ErrorValidationMessage>
        </div>
      </Label>

      <Label className="mt-4">
        Technical Specialist
        <div className="mt-1">
          <ErrorValidationMessage touched={errors?.initials} message={errors?.initials?.message}>
            <TextInput type="text" placeholder="Initials *" register={register('initials')} error={errors?.initials} />
          </ErrorValidationMessage>
        </div>
      </Label>

      <Label className="mt-4">
        Date
        <div className="my-1">
          <DateField
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            name={'date'}
            error={errors?.date}
            placeholder={'MM/DD/YYYY'}
          />
        </div>
      </Label>
    </div>
  );
};

export default TransferToClinicForm;
