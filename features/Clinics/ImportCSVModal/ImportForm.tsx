import { useFormContext } from 'react-hook-form';
import fileIcon from '@/public/icons/file.svg';
import Image from 'next/image';
import { AiOutlineSearch } from 'react-icons/ai';
import { Button, FileInput } from 'flowbite-react';
import { ViewTypes } from '@/types';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { MdDelete } from 'react-icons/md';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import useToggleModal from '@/hooks/useToggleModal';
import CreateClinicModal from '../CreateClinicModal/CreateClinicModal';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

const ImportForm = () => {
  const [file, setFile] = useState<any>({ name: '', size: '' });
  const {
    isModalOpen: isAddNewModalOpen,
    onCloseModal: onCloseAddNewModal,
    onOpenModal: onOpenAddNewModal,
  } = useToggleModal();

  const {
    watch,
    setValue,
    control,
    formState: {
      errors: { details: errors },
    },
  } = useFormContext<ViewTypes.ImportFormValues>();

  const onChange = (e: any) => {
    setFile(e[0]);
    setValue('file', e[0] || null);
  };

  const inputRef = useRef<any>(null);

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      onChange(selectedFiles);
    },
    [onChange]
  );

  const removeUploadFile = () => {
    setFile(null);
  };

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
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <form className="">
      {!file?.size ? (
        <div onDragOver={handleDragOver} onDrop={handleDrop} className="flex w-full items-center justify-center py-5">
          <label
            onClick={openFileDialog}
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop CSV here
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Max. File Size: 30MB</p>

              <p
                className="mt-6 flex items-center justify-center gap-4 rounded-lg  bg-gradient-to-r from-cryo-blue
                 to-cryo-cyan px-2 py-2 text-sm font-medium
                ">
                <AiOutlineSearch className="" /> <span>Browse File</span>
              </p>
            </div>
          </label>
          <FileInput id="file" className="hidden" ref={inputRef} onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between rounded-md border border-[#616161] bg-[#292B2C] p-2 ">
            <div className="flex items-center">
              <Image src={fileIcon} alt="file" />

              <div className="flex flex-col px-4">
                <span className="text-sm font-normal text-gray-300 ">{file.name}</span>
                <span className="text-xs font-normal text-[#828282]">{file.size}B</span>
              </div>
            </div>

            <MdDelete color="white" className="padding-4 cursor-pointer" onClick={removeUploadFile} />
          </div>
          <span className="text-sm font-normal text-[#828282]">Attach this CSV to a clinic or create a new one:</span>
          <div>
            <div className="flex w-full gap-4">
              <ErrorValidationMessage
                touched={errors?.clinic?.name || errors?.clinic}
                message={errors?.clinic?.name?.message || errors?.clinic?.message}
                style={{
                  container: {
                    width: '100%',
                  },
                }}>
                <Autocomplete2
                  defaultValue={watch('details.clinic')}
                  url="/clinics"
                  control={control}
                  name="details.clinic"
                  error={errors?.clinic}
                  placeholder={'Select clinic'}
                />
              </ErrorValidationMessage>

              <Button outline gradientDuoTone="primary" className="w-1/4" onClick={onOpenAddNewModal}>
                + Add New
              </Button>
            </div>
            <DynamicNamespaces namespaces={['clinics']} fallback="Loading...">
              <CreateClinicModal isOpen={isAddNewModalOpen} setIsOpen={onCloseAddNewModal} revalidate={() => {}} />
            </DynamicNamespaces>
          </div>
        </div>
      )}
    </form>
  );
};

export default ImportForm;
