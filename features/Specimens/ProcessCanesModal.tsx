/* eslint-disable complexity */
// @ts-nocheck
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import closeIcon from '@/public/icons/close-button.svg';
import { Button, Modal } from 'flowbite-react';
import { useRef } from 'react';
import ProcessCanesForm from './ProcessCanesForm';

const ProcessCanesModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  validationSchema,
}: ViewTypes.ProcessCanesModalTypes) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { handleSubmit, ...formProps } = useForm<ViewTypes.ProcessCanesFormValues>({
    // @ts-ignore
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });

  const handleConfirm = (data: ViewTypes.ProcessCanesFormValues) => {
    onConfirm(data);
    formProps.reset();
  };

  const onCloseModal = () => {
    onClose();
    formProps.reset();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="flex items-center justify-between p-5">
          <div className="h-5 w-5"></div>

          <div className="text-3xl font-light dark:text-white">
            <div className="flex flex-row">{'Update inventory status'}</div>
          </div>

          <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[650px] text-sm font-normal  leading-[10px] text-gray-100">
          <div className="mx-8 mb-4  mt-0 space-y-6">
            <div className="text-md text-start font-normal text-[#828282]">
              <p>{message}</p>
            </div>

            <div className="max-h-[470px] overflow-y-scroll">
              <FormProvider handleSubmit={handleSubmit(handleConfirm)} {...formProps}>
                <ProcessCanesForm />
              </FormProvider>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex w-full justify-between p-5  pt-2">
            <Button color="transparent" onClick={onCloseModal}>
              <div className=" font-light dark:text-white">Cancel</div>
            </Button>

            <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(handleConfirm)}>
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProcessCanesModal;
