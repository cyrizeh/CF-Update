import React, { useRef, Dispatch, SetStateAction } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { addClinicAddressScheme } from '@/validations/clinics';
import closeIcon from '@/public/icons/close-button.svg';

import { errorHandler } from '@/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import TextInput from '@/components/Forms/TextInput/TextInput';
import CustomSelect from '@/components/Forms/Select/Select';
import { statesWithId } from '@/constants/states';
import Switch from '@/components/Forms/Switch/Switch';
import useClinicMutation from '@/api/mutations/useClinicMutation';
import { useRouter } from 'next/router';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type EditClinicProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  updateClinics: (data: any, option: any) => Promise<any>;
  clinic: {
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
      sameBilling: boolean;
    };
    billingAddress: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  // eslint-disable-next-line no-unused-vars
  updateDetails: (data: any) => Promise<any>;
};

const AddAddressModal = ({ isOpen, setIsOpen, updateClinics }: EditClinicProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const { t } = useTranslation('clinics');
  const { updateClinicAddress } = useClinicMutation();

  const {
    handleSubmit,
    control,
    register,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<{
    address: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
      sameBilling: boolean;
    };
    billingAddress: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }>({
    // @ts-ignore
    resolver: yupResolver(addClinicAddressScheme),
  });

  function handleError(error: { field: any; error: { message: string } }) {
    setError(error.field, { ...error.error });
  }

  const isLoading = false;

  const onSubmit = (data: any) => {
    const addressData = { ...data, clinicId: query.id };

    if (watch('address.sameBilling')) addressData.billingAddress = { ...data.address };

    updateClinicAddress(addressData)
      .then(() => {
        updateClinics(undefined, { revalidate: true });
        onCloseModal();
      })
      .catch(error => errorHandler(error, handleError, 'address'));
  };

  const onCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">Add address</div>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <form>
            <div className="flex max-w-md flex-col gap-4">
              {/* @ts-ignore */}
              {errors?.type === 'general' && <div className="text-xs text-rose-400">{errors?.message}</div>}

              <div className="label-with-help">
                <div className="text-sm font-normal">{t('step2.clinicAddress')}</div>
              </div>
              <ErrorValidationMessage touched={errors?.address?.street1} message={errors?.address?.street1?.message}>
                <TextInput
                  type="text"
                  placeholder={t('common:addressLine1') + ' *'}
                  register={register('address.street1')}
                />
              </ErrorValidationMessage>
              <ErrorValidationMessage touched={errors?.address?.street2} message={errors?.address?.street2?.message}>
                <TextInput type="text" placeholder={t('common:addressLine2')} register={register('address.street2')} />
              </ErrorValidationMessage>
              <ErrorValidationMessage touched={errors?.address?.city} message={errors?.address?.city?.message}>
                <TextInput type="text" placeholder={t('common:city') + ' *'} register={register('address.city')} />
              </ErrorValidationMessage>
              <div className="grid grid-cols-2 gap-5">
                <ErrorValidationMessage touched={errors?.address?.state} message={errors?.address?.state?.message}>
                  <CustomSelect
                    control={control}
                    name="address.state"
                    options={statesWithId}
                    placeholder={t('step2.selectState') + ' *'}
                  />
                </ErrorValidationMessage>

                <ErrorValidationMessage touched={errors?.address?.zipCode} message={errors?.address?.zipCode?.message}>
                  <TextInput
                    type="text"
                    placeholder={t('common:zipCode') + ' *'}
                    register={register('address.zipCode')}
                  />
                </ErrorValidationMessage>
              </div>

              <div className="flex items-center justify-between">
                <div className="label-with-help">
                  <div className="text-sm font-normal">Billing address</div>
                </div>

                <div className="ml-auto flex-shrink-0">
                  <Switch label={t('step2.sameBilling')} register={register('address.sameBilling')} />
                </div>
              </div>

              {!watch('address.sameBilling') && (
                <div>
                  <div className="flex max-w-md flex-col gap-4">
                    <ErrorValidationMessage
                      touched={errors?.billingAddress?.street1}
                      message={errors?.billingAddress?.street1?.message}>
                      <TextInput
                        type="text"
                        placeholder={t('common:addressLine1') + ' *'}
                        register={register('billingAddress.street1')}
                      />
                    </ErrorValidationMessage>
                    <ErrorValidationMessage
                      touched={errors?.billingAddress?.street2}
                      message={errors?.billingAddress?.street2?.message}>
                      <TextInput
                        type="text"
                        placeholder={t('common:addressLine2')}
                        register={register('billingAddress.street2')}
                      />
                    </ErrorValidationMessage>
                    <ErrorValidationMessage
                      touched={errors?.billingAddress?.city}
                      message={errors?.billingAddress?.city?.message}>
                      <TextInput
                        type="text"
                        placeholder={t('common:city') + ' *'}
                        register={register('billingAddress.city')}
                      />
                    </ErrorValidationMessage>
                    <div className="grid grid-cols-2 gap-5">
                      <ErrorValidationMessage
                        touched={errors?.billingAddress?.state}
                        message={errors?.billingAddress?.state?.message}>
                        <CustomSelect
                          control={control}
                          name="billingAddress.state"
                          options={statesWithId}
                          placeholder={t('step2.selectState') + ' *'}
                        />
                      </ErrorValidationMessage>
                      <ErrorValidationMessage
                        touched={errors?.billingAddress?.zipCode}
                        message={errors?.billingAddress?.zipCode?.message}>
                        <TextInput
                          type="text"
                          placeholder={t('common:zipCode') + ' *'}
                          register={register('billingAddress.zipCode')}
                        />
                      </ErrorValidationMessage>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCloseModal}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            <div className="flex gap-2">{t('common:save')}</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAddressModal;
