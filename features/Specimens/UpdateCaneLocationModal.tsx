import { ViewTypes } from '@/types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import closeIcon from '@/public/icons/close-button.svg';
import { updateCaneLocationSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import UpdateCaneLocationForm from './UpdateCaneLocationForm';
import { Cane } from '@/types/view/Specimen.interface';
import useTransfersMutation from '@/api/mutations/useTransfersMutation';
import { toast } from 'react-toastify';

interface UpdateCaneLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (value?: string) => void;
  refetchCanesInfo: (id: any, options?: any) => void;
  canes: Cane[];
  transferId: string;
  clinicName: string;
  clinicId: string;
  caneDetails?: any;
  closeModalAndChangeState?: (value?: string) => void; // Todo: use for stay at clinic to reset rows chsckboxes, find better solution
}

const UpdateCaneLocationModal = ({
  isOpen,
  onClose,
  canes, // for transfer out and stay at clinic
  transferId,
  refetchCanesInfo,
  clinicName,
  caneDetails, // for cane details to change location
  onConfirm,
  closeModalAndChangeState,
}: UpdateCaneLocationModalProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCane, setActiveCane] = useState<number>(0); // on stay at clinic we have several steps
  const { t } = useTranslation('specimens');
  const { updateCaneLocation } = useTransfersMutation();
  const { handleSubmit, reset, ...formProps } = useForm<ViewTypes.UpdateCaneLocationFormValues>({
    // @ts-ignore
    resolver: yupResolver(updateCaneLocationSchema),
  });

  const handleUpdateCaneLocation = async () => {
    await updateCaneLocation({
      slotId: formProps?.getValues()?.slotId || '',
      caneId: canes[activeCane]?.id,
      transferId,
    })
      .then(() => {
        toast.success('Cane status updated successfully');
      })
      .catch(() => {
        toast.error('Error updating status');
      });
  };

  const onSubmit = async () => {
    await handleUpdateCaneLocation();
    reset();
    // used in Stay at Clinic Logic
    if (activeCane < canes.length - 1) {
      setActiveCane(prev => prev + 1);
    } else {
      closeModalAndCheckUpdatedInfo();
    }
  };

  const handleConfirm = async () => {
    onConfirm?.(formProps?.getValues()?.slotId || '');
  };

  const closeModalAndCheckUpdatedInfo = () => {
    // @ts-ignore
    refetchCanesInfo(undefined, { revalidate: true });
    setActiveCane(0);
    onClose();
    reset();
    if (activeCane === canes.length - 1) {
      closeModalAndChangeState?.();
    }
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
                <div className="flex flex-row">Update cane location</div>
              </div>

              <div className="h-5 w-5 cursor-pointer" onClick={closeModalAndCheckUpdatedInfo}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)]">
              {clinicName ? (
                <p className="mb-2 text-sm font-normal leading-[21px] text-gray-100">Clinic: {clinicName}</p>
              ) : null}
              <p className="sensitive mb-2 text-sm font-normal leading-[21px] text-gray-100">
                Patient: {canes[activeCane]?.patient?.firstAndLast}
              </p>
              {canes[activeCane]?.rfid && (
                <p className="mb-4 text-sm font-normal leading-[21px] text-gray-100">RFID: {canes[activeCane]?.rfid}</p>
              )}
              <div className="space-y-6">
                <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} reset={reset} {...formProps}>
                    <UpdateCaneLocationForm isOpen={isOpen} caneDetails={caneDetails} withSlotId />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex w-full justify-between">
                <Button color="transparent" onClick={closeModalAndCheckUpdatedInfo}>
                  {t('common:cancel')}
                </Button>

                {caneDetails ? (
                  <Button gradientDuoTone="primary" onClick={handleSubmit(handleConfirm)}>
                    {t('common:confirm')}
                  </Button>
                ) : (
                  <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
                    {activeCane < canes.length - 1 ? t('common:next') : t('common:finish')}
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateCaneLocationModal;
