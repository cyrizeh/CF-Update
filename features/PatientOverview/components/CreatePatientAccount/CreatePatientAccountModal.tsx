import usePatientMutation from '@/api/mutations/usePatientMutation';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import closeIcon from '@/public/icons/close-button.svg';
import { PatientStatus } from '@/types/Patients.enum';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { PatientAccountStatus } from '@/types/view/PatientOverviewProps.interface';
import { handleBackendErrors, handleResponseErrorsWithSucceedResult } from '@/utils/handleBackendErrors';
import { autoCompleteValidation } from '@/validations/autoComplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Label, Modal, Radio, Spinner, Tooltip } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetchPatientData: any;
  patient: any;
}

interface FormValues {
  onBoardingType: OnboardingType;
  witness: any;
}

const CreatePatientAccountModal = ({ isOpen, onClose, refetchPatientData, patient }: Props) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('patients');

  const canCreateAccount =
    patient?.accountStatus === PatientAccountStatus.Inactive && patient?.patientStatus === PatientStatus.Created;

  const validationSchema = Yup.object().shape({
    witness: Yup.mixed()
      .nullable()
      .when('onBoardingType', {
        is: (value: any) => value === OnboardingType.FullOnboard,
        then: () => autoCompleteValidation('Please select a witness from the dropdown list'),
        otherwise: schema => schema.notRequired(),
      }),
    onBoardingType: Yup.string().required('Please select Onboarding Type'),
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
    trigger,
  } = useForm<FormValues>({
    // @ts-ignore
    resolver: yupResolver(validationSchema),
  });
  function onCloseModal() {
    reset();
    onClose();
  }

  const { createAccount } = usePatientMutation(router.query.id as string);

  const initiateOnboarding = async (data: FormValues) => {
    if (!patient?.email) {
      const erorMsg = t('initiateOnboardingError');
      toast.error(erorMsg);
      return;
    }

    await createAccount
      .trigger({
        patientId: router.query.id as string,
        onboardingType: data?.onBoardingType,
        witnessId: data?.witness?.id || null,
      })
      .then(reason => {
        if (reason?.data?.errors) {
          handleResponseErrorsWithSucceedResult(reason?.data);
        }
      })
      .catch(reason => {
        if (!_.isEmpty(reason?.response?.data?.errors)) {
          handleBackendErrors(reason.response.data.errors);
        } else if (!!reason?.response?.data?.detail) {
          toast.error(reason?.response?.data?.detail);
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
              <div className="text-3xl font-light dark:text-white"> {t('initiateOnboarding')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div className="flex flex-col gap-5">
                <div>
                  <Label>{t('step5.onBoardingType.title')}</Label>
                  <Label htmlFor="fullOnboard" className="flex items-center gap-2 pl-1">
                    <Radio
                      id="fullOnboard"
                      name="fullOnboard"
                      checked={watch('onBoardingType') === OnboardingType.FullOnboard}
                      onClick={() => {
                        setValue('onBoardingType', OnboardingType.FullOnboard);
                        trigger('onBoardingType');
                      }}
                    />
                    {t('step5.onBoardingType.fullOnboard')}
                  </Label>

                  <Label htmlFor="paymentsOnboardPlusLogin" className="flex items-center gap-2 pl-1">
                    <Radio
                      id="paymentsOnboardPlusLogin"
                      name="paymentsOnboardPlusLogin"
                      checked={watch('onBoardingType') === OnboardingType.PaymentsOnboardPlusLogin}
                      onClick={() => {
                        setValue('onBoardingType', OnboardingType.PaymentsOnboardPlusLogin);
                        trigger('onBoardingType');
                      }}
                    />
                    {t('step5.onBoardingType.paymentsOnboardPlusLogin')}
                  </Label>
                  {
                    <div className="flex gap-3">
                      <Label
                        htmlFor="justPatientLogin"
                        className={`flex items-center gap-2 pl-1 ${!canCreateAccount && 'opacity-50'}`}>
                        <Radio
                          id="justPatientLogin"
                          name="justPatientLogin"
                          checked={watch('onBoardingType') === OnboardingType.JustPatientLogin}
                          onClick={() => {
                            setValue('onBoardingType', OnboardingType.JustPatientLogin);
                            trigger('onBoardingType');
                          }}
                          disabled={!canCreateAccount}
                          className={`${!canCreateAccount && 'opacity-30'}`}
                        />
                        {t('step5.onBoardingType.justPatientLogin')}
                      </Label>
                      {!canCreateAccount && (
                        <Tooltip content={t('tooltip.typeExists')} className="text-sm font-normal italic">
                          <HiInformationCircle className="relative h-5 w-5" color="#828282" />
                        </Tooltip>
                      )}
                    </div>
                  }
                  {errors?.onBoardingType && (
                    <ErrorValidationMessage
                      touched={errors?.onBoardingType}
                      message={errors?.onBoardingType?.message}
                      style={{
                        label: {
                          fontSize: '14px',
                          marginTop: '5px',
                        },
                      }}></ErrorValidationMessage>
                  )}
                </div>
                {watch('onBoardingType') === OnboardingType.FullOnboard && (
                  <ErrorValidationMessage touched={errors?.witness} message={errors?.witness?.message}>
                    <Autocomplete2
                      defaultValue={watch('witness')}
                      url="/Witness"
                      control={control}
                      error={errors?.witness}
                      name="witness"
                      placeholder={'Select consent witness *'}
                      isPrefilled
                    />
                  </ErrorValidationMessage>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button
                type="submit"
                gradientDuoTone="primary"
                onClick={handleSubmit(initiateOnboarding)}
                disabled={createAccount?.isMutating}>
                {createAccount?.isMutating ? (
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

export default CreatePatientAccountModal;
