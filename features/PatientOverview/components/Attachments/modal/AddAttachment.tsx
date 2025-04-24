import { axiosInstance } from '@/api/axiosConfig';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import closeIcon from '@/public/icons/close-button.svg';
import { PatientPersonalDetails } from '@/types/view/PatientOverviewProps.interface';
import { Button, FileInput, Label, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface AddAttachmentProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientPersonalDetails;
  refetchAttachmentsList: any;
}

interface Attachment {
  file: File;
  isVisibleForPatient: boolean;
  isUploaded?: boolean;
  id: string;
}

interface FormValues {
  attachments: Attachment[];
  makeVisibleForAll: boolean;
}

const AddAttachment: React.FC<AddAttachmentProps> = ({ isOpen, onClose, patient, refetchAttachmentsList }) => {
  const { t } = useTranslation('attachments');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { control, handleSubmit, reset, watch, setValue, register } = useForm<FormValues>({
    defaultValues: {
      attachments: [],
      makeVisibleForAll: false,
    },
  });

  const attachments = watch('attachments');
  const allIsVisible = watch('makeVisibleForAll');
  const filesCount = attachments?.length;

  const addNewAttachment: SubmitHandler<FormValues> = async data => {
    if (!Array.isArray(data.attachments) || !data.attachments.length) {
      return;
    }

    for (let i = 0; i < data.attachments.length; i++) {
      const attachment = data.attachments[i];
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', attachment.file, attachment.file.name);
      formData.append('isVisibleForPatient', attachment.isVisibleForPatient.toString());
      try {
        await axiosInstance.post(`/admin/patients/${patient?.id}/attachments`, formData);

        toast.success(`Attachment added: ${attachment.file.name}`);
      } catch (error: any) {
        toast.error(`Error: ${attachment.file.name}. ${error?.response?.data?.errors?.FileName?.[0]}`);
      } finally {
        setIsUploading(false);
        refetchAttachmentsList();
        onCancel();
      }
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target?.files || []);
      const newAttachments = selectedFiles.map(file => ({ id: uuidv4(), file, isVisibleForPatient: allIsVisible }));
      setValue('attachments', [...attachments, ...newAttachments]);
    },
    [attachments, setValue, allIsVisible]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const droppedFiles = Array.from(event.dataTransfer?.files || []);
      const newAttachments = droppedFiles.map(file => ({
        id: uuidv4(),
        file,
        isVisibleForPatient: allIsVisible,
      }));
      setValue('attachments', [...attachments, ...newAttachments]);
    },
    [attachments, setValue, allIsVisible]
  );

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const onCancel = () => {
    reset({
      attachments: [],
      makeVisibleForAll: false,
    });
    onClose();

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleMakeVisibleForAllChange = () => {
    const currentMakeVisibleForAll = watch('makeVisibleForAll');
    const newMakeVisibleForAll = !currentMakeVisibleForAll;
    reset({
      makeVisibleForAll: newMakeVisibleForAll,
      attachments: attachments.map(attachment => ({
        ...attachment,
        isVisibleForPatient: newMakeVisibleForAll,
      })),
    });
  };

  const removeAttachment = (id: string) => {
    const updatedAttachments = attachments.filter(attachment => attachment.id !== id);
    setValue('attachments', updatedAttachments);
    if (updatedAttachments?.length === 0) {
      setValue('makeVisibleForAll', false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleAttachmentCheckboxChange = (id: string, value: boolean) => {
    const updatedAttachments = attachments.map(attachment =>
      attachment?.id === id ? { ...attachment, isVisibleForPatient: value } : attachment
    );
    setValue('attachments', updatedAttachments);
    if (!value) {
      setValue('makeVisibleForAll', false);
    } else {
      const allChecked = updatedAttachments.every(att => att.isVisibleForPatient);
      if (allChecked) {
        setValue('makeVisibleForAll', true);
      }
    }
  };

  useEffect(() => {
    const allChecked = attachments.length > 0 && attachments.every(attachment => attachment.isVisibleForPatient);
    if (allChecked !== allIsVisible) {
      setValue('makeVisibleForAll', allChecked);
    }
  }, [attachments, allIsVisible, setValue]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="xl" onClose={onCancel}>
        <div className="flex items-center justify-center p-4">
          <div className="text-3xl font-light">{t('modal.title')}</div>
          <div className="absolute right-4 cursor-pointer" onClick={onCancel}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>
        <Modal.Body className="mb-4 flex flex-col gap-4 max-h-[calc(100vh-270px)]">
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> {t('modal.uploading')}
            </div>
          ) : (
            <>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="rounded-lg border-dark-grey-300 bg-dark-grey-400 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-dark-grey-300 dark:bg-dark-grey-400 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500">
                <label onClick={openFileDialog}>
                  <Button className="text w-full cursor-pointer" outline gradientDuoTone="primary">
                    {filesCount
                      ? `${filesCount} ${filesCount > 1 ? 'files' : 'file'} ${t('modal.selected')}`
                      : t('modal.uploadPlaceholder')}
                  </Button>
                </label>
                <FileInput
                  accept=".pdf,.jpg,.bmp,.jpeg"
                  id="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleFileSelect}
                  multiple
                />
              </div>
              {attachments?.map((attachment, index) => (
                <div key={attachment.id} className="flex items-center justify-between gap-2">
                  <p className="w-1/2 break-words text-sm">{attachment.file.name}</p>
                  <div className="flex w-1/2 justify-end gap-3">
                    <Label htmlFor={`isVisibleForPatient-${index}`} className="flex items-center gap-2 pl-1">
                      <Controller
                        name={`attachments.${index}.isVisibleForPatient`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Checkbox
                              {...field}
                              checked={watch(`attachments.${index}.isVisibleForPatient`)}
                              label={t('modal.visibleForPatient')}
                              register={{ name: `attachments.${index}.isVisibleForPatient` }}
                              onChange={() => {
                                handleAttachmentCheckboxChange(attachment?.id, !attachment?.isVisibleForPatient);
                              }}
                            />
                          );
                        }}
                      />
                    </Label>
                    <MdDelete
                      color="white"
                      className="cursor-pointer"
                      onClick={() => removeAttachment(attachment.id)}
                    />
                  </div>
                </div>
              ))}
              {!!attachments?.length && (
                <div className="mt-4 flex items-center justify-between">
                  <Label htmlFor="makeVisibleForAll" className="flex items-center gap-2">
                    <Controller
                      name="makeVisibleForAll"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={handleMakeVisibleForAllChange}
                          label={t('modal.visibleForAll')}
                          register={{ name: 'makeVisibleForAll' }}
                        />
                      )}
                    />
                  </Label>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCancel}>
            {t('modal.cancel')}
          </Button>
          <Button
            type="submit"
            gradientDuoTone="primary"
            onClick={handleSubmit(addNewAttachment)}
            disabled={isUploading}>
            <div className="flex gap-2">{t('modal.submit')}</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAttachment;
