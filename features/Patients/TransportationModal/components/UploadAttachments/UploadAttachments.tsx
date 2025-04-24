import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import { Button, FileInput } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const UploadAttachments = () => {
  const { t } = useTranslation('transportation');
  const inputRef = useRef<any>(null);
  const [file, setFile] = useState<any>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = (e: any) => {
    // setValue('shipment.attachments', e[0]);
    setFile(e[0]);
  };

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      onChange(selectedFiles);
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
      onChange(droppedFiles);
    },
    [onChange]
  );

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  useEffect(() => {
    setFile({});
    // setValue('shipment.attachments', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, setValue } = useFormContext<ViewTypes.TransportationFormValues>();

  return (
    <div className="flex justify-between gap-2">
      <TextInput
        disabled
        type="text"
        placeholder={t('shipmentInfo.file')}
        value={file ? file.name : t('shipmentInfo.file')}
        // register={register('shipment.attachments')}
      />

      <div onDragOver={handleDragOver} onDrop={handleDrop}>
        <label onClick={openFileDialog}>
          <Button className="h-full w-[120px]" gradientDuoTone="primary">
            Upload
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
    </div>
  );
};
