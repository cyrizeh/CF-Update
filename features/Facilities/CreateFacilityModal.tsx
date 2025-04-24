import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { Facility } from '@/types/view';
import { getValidationSchema } from '@/validations/facility';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FacilityForm from './FacilityForm';
import { handleBackendErrors } from '@/utils/handleBackendErrors';

type Props = {
  isOpen: boolean;
  onClose: (isSubmitted?: boolean) => void;
  facilityData?: Facility;
};

const CreateFacilityModal = ({ isOpen, onClose, facilityData }: Props) => {
  const { t } = useTranslation('facilities');
  const rootRef = useRef<HTMLDivElement>(null);
  const { createFacility, updateFacility } = useFacilityMutation();

  const { handleSubmit, ...formProps } = useForm<ViewTypes.FacilityFormValues>({
    // @ts-ignore
    resolver: yupResolver(getValidationSchema()),
  });

  const isLoading = createFacility.isMutating || updateFacility?.isMutating;

  function handleClearForm() {
    formProps.reset();
  }

  const handleCreateFacility = async (data: ViewTypes.FacilityFormValues) => {
    if (data?.id) {
      updateFacility
        .trigger({ ...data, facilityId: data?.id })
        .then(() => {
          onCloseModal(true);
        })
        .catch(reason => {
          if (reason?.response?.data?.errors) {
            handleBackendErrors(reason.response.data.errors);
          }
        });
    } else {
      createFacility
        .trigger({ ...data })
        .then(() => {
          onCloseModal(true);
        })
        .catch(reason => {
          if (reason?.response?.data?.errors) {
            handleBackendErrors(reason.response.data.errors);
          }
        });
    }
  };

  const onSubmit = (data: ViewTypes.FacilityFormValues) => {
    handleCreateFacility(data);
  };

  const onCloseModal = (isSubmitted?: boolean) => {
    handleClearForm();
    onClose(isSubmitted);
  };

  useEffect(() => {
    if (facilityData) {
      // Set the form values when facilityData is provided
      formProps.reset({
        address: facilityData?.address,
        name: facilityData?.name,
        id: facilityData?.id,
      });
    } else {
      handleClearForm();
    }
  }, [facilityData, formProps.reset]);

  return (
    <div ref={rootRef} data-testid="facility-modal-root">
      <Modal
        root={rootRef.current ?? undefined}
        show={isOpen}
        size="md"
        onClose={() => onCloseModal()}
        data-testid="create-facility-modal">
        <div className="flex items-center justify-between p-5" data-testid="facility-modal-header">
          <div></div>
          <div className="text-3xl font-light" data-testid="facility-modal-title">
            {!!facilityData?.id ? t('modal.updateFacility') : t('modal.createFacility')}
          </div>
          <div className="cursor-pointer" onClick={() => onCloseModal()} data-testid="facility-modal-close-button">
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body className="max-h-[calc(100vh-270px)]" data-testid="facility-modal-body">
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            <FacilityForm />
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between" data-testid="facility-modal-footer">
          <Button color="transparent" onClick={onCloseModal} data-testid="facility-modal-footer-cancel-button">
            {t('common:cancel')}
          </Button>

          <Button
            type="submit"
            gradientDuoTone="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            data-testid="facility-modal-footer-submit-button">
            {isLoading ? (
              <div className="flex items-center gap-2" data-testid="facility-modal-footer-loading-spinner">
                <Spinner size="sm" className="mt-[-1px]" /> {t('loading')}
              </div>
            ) : (
              <div className="flex gap-2">{!!facilityData?.id ? t('common:save') : t('common:add')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateFacilityModal;
