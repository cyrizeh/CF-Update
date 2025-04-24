import { ViewTypes } from '@/types';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import closeIcon from '@/public/icons/close-button.svg';
import { SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import { addSpecimanToStrawSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import AddSpecimen from './AddSpecimen';

interface AddSpecimenModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchPatientInfo: any;
  specimenData: (SpecimanDetailsByCane & { deviceId?: string }) | null | undefined;
}

const AddSpecimenModal = ({ isOpen, onClose, refetchPatientInfo, specimenData }: AddSpecimenModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('specimens');
  const { handleSubmit, ...formProps } = useForm<ViewTypes.AddSpecimenToStrawFormValues>({
    // @ts-ignore
    resolver: yupResolver(addSpecimanToStrawSchema),
    defaultValues: {
      specimentype: specimenData?.specimenType || '',
      PGTResults: specimenData?.pgtResults || '',
      deviceId: specimenData?.deviceId || '',
      id: specimenData?.id || '',
      gradeMaturity: specimenData?.gradeMaturity || '',
      embryoOocyteCount: specimenData?.embryoOocyteNumber || '',
    },
  });
  const { createSpecimen, updateSpecimen } = useInventoryMutation();
  const isLoading = createSpecimen?.isMutating;

  function onCloseModal() {
    onClose();
    formProps?.reset();
  }

  const handleUpdateCaneData = (data: ViewTypes.AddSpecimenToStrawFormValues) => {
    try {
      const updatedDevice = {
        embryoOocyteNumber: data?.embryoOocyteCount || null,
        gradeMaturity: data?.gradeMaturity || null,
        pgtResults: data?.PGTResults || null,
      };
      if (data?.id) {
        updateSpecimen.trigger({ ...updatedDevice, id: data?.id }).then((response: any) => {
          onClose();
          // @ts-ignore
          refetchPatientInfo(undefined, { revalidate: true });
        });
      } else if (data?.deviceId) {
        createSpecimen.trigger({ ...updatedDevice, deviceId: data?.deviceId }).then((response: any) => {
          onClose();
          // @ts-ignore
          refetchPatientInfo(undefined, { revalidate: true });
        });
      }
    } catch (err: any) {
      const data = err?.response?.data?.errors || [];

      const result = [];
      for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          if (key.split('.')[2] === 'freezeDate') {
            result.push('Please select the correct freeze date.');
          } else {
            const array = data[key];
            const joinedString = array.join(' ');
            result.push(joinedString);
          }
        }
      }

      const finalString = result.join(' ');
      return toast.error(finalString);
    }
  };

  useEffect(() => {
    if (!specimenData?.id) {
      formProps?.reset({
        specimentype: specimenData?.specimenType || '',
        PGTResults: '',
        deviceId: specimenData?.deviceId || '',
        id: '',
        gradeMaturity: '',
        embryoOocyteCount: '',
      });
    } else {
      formProps?.reset({
        specimentype: specimenData?.specimenType || '',
        PGTResults: specimenData?.pgtResults || '',
        deviceId: specimenData?.deviceId || '',
        id: specimenData?.id || '',
        gradeMaturity: specimenData?.gradeMaturity || '',
        embryoOocyteCount: specimenData?.embryoOocyteNumber || '',
      });
    }
  }, [specimenData, isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">
                {!specimenData?.id ? t('modal.addSpecimen') : t('modal.editSpecimen')}
              </div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <FormProvider handleSubmit={handleSubmit} {...formProps}>
                <AddSpecimen />
              </FormProvider>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(handleUpdateCaneData)}
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

export default AddSpecimenModal;
