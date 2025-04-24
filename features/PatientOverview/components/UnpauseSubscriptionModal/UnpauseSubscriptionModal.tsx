import React, { useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import DateField from '@/components/Forms/DateField/DateField';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import closeIcon from '@/public/icons/close-button.svg';

interface UnpauseSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string }) => void;
  date?: string;
  label: string;
}

interface DateFormValues {
  date: string;
}

const UnpauseSubscriptionModal: React.FC<UnpauseSubscriptionModalProps> = ({ isOpen, onClose, date, onSubmit, label }) => {
  const { t } = useTranslation('patients');
  const rootRef = useRef<HTMLDivElement>(null);

  const formMethods = useForm<DateFormValues>({
    // @ts-ignore
    resolver: yupResolver(
      Yup.object().shape({
        date: Yup.date()
          .required(t('please_select_a_date'))
          .transform((value, originalValue) =>
            originalValue === '' || dayjs(originalValue, 'MM/DD/YYYY', true).isValid() ? value : null
          )
          .min(dayjs().subtract(6, 'month').subtract(1, 'day'), t('date_cannot_be_more_than_6_months')),
      })
    ),
  });

  const { handleSubmit, setError, clearErrors, control, formState, reset, setValue } = formMethods;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (date && isOpen) {
      setValue('date', dayjs(date).format('MM/DD/YYYY'));
    }
  }, [date, isOpen, setValue]);

  const onCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-center text-2xl font-light">{label}</div>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <FormProvider {...formMethods}>
            <form className="flex max-w-md flex-col gap-4">
              <ErrorValidationMessage touched={!!errors?.date} message={errors?.date?.message}>
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

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
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

export default UnpauseSubscriptionModal;
