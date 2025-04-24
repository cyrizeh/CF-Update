import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import AddNotesModal from '@/features/PatientOverview/components/AddNotesModal';
import useToggleModal from '@/hooks/useToggleModal';
import PencilAlt from '@/public/icons/PencilAlt';
import PlusIcon from '@/public/icons/PlusIcon';
import { hasPermission } from '@/utils';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Button, Textarea } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export type TNotes = {
  id: string;
  text: string;
  isDisabled: boolean;
  created: string;
  lastModified: string;
  orderNumber?: number;
  author?: string;
  caneId: string;
};

const CaneNotes = ({ notes, title, refetchNotes }: { notes: any; title: string; refetchNotes?: any }) => {
  // utils
  const router = useRouter();
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { t } = useTranslation('notes');
  const { userPermissions } = usePermissions();
  const isUserCanCreateNotes = hasPermission(userPermissions, 'create:notes');
  const isUserCanUpdateNotes = hasPermission(userPermissions, 'update:notes');
  // states
  const [notesList, setNotesList] = useState<TNotes[] | []>([]);
  const textAreaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  // apis
  const { addCaneNote, updateCaneNote } = useInventoryMutation();
  // fns
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

  const changeTextStatus = (caneNote: TNotes) => async () => {
    if (!caneNote.isDisabled) {
      await updateCaneNote
        .trigger({
          caneId: router?.query?.id as string,
          text: caneNote.text,
          noteId: caneNote.id,
        })
        .then(() => {
          toast.success('Cane Note was edited');
          toggleNoteStatus(caneNote.id, notesList, setNotesList);
        })
        .catch(reason => {
          if (reason?.response?.data?.errors) {
            handleBackendErrors(reason.response.data.errors);
          }
        })
        .finally(() => {
          refetchNotes?.();
        });
    } else {
      toggleNoteStatus(caneNote.id, notesList, setNotesList);
    }
  };

  const changeText = (id: string) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newList = JSON.parse(JSON.stringify(notesList));
    const item = newList.find((item: { id: string }) => item.id === id);
    item.text = e.target.value;
    setNotesList(newList);

    adjustHeight(e.target);
  };

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

  const addNotes = async (newNote: string) =>
    await addCaneNote
      .trigger({
        caneId: router?.query?.id as string,
        text: newNote,
      })
      .then((response: any) => {
        const { data } = response;
        setNotesList((prev: any) => {
          return [{ ...data, isDisabled: true }, ...prev];
        });
        toast.success('Notes added');
        onCloseModal();
        refetchNotes?.();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        refetchNotes?.();
      });

  useEffect(() => {
    if (notes?.length) {
      const newList = notes.map((note: any) => {
        return { ...note, isDisabled: true };
      });
      setNotesList(newList);
    }
  }, [notes]);

  useEffect(() => {
    Object.values(textAreaRefs.current).forEach(adjustHeight);
  }, [notesList]);

  return (
    <div
      className={`my-2 flex min-w-full max-w-[370px] flex-col items-center gap-3  rounded-md border border-transparent p-4 sm:p-8  md:max-w-full dark:bg-[#1E2021] `}>
      <div className="flex w-full items-center justify-between">
        <span className=" text-2xl font-normal text-white">{title}</span>
        {isUserCanCreateNotes && (
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
        <div className="w-full">
          {notesList?.map(note => (
            <div key={note.id} className="mt-8 flex items-center justify-between gap-2">
              <div className="flex w-full flex-col">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                  <div className="flex flex-col text-start">
                    {note.author && (
                      <span className="text-start text-sm font-normal text-gray-300">{`Note added by ${
                        note.author
                      } at ${formatDataWithTime(note.created)}`}</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex w-full flex-row items-center gap-4">
                  <Textarea
                    ref={el => (textAreaRefs.current[note.id] = el)}
                    value={note.text}
                    disabled={note.isDisabled}
                    onChange={changeText(note.id)}
                    className="custom-vertical-scrollbar my-2 max-h-[500px] min-h-[70px] resize-none rounded-md px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]"
                  />
                  {isUserCanUpdateNotes && (
                    <Button className=" w-[100px]" outline gradientDuoTone="primary" onClick={changeTextStatus(note)}>
                      <div className="mr-2">
                        <PencilAlt />
                      </div>
                      {note.isDisabled ? t('edit') : t('save')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CaneNotes;
