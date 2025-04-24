import usePatientMutation from '@/api/mutations/usePatientMutation';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import closeIcon from '@/public/icons/close-button.svg';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
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

interface LinkedAccFormValues {
  userData: {
    email: string;
    id: string;
  };
}

const LinkedAccModal = ({ isOpen, onClose, refetchPatientData }: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const { query } = useRouter();
  const { updatePatientDonorInfo } = usePatientMutation(router.query.id as string);

  const linkedAccSchema = Yup.object().shape({
    userData: autoCompleteValidation('Please select a patient from the dropdown list'),
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm<LinkedAccFormValues>({
    // @ts-ignore
    resolver: yupResolver(linkedAccSchema),
  });
  function onCloseModal() {
    reset();
    onClose();
  }

  const { addLinkedAcc } = usePatientMutation(query.id as string);

  const handleLinkedAccCreate = async (data: LinkedAccFormValues) => {
    await addLinkedAcc
      .trigger({
        partnerId: data?.userData?.id,
        patientId: query.id as string,
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        onCloseModal();
        refetchPatientData?.();
      });
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal} size={'3xl'}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white"> {t('linkedAcc.addLinkedAcc')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="mb-3 flex w-full flex-col text-[16px] font-normal text-gray-50">
                <p className="text-start font-['Inter'] text-lg font-light text-white">
                  <span className="font-semibold">{t('linkedAcc.warning')}</span>
                  <span>{t('linkedAcc.warningMsg')}</span>
                </p>
              </div>
              <ErrorValidationMessage
                touched={errors?.userData?.email || errors?.userData}
                message={errors?.userData?.email?.message || errors?.userData?.message}>
                <div className="sensitive">
                  <Autocomplete2
                    defaultValue={watch('userData.email')}
                    url="/admin/patients/linkPatients"
                    control={control}
                    name={'userData'}
                    error={errors?.userData?.email || errors?.userData}
                    placeholder={t('linkedAcc.placeholder')}
                    customOptionField="email"
                    mapOptionName={(el: any) => {
                      return `${el?.firstAndLast}${el?.email ? `: ${el?.email}` : ''}`;
                    }}
                  />
                </div>
              </ErrorValidationMessage>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(handleLinkedAccCreate)}
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

export default LinkedAccModal;
