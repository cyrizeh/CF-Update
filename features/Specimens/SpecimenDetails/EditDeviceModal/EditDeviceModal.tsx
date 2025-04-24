import { ViewTypes } from '@/types';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import closeIcon from '@/public/icons/close-button.svg';
import { SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { EditDeviceItemSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import EditDevice from './EditDevice';
import { formInitValues, mapFormValuesFromDeviceData, mapUpdateDeviceData } from './EditDeviceModal.utils';

interface EditDevicemodalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchPatientInfo: any;
  caneId: string;
  deviceData: SpecimanDetailsByCane | null | undefined;
}

const EditDeviceModal = ({ isOpen, onClose, refetchPatientInfo, caneId, deviceData }: EditDevicemodalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('specimens');
  const { handleSubmit, ...formProps } = useForm<ViewTypes.EditSpecimanModalFormValues>({
    // @ts-ignore
    resolver: yupResolver(EditDeviceItemSchema),
    defaultValues: mapFormValuesFromDeviceData(deviceData),
  });
  const { updateDevice, createDevice } = useInventoryMutation();
  const isLoading = updateDevice?.isMutating || createDevice?.isMutating;

  function onCloseModal() {
    onClose();
    formProps?.reset();
  }

  const handleUpdateDeviceData = async (data: ViewTypes.EditSpecimanModalFormValues) => {
    const updatedDevice = mapUpdateDeviceData(data, caneId);
    await updateDevice
      .trigger(updatedDevice)
      .then(() => {
        onClose();
        // @ts-ignore
        refetchPatientInfo(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  useEffect(() => {
    if (!deviceData) {
      formProps?.reset(formInitValues);
    } else {
      formProps?.reset(mapFormValuesFromDeviceData(deviceData));
    }
  }, [deviceData, isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">
                {deviceData ? t('modal.editDevice') : t('modal.addDevice')}
              </div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)] overflow-y-scroll">
              <FormProvider handleSubmit={handleSubmit} {...formProps}>
                <EditDevice />
              </FormProvider>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(handleUpdateDeviceData)}
                disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
                  </div>
                ) : (
                  <div className="flex gap-2">{t('common:save')}</div>
                )}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditDeviceModal;
