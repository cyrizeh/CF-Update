import { Button, Modal } from 'flowbite-react';
import Image from 'next/image';
import closeIcon from '@/public/icons/close-button.svg';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ImportForm from './ImportForm';
import * as Yup from 'yup';
import { axiosInstance } from '@/api/axiosConfig';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { ViewTypes } from '@/types';
import { useRef } from 'react';
import { autoCompleteValidation } from '@/validations/autoComplete';

const ImportCSVModal = ({ isOpen, onClose }: ViewTypes.ImportCSV) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { handleSubmit, ...formProps } = useForm<ViewTypes.ImportFormValues>({
    // @ts-ignore
    resolver: yupResolver(
      Yup.object().shape({
        details: Yup.object().shape({
          clinic: autoCompleteValidation('Please select a clinic from the dropdown list'),
        }),
      })
    ),
  });

  const onSubmit = async (data: ViewTypes.ImportFormValues) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('clinicId', data.details.clinic.id);

    try {
      const res = await axiosInstance.post('/imports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      });

      const headers = JSON.stringify(res.data.headers);
      const availableFields = JSON.stringify(res.data.availableFields);

      localStorage.setItem('availableFields', availableFields);
      localStorage.setItem('headers', headers);
      localStorage.setItem('id', res.data.importDataId);

      return router.push(`/admin/clinics/import`);
    } catch (err: any) {
      toast.error(err?.response.data?.errors?.File[0] || err?.response.data);
    }
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="xl" onClose={onClose}>
        <div className="flex items-center justify-center p-5">
          <div className="text-3xl font-light">Import patients</div>

          <div className="absolute right-7 h-5 w-5 cursor-pointer" onClick={onClose}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="items-center px-8 max-h-[calc(100vh-270px)]">
          <div className="pb-4 text-start text-sm font-normal text-[#828282]">
            <p>Upload a CSV to import customer data to your inventory</p>
          </div>
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <ImportForm />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="px- justify-between pt-0">
          <div className="flex w-full justify-between">
            <Button color="transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
              Upload
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImportCSVModal;
