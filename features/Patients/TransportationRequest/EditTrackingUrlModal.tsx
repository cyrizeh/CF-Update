import React, { useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useForm, FormProvider } from 'react-hook-form';
import Image from 'next/image';
import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { editTrakingUrlSchema } from '@/validations/transportation';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { useGetTransportationInfo } from '@/api/queries/transportation.queries';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onClose: (isSubmitted?: boolean) => void;
  updateDetails: (data: any) => Promise<any>;
  refetchTransportations: () => void;
  requestId: string;
};

const EditTrackingUrlModal = ({ isOpen, onClose, updateDetails, requestId, refetchTransportations }: Props) => {
  const { t } = useTranslation('transportation');
  const rootRef = useRef<HTMLDivElement>(null);
  const { createTank } = useFacilityMutation();

  const { data: request, isLoading: isRequestLoading } = useGetTransportationInfo(requestId);
  const { handleSubmit, ...formProps } = useForm<ViewTypes.TrackingUrlFormValues>({
    resolver: yupResolver(editTrakingUrlSchema),
  });

  const isLoading = createTank.isMutating;

  useEffect(() => {
    if (request) {
      formProps.setValue('url', request.transportationDetails.trackingUrl);
    }
  }, [request]);

  const onSubmit = (data: any) => {
    const updatedRequest = {
      facilityId: request?.facilityId,
      account: request?.account,
      shipperNumber: request?.transportationDetails?.shipperNumber,
      shipmentType: request?.transportationDetails?.shipmentType,
      shipmentSentDate: request?.transportationDetails?.shipmentSentDate,
      shipmentReceivedDate: request?.transportationDetails?.shipmentSentDate,
      trackingUrl: data.url,
      transportationRequestId: request.id,
      numberOfCanes: request?.numberOfCanes,
      numberOfDevices: request?.numberOfDevices,
    };
    updateDetails({ ...updatedRequest })
      .then(() => {
        onClose(true);
        toast.success('The transportation link edited');
        refetchTransportations();
      })
      .catch(error => {
        toast.error('Failed to edit transportation link');
      });
  };

  // function handleClearForm() {
  //   formProps.reset();
  // }

  const onCloseModal = (isSubmitted?: boolean) => {
    // handleClearForm();
    formProps.reset();
    onClose(isSubmitted);
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} size="md" onClose={() => onCloseModal()}>
        <div className="flex items-center justify-between p-5">
          <div></div>
          <div className="text-3xl font-light">{'Edit tracking link'}</div>
          <div className="cursor-pointer" onClick={() => onCloseModal()}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <FormProvider handleSubmit={handleSubmit} {...formProps}>
            {isRequestLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="xs" className="mt-[-1px]" />
              </div>
            ) : (
              <form className="flex max-w-md flex-col gap-4">
                <ErrorValidationMessage
                  touched={formProps?.formState?.errors?.url}
                  message={formProps?.formState?.errors?.url?.message}>
                  <TextInput
                    type="text"
                    placeholder={'Tracking link'}
                    register={formProps.register('url')}
                    error={formProps.formState.errors?.url}
                  />
                </ErrorValidationMessage>
              </form>
            )}
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onCloseModal}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('loading')}
              </div>
            ) : (
              <div className="flex gap-2">{t('common:save')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditTrackingUrlModal;
