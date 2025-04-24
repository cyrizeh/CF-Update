/* eslint-disable complexity */
// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import useTranslation from 'next-translate/useTranslation';
import DateField from '@/components/Forms/DateField/DateField';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onClose: (isSubmitted?: boolean) => void;
  onSubmit: (data: any) => void;
  date: string;
  label: string;
};

const EditDateModal = ({ isOpen, onClose, date, onSubmit, label }: Props) => {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);
  const { createTank } = useFacilityMutation();

  const { handleSubmit, setError, clearErrors, control, watch, formState, ...formProps } =
    useForm<ViewTypes.DateFormValues>({
      resolver: yupResolver(
        Yup.object().shape({
          date: Yup.date()
            .required('Please select a date')
            .transform((value, originalValue) => {
              return originalValue === '' || dayjs(originalValue, 'MM/DD/YYYY', true).isValid() ? value : null;
            })
            .min(dayjs().subtract(6, 'month').subtract(1, 'day'), 'Date cannot be more than 6 months in the past'),
        })
      ),
    });

  const errors = formState.errors;

  const isLoading = createTank.isMutating;

  useEffect(() => {
    if (date && isOpen) {
      const formattedDate = dayjs(date).format('MM/DD/YYYY');
      formProps.setValue('date', formattedDate);
    }
  }, [date, isOpen]);

  function handleClearForm() {
    formProps.reset();
  }

  const onCloseModal = (isSubmitted?: boolean) => {
    handleClearForm();
    onClose(isSubmitted);
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={() => onCloseModal()}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-center text-2xl font-light">{label}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <FormProvider
            handleSubmit={handleSubmit}
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            {...formProps}>
            <form className="flex max-w-md flex-col gap-4">
              <ErrorValidationMessage touched={errors?.date} message={errors?.date?.message}>
                <DateField
                  minDate={dayjs().subtract(6, 'month')}
                  setError={setError}
                  clearErrors={clearErrors}
                  control={control}
                  name="date"
                  error={errors?.date}
                  placeholder={'MM/DD/YYYY'}
                />
              </ErrorValidationMessage>
            </form>
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCloseModal}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('loading')}
              </div>
            ) : (
              <div className="flex gap-2">{t('common:save')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditDateModal;
