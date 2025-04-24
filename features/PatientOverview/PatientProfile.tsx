import { Spinner } from 'flowbite-react';
import React from 'react';
import AvatarInfo from './components/AvatarInfo';
import PersonalDetails from './components/PersonalDetails';
import LinkedAcc from './components/LinkedAccounts/LinkedAcc';
import Locations from './components/Locations';
import Documents from './components/Documents';
import EmergencyContact from './components/EmergencyContact';
import ClinicDetails from './components/ClinicDetails';
import WitnessInfo from './components/WitnessInfo/WitnessInfo';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { FaDownload } from 'react-icons/fa';
import { axiosInstance } from '@/api/axiosConfig';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { PatientPersonalDetails } from '@/types/view/PatientOverviewProps.interface';
import Onboarding from './components/Onboarding';
import Attachments from './components/Attachments/Attachments';
import { useGetPaymentPatientPlan } from '@/api/queries/patient.queries';
import { PatientProfileActionsMenu } from './components/PatientProfileActionsMenu/PatientProfileActionsMenu';
import { PaymentType } from '@/types/PaymentType.enum';
import { BillingChargeStatus } from '@/types/BillingStatus.enum';

const PatientProfile = ({
  patient,
  terminationDocuments,
}: {
  patient: PatientPersonalDetails;
  terminationDocuments?: any[];
}) => {
  const { data: patientBillingData, mutate: refetchPaymentPlan } = useGetPaymentPatientPlan({ isPatient: true });
  const isEnabledChangeStoragePlan =
    !!patientBillingData?.storageDuration &&
    (!patient?.pastCharges?.length ||
      !patient.pastCharges.some(
        charge => charge.status === BillingChargeStatus.Succeeded && charge.type === PaymentType.StoragePayment
      ));

  const handleDownload = async (terminationId: string) => {
    axiosInstance
      .get(`/patients/attachments/${terminationId}/download`)
      .then(resp => {
        downloadDocument(resp.data);
      })
      .catch(error => {
        if (error.response.data.errors) {
          handleBackendErrors(error.response.data.errors);
        }
      });
  };

  const downloadDocument = (file: any) => {
    if (file) {
      const a = document.createElement('a');
      a.href = file.documentUri;
      document.body.appendChild(a);
      window.URL.revokeObjectURL(file.documentUri);
      a.click();
    }
  };

  const columns: ColDefType[] = [
    {
      headerName: 'File Name',
      field: 'fileName',
      renderCell: row => (
        <span className="sensitive text truncate text-sm font-normal text-gray-300">{row.requestFile.fileName}</span>
      ),
    },
    { headerName: 'Specimen Type', field: 'specimenType' },
    {
      headerName: 'Termination Type',
      field: 'terminationType',
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'left',
      renderCell: row => <FaDownload className="cursor-pointer" onClick={() => handleDownload(row.requestFile.id)} />,
    },
  ];

  if (!patient?.firstName) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="text-center xl:hidden">
        <h4 className="sensitive mb-4 hidden bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
        </h4>
      </div>
      <div className="flex w-full flex-col items-center gap-4 xl:w-1/3 xl:items-start">
        <div className="min-w-full max-w-[370px] rounded-md border border-transparent dark:bg-[#1E2021]">
          {/* 
            Todo: delete isEnabledChangeStoragePlan when we add more actions for patient profile
           */}
          {isEnabledChangeStoragePlan && (
            <PatientProfileActionsMenu
              patient={patient}
              changeStoragePlanAction={{
                isEnabledChangeStoragePlan: isEnabledChangeStoragePlan,
                storageDuration: patientBillingData?.storageDuration,
                clinicStoragePrices: patientBillingData?.clinicStoragePrices,
                refetchPaymentPlan: refetchPaymentPlan,
              }}
            />
          )}
          <AvatarInfo patient={patient} isPatient={true} storageDuration={patientBillingData?.storageDuration} />
        </div>
        <PersonalDetails patient={patient} isReadonly={true} />
        {patient?.emergencyContact?.name && <EmergencyContact patient={patient} />}
        <LinkedAcc patient={patient} />
        <Locations patient={patient} />
        <ClinicDetails patient={patient} />
        {patient?.witnessName && <WitnessInfo patient={patient} />}
      </div>
      <div className="flex w-full flex-col gap-6 xl:w-2/3">
        <Onboarding />
        <Attachments patient={patient} />
        <Documents documents={patient.documents} />
        {!!terminationDocuments?.length && (
          <>
            <span className="mb-6 pl-10 text-2xl font-normal text-white">Termination Documents</span>
            <DataGridTable isLoading={false} columns={columns} rows={terminationDocuments || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
