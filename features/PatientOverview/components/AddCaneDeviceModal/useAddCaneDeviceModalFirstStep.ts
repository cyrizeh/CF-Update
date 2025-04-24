import useReadersMutation from '@/api/mutations/useReaderMutation';
import { ViewTypes } from '@/types';
import { RFIDType } from '@/types/view/AddSpecimanModal.type';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export type ItemList = { id: string; name: string };
export type PieList = { id: string; color: string };

const useAddSpecimensModal = (isOpen: boolean) => {
  const { setValue, trigger, watch } = useFormContext<ViewTypes.AddSpecimanModalFormValues>();

  // set Reader RFID
  const { getReaderTag, getReaderTagType } = useReadersMutation();
  const isReaderRFIDLoading = getReaderTag?.isMutating;
  const [isZeroTagsLoading, setIsZEroTagsLoading] = useState(false);
  const handleReaderRFID = (id: string) => {
    setIsZEroTagsLoading(true);
    const fetchReaderTag = () => {
      if (
        !isOpen ||
        watch('caneData.rfidType') !== RFIDType.Reader ||
        Number(watch('currentStep')) !== 1 || // if we change step
        watch('caneData.rfidReader') !== id
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
            setValue('caneData.rfidReaderId', res?.data?.at(0)?.UID?.at(0) || '');
            setValue('caneData.rfId', res?.data?.at(0)?.UID?.at(0) || '');
            // If tag is found, get the type for the item
            if (res?.data?.at(0)?.UID?.at(0)) {
              getReaderTagType
                ?.trigger({
                  readerId: id,
                  tagId: res?.data?.at(0)?.UID?.at(0) || '',
                })
                .then(response => {
                  const type = response?.data?.Ident || '';
                  setValue('caneData.rfidItemType', type || '');
                });
              setIsZEroTagsLoading(false);
              trigger('caneData.rfId');
            }
          } else if (res?.data?.length === 0 || res?.data?.at(0)?.UID?.length === 0) {
            setValue('caneData.rfId', '');
            setValue('caneData.rfidItemType', '');
            setValue('caneData.rfidReaderId', '');
            fetchReaderTag(); // Attempt fetching again
          } else {
            // Multiple tags case
            setValue('caneData.rfidReaderId', 'multiple');
            setValue('caneData.rfId', '');
            setValue('caneData.rfidItemType', '');
            setIsZEroTagsLoading(false);
          }
          trigger('caneData.rfidReaderId');
        })
        .catch(() => {
          setValue('caneData.rfidReaderId', 'error');
          setValue('caneData.rfId', '');
          setValue('caneData.rfidItemType', '');
          setIsZEroTagsLoading(false);
          trigger(['caneData.rfId', 'caneData.rfidReaderId']);
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

export default useAddSpecimensModal;
