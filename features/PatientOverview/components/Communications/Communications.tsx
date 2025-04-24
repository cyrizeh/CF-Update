import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import NotificationsTable from './NotificationsTable';

type CommunicationsProps = {
  patient: any;
};

export const Communications: React.FC<CommunicationsProps> = ({ patient }) => {
  const { query } = useRouter();
  const patientId = query.id as string;

  return (
    <PatientComponentLayout col>
      <div className="mb-6 flex w-full flex-col gap-6 lg:flex-row">
        <NotificationsTable patientId={patientId} />
      </div>
    </PatientComponentLayout>
  );
};
