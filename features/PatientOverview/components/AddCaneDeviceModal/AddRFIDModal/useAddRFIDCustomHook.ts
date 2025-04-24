import useReadersMutation from '@/api/mutations/useReaderMutation';
import { RFIDType } from '@/types/view/AddSpecimanModal.type';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EditRFIDFormValues } from './AddRFIDModal';

export type ItemList = { id: string; name: string };
export type PieList = { id: string; color: string };

const useAddRFIDCustomHook = (isOpen: boolean) => {
  const { setValue, trigger, watch } = useFormContext<EditRFIDFormValues>();

  // set Reader RFID
  const { getReaderTag, getReaderTagType } = useReadersMutation();
  const isReaderRFIDLoading = getReaderTag?.isMutating;
  const [isZeroTagsLoading, setIsZEroTagsLoading] = useState(false);
  const handleReaderRFID = (id: string) => {
    setIsZEroTagsLoading(true);
    const fetchReaderTag = () => {
      if (
        !isOpen ||
        watch('rfidType') !== RFIDType.Reader ||
        watch('rfidReader') !== id
      ) {
        // if we change type we need to stop loop
        // Stop further execution if the modal is closed
        setIsZEroTagsLoading(false);
        return;
      }

      getReaderTag
        ?.trigger({ id })
        .then(res => {
          if (res?.data?.at(0)?.UID?.length === 1) {
            setValue('rfidReaderId', res?.data?.at(0)?.UID?.at(0) || '');
            setValue('rfId', res?.data?.at(0)?.UID?.at(0) || '');
            // If tag is found, get the type for the item (Cane/Straw/Vial)
            if (res?.data?.at(0)?.UID?.at(0)) {
              getReaderTagType
                ?.trigger({
                  readerId: id,
                  tagId: res?.data?.at(0)?.UID?.at(0) || '',
                })
                .then(response => {
                  const type = response?.data?.Ident || '';
                  setValue('rfidItemType', type || '');
                });
              setIsZEroTagsLoading(false);
              trigger('rfId');
            }
          } else if (res?.data?.length === 0 || res?.data?.at(0)?.UID?.length === 0) {
            setValue('rfId', '');
            setValue('rfidItemType', '');
            setValue('rfidReaderId', '');
            fetchReaderTag(); // Attempt fetching again
          } else {
            // Multiple tags case
            setValue('rfidReaderId', 'multiple');
            setValue('rfId', '');
            setValue('rfidItemType', '');
            setIsZEroTagsLoading(false);
          }
          trigger('rfidReaderId');
        })
        .catch(() => {
          setValue('rfidReaderId', 'error');
          setValue('rfId', '');
          setValue('rfidItemType', '');
          setIsZEroTagsLoading(false);
          trigger(['rfId', 'rfidReaderId']);
        });
    };

    fetchReaderTag(); // Initial call to start the process
  };

  return {
    handleReaderRFID,
    isReaderRFIDLoading,
    isZeroTagsLoading,
  };
};

export default useAddRFIDCustomHook;
