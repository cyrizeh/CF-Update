import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { initialDeviceData } from '@/constants/specimens';
import closeIcon from '@/public/icons/close-button.svg';
import { AddDevicesModalFormValues } from '@/types/view/AddSpecimanModal.type';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { addDevicesSeparate } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AddDevicesSeparateForm from './AddDevicesSeparateForm';

interface AddDevicesSeparateModalProps {
  isOpen: boolean;
  onClose: () => void;
  devicesCount: number;
  caneId: string;
  refetchCaneInfo?: (id: any, options?: any) => void;
}

const AddDevicesSeparateModal = ({
  isOpen,
  onClose,
  devicesCount,
  refetchCaneInfo,
  caneId,
}: AddDevicesSeparateModalProps) => {
  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Utils
  const { t } = useTranslation('specimens');
  // Form setup
  const { handleSubmit, ...formProps } = useForm<AddDevicesModalFormValues>({
    // @ts-ignore
    resolver: yupResolver(addDevicesSeparate),
    defaultValues: {
      devices: [initialDeviceData],
    },
  });

  // Functions
  const onCloseModal = () => {
    onClose();
    formProps?.reset();
  };

  const closeModalAndCheckUpdatedInfo = () => {
    refetchCaneInfo?.(undefined, { revalidate: true });
    onCloseModal();
  };

  // Handle Submit
  const { createDevice } = useInventoryMutation();
  const stepClick = async () => {
    if (createDevice?.isMutating) return;
    const deviceData = formProps?.getValues()?.devices;
    const caneId = formProps?.getValues()?.caneId;
    try {
      await createDevice
        .trigger({
          devices: deviceData?.map(device => ({
            caneId: caneId || '',
            expectedSpecimenQty: Number(device?.numberOfSpecimens),
            notes: device?.notes || '',
            quantity: Number(device?.qty),
            specimenType: device?.specimentype,
            color: device?.color || null,
            numberDescription: device?.description || null,
            rfid: device?.rfId || (device?.rfidType ? '' : null),
          })),
        })
        .then(() => {
          refetchCaneInfo?.(undefined, { revalidate: true });
          onClose();
        })
        .catch(reason => {
          if (reason?.response?.data?.errors) {
            handleBackendErrors(reason.response.data.errors);
          }
        });
    } catch (error) {
      console.error('Error in step click:', error);
    }
  };

  useEffect(() => {
    const initialDevices = Array.from({ length: devicesCount }, () => ({
      specimentype: '',
      donorOocyte: false,
      donorSperm: false,
      deviceType: '',
      qty: '',
      color: '',
      notes: '',
      description: '',
      numberOfSpecimens: '1',
      freesedate: null,
      rfId: '',
      rfidType: null,
      rfidReader: null,
      rfidReaderId: '',
      rfidItemType: '',
    }));

    formProps.reset({
      devices: initialDevices,
      caneId: caneId,
    });
  }, [isOpen, devicesCount, caneId]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={closeModalAndCheckUpdatedInfo} size={'7xl'}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>

              <div className="text-3xl font-light dark:text-white">{t('modal.addDevices')}</div>

              <div className="h-5 w-5 cursor-pointer" onClick={closeModalAndCheckUpdatedInfo}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="space-y-6">
                <div className="max-h-[calc(100vh-270px)] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <AddDevicesSeparateForm />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full p-5 pt-2">
                <div className="flex w-full justify-between">
                  <Button color="transparent" onClick={closeModalAndCheckUpdatedInfo} className="dark:text-white">
                    {t('common:cancel')}
                  </Button>

                  <Button
                    gradientDuoTone="primary"
                    onClick={handleSubmit(stepClick)}
                    disabled={createDevice?.isMutating}>
                    {t('common:finish')}
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddDevicesSeparateModal;
