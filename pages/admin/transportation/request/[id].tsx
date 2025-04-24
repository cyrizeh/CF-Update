import { useRouter } from 'next/router';
import { isSmallScreen } from '@/utils';
import { TransportationContextProvider } from '@/contexts/TransportationContext';
import { useGetTransportationInfo } from '@/api/queries/transportation.queries';
import RequestTransportationOverview from '@/features/Transportation/RequestTransportationOverview';
import { Spinner } from 'flowbite-react';
import { NotFound } from '@/features/NotFound/NotFound';
import useTranslation from 'next-translate/useTranslation';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';

export default function RequestPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: request, isLoading, error } = useGetTransportationInfo(router?.query?.id as string);

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:transportationRequestNotFound')} />;
  }

  return (
    <TransportationContextProvider>
      {!isSmallScreen() && (
        <div className="flex items-end justify-between md:mb-10">
          <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent ">
            {`Transportation request ${request?.orderNumber || ''}`}
          </h1>
        </div>
      )}
      {request && <RequestTransportationOverview request={request} />}
    </TransportationContextProvider>
  );
}
