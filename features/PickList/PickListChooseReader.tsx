import { useGetReaders } from '@/api/queries/reader.queries';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { useCryoGattContext } from '@/contexts/CryoGattContext/CryoGattContext';
import closeIcon from '@/public/icons/close-button.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Label, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
  readers: any[];
  initialValue?: string | null;
}

interface PickListChooseReaderFormValues {
  rfidReader: string;
}

const PickListChooseReaderModal = ({ isOpen, onClose, onSubmit, readers, initialValue }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('pickList');

  const validationSchema = Yup.object().shape({
    rfidReader: Yup.string().required('Reader is required'),
  });

  const formMethods = useForm<PickListChooseReaderFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      rfidReader: '',
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (isOpen) {
      if (initialValue) {
        setValue('rfidReader', initialValue);
      }
    } else {
      reset();
    }
  }, [isOpen, initialValue, reset, setValue]);

  function onCloseModal() {
    reset();
    onClose();
  }

  const submitReader = (data: PickListChooseReaderFormValues) => {
    onSubmit(data?.rfidReader);
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('modal.chooseReader')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <FormProvider {...formMethods}>
                {readers?.length > 0 && (
                  <div className="flex flex-col">
                    <Label>
                      {t('modal.reader')}
                      <CustomSelect
                        control={control}
                        name="rfidReader"
                        options={readers}
                        placeholder={`${t('modal.reader')}`}
                        onChange={val => {
                          if (val?.value) {
                            setValue('rfidReader', val.value);
                          }
                        }}
                      />
                    </Label>
                    <ErrorValidationMessage touched={!!errors.rfidReader} message={errors.rfidReader?.message} />
                  </div>
                )}
              </FormProvider>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(submitReader)}>
                {t('common:confirm')}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PickListChooseReaderModal;
