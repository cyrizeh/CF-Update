import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { useEffect } from 'react';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { PatternFormat } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';
import { Label, Radio } from 'flowbite-react';

interface SignupFormProps {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hasPartner: boolean;
  hasSpecimens: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  firstName,
  lastName,
  phoneNumber,
  hasPartner,
  hasSpecimens,
}: SignupFormProps) => {
  const { t } = useTranslation('patients');
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useFormContext<ViewTypes.SignupFormPropsFormValues>();

  useEffect(() => {
    setValue('email', email);
    setValue('firstName', firstName);
    setValue('lastName', lastName);
    setValue('phoneNumber', phoneNumber?.slice(-10));
    setValue('hasPartner', hasPartner);
    setValue('hasSpecimens', hasSpecimens);
  }, [email, firstName, lastName, phoneNumber, hasPartner, hasSpecimens]);

  return (
    <div className="flex max-h-[100vh] flex-col">
      <div className="mt-2 flex flex-col gap-4">
        <ErrorValidationMessage touched={errors?.firstName} message={errors?.firstName?.message}>
          <Label>First Name</Label>
          <TextInput
            type="text"
            error={errors?.firstName}
            placeholder={t('common:firstName') + ' *'}
            register={register('firstName')}
          />
        </ErrorValidationMessage>

        <ErrorValidationMessage touched={errors?.lastName} message={errors?.lastName?.message}>
          <Label>Last Name</Label>
          <TextInput
            type="text"
            error={errors?.lastName}
            placeholder={t('common:lastName') + ' *'}
            register={register('lastName')}
          />
        </ErrorValidationMessage>

        <ErrorValidationMessage touched={errors?.email} message={errors?.email?.message}>
          <Label>Email</Label>
          <TextInput
            type="email"
            error={errors?.email}
            placeholder={t('common:email') + ' *'}
            register={register('email')}
            inputstyles="sensitive"
          />
        </ErrorValidationMessage>

        <Controller
          render={({ field: { onChange, name, value } }) => (
            <ErrorValidationMessage touched={errors?.phoneNumber} message={errors?.phoneNumber?.message}>
              <div className="sensitive">
                <PatternFormat
                  onValueChange={v => {
                    let inputValue = v.value;
                    onChange(inputValue);
                  }}
                  name={name}
                  label="Phone Number"
                  value={value || ''}
                  format="+1 (###) ###-####"
                  allowEmptyFormatting
                  mask="_"
                  customInput={TextInput}
                  error={errors?.phoneNumber}
                />
              </div>
            </ErrorValidationMessage>
          )}
          name="phoneNumber"
          control={control}
        />

        <Label htmlFor="hasSpecimens" className="flex items-center">
          Do you have specimens (embryos, oocytes and/or sperm) that were frozen at clinic and are currently stored at
          clinic?
        </Label>
        <Label htmlFor={`hasSpecimens`} className="flex items-center gap-2 md:mb-0">
          <Controller
            name={`hasSpecimens`}
            control={control}
            render={() => (
              <Radio
                id={`hasSpecimens`}
                checked={watch(`hasSpecimens`) === true}
                onClick={() => setValue(`hasSpecimens`, true)}
              />
            )}
          />
          Yes
        </Label>
        <Label htmlFor={`hasSpecimens`} className="flex items-center gap-2 md:mb-0">
          <Controller
            name={`hasSpecimens`}
            control={control}
            render={() => (
              <Radio
                id={`hasSpecimens`}
                checked={watch(`hasSpecimens`) === false}
                onClick={() => setValue(`hasSpecimens`, false)}
              />
            )}
          />
          No
        </Label>
        <Label htmlFor="hasPartner" className="flex items-center">
          Do you have a partner associated with your account?
        </Label>
        <Label htmlFor={`hasPartner`} className="mb-2 flex items-center gap-2 md:mb-0">
          <Controller
            name={`hasPartner`}
            control={control}
            render={() => (
              <Radio
                id={`hasPartner`}
                checked={watch(`hasPartner`) === true}
                onClick={() => setValue(`hasPartner`, true)}
              />
            )}
          />
          Yes
        </Label>
        <Label htmlFor={`hasPartner`} className="mb-2 flex items-center gap-2 md:mb-0">
          <Controller
            name={`hasPartner`}
            control={control}
            render={() => (
              <Radio
                id={`hasPartner`}
                checked={watch(`hasPartner`) === false}
                onClick={() => setValue(`hasPartner`, false)}
              />
            )}
          />
          No
        </Label>
      </div>
    </div>
  );
};

export default SignupForm;
