import usePatientMutation from '@/api/mutations/usePatientMutation';
import { useGetAdminPatientEPP, useGetPatientPaymentMethodById } from '@/api/queries/patient.queries';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import { PatientOverviewProps } from '@/types/view';
import { PaymentDateSource, PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import { isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getPatientSpecimenTypesLabels } from '@/utils/getSpecimenLabels';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import EditDateModal from './EditDateModal';
import EditDonorInformationModal from './EditDonorInformationModal/EditDonorInformationModal';
import PatientComponentLayout from './PatientComponentLayout';
import PaymentDetails from './PaymentDetails/PaymentDetails';
import ReceivedDates from './ReceivedDates';

const Payments = ({ patient, refetchPatientInfo }: PatientOverviewProps) => {
  const { query } = useRouter();
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isClinicAdmin = isUserClinicAdmin(roles);
  const [billingStartDate, setBillingStartDate] = useState<string | null | undefined>('');
  const [specimenReceivedDate, setSpecimenReceivedDate] = useState<string | null | undefined>('');
  const [subscriptionType, setSubscriptionType] = useState<string | null | undefined>('');
  const [paymentDateSource, setPaymentDateSource] = useState<PaymentDateSource | null>(null);
  const { updatePatientBillingDate } = usePatientMutation(query.id as string);
  const { t } = useTranslation('patients');
  const { data: paymentDetails } = useGetPatientPaymentMethodById({ patientId: patient.id });
  const { data: eppData } = useGetAdminPatientEPP({ id: isCryoAdmin ? patient?.id : '' });

  const [formattedUpcomingCharges, setFormattedUpcomingCharges] = useState(patient.upcomingCharges || []);

  const {
    isModalOpen: isEditBillingDateModalOpen,
    onCloseModal: closeEditBillingDateModal,
    onOpenModal: openEditBillingDateModal,
  } = useToggleModal();

  const {
    isModalOpen: isEditDonorInformationOpen,
    onCloseModal: closeEditDonorInformationModal,
    onOpenModal: openEditDonorInformationModal,
  } = useToggleModal();

  const onSubmit = (data: any) => {
    const billingStartDate = data?.date ? formatDate(new Date(data?.date)) : null;
    const updatedRequest = {
      billingDate: billingStartDate,
      patientId: patient?.id,
    };
    updatePatientBillingDate({ ...updatedRequest })
      .then(() => {
        closeEditBillingDateModal();
        toast.success('The billing date updated');
        setBillingStartDate(data?.date);
        refetchPatientInfo?.(undefined, { revalidate: true });
      })
      .catch(error => {
        let message = '';
        if (error?.response?.data?.errors?.BillingDate) {
          message = error?.response?.data?.errors?.BillingDate[0];
        } else if (error?.response?.data?.errors?.BillingInformation) {
          message = error?.response?.data?.errors?.BillingInformation[0];
        }
        toast.error(`Failed to edit billing date. ${message}`);
      });
  };

  useEffect(() => {
    if (patient) {
      setBillingStartDate(patient.billingStartDate);
    }
    if (patient) {
      setSpecimenReceivedDate(patient.specimenReceivedDate);
    }
    if (patient?.paymentDateSource) {
      setPaymentDateSource(patient?.paymentDateSource);
    }
    if (patient?.subscriptionType) {
      setSubscriptionType(patient?.subscriptionType);
    }
  }, [patient]);

  useEffect(() => {
    if (patient?.upcomingCharges?.length) {
      const updatedCharges = patient.upcomingCharges.map(charge => {
        let newName = charge.name;

        if (charge.specimenType) {
          newName = `${charge.name} [${charge.specimenType}]`;
        } else if (charge.billingCriteria === 'Patient') {
          newName = `${charge.name} [Patient]`;
        }

        return { ...charge, name: newName };
      });

      setFormattedUpcomingCharges(updatedCharges);
    } else {
      setFormattedUpcomingCharges([]);
    }
  }, [patient]);

  return (
    <PatientComponentLayout col>
      <EditDateModal
        label="Edit billing start date"
        isOpen={isEditBillingDateModalOpen}
        onClose={() => {
          closeEditBillingDateModal();
        }}
        date={billingStartDate || ''}
        onSubmit={onSubmit}
      />
      <EditDonorInformationModal
        isOpen={isEditDonorInformationOpen}
        onClose={closeEditDonorInformationModal}
        propsData={patient}
        refetchPatientData={refetchPatientInfo}
      />
      <div className="mb-4 text-2xl font-normal text-white">{t('billingDetails')}</div>

      {!billingStartDate && paymentDateSource === PaymentDateSourceEnum.BillingStartDate ? (
        <div className="mb-5 flex items-center justify-start gap-1 rounded bg-[#fff4e5] p-3">
          <HiInformationCircle className=" mb-1 h-6 w-6 text-[#663c00]" />
          <p className="text-sm text-[#663c00]">{t('notSetBillingStartDate')}</p>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="my-2 mr-2 flex w-full items-center justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
          <div>{t('billingStartDate')}</div>
          {billingStartDate ? <div>{formatDateWithSlashSeparator(billingStartDate)}</div> : <div>{t('notSet')}</div>}
        </div>
        {(isCryoAdmin || isClinicAdmin) && (
          <Button
            className="border-0 p-1 lg:block"
            size={'sm'}
            gradientDuoTone="primary"
            onClick={openEditBillingDateModal}>
            <div>{t('common:edit')}</div>
          </Button>
        )}
      </div>

      {isCryoAdmin && (
        <div className="flex items-center justify-between">
          <div className="my-2 mr-2 flex w-full items-center justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
            <div className="flex flex-col gap-4">
              <div>{t('paymentMethodDetails')}</div>
              {paymentDetails ? (
                <div className="rounded-lg p-4 shadow-md dark:bg-[#1E2021]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xl font-bold">{paymentDetails?.brand}</div>
                    <div>
                      {paymentDetails?.expMonth || '-'}/{paymentDetails?.expYear || '-'}
                    </div>
                  </div>
                  <div className="mb-4 text-xl font-bold">
                    {'**** **** **** ' + (paymentDetails?.last4 ? paymentDetails?.last4 : '****')}
                  </div>
                </div>
              ) : null}
            </div>
            {!paymentDetails && <div>{t('notSet')}</div>}
          </div>
        </div>
      )}

      <ReceivedDates patient={patient} />

      <div className="mb-2 flex items-center justify-between">
        <div className="my-2 mr-2 flex w-full items-center justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
          <div>{t('billing_details_overview.paymentDateSource')}</div>
          {paymentDateSource ? (
            <div>{t(`billing_details_overview.${paymentDateSource}`)}</div>
          ) : (
            <div>{t('notSet')}</div>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="my-2 mr-2 flex w-full items-center justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
          <div>{t('subscriptionType.paymentType')}</div>
          {subscriptionType ? <div>{t(`subscriptionType.${subscriptionType}`)}</div> : <div>{t('notSet')}</div>}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="my-2 mr-2 w-full rounded-md border border-transparent text-gray-300 dark:bg-[#292B2C]">
          <div className="flex w-full items-center justify-between gap-12 px-4  py-3 text-sm font-normal leading-tight">
            <div>{t('specimenTypes')}</div>
            <div className="flex justify-end text-end">
              {!!patient?.specimenTypes?.length ? getPatientSpecimenTypesLabels(patient?.specimenTypes) : t('notSet')}
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-12 px-4 py-3 text-sm font-normal leading-tight ">
            <div>{t('numberOfCanes')}</div>
            <div>{patient?.numberOfCanes || '0'}</div>
          </div>
        </div>
        {isCryoAdmin && (
          <Button
            className="border-0 p-1 lg:block"
            size={'sm'}
            gradientDuoTone="primary"
            onClick={openEditDonorInformationModal}>
            <div>{t('common:edit')}</div>
          </Button>
        )}
      </div>

      {eppData && (
        <div className="mb-4 items-center">
          <div className="my-2 mr-2 flex w-full flex-col gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal text-gray-300 dark:bg-[#292B2C]">
            <div className="text-lg text-white">{t('extraProtectionProgramStatus')}</div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>{eppData?.status}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>{`${t('extraProtection.autoRenew.toggleLabel')}: ${
                eppData?.autoRenew ? t('extraProtection.autoRenew.on') : t('extraProtection.autoRenew.off')
              }`}</div>
            </div>
          </div>
        </div>
      )}
      <PaymentDetails
        label="Upcoming Charges"
        payment={formattedUpcomingCharges}
        showDraftStatus={true}
        refetchPatientInfo={refetchPatientInfo}
      />
      <PaymentDetails label="Past Charges" payment={patient.pastCharges} />
    </PatientComponentLayout>
  );
};

export default Payments;
