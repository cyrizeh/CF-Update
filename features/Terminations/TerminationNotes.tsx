import useTranslation from 'next-translate/useTranslation';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import useToggleModal from '@/hooks/useToggleModal';
import { Button } from 'flowbite-react';
import PlusIcon from '@/public/icons/PlusIcon';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import AddNotesModal from '../PatientOverview/components/AddNotesModal';
import useTerminationsMutation from '@/api/mutations/useTerminationsMutation';

export type TNotes = {
  id: string;
  text: string;
  isDisabled: boolean;
  created: string;
  lastModified: string;
  orderNumber?: number;
  author?: string;
  terminationRequestId: string;
};

const TerminationNotes = ({
  notes,
  title,
  terminationRequestId,
  refetchNotes,
}: {
  notes: any;
  title: string;
  terminationRequestId?: string;
  refetchNotes?: any;
}) => {
  const { t } = useTranslation('notes');
  const [notesList, setNotesList] = useState<TNotes[] | []>([]);
  const [selectedReguestId, setSelectedReguestId] = useState<string>(terminationRequestId || '');

  useEffect(() => {
    if (notes?.length) {
      const newList = notes.map((note: any) => {
        return { ...note, isDisabled: true };
      });
      setNotesList(newList);
    }
  }, [notes]);

  const { addTerminationNote } = useTerminationsMutation();
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const addNotes = async (newNote: string) =>
    await addTerminationNote({
      terminationRequestId: selectedReguestId,
      notes: newNote,
    })
      .then((response: any) => {
        const { data } = response;
        setNotesList((prev: any) => {
          return [{ ...data, isDisabled: true }, ...prev];
        });
        toast.success('Notes added');
        refetchNotes(undefined, { revalidate: true });
        onCloseModal();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className=" text-2xl font-normal text-white">{title}</span>
        {terminationRequestId && (
          <Button gradientDuoTone="primary" onClick={onOpenModal}>
            <div className="mr-2">
              <PlusIcon />
            </div>
            {t('add')}
          </Button>
        )}
      </div>
      <AddNotesModal isOpen={isModalOpen} onClose={onCloseModal} addNotes={addNotes} />

      {!_.isEmpty(notesList) ? (
        <div className="pt-4">
          {notesList?.map(n => (
            <div key={n.id} className="mt-8 flex items-center justify-between gap-2">
              <div className="flex w-full flex-col">
                <div className="flex flex-col text-start">
                  {n.author && (
                    <span className="text-start text-sm font-normal text-gray-300">{`Note added by ${
                      n.author
                    } at ${formatDataWithTime(n.created)}`}</span>
                  )}
                </div>

                <div className="flex items-center justify-start gap-2 pt-4 text-sm font-normal text-white">
                  {n.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default TerminationNotes;
