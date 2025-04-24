/* eslint-disable complexity */
// @ts-nocheck;
import { useFormContext } from 'react-hook-form';
import { Label } from 'flowbite-react';
import TextInput from '@/components/Forms/TextInput/TextInput';
import DateField from '@/components/Forms/DateField/DateField';
import CustomSelect from '@/components/Forms/Select/Select';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { ViewTypes } from '@/types';
import { disposeActions } from '@/constants/specimens';

const ProcessCanesForm = ({ isOpen }: { isOpen: boolean }) => {
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    register,
    ...formProps
  } = useFormContext<ViewTypes.ProcessCanesFormValues>();

  useEffect(() => {
    formProps.reset({
      notes: '',
      initials: '',
    });
  }, [isOpen]);

  return (
    <div className="flex flex-col">
      <ErrorValidationMessage touched={errors?.status} message={errors?.status?.message}>
        <Label className="mt-1">
          Action
          <div className="mt-1">
            <CustomSelect
              control={control}
              name="status"
              error={errors?.status}
              options={disposeActions}
              placeholder={'Select status *'}
            />
          </div>
        </Label>
      </ErrorValidationMessage>
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
        <div className="mt-1">
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

export default ProcessCanesForm;
