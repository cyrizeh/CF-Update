import usePatientMutation from '@/api/mutations/usePatientMutation';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import closeIcon from '@/public/icons/close-button.svg';
import { handleResponseErrorsWithSucceedResult } from '@/utils/handleBackendErrors';
import { autoCompleteValidation } from '@/validations/autoComplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetchPatientData: any;
}

interface FormValues {
  clinicData: {
    name: string;
    id: string;
  };
  facilityData: {
    name: string;
    id: string;
  };
}

const MergeTranspPatientToStoragePatientModal = ({ isOpen, onClose, refetchPatientData }: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const { updatePatientDonorInfo } = usePatientMutation(router.query.id as string);

  const linkedAccSchema = Yup.object().shape({
    clinicData: autoCompleteValidation('Please select a clinic from the dropdown list'),
    facilityData: autoCompleteValidation('Please select a facility from the dropdown list'),
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    // @ts-ignore
    resolver: yupResolver(linkedAccSchema),
  });
  function onCloseModal() {
    reset();
    onClose();
  }

  const { mergeTrasportationUserToStorageUser } = usePatientMutation(router.query.id as string);

  const mergeToStoragePatient = async (data: FormValues) => {
    await mergeTrasportationUserToStorageUser
      .trigger({
        patientId: router.query.id as string,
        clinicId: data?.clinicData?.id,
        facilityId: data?.facilityData?.id,
      })
      .then(reason => {
        if (reason?.data?.errors) {
          handleResponseErrorsWithSucceedResult(reason?.data);
        }
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleResponseErrorsWithSucceedResult(reason.response.data.errors);
        }
      })
      .finally(() => {
        // @ts-ignore
        refetchPatientData?.(undefined, { revalidate: true });
        onCloseModal();
      });
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('mergeToStoragePatient')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="flex flex-col gap-5">
                <ErrorValidationMessage
                  touched={errors?.clinicData?.name || errors?.clinicData}
                  message={errors?.clinicData?.name?.message || errors?.clinicData?.message}>
                  <Autocomplete2
                    defaultValue={watch('clinicData.name')}
                    url="/clinics"
                    control={control}
                    name={'clinicData'}
                    error={errors?.clinicData?.name || errors?.clinicData}
                    placeholder={t('step4.clinic')}
                    customOptionField="name"
                  />
                </ErrorValidationMessage>
                <ErrorValidationMessage
                  touched={errors?.facilityData?.name || errors?.facilityData}
                  message={errors?.facilityData?.name?.message || errors?.facilityData?.message}>
                  <Autocomplete2
                    defaultValue={watch('facilityData.name')}
                    url="/facilities"
                    control={control}
                    name={'facilityData'}
                    error={errors?.facilityData?.name || errors?.facilityData}
                    placeholder={t('step4.facility')}
                    customOptionField="name"
                  />
                </ErrorValidationMessage>
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(mergeToStoragePatient)}
                disabled={updatePatientDonorInfo?.isMutating}>
                {updatePatientDonorInfo?.isMutating ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> {t('common:loading')}
                  </div>
                ) : (
                  <div className="flex gap-2">{t('common:confirm')}</div>
                )}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MergeTranspPatientToStoragePatientModal;
