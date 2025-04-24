import { useRouter } from 'next/router';
import { isSmallScreen } from '@/utils';
import { TransportationContextProvider } from '@/contexts/TransportationContext';
import { useGetTransportationInfo } from '@/api/queries/transportation.queries';
import RequestTransportationOverview from '@/features/Transportation/RequestTransportationOverview';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';

export default function RequestPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: request, isLoading } = useGetTransportationInfo(router?.query?.id as string);

  return isLoading ? (
    <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-sm text-white">
        <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
      </div>
    </div>
  ) : (
    <TransportationContextProvider>
      {!isSmallScreen() && (
        <div className="flex items-end justify-between md:mb-10">
          <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent ">
            {`Transportation request ${request?.orderNumber || ''}`}
          </h1>
        </div>
      )}
      {request && <RequestTransportationOverview request={request} userRole={'AccountAdmin'} />}
    </TransportationContextProvider>
  );
}
