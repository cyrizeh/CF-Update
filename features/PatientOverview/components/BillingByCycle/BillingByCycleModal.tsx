import usePatientMutation from '@/api/mutations/usePatientMutation';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import { PatientSpecimenTypes } from '@/constants/patients';
import closeIcon from '@/public/icons/close-button.svg';
import { formatDate } from '@/utils/formatDate';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { Button, Label, Modal, Spinner } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { FieldError, useForm, UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import * as yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetchTableData: () => void;
}

interface FormData {
  specimenTypes: string[];
  billingDate: string | null;
}

const validationSchema = yup.object().shape({
  specimenTypes: yup.array().of(yup.string()).min(1, 'Specimen types are required'),
  billingDate: yup
    .string()
    .required('Billing Date is required')
    .test({
      name: 'billingDate-is-not-required',
      message: `Billing Date is invalid`,
      test: (value, { path, createError }) => {
        const date = dayjs(value);
        const yesterday = dayjs().add(-1, 'day');

        if (!_.isEmpty(value) && date.isBefore(yesterday)) {
          return createError({
            message: `Billing Date must be today or later`,
            path: path,
          });
        }
        if (!_.isEmpty(value) && !date.isValid()) {
          return createError({
            message: `Billing Date is invalid`,
            path: path,
          });
        }

        return true;
      },
    }),
});

const BillingByCycleModal = ({ isOpen, onClose, refetchTableData }: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');
  const [selectedSpecimenTypes, setSelectedSpecimenTypes] = useState<string[]>([]);

  const { addBillingCycle } = usePatientMutation(router.query.id as string);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
  } = useForm<FormData>({
    // @ts-ignore
    resolver: yupResolver(validationSchema),
    defaultValues: {
      specimenTypes: [],
      billingDate: null,
    },
  });

  const onCloseModal = () => {
    reset({
      specimenTypes: [],
      billingDate: null,
    });
    setSelectedSpecimenTypes([]);
    onClose();
  };

  const handleCycleAdd = async (data: FormData) => {
    const billingStartDate = data?.billingDate ? formatDate(new Date(data?.billingDate)) : null;
    await addBillingCycle
      .trigger({ ...data, specimenTypes: selectedSpecimenTypes, billingDate: billingStartDate })
      .then(() => {
        refetchTableData();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        onCloseModal();
      });
  };

  const handleChange = (types: { value: string; label: string }[]) => {
    const values = types.map(type => type.value);
    setSelectedSpecimenTypes(values);
    setValue('specimenTypes', values, { shouldValidate: true });
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal} size="md">
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('billingByCycle.addCycle')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="mb-3 text-sm font-light dark:text-white">
                <div className="mb-5 flex flex-col gap-5">
                  <ErrorValidationMessage
                    touched={errors?.specimenTypes as FieldError}
                    message={errors?.specimenTypes?.message}>
                    <Label>
                      {t('specimenTypes')}
                      <div className="mt-0 gap-5">
                        <CustomSelect
                          isMulti
                          options={PatientSpecimenTypes}
                          placeholder={t('specimenTypes')}
                          // @ts-ignore
                          error={errors?.specimenTypes?.message}
                          value={selectedSpecimenTypes.map(value => ({
                            value: value,
                            label: PatientSpecimenTypes.find(specimen => specimen.value === value)?.label || '',
                          }))}
                          name="specimenTypes"
                          onChange={handleChange}
                        />
                      </div>
                    </Label>
                  </ErrorValidationMessage>
                </div>
                <ErrorValidationMessage
                  touched={errors?.billingDate as FieldError}
                  message={errors?.billingDate?.message}>
                  <Label className=" mt-2 text-sm font-normal">{t('billingByCycle.billingStartDate')}</Label>
                  <DateField
                    setError={setError as UseFormSetError<FormData>}
                    clearErrors={clearErrors as UseFormClearErrors<FormData>}
                    control={control}
                    minDate={dayjs()}
                    name="billingDate"
                    // @ts-ignore
                    error={errors?.billingDate?.message}
                    placeholder={t('billingByCycle.billingStartDate')}
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
                onClick={handleSubmit(handleCycleAdd)}
                disabled={addBillingCycle?.isMutating}>
                {addBillingCycle?.isMutating ? (
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

export default BillingByCycleModal;
