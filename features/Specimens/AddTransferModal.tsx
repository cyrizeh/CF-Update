/* eslint-disable complexity */
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import { Button, Label, Modal } from 'flowbite-react';
import DateField from '@/components/Forms/DateField/DateField';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

interface AddTransferModalTypes {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  message: string;
  title: string;
  selectClinic?: boolean;
  validationSchema?: any;
}

const AddTransferModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  selectClinic,
  validationSchema,
}: AddTransferModalTypes) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    ...formProps
  } = useForm<ViewTypes.AddTransferModalFormValues>({
    // @ts-ignore
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    formProps.reset();
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onClose}>
        <div className="flex items-center justify-between p-5">
          <div className="h-5 w-5"></div>

          <div className="text-3xl font-light dark:text-white">
            <div className="flex flex-row">{title}</div>
          </div>

          <div className="h-5 w-5 cursor-pointer" onClick={onClose}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>
        <Modal.Body className="max-h-[650px] text-sm font-normal leading-[21px] text-gray-100">
          <div className="mx-8 mb-4  mt-0 space-y-6">
            <div className="max-h-[470px] overflow-y-scroll">
              <form className="flex  w-full flex-col gap-4">
                <div className="text-md text-start font-normal text-[#828282]">
                  <p>{message}</p>
                </div>
                <Label>
                  Date
                  <div className="mt-3">
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

                {selectClinic && (
                  <Label>
                    Receiving clinic
                    <div className="mt-3">
                      <ErrorValidationMessage
                        touched={errors?.clinic?.name || errors?.clinic}
                        message={errors?.clinic?.name?.message || errors?.clinic?.message}>
                        <Autocomplete2
                          defaultValue={watch('clinic')}
                          url="/clinics"
                          control={control}
                          name="clinic"
                          error={errors?.clinic}
                          placeholder={'Select receiving clinic *'}
                          isPrefilled
                        />
                      </ErrorValidationMessage>
                    </div>
                  </Label>
                )}
              </form>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex w-full justify-between p-5  pt-2">
            <Button color="transparent" onClick={onClose}>
              <div className=" font-light dark:text-white">Cancel</div>
            </Button>

            <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onConfirm)}>
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddTransferModal;
