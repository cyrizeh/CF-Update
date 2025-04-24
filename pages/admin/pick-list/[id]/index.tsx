import usePickListMutation from '@/api/mutations/usePickListMutation';
import useReadersMutation from '@/api/mutations/useReaderMutation';
import { useAdmicGetPickListDetails } from '@/api/queries/pickList.queries';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { NotFound } from '@/features/NotFound/NotFound';
import PickListDetailsPage from '@/features/PickList/PickListDetailsPage';
import { PickListStatus, PickUpCaneStatus } from '@/features/PickList/PickListPage.constants';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminPickListDetailsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const id = router?.query?.id as string;
  const { data: request, isLoading, mutate, error } = useAdmicGetPickListDetails(id || '');
  const { getReaderTag } = useReadersMutation();
  const [isScanning, setIsScanning] = useState(false);

  const [selectedReader, setSelectedReader] = useState<string | null>(null);
  const { withDrawPickList } = usePickListMutation();

  const isUidInCaneList = (uid: string, canes: { rfid: string }[]): boolean => {
    return canes.some(cane => cane.rfid === uid);
  };

  const processValidCane = async (
    uid: string,
    caneId: string,
    pickListId: string,
    processedUIDs: string[],
    mutate: any,
    withDrawPickList: any
  ) => {
    processedUIDs.push(uid);
    try {
      await withDrawPickList.trigger({ pickListId, caneId });
      toast.success('Cane was withdrawn successfully');
      await mutate(undefined, { revalidate: true });
    } catch {
      toast.error('Failed to withdraw cane');
      processedUIDs.splice(processedUIDs.indexOf(uid), 1);
    }
  };

  const processInvalidCane = (uid: string, processedUIDs: string[], invalidUIDs: string[]) => {
    if (invalidUIDs.includes(uid)) return;

    processedUIDs.push(uid);
    invalidUIDs.push(uid);
    // Todo: Return in Phase 2, check with scanner
    // toast.error(`Please scan a different RFID. This ${uid} RFID is not in the current pick list`);
  };

  const processWithdrawnCane = (uid: string, processedUIDs: string[]) => {
    if (processedUIDs.includes(uid)) return;

    processedUIDs.push(uid);
    toast.error(`This ${uid} RFID is already withdrawn`);
  };

  const fetchReaderTag = async (processedUIDs: string[], invalidUIDs: string[], controller: AbortController) => {
    setIsScanning(true);

    try {
      const response = await getReaderTag.trigger({ id: selectedReader as string });
      if (controller.signal.aborted) return;

      const requestCaneRFIds =
        request?.canes?.map((item: any) => ({
          id: item?.id,
          rfid: item?.rfid,
          pickUpStatus: item?.pickUpStatus,
        })) || [];

      const newUIDs = response?.data?.flatMap((antennaData: any) => antennaData.UID);
      invalidUIDs = invalidUIDs.filter(uid => newUIDs.includes(uid));
      processedUIDs = processedUIDs.filter(uid => newUIDs.includes(uid));

      for (const antennaData of response?.data || []) {
        for (const uid of antennaData.UID) {
          if (processedUIDs.includes(uid)) continue;

          const matchingCane = requestCaneRFIds.find(
            (cane: { rfid: string; pickUpStatus: PickUpCaneStatus }) => cane.rfid === uid
          );

          if (matchingCane?.pickUpStatus === PickUpCaneStatus.Withdrawn) {
            processWithdrawnCane(uid, processedUIDs);
          } else if (matchingCane?.pickUpStatus === PickUpCaneStatus.Requested) {
            await processValidCane(uid, matchingCane.id, request?.id, processedUIDs, mutate, withDrawPickList);
          } else if (!isUidInCaneList(uid, requestCaneRFIds)) {
            processInvalidCane(uid, processedUIDs, invalidUIDs);
          }
        }
      }

      fetchReaderTag(processedUIDs, invalidUIDs, controller);
    } catch (error) {
      if (controller.signal.aborted) return;
      toast.error('There is no connection. Please scan item again');
      setIsScanning(false);
      setSelectedReader('');
    }
  };

  // use to stop loop of requests to receive tags from scanner
  useEffect(() => {
    let controller: AbortController | null = null;

    if (selectedReader) {
      controller = new AbortController();
      const processedUIDs: string[] = [];
      const invalidUIDs: string[] = [];
      fetchReaderTag(processedUIDs, invalidUIDs, controller);
    }

    return () => {
      if (controller) {
        controller.abort();
        setIsScanning(false);
      }
    };
  }, [selectedReader, request]);

  useEffect(() => {
    // we do this to push fresh data to fetchReaderTag
    if (request?.status === PickListStatus.Completed) {
      setSelectedReader('');
    }
  }, [request]);

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
    return <NotFound text={t('notFound:pickListNotFound')} />;
  }

  return (
    <>
      {request && (
        <PickListDetailsPage
          request={request}
          isLoading={isLoading}
          refetchPickListDetails={mutate}
          selectedReader={selectedReader}
          setSelectedReader={setSelectedReader}
          isScanning={isScanning}
        />
      )}
    </>
  );
}
