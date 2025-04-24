import usePickListMutation from '@/api/mutations/usePickListMutation';
import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import closeIcon from '@/public/icons/close-button.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Label, Modal } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import * as Yup from 'yup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mutate: KeyedMutator<any>;
}

interface PickListChooseReaderFormValues {
  adminData: any;
}

const PickListAssignToModal = ({ isOpen, onClose, mutate }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('pickList');
  const router = useRouter();
  const pickListId = router.query.id as string;
  const isAutoCompleteRequired = true;
  const validationSchema = Yup.object().shape({
    adminData: Yup.mixed().test('clinic-check', `Please select admin from dropdown`, value => {
      if (typeof value === 'string') return !isAutoCompleteRequired;
      // check id if user entered data
      return Yup.object({
        email: isAutoCompleteRequired ? Yup.string().required() : Yup.string().notRequired(),
        id: Yup.string().when('name', {
          is: (value: any) => !!value,
          then: schema => schema.required(),
          otherwise: schema => schema.notRequired(),
        }),
      }).isValidSync(value);
    }),
  });

  const formMethods = useForm<PickListChooseReaderFormValues>({
    // @ts-ignore
    resolver: yupResolver(validationSchema),
    defaultValues: {
      adminData: '',
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = formMethods;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  function onCloseModal() {
    reset();
    onClose();
  }

  const { assignPickToAdminList } = usePickListMutation();

  function assignToAdmin(data: PickListChooseReaderFormValues) {
    assignPickToAdminList
      ?.trigger({ pickListId: pickListId, adminPickListId: data?.adminData?.id })
      .then(res => {
        // @ts-ignore
        mutate(undefined, { revalidate: true });

        onClose();
      })
      .catch(() => {
        toast.error('Please choose another admin');
      });
  }

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onCloseModal}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div></div>
              <div className="text-3xl font-light dark:text-white">{t('assign_to')}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onCloseModal}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <FormProvider {...formMethods}>
                <div className="flex flex-col">
                  <Label>
                    {t('assign_to')}
                    <Autocomplete2
                      defaultValue={watch('adminData')}
                      url="/users/admins"
                      control={control}
                      name={'adminData'}
                      error={errors?.adminData}
                      placeholder={t('assign_to')}
                      customOptionField="email"
                    />
                  </Label>
                  <ErrorValidationMessage touched={!!errors.adminData} message={errors.adminData?.message} />
                </div>
              </FormProvider>
            </Modal.Body>

            <Modal.Footer className="justify-between">
              <Button color="transparent" onClick={onCloseModal}>
                {t('common:cancel')}
              </Button>

              <Button type="submit" gradientDuoTone="primary" onClick={handleSubmit(assignToAdmin)}>
                {t('common:confirm')}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PickListAssignToModal;
