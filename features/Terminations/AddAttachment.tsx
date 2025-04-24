import { Button, FileInput, Modal } from 'flowbite-react';
import { ChangeEvent, useCallback, useRef, useState } from 'react';

import closeIcon from '@/public/icons/close-button.svg';
import { axiosInstance } from '@/api/axiosConfig';
import Image from 'next/image';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';
import { Spinner } from 'flowbite-react';

const AddAttachment = ({ isOpen, onClose, id, terminationRequestId, onSubmit }: any) => {
  const { t } = useTranslation('attachments');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const filesCount = attachments?.length;

  const addNewAttachment = async () => {
    if (!Array.isArray(attachments) || !attachments?.length) {
      return;
    }

    for (const file of attachments) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('specimenTerminationId', id);
      try {
        const { data } = await axiosInstance.put(
          `/TerminationRequests/${terminationRequestId}/notarizedFile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        onSubmit();
        toast.success(`Attachment added: ${file.name}`);
      } catch (error: any) {
        toast.error(`Error: ${file.name}. ${error?.response?.data?.errors?.FileName[0] || "Couldn't upload file"}`);
      }
    }
    setIsUploading(false);
    setAttachments([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClose();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = (files: any[]) => {
    setAttachments(files);
  };

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      onChange(Array.from(selectedFiles || []));
    },
    [onChange]
  );

  const handleDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      const droppedFiles = event.dataTransfer.files;
      onChange(Array.from(droppedFiles || []));
    },
    [onChange]
  );

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onCancel = () => {
    setAttachments([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="xl" onClose={onCancel}>
        <div className="flex items-center justify-center p-4">
          <div className="text-3xl font-light">{t('modal.title')}</div>

          <div className="absolute right-4 cursor-pointer" onClick={onCancel}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>
        <Modal.Body className="mb-4 flex flex-col gap-4">
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> Uploading attachments...
            </div>
          ) : (
            <>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="pX-2.5 rounded-lg border-dark-grey-300 bg-dark-grey-400 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-dark-grey-300 dark:bg-dark-grey-400 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500">
                <label onClick={openFileDialog}>
                  <Button className="text w-full cursor-pointer" outline gradientDuoTone="primary">
                    {filesCount
                      ? `${filesCount} ${filesCount > 1 ? 'files' : 'file'} selected`
                      : t('modal.uploadPlaceholder')}
                  </Button>
                </label>
                <FileInput
                  accept=".pdf,.jpg,.bmp,.jpeg"
                  id="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleFileSelect}
                />
              </div>
              {attachments?.map((file: any) => {
                return (
                  <span className="text-sm" key={file.name}>
                    {file.name}
                  </span>
                );
              })}
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCancel}>
            {t('modal.cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={addNewAttachment} disabled={isUploading}>
            <div className="flex gap-2">{t('modal.submit')}</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAttachment;
