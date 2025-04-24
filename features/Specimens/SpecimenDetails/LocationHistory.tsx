import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { Spinner } from 'flowbite-react';
import _ from 'lodash';
import React from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { caneLocationHistoryTypeToText } from './CaneDetails.utils';

interface CaneLocationHistory {
  id: string;
  caneId: string;
  oldLocation: LocationDetails | null;
  currentLocation: LocationDetails | null;
  timestamp: string;
  userId: string;
  userEmail: string;
  historyType: string;
}

interface LocationDetails {
  facilityId: { value: string };
  facilityName: string;
  vaultId: { value: string };
  vaultName: string;
  tankId?: { value: string };
  tankName?: string;
  pieId?: { value: string };
  pieName?: string;
  canisterId: { value: string };
  canisterName: string;
  slotId: { value: string };
  slotName: string;
}

const TEXTS = {
  title: 'Location History',
  loading: 'Loading...',
  noHistory: 'No location history available for this cane.',
  locationChanged: 'Location changed',
  by: 'by',
  on: 'On',
  from: 'From',
  to: 'To',
};

const CaneLocationHistoryTable: React.FC<{ caneHistory: any; isLoading: boolean }> = ({ caneHistory, isLoading }) => {
  const renderLocation = (location: LocationDetails | null) => {
    if (!location) return '';
    return (
      <span className="whitespace-normal break-words text-[14px]">
        {[
          <span key="facility">Facility:</span>,
          ` ${location.facilityName}`,
          ', ',
          <span key="vault">Vault:</span>,
          ` ${location.vaultName}`,
          location.tankName && [', ', <span key="tank">Tank:</span>, ` ${location.tankName}`],
          location.pieName && [', ', <span key="pie">Pie:</span>, ` ${location.pieName}`],
          ', ',
          <span key="canister">Canister:</span>,
          ` ${location.canisterName}`,
          ', ',
          <span key="slot">Slot:</span>,
          ` ${location.slotName}`,
        ].flat()}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Spinner size="lg" className="text-white">
        {TEXTS.loading}
      </Spinner>
    );
  }

  return (
    <div className="min-w-full max-w-[370px] items-center gap-3 rounded-md border border-transparent p-4 text-white sm:p-8 md:max-w-full dark:bg-[#1E2021] ">
      <div className="flex justify-between">
        <div className="flex items-center gap-1 text-center">
          <div className="flex h-[25px] w-[25px] justify-center">{<FaMapLocationDot />}</div>
          <div className="flex items-center text-center">
            <span className="text-2xl font-normal text-white">{TEXTS.title}</span>
          </div>
        </div>
      </div>
      <ul className="my-4">
        {!_.isEmpty(caneHistory?.items) ? (
          caneHistory.items.map((entry: CaneLocationHistory) => {
            const formattedDate = formatDataWithTime(entry.timestamp);
            return (
              <li
                key={entry.id}
                className="my-2 border-b border-gray-300 pb-4 text-base text-gray-300 last:border-none">
                <div className="mb-2">
                  <span className="font-semibold">
                    {TEXTS.on} {formattedDate} {TEXTS.by} <span>{entry.userEmail}</span>
                  </span>
                </div>
                <div className="mb-2">
                  <span className="bold">{'Action'}:</span>{' '}
                  <div className="pl-4 text-[14px] font-normal">
                    <span className="font-bold">{caneLocationHistoryTypeToText(entry?.historyType)}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="bold">{TEXTS.from}:</span>{' '}
                  <div className="pl-4 text-[14px] font-normal">
                    {entry.oldLocation ? renderLocation(entry.oldLocation) : '-'}
                  </div>
                </div>

                <div>
                  {TEXTS.to}:{' '}
                  <div className="pl-4 text-[14px] font-normal">
                    {entry.currentLocation ? renderLocation(entry.currentLocation) : '-'}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <div className="text-base">{TEXTS.noHistory}</div>
        )}
      </ul>
    </div>
  );
};

export default CaneLocationHistoryTable;
