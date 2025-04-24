import PatientTransportationOverview from '@/features/PatientOverview/PatientTransportationOverview';
import { useRouter } from 'next/router';
import { useGetPatientsById } from '@/api/queries/patient.queries';
import { TransportationContextProvider } from '@/contexts/TransportationContext/TransportationContextProvider';
import { toPascalCase } from '@/utils/toPascalCase';

export default function OverviewPage() {
  const router = useRouter();
  const { data: patient } = useGetPatientsById(router?.query?.id as string);

  return (
    <TransportationContextProvider>
      <div className="flex items-end justify-between sm:mb-10">
        <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light leading-[60px] text-transparent lg:text-5xl ">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
        </h1>
      </div>

      {patient && <PatientTransportationOverview patient={patient} isReadonly={false} userRole={'AccountAdmin'} />}
    </TransportationContextProvider>
  );
}
