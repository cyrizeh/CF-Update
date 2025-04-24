import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { ViewTypes } from '@/types';
import { Specimen } from '@/types/view';
import Link from 'next/link';

export const SpecimensDataRows = ({ specimens }: ViewTypes.SpecimensDataRowProps) => {
  const bodyRowClass =
    'text-white whitespace-nowrap font-normal h-[49px] border-y border-y-dark-grey-200 dark:border-y dark:border-y-dark-grey-200 hover:bg-dark-grey-100 dark:hover:bg-dark-grey-100 text-sm';
  const bodyCellClass =
    'group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg  px-6 py-4';

  return (
    <tbody>
      {!!specimens.length &&
        specimens.map((specimen: Specimen, idx: number) => {
          return (
            <tr key={idx} className={bodyRowClass}>
              <td className={bodyCellClass}>
                <Link href={buildAdminGeneralPatientPageRoute(specimen.patient.id)}>
                  <div className="flex items-center gap-2 ">
                    <span className="sensitive hover:underline"> {specimen.patient.firstAndLast}</span>
                  </div>
                </Link>
              </td>
              <td className={bodyCellClass}>{specimen.specimenType}</td>
              <td className={bodyCellClass}>
                <Link href={`/admin/facilities/${specimen.facilityId}`}>
                  <div className="flex items-center gap-2 ">
                    <span className="hover:underline">{specimen.facilityName}</span>
                  </div>
                </Link>
              </td>
              <td className={bodyCellClass}>{specimen.vault}</td>
              <td className={bodyCellClass}>{specimen.tank}</td>
              <td className={bodyCellClass}>{specimen.canister}</td>
              <td className={bodyCellClass}>{specimen.pie}</td>
              <td className={bodyCellClass}>{specimen.cane}</td>
              <td className={bodyCellClass}>{specimen.rfid}</td>
            </tr>
          );
        })}
    </tbody>
  );
};
