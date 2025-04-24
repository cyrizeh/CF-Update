import { Button, Modal, Spinner } from 'flowbite-react';
import Image from 'next/image';
import closeIcon from '@/public/icons/close-button.svg';
import useCreateParentClinicModal from './useCreateParentClinicModal';
import TextInput from '@/components/Forms/TextInput/TextInput';

const CreateParentClinicModal = ({ isOpen, setIsOpen }: any) => {
  const { clinic, error, isLoading, changeClinicName, setError, createNewClinic, rootRef } =
    useCreateParentClinicModal(setIsOpen);

  const onCloseModal = () => {
    changeClinicName('');
    setError('');
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} data-testid="create-parent-clinic-modal">
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-center p-5" data-testid="create-parent-clinic-modal-header">
          <div data-testid="create-parent-modal-title" className="text-3xl font-light">
            Add an account
          </div>

          <div
            data-testid="create-parent-clinic-modal-close-button"
            className="absolute right-4 cursor-pointer"
            onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body data-testid="create-parent-clinic-modal-body">
          <div>
            <TextInput
              data-testid="create-parent-clinic-name-input"
              type="text"
              placeholder="Account name"
              value={clinic}
              onChange={changeClinicName}
              error={error}
            />
            <div data-testid="create-parent-clinic-name-input-error-message" className="pt-2 text-xs text-rose-400">
              {error}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer data-testid="create-parent-clinic-modal-footer" className="justify-between">
          <Button data-testid="create-parent-clinic-cancel-button" color="transparent" onClick={setIsOpen}>
            Cancel
          </Button>

          <Button
            data-testid="create-parent-clinic-create-button"
            type="submit"
            gradientDuoTone="primary"
            onClick={createNewClinic}>
            {isLoading ? (
              <div data-testid="create-parent-loading-indicator" className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> Loading...
              </div>
            ) : (
              <div>Create</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateParentClinicModal;
