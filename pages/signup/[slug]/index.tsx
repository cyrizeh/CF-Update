import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/validations/patients';
import { ViewTypes } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import SignupForm from '../SignupForm';
import { toast } from 'react-toastify';

function SignUpPage() {
  const { t } = useTranslation('common');
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [hasSpecimens, setHasSpecimens] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);
  const [isRequestFailed, setIsRequestFailed] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { handleSubmit, setError, ...formProps } = useForm<ViewTypes.SignupFormPropsFormValues>({
    // @ts-ignore
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });

  function handleError(error: { field: any; error: { message: string } }) {
    setError(error.field, { ...error.error });
  }

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_DEV_URL}/Signup/${router.query.slug}`);
        if (response.data.contact) {
          setPhoneNumber(response.data.contact.phoneNumber);
          setEmail(response.data.contact.email);
        }
      } catch (error: any) {
        if (error?.response?.data?.errors) {
          handleBackendErrors(error?.response?.data?.errors);
        } else {
          toast.error(`The URL is invalid or does not exist.`);
        }
      }
    };

    fetchContactData();
  }, [router.query.slug]);

  const onSubmit = (data: ViewTypes.SignupFormPropsFormValues) => {
    setIsRequestLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_DEV_URL}/Signup/${router.query.slug}`, {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim(),
        hasSpecimens: data.hasSpecimens,
        hasPartner: data.hasPartner,
        phoneNumber: data.phoneNumber,
        key: router.query.slug,
      })
      .then(async response => {
        if (response.data.succeeded) {
          await router.push(`/thank-you`);
        } else {
          // if (Array.isArray(response.data.errors)) {
          //   toast.error(`Please check the url. ${response.data.errors[0]} `);
          // } else {
          //   toast.error(`The URL is invalid. Please check the URL and try again`);
          // }
          await router.push(`/not-found`);
        }
      })
      .catch(error => {
        if (error?.response?.data?.errors?.Email) {
          handleError({
            field: 'email',
            error: {
              message: error.response.data.errors.Email,
            },
          });
        }
        handleBackendErrors(error?.response?.data?.errors);

        setIsRequestLoading(false);
        setIsRequestFailed(true);
      })
      .finally(() => {
        setIsRequestLoading(false);
      });
  };

  useEffect(() => {
    if (isRequestLoading) {
      return;
    }

    const email = router.query.email as string;
    const firstName = router.query.first_name as string;
    const lastName = router.query.last_name as string;
    const phoneNumber = router.query.phone_number as string;
    const hasPartner = router.query.has_partner as string;
    const hasSpecimens = router.query.has_specimens as string;

    setHasSpecimens(hasSpecimens?.toLowerCase() === 'yes');
    setHasPartner(hasPartner?.toLowerCase() === 'yes');

    if (!firstName || !lastName || !email) {
      setIsRequestLoading(false);
      router.push(`/not-found`);
    }

    onSubmit({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      phoneNumber: phoneNumber?.length === 10 ? `1${phoneNumber}` : phoneNumber,
      hasSpecimens: hasSpecimens?.toLowerCase() === 'yes',
      hasPartner: hasPartner?.toLowerCase() === 'yes',
    });
  }, []);

  if (isLoading || isRequestLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (user) {
    return router.push(`/`);
  }

  return isRequestFailed ? (
    <div className="m-4 flex flex-col items-start justify-center gap-4  md:items-center md:justify-center">
      <div className="h-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500  p-[2px] ">
        <div className="h-full rounded-lg bg-[#1E2021] p-6">
          <div className="flex items-center justify-center p-4">
            <div className="text-3xl font-light dark:text-white">{t('register')}</div>
          </div>

          <div className="max-h-[650px] md:w-[448px]">
            <div className="space-y-6">
              <FormProvider handleSubmit={handleSubmit} setError={setError} {...formProps}>
                <SignupForm
                  email={router.query.email as string}
                  firstName={router.query.first_name as string}
                  lastName={router.query.last_name as string}
                  hasSpecimens={hasSpecimens}
                  hasPartner={hasPartner}
                  phoneNumber={router.query.phone_number as string}
                />
              </FormProvider>
            </div>
          </div>

          <div>
            <div className="flex w-full flex-row justify-end pt-6">
              <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)}>
                {t('submit')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3  pt-4 text-sm font-light  text-white  md:justify-end md:px-0">
        <p>
          You can always contact us at {phoneNumber} or email us at {email}.
        </p>
      </div>
    </div>
  ) : null;
}

SignUpPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default SignUpPage;
