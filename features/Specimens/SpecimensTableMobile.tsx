import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import { ReactNode, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ViewTypes } from '@/types';
import Link from 'next/link';
import { Button } from 'flowbite-react';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { toPascalCase } from '@/utils/toPascalCase';

const InfoItem = ({ header, value, isLast = false }: { header: string; value: ReactNode; isLast?: boolean }) => {
  const mainClasses = `grid grid-cols-2 mb-2.5 ${isLast ? '' : 'border-b border-dark-grey-300'}`;
  return (
    <div className={mainClasses}>
      <div className="pts__item__title py-1 pl-4 text-xs font-semibold uppercase leading-[18px] text-zinc-500">
        {header}
      </div>
      <div className="pts__item__value text-medium py-1 pl-4 text-white">{value}</div>
    </div>
  );
};

export const DataTableMobile = ({ items }: ViewTypes.SpecimenTableMobileProps) => {
  const { t } = useTranslation('specimens');
  const [openedId, setOpenedId] = useState<string>('');
  const [openFull, setOpenFull] = useState<string>('');

  const handlePatientOpen = (id: string) => {
    if (openedId === id) {
      setOpenedId('');
      setOpenFull('');
      return;
    }
    setOpenedId(id);
  };

  const openFullView = (id: string) => {
    if (openFull === id) {
      setOpenFull('');
      return;
    }
    setOpenFull(id);
  };

  const itemIsOpened = (id: string) => openedId === id;
  const itemIsOpenedFull = (id: string) => openFull === id;
  return (
    <div>
      {!!items.length &&
        items.map((item: ViewTypes.Specimen, idx: number) => {
          return (
            <div key={idx} className="border-b border-dark-grey-300 text-sm font-normal">
              <div className="flex flex-row items-center justify-between py-3.5">
                <div className="flex items-center gap-2.5">
                  <Link href={buildAdminGeneralPatientPageRoute(item.patient.id)}>
                    <div className="flex items-center gap-2 ">
                      <span className="sensitive hover:cursor-pointer hover:underline dark:text-white">
                        {toPascalCase(item.patient.fullName)}
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-6">
                  <span className="cursor-pointer dark:text-white">
                    {itemIsOpened(`${idx}`) && <HiChevronDown size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                    {!itemIsOpened(`${idx}`) && <HiChevronLeft size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                  </span>
                </div>
              </div>
              {itemIsOpened(`${idx}`) && (
                <div>
                  <div>
                    {item.facilityName && <InfoItem header={t('table.facility')} value={item.facilityName} />}
                    {item.clinicName && <InfoItem header={t('table.clinic')} value={item.clinicName} />}
                    {item.specimenType && <InfoItem header={t('table.tissueType')} value={item.specimenType} />}

                    {itemIsOpenedFull(`${idx}`) && (
                      <>
                        {item.freezeDate && <InfoItem header={t('table.freezeDate')} value={item.freezeDate} />}
                        {item.vault && <InfoItem header={t('table.vault')} value={item.vault} />}
                        {item.tank && <InfoItem header={t('table.Tank')} value={item.tank} />}
                        {item.canister && <InfoItem header={t('table.Canister')} value={item.canister} />}
                        {item.pie && <InfoItem header={t('table.Pie')} value={item.pie} />}
                        {item.cane && <InfoItem header={t('table.Cane')} value={item.cane} />}
                        {item.rfid && <InfoItem header={t('table.RFID')} value={item.rfid} />}
                      </>
                    )}
                  </div>
                  <div>
                    <Button
                      size={'sm'}
                      className={'mb-4 w-full'}
                      color={'grayBorderedDefault'}
                      onClick={() => openFullView(`${idx}`)}>
                      {itemIsOpenedFull(`${idx}`) ? t('table.hideDetails') : t('table.openDetails')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
