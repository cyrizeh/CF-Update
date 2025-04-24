import usePatientMutation from '@/api/mutations/usePatientMutation';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { PatientSpecimenTypes } from '@/constants/patients';
import closeIcon from '@/public/icons/close-button.svg';
import { ViewTypes } from '@/types';
import { editPatientDonorSchema } from '@/validations/patients';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Label, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propsData: any;
  refetchPatientData: any;
}

const EditDonorInformationModal = ({ isOpen, onClose, propsData, refetchPatientData }: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const { updatePatientDonorInfo } = usePatientMutation(router.query.id as string);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ViewTypes.EditPatientDonorInfo>({
    //@ts-ignore
    resolver: yupResolver(editPatientDonorSchema),
  });
  function onCloseModal() {
    reset({
      specimenTypes: propsData.specimenTypes,
      numberOfCanes: propsData?.numberOfCanes || '',
    });
    onClose();
  }

  const handleDonorCreate = async (data: ViewTypes.EditPatientDonorInfo) => {
    try {
      await updatePatientDonorInfo.trigger({
        ...data,
        specimenTypes: data?.specimenTypes.map(type => type.value),
        patientId: router.query.id,
        numberOfCanes: data?.numberOfCanes || null,
        onboardingType: propsData?.onboardingType || null,
      });
      toast.success('Specimen information updated successfully');
      onClose();
      refetchPatientData();
    } catch {
      const err = t('errors.editDonorInfo');
      toast.error(err);
    }
  };

  useEffect(() => {
    const filteredSpecimenTypes = PatientSpecimenTypes.filter(specimen => propsData?.specimenTypes?.includes(specimen.value));

    if (isOpen) {
      reset({
        specimenTypes: filteredSpecimenTypes,
        numberOfCanes: propsData?.numberOfCanes,
      });
    }
  }, [propsData, isOpen]);

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal} size="md">
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('editDonorInfo')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="mb-3 text-sm font-light dark:text-white">
                <div className="mb-5 flex flex-col gap-5">
                  <Label>
                    {t('specimenTypes')}
                    <div className="mt-0 gap-5">
                      <CustomSelect
                        isMulti
                        options={PatientSpecimenTypes}
                        placeholder={t('specimenTypes')}
                        // @ts-ignore
                        error={errors?.specimenTypes}
                        control={control}
                        name="specimenTypes"
                      />
                    </div>
                  </Label>
                </div>

                <div className="mb-5 flex flex-col gap-5">
                  <div className="mt-0 ">
                    <Label>
                      {t('numberOfCanes')}
                      <ErrorValidationMessage touched={errors?.numberOfCanes} message={errors?.numberOfCanes?.message}>
                        <Controller
                          render={({ field: { onChange, name, value } }) => (
                            <NumericFormat
                              allowNegative={false}
                              name={name}
                              value={value}
                              onValueChange={v => onChange(v.value)}
                              customInput={TextInput}
                              placeholder={t('numberOfCanes')}
                              inputstyles="text-sm font-normal leading-[21px] text-white normal-case"
                            />
                          )}
                          name={'numberOfCanes'}
                          control={control}
                        />
                      </ErrorValidationMessage>
                    </Label>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(handleDonorCreate)}
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

export default EditDonorInformationModal;
