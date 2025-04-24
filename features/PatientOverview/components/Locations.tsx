import { PatientOverviewProps } from '@/types/view';

import PatientComponentLayout from './PatientComponentLayout';

const Locations = ({ patient }: PatientOverviewProps) => {
  return (
    <PatientComponentLayout col>
      <span className="text-2xl font-normal text-white">Locations</span>
      {patient.locations.map((item: any, i: number) => (
        <div key={item.id} className="flex flex-col">
          <div className="align-center flex items-center justify-between">
            <div className="flex w-3/4 flex-col text-left">
              <span className="overflow-hidden truncate text-ellipsis text-lg font-normal text-white">{item.name}</span>
              <span className="overflow-hidden truncate text-ellipsis text-sm font-normal text-gray-300">
                {item.address.city}, USA
              </span>
            </div>

            {patient?.numberOfCanes && (
              <span className="text-xs font-medium text-gray-50">{patient?.numberOfCanes} Canes</span>
            )}
          </div>
          {i !== patient.locations.length - 1 && (
            <hr className="my-4 h-0.5 rounded border-0 bg-[#4F4F4F] dark:bg-[#4F4F4F]"></hr>
          )}
        </div>
      ))}
    </PatientComponentLayout>
  );
};

export default Locations;
