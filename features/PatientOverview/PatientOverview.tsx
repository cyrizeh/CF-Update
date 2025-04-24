import { axiosInstance } from '@/api/axiosConfig';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { terminationStatuses } from '@/constants/terminations';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import useRole from '@/hooks/useRole';
import { PatientOverviewProps } from '@/types/view';
import { hasPermission, isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { toPascalCase } from '@/utils/toPascalCase';
import { Button, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';
import Attachments from './components/Attachments/Attachments';
import AvatarInfo from './components/AvatarInfo';
import BillingDateHistory from './components/BillingDateHistory';
import ClinicDetails from './components/ClinicDetails';
import Documents from './components/Documents';
import EmergencyContact from './components/EmergencyContact';
import LinkedAcc from './components/LinkedAccounts/LinkedAcc';
import Locations from './components/Locations';
import Notes from './components/Notes';
import { PatientActionsMenu } from './components/PatientActionsMenu/PatientActionsMenu';
import { PatientInventorySection } from './components/PatientInventorySection/PatientInventorySection';
import Payments from './components/Payments';
import PersonalDetails from './components/PersonalDetails';
import WitnessInfo from './components/WitnessInfo/WitnessInfo';
import PatientLabels from './components/PatientLabels/PatientLabels';
import { useGetPatientsBilling } from '@/api/queries/patient.queries';
import { BillingChargeStatus } from '@/types/BillingStatus.enum';
import { PaymentType } from '@/types/PaymentType.enum';

const PatientOverview = ({
  patient,
  refetchPatientInfo,
  isReadonly,
  terminationDocuments,
  terminationRequests,
}: PatientOverviewProps) => {
  const { userPermissions } = usePermissions();
  const isUserCanReadNotes = hasPermission(userPermissions, 'read:notes');
  const { roles } = useRole();
  const isAttachmentsEnabled =
    isUserAdmin(roles) || isUserGodAdmin(roles) || isUserAccountAdmin(roles) || isUserClinicAdmin(roles);
  const isBillingHistoryEnabled = isUserAdmin(roles) || isUserGodAdmin(roles);

  const { data: patientBillingData, mutate: refetchPaymentPlan } = useGetPatientsBilling(patient?.id);
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
        <span className="text sensitive truncate text-sm font-normal text-gray-300">{row.requestFile.fileName}</span>
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

  const terminationRequestsColumns: ColDefType[] = [
    {
      headerName: 'Request',
      field: 'id',
      renderCell: row => (
        <Link href={`/admin/terminations/${row.id}`}>
          <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Button size={'sm'} gradientDuoTone="primary">
              <span>{`View details ${row.orderNumber || ''}`}</span>
            </Button>
          </div>
        </Link>
      ),
    },
    {
      headerName: 'Termination Status',
      field: 'terminationStatuses',
      renderCell: row => (
        <td className="min-w-[260px] ">
          <div
            className="mr-2 flex items-center gap-2 overflow-hidden whitespace-pre-wrap"
            style={{ maxHeight: '4rem', position: 'relative' }}>
            <div className="overflow-hidden overflow-ellipsis">
              {row.terminationStatuses
                ?.map((value: string) => terminationStatuses.find((status: any) => status.value === value)?.label)
                .join(', ')}
            </div>
          </div>
        </td>
      ),
      align: 'left',
    },
    {
      headerName: 'Created',
      field: 'created',
      renderCell: row => <span className="text-sm font-normal text-gray-300">{formatDataWithTime(row.created)}</span>,
    },
    {
      headerName: 'Specimen Types',
      field: 'specimenType',
      renderCell: row => (
        <td className="min-w-[260px]">
          <div
            className="mr-2 flex items-center gap-2 overflow-hidden whitespace-pre-wrap"
            style={{ position: 'relative' }}>
            <div className="overflow-hidden overflow-ellipsis">
              <span>
                {/* specimenTerminations contains multiple objects, 
                each object has a specimenType. Since this is processed in a loop,
                we need to join them into a single string with commas. */}
                {row.specimenTerminations
                  .map((termination: any) => getSpecimenLabels(termination.specimenType))
                  .join(', ')}
              </span>
            </div>
          </div>
        </td>
      ),
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
        <h4 className="sensitive mb-4 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
        </h4>
      </div>
      <div className="flex w-full flex-col items-center gap-4 xl:w-1/3 xl:items-start">
        <div className="min-w-full max-w-[370px] rounded-md border border-transparent dark:bg-[#1E2021]">
          <PatientActionsMenu
            patient={patient}
            refetchPatientInfo={refetchPatientInfo}
            changeStoragePlanAction={{
              isEnabledChangeStoragePlan: isEnabledChangeStoragePlan,
              storageDuration: patientBillingData?.storageDuration,
              clinicStoragePrices: patientBillingData?.storagePrices,
              refetchPaymentPlan: refetchPaymentPlan,
            }}
          />
          <PatientLabels patient={patient} />
          <AvatarInfo
            patient={patient}
            refetchPatientInfo={refetchPatientInfo}
            storageDuration={patientBillingData?.storageDuration}
          />
        </div>
        <PersonalDetails patient={patient} refetchPatientInfo={refetchPatientInfo} isReadonly={isReadonly} />
        {patient?.emergencyContact?.name && (
          <EmergencyContact patient={patient} refetchPatientInfo={refetchPatientInfo} />
        )}
        <LinkedAcc patient={patient} refetchPatientInfo={refetchPatientInfo} />
        <Payments patient={patient} isReadonly={isReadonly} refetchPatientInfo={refetchPatientInfo} />
        <Locations patient={patient} />
        <ClinicDetails patient={patient} />
        {patient?.witnessName && <WitnessInfo patient={patient} />}
      </div>
      <div className="flex w-full flex-col gap-6 xl:w-2/3">
        <PatientInventorySection patient={patient} refetchPatientInfo={refetchPatientInfo} isReadonly={isReadonly} />

        {isUserCanReadNotes && <Notes patient={patient} isReadonly={isReadonly} />}
        {isAttachmentsEnabled && <Attachments patient={patient} />}
        <Documents documents={patient.documents} />
        {!!terminationDocuments?.length && (
          <>
            <span className="mb-6 pl-10 text-2xl font-normal text-white">Termination Documents</span>
            <DataGridTable isLoading={false} columns={columns} rows={terminationDocuments || []} />
          </>
        )}
        {isBillingHistoryEnabled && <BillingDateHistory history={patient?.billingStartDateHistory} />}
        {!!terminationRequests?.length && (
          <>
            <span className="mb-6 pl-10 text-2xl font-normal text-white">Termination Requests</span>
            <DataGridTable isLoading={false} columns={terminationRequestsColumns} rows={terminationRequests || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default PatientOverview;
