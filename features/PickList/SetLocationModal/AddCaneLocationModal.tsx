import usePickListMutation from '@/api/mutations/usePickListMutation';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { Cane } from '@/types/view/Specimen.interface';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { updateCaneLocationSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AddCaneLocationForm from './AddCaneLocationForm';

interface AddCaneLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchCanesInfo: (id: any, options?: any) => void;
  cane: any | null;
  pickListId: string;
}

const AddCaneLocationModal = ({ isOpen, onClose, cane, refetchCanesInfo, pickListId }: AddCaneLocationModalProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('specimens');
  const { updateCaneLocation } = usePickListMutation();
  const { handleSubmit, reset, ...formProps } = useForm<ViewTypes.UpdateCaneLocationFormValues>({
    // @ts-ignore
    resolver: yupResolver(updateCaneLocationSchema),
  });

  const handleAddCaneLocation = async () => {
    await updateCaneLocation
      .trigger({
        slotId: formProps?.getValues()?.slotId || '',
        caneId: cane?.id || '',
      })
      .then(() => {
        toast.success('Cane location updated successfully');
        reset();
        closeModalAndCheckUpdatedInfo();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        } else {
          toast.error('Error updating location');
        }
      });
  };

  const onSubmit = async () => {
    await handleAddCaneLocation();
  };

  const closeModalAndCheckUpdatedInfo = () => {
    // @ts-ignore
    refetchCanesInfo(undefined, { revalidate: true });
    onClose();
    reset();
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    formProps?.setValue('facilityId', cane?.facilityId || '');
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={closeModalAndCheckUpdatedInfo}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className="h-5 w-5"></div>

              <div className="text-3xl font-light dark:text-white">
                <div className="flex flex-row">Add cane location</div>
              </div>

              <div className="h-5 w-5 cursor-pointer" onClick={closeModalAndCheckUpdatedInfo}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body className="max-h-[calc(100vh-270px)]">
              {cane?.clinicName ? (
                <p data-testid="add-location-clinic" className="mb-2 text-sm font-normal leading-[21px] text-gray-100">
                  Clinic: {cane?.clinicName}
                </p>
              ) : null}
              {cane?.facilityName && (
                <p
                  data-testid="add-location-facility"
                  className="mb-4 text-sm font-normal leading-[21px] text-gray-100">
                  Facility: {cane?.facilityName}
                </p>
              )}
              <div className="space-y-6">
                <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} reset={reset} {...formProps}>
                    <AddCaneLocationForm isOpen={isOpen} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex w-full justify-between">
                <Button
                  data-testid="add-location-cancel-button"
                  color="transparent"
                  onClick={closeModalAndCheckUpdatedInfo}>
                  {t('common:cancel')}
                </Button>

                <Button
                  data-testid="add-location-confirm-button"
                  gradientDuoTone="primary"
                  onClick={handleSubmit(onSubmit)}>
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

export default AddCaneLocationModal;
