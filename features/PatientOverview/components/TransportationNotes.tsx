import PatientComponentLayout from './PatientComponentLayout';
import useTranslation from 'next-translate/useTranslation';
import { TNotes } from '@/types/view/Notes.type';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import useToggleModal from '@/hooks/useToggleModal';
import { Button, Textarea } from 'flowbite-react';
import AddNotesModal from './AddNotesModal';
import PlusIcon from '@/public/icons/PlusIcon';
import { hasPermission } from '@/utils';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/api/axiosConfig';
import _ from 'lodash';
import PencilAlt from '@/public/icons/PencilAlt';
import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const TransportationNotes = ({
  notes,
  title,
  transportationRequestId,
  refetchNotes,
}: {
  notes: any;
  title: string;
  transportationRequestId?: string;
  refetchNotes?: any;
}) => {
  const [notesList, setNotesList] = useState<TNotes[] | []>([]);
  const [selectedReguestId, setSelectedReguestId] = useState<string>(transportationRequestId || '');
  const textAreaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    Object.values(textAreaRefs.current).forEach(adjustHeight);
  }, [notesList]);

  useEffect(() => {
    if (notes?.length) {
      const newList = notes.map((note: any) => {
        return { ...note, isDisabled: true };
      });
      setNotesList(newList);
    }
  }, [notes]);

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { t } = useTranslation('notes');

  const { userPermissions } = usePermissions();

  const isUserCanCreateNotes = hasPermission(userPermissions, 'create:notes');
  const isUserCanUpdateNotes = hasPermission(userPermissions, 'update:notes');

  const toggleNoteStatus = (
    noteId: string,
    notesList: TNotes[],
    setNotesList: React.Dispatch<React.SetStateAction<TNotes[]>>
  ) => {
    const newList = JSON.parse(JSON.stringify(notesList)) as TNotes[];
    newList.forEach(item => {
      if (item.id === noteId) item.isDisabled = !item.isDisabled;
    });
    setNotesList(newList);
  };

  const changeTextStatus = (n: TNotes) => async () => {
    if (!n.isDisabled) {
      const body = {
        text: n.text,
        transportationRequestId: n.transportationRequestId,
        noteId: n.id,
      };
      try {
        await axiosInstance.put(`/transportations/${n.transportationRequestId}/note/${n.id}`, body);
        toast.success('Notes edited');
        toggleNoteStatus(n.id, notesList, setNotesList);
      } catch (error: any) {
        toast.error(error.response.data?.errors?.Text?.[0] || 'Failed to edit the note');
      } finally {
        refetchNotes?.();
      }
    } else {
      toggleNoteStatus(n.id, notesList, setNotesList);
    }
  };

  const changeText = (id: string) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newList = JSON.parse(JSON.stringify(notesList));
    const item = newList.find((item: { id: string }) => item.id === id);
    item.text = e.target.value;
    setNotesList(newList);

    adjustHeight(e.target);
  };

  const { addTransportationNote } = useTransportationMutation();
  const addNotes = async (newNote: string) =>
    await addTransportationNote
      .trigger({
        transportationRequestId: selectedReguestId,
        text: newNote,
      })
      .then((response: any) => {
        const { data } = response;
        setNotesList((prev: any) => {
          return [{ ...data, isDisabled: true }, ...prev];
        });
        toast.success('Notes added');
        onCloseModal();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        refetchNotes?.();
      });

  const adjustHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      if (textarea.scrollHeight > 500) {
        textarea.style.height = '500px';
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  return (
    <PatientComponentLayout col>
      <div className="flex items-center justify-between">
        <span className=" text-2xl font-normal text-white">{title}</span>
        {transportationRequestId && isUserCanCreateNotes && (
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
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                  <div className="flex flex-col text-start">
                    {n.author && (
                      <span className="text-start text-sm font-normal text-gray-300">{`Note added by ${
                        n.author
                      } at ${formatDataWithTime(n.created)}`}</span>
                    )}
                  </div>
                  {!transportationRequestId && isUserCanCreateNotes && (
                    <Button
                      gradientDuoTone="primary"
                      size="md"
                      onClick={() => {
                        setSelectedReguestId(n.transportationRequestId);
                        onOpenModal();
                      }}>
                      <div className="mr-2">
                        <PlusIcon />
                      </div>
                      {t('add')}
                    </Button>
                  )}
                </div>
                <div className="mt-2 flex w-full flex-row items-center gap-4">
                  <Textarea
                    ref={el => (textAreaRefs.current[n.id] = el)}
                    value={n.text}
                    disabled={n.isDisabled}
                    onChange={changeText(n.id)}
                    className="custom-vertical-scrollbar my-2 max-h-[500px] min-h-[70px] resize-none rounded-md px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]"
                  />
                  {isUserCanUpdateNotes && (
                    <Button className=" w-[100px]" outline gradientDuoTone="primary" onClick={changeTextStatus(n)}>
                      <div className="mr-2">
                        <PencilAlt />
                      </div>
                      {n.isDisabled ? t('edit') : t('save')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </PatientComponentLayout>
  );
};

export default TransportationNotes;
