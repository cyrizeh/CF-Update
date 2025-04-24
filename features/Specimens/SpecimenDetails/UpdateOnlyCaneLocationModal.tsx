import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { updateCaneLocationSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import UpdateCaneLocationForm from '../UpdateCaneLocationForm';

interface UpdateCaneLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchCanesInfo: () => void;
  caneDetails?: any;
}

const UpdateCaneLocationModal = ({ isOpen, onClose, refetchCanesInfo, caneDetails }: UpdateCaneLocationModalProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('specimens');
  const { updateCaneLocation } = useInventoryMutation();
  const { handleSubmit, reset, ...formProps } = useForm<ViewTypes.UpdateCaneLocationFormValues>({
    // @ts-ignore
    resolver: yupResolver(updateCaneLocationSchema),
  });

  const handleUpdateCaneLocation = async (data: ViewTypes.UpdateCaneLocationFormValues) => {
    if (caneDetails?.slotId === data?.slotId) {
      toast.warning('Cane is already at this location');
      return;
    }
    await updateCaneLocation
      .trigger({
        slotId: data?.slotId || '',
        caneId: caneDetails?.id,
      })
      .then(() => {
        toast.success('Cane status updated successfully');
        refetchCanesInfo();
        onClose();
        reset();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        } else {
          toast.error('Error updating status');
        }
      })
      .finally(() => {});
  };

  const closeModalAndCheckUpdatedInfo = () => {
    refetchCanesInfo();
    onClose();
    reset();
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={closeModalAndCheckUpdatedInfo}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className="h-5 w-5"></div>

              <div className="text-3xl font-light dark:text-white">
                <div className="flex flex-row">{t('modal.updateCaneLocation')}</div>
              </div>

              <div className="h-5 w-5 cursor-pointer" onClick={closeModalAndCheckUpdatedInfo}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)]">
              <p className="mb-2 text-sm font-normal leading-[21px] text-gray-100">
                {t('modal.clinic')}: {caneDetails?.clinicName}
              </p>
              <p className="mb-2 text-sm font-normal leading-[21px] text-gray-100">
                {t('modal.patient')}: {caneDetails?.patient?.firstAndLast}
              </p>
              <p className="mb-4 text-sm font-normal leading-[21px] text-gray-100">
                {t('modal.rfid')}: {caneDetails?.rfid}
              </p>
              <div className="space-y-6">
                <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} reset={reset} {...formProps}>
                    <UpdateCaneLocationForm isOpen={isOpen} caneDetails={caneDetails} withSlotId={false} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex w-full justify-between">
                <Button color="transparent" onClick={closeModalAndCheckUpdatedInfo}>
                  {t('common:cancel')}
                </Button>
                <Button gradientDuoTone="primary" type="submit" onClick={handleSubmit(handleUpdateCaneLocation)}>
                  {t('common:confirm')}
                </Button>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateCaneLocationModal;
