import { Button, Modal, Textarea } from 'flowbite-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import closeIcon from '@/public/icons/close-button.svg';

interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNotes: (newNote: string) => Promise<void>;
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({ isOpen, onClose, addNotes }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [newNote, setNewNote] = useState('');
  const { t } = useTranslation('notes');
  const changeNewNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const onCloseModal = () => {
    setNewNote('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setNewNote('');
    }
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="xl" onClose={onCloseModal}>
        <div className="flex items-center justify-center p-5">
          <div className="text-3xl font-light">{t('modal.title')}</div>

          <div className="absolute right-4 cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[calc(100vh-270px)]">
          <div className="flex flex-col gap-5 ">
            <p className="mb-2 text-sm font-normal leading-[21px] text-gray-50">{t('modal.label')}</p>
          </div>

          <Textarea value={newNote} onChange={changeNewNote} className="mb-6 min-h-[100px]" />
        </Modal.Body>

        <Modal.Footer className="my-4 justify-between">
          <Button color="transparent" onClick={onCloseModal} className="capitalize">
            {t('modal.cancel')}
          </Button>

          <Button
            gradientDuoTone="primary"
            onClick={() => {
              addNotes(newNote);
            }}
            className="w-[80px] capitalize">
            {t('modal.submit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNotesModal;
