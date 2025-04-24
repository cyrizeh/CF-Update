import usePatientMutation from '@/api/mutations/usePatientMutation';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { StorageDurationNames } from '@/constants/billing';
import closeIcon from '@/public/icons/close-button.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  storageDuration: string;
  clinicStoragePrices: any[];
  onSubmit: (data: ChangeStoragePlanFormValues) => void;
}

interface ChangeStoragePlanFormValues {
  storagePlan: string;
}

const ChangeStoragePlanModal = ({
  isOpen,
  onClose,
  storageDuration,
  clinicStoragePrices,
  onSubmit,
}: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');

  const { updatePatientDonorInfo } = usePatientMutation(router.query.id as string);

  const changePlanSchema = Yup.object().shape({
    storagePlan: Yup.string().trim().required('Please select a storage plan from the dropdown list'),
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ChangeStoragePlanFormValues>({
    // @ts-ignore
    resolver: yupResolver(changePlanSchema),
  });
  function onCloseModal() {
    reset();
    onClose();
  }


  useEffect(() => {
    if (isOpen) {
      setValue('storagePlan', storageDuration);
    }
  }, [storageDuration, isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white"> {t('changeStoragePlan.title')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <ErrorValidationMessage touched={errors?.storagePlan} message={errors?.storagePlan?.message}>
                <div className="sensitive">
                  <CustomSelect
                    dataTestId="change-storage-plan-select"
                    control={control}
                    name={'storagePlan'}
                    options={
                      clinicStoragePrices?.map(el => ({
                        value: el.storageDuration,
                        label: StorageDurationNames[el.storageDuration],
                      })) || []
                    }
                    placeholder={t('changeStoragePlan.selectPlan')}
                    value={watch('storagePlan')}
                    error={errors?.storagePlan}
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
                onClick={handleSubmit(onSubmit)}
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

export default ChangeStoragePlanModal;
