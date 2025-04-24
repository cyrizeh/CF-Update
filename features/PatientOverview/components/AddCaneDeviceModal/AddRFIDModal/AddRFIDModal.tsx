import { useGetReaders } from '@/api/queries/reader.queries';
import { useGetRfidConfiguration } from '@/api/queries/speciment.queries';
import { useCryoGattContext } from '@/contexts/CryoGattContext/CryoGattContext';
import closeIcon from '@/public/icons/close-button.svg';
import { AddSpecimanModalFormValues, RFIDType } from '@/types/view/AddSpecimanModal.type';
import { EditRFIDSchema } from '@/validations/specimens';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Button, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import AddRFIDForm from './AddRFIDForm';
// Interfaces
interface AddSpecimenModalWithStepsTypes {
  isOpen: boolean;
  onClose: () => void;
  index: number;
}

export interface EditRFIDFormValues {
  rfidType: RFIDType | null;
  rfId: string;
  rfidReader: string | null;
  rfidReaderId: string;
  rfidItemType: string; // Cane/Device/Straw
}

const AddRFIDModal = ({ isOpen, onClose, index }: AddSpecimenModalWithStepsTypes) => {
  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('specimens');

  // Form setup
  const { handleSubmit, ...formProps } = useForm<EditRFIDFormValues>({
    // @ts-ignore
    resolver: yupResolver(EditRFIDSchema),
    defaultValues: {
      rfidType: null,
      rfidReader: '',
      rfidReaderId: '',
      rfidItemType: '',
    },
  });

  const { setValue, watch, trigger } = useFormContext<AddSpecimanModalFormValues>();

  // States
  const [dictionaryRFID, setDictionaryRFID] = useState<Record<string, string>>({});
  const [readersList, setReadersList] = useState<any[]>([]);

  // Context and API Queries
  // To show the type which was scanned Cane/Straw/Vial/Specimen
  const { canUseScanner } = useCryoGattContext();
  const { data: dictionary } = useGetRfidConfiguration(canUseScanner);
  const { data: readers } = useGetReaders(canUseScanner);

  // Functions
  function onCloseModal() {
    onClose();
    formProps?.reset({
      rfidType: null,
      rfidReader: '',
      rfidReaderId: '',
      rfidItemType: '',
    });
  }

  const handleSave = (data: EditRFIDFormValues) => {
    setValue(`specimensData.${index}.rfidType`, data.rfidType);
    setValue(`specimensData.${index}.rfId`, data.rfId);
    setValue(`specimensData.${index}.rfidReader`, data.rfidReader);
    setValue(`specimensData.${index}.rfidReaderId`, data.rfidReaderId);
    setValue(`specimensData.${index}.rfidItemType`, data.rfidItemType);
    trigger([
      `specimensData.${index}.rfidType`,
      `specimensData.${index}.rfId`,
      `specimensData.${index}.rfidReader`,
      `specimensData.${index}.rfidReaderId`,
      `specimensData.${index}.rfidItemType`,
    ]);
    onClose();
  };

  // useEffect hooks
  useEffect(() => {
    if (dictionary) {
      setDictionaryRFID(dictionary);
    }
  }, [dictionary]);

  useEffect(() => {
    if (readers) {
      const list = readers.map((item: any) => {
        return {
          label: item?.Name,
          value: item?.Id,
        };
      });
      setReadersList(list);
    }
  }, [readers]);

  useEffect(() => {
    if (isOpen) {
      // Fetch existing RFID data for the specified index from specimensData
      const existingData = watch(`specimensData.${index}`);
      if (existingData && (existingData.rfId || existingData.rfidType)) {
        // Set the form values with the existing data
        formProps?.setValue('rfidType', existingData.rfidType);
        formProps?.setValue('rfId', existingData.rfId);
        formProps?.setValue('rfidReader', existingData.rfidReader);
        formProps?.setValue('rfidReaderId', existingData.rfidReaderId);
        formProps?.setValue('rfidItemType', existingData.rfidItemType);
      }
    }
  }, [isOpen, index]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className={classNames('h-5 w-5')}></div>

              <div className="text-3xl font-light dark:text-white">{'Edit RFID'}</div>

              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="space-y-6">
                <div className="max-h-[calc(100vh-270px)] overflow-y-scroll" ref={scrollRef}>
                  <FormProvider handleSubmit={handleSubmit} {...formProps}>
                    <AddRFIDForm isOpen={isOpen} dictionaryRFID={dictionaryRFID} readersList={readersList} />
                  </FormProvider>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full p-5 pt-2">
                <div className="flex w-full justify-between">
                  <Button color="transparent" onClick={onCloseModal} className="dark:text-white">
                    {t('common:cancel')}
                  </Button>

                  <Button gradientDuoTone="primary" onClick={handleSubmit(handleSave)} disabled={false}>
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

export default AddRFIDModal;
