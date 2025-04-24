import { axiosInstance } from '@/api/axiosConfig';
import usePatientMutation from '@/api/mutations/usePatientMutation';
import { buildPatientStatementEndpoint } from '@/api/queries/document.queries';
import {
  useGetAdminPatientEPP,
  useGetExtraProtectionSubscriptionPatientPlan,
  useGetPatientBillingStatements,
  useGetPatientInfo,
  useGetPatientPaymentMethod,
  useGetPaymentPatientPlan,
} from '@/api/queries/patient.queries';
import Pagination from '@/components/Pagination/Pagination';
import { EPP_LINK } from '@/constants/billing';
import EditDateModal from '@/features/PatientOverview/components/EditDateModal';
import EditDonorInformationModal from '@/features/PatientOverview/components/EditDonorInformationModal/EditDonorInformationModal';
import EditPaymentMethodModal from '@/features/PatientOverview/components/EditPaymentMethodModal';
import ExtraProtectionAutoRenewSubscriptionModal from '@/features/PatientOverview/components/ExtraProtectionSubscriptionModal/ExtraProtectionAutoRenewSubscriptionModal';
import ExtraProtectionSubscriptionModal from '@/features/PatientOverview/components/ExtraProtectionSubscriptionModal/ExtraProtectionSubscriptionModal';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import PaymentDetails from '@/features/PatientOverview/components/PaymentDetails/PaymentDetails';
import ReceivedDates from '@/features/PatientOverview/components/ReceivedDates';
import useRole from '@/hooks/useRole';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import doc from '@/public/icons/doc.svg';
import { PatientRoute } from '@/types';
import { BillingStatementResponse } from '@/types/api';
import { PaymentDateSource, PaymentDateSourceEnum } from '@/types/view/PatientPaymentDateSource.type';
import {
  PatientExtraProtectionStatusDisplay,
  PatientExtraProtectionSubscriptionStatus,
} from '@/types/view/PatientPayments.type';
import { formatDate } from '@/utils/formatDate';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getPatientSpecimenTypesLabels } from '@/utils/getSpecimenLabels';
import dayjs from 'dayjs';
import { Button, Spinner } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { HiCalendar, HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

export const PatientBillingStatements: React.FC = () => {
  const { t } = useTranslation('billing');
  const { query } = useRouter();
  const { roles } = useRole();
  const [checkedExtraProtectionAutoRenewSub, setCheckedExtraProtectionAutoRenewSub] = useState(false);
  const [billingStartDate, setBillingStartDate] = useState<string | null | undefined>('');
  const [specimenReceivedDate, setSpecimenReceivedDate] = useState<string | null | undefined>('');
  const [subscriptionType, setSubscriptionType] = useState<string | null | undefined>('');
  const [paymentDateSource, setPaymentDateSource] = useState<PaymentDateSource | null>(null);

  const [showEPPForPatient, setShowEPPForPatient] = useState(true);

  const { data: patient, mutate: refetchPatientInfo, isLoading: isPatientLoading } = useGetPatientInfo();
  const openPdfInNewTab = (id: string) => {
    window.open(`${PatientRoute.BillingStatements}/${id}`, '_blank');
  };

  const [billingStatements, setBillingStatements] = useState<BillingStatementResponse | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const { pagination } = useTableControls(billingStatements, {});
  const { data, isLoading } = useGetPatientBillingStatements({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  const { updatePatientBillingDate, changeExtraProtectionProgramAutoRenewState } = usePatientMutation(
    query.id as string
  );

  const { data: paymentDetails, mutate: refetchPaymentDetails } = useGetPatientPaymentMethod({ isPatient: true });
  const { data: extraProtectiondata } = useGetExtraProtectionSubscriptionPatientPlan({ isPatient: true });
  const { data: billingData, mutate: refetchPaymentPlan } = useGetPaymentPatientPlan({ isPatient: true });
  const { data: eppData } = useGetAdminPatientEPP({ id: '' });

  const subscriptionBtnLabel = (status: PatientExtraProtectionSubscriptionStatus) =>
    status === PatientExtraProtectionSubscriptionStatus.Subscribed
      ? t('patients:unSubscribe')
      : t('patients:subscribe');

  const nextBillingDate = dayjs(billingData?.extraProtection?.nextBillingDate);
  const today = dayjs().startOf('day');

  const isDateTheSameOrAfter = nextBillingDate.isAfter(today) || nextBillingDate.isSame(today, 'day');

  const {
    isModalOpen: isEditBillingDateModalOpen,
    onCloseModal: closeEditBillingDateModal,
    onOpenModal: openEditBillingDateModal,
  } = useToggleModal();

  const {
    isModalOpen: isEditPaymentMethodOpen,
    onCloseModal: closeEditPaymentMethodModal,
    onOpenModal: openEditPaymentMethodModal,
  } = useToggleModal();

  const {
    isModalOpen: isTurnOffAutoRenewModalOpen,
    onCloseModal: onCloseTurnOffAutoRenewModal,
    onOpenModal: onOpenTurnOffAutoRenewModal,
  } = useToggleModal();

  const {
    isModalOpen: isSubscriptionModalOpen,
    onCloseModal: closeSubscriptionModalOpen,
    onOpenModal: openSubscriptionModalOpen,
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

  const onSubmitExtraProtectionProgramAutoRenewState = async () => {
    await changeExtraProtectionProgramAutoRenewState
      .trigger({ autoRenew: !checkedExtraProtectionAutoRenewSub })
      .then(() => {
        setCheckedExtraProtectionAutoRenewSub(prev => !prev);
        onCloseTurnOffAutoRenewModal();
        refetchPaymentPlan();
      });
  };

  const handleExtraProtectionProgram = () => {
    const isSubscribed = billingData?.extraProtection?.status === PatientExtraProtectionSubscriptionStatus.Subscribed;
    const isUnsubscribed =
      billingData?.extraProtection?.status === PatientExtraProtectionSubscriptionStatus.Unsubscribed ||
      billingData?.extraProtection?.status === PatientExtraProtectionSubscriptionStatus.OptedOut;
    const isAutoRenewChecked = checkedExtraProtectionAutoRenewSub === true;
    const isAutoRenewUnchecked = checkedExtraProtectionAutoRenewSub === false;

    if (isSubscribed && isAutoRenewUnchecked) {
      onSubmitExtraProtectionProgramAutoRenewState();
    } else if (isSubscribed && isAutoRenewChecked) {
      onOpenTurnOffAutoRenewModal();
    } else if (isUnsubscribed && isAutoRenewChecked) {
      onSubmitExtraProtectionProgramAutoRenewState();
    } else if (isUnsubscribed && isAutoRenewUnchecked) {
      openSubscriptionModalOpen();
    }
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
    setCheckedExtraProtectionAutoRenewSub(billingData?.extraProtection?.autoRenew);
    if (
      !!patient &&
      billingData?.extraProtection?.status === PatientExtraProtectionSubscriptionStatus.Subscribed &&
      billingData?.extraProtection.ownerId !== patient?.id
    ) {
      setShowEPPForPatient(false);
    }
  }, [billingData, patient]);

  useEffect(() => {
    if (!isLoading && data) {
      setBillingStatements(data);
    }
  }, [isLoading, data]);

  const downloadDocument = async (id: string) => {
    setLoading(prevState => ({ ...prevState, [id]: true }));
    try {
      const response = await axiosInstance.get(buildPatientStatementEndpoint(id));
      const documentUri = response.data.documentUri;
      if (documentUri) {
        fetch(documentUri)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = response?.data?.name || 'document.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error('Error fetching and downloading the document:', error);
          });
      }
    } catch (error) {
      toast.error('Failed to download document');
    } finally {
      setLoading(prevState => ({ ...prevState, [id]: false }));
    }
  };

  if (isLoading || isPatientLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent md:mb-4 md:w-[600px]">
        {t('billingStatements.title')}
      </h1>
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* <Payments patient={patient} isReadonly={true} refetchPatientInfo={refetchPatientInfo} /> */}
        <div className="flex w-full flex-col items-center gap-4 xl:w-1/3 xl:items-start">
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

            <EditPaymentMethodModal
              isOpen={isEditPaymentMethodOpen}
              onClose={closeEditPaymentMethodModal}
              refetchPaymentDetails={refetchPaymentDetails}
            />

            <ExtraProtectionSubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={closeSubscriptionModalOpen}
              refetchPatientExtraProtectionStatus={refetchPaymentPlan}
              subscriptionStatus={billingData?.extraProtection?.status}
              data={extraProtectiondata}
            />

            <ExtraProtectionAutoRenewSubscriptionModal
              isOpen={isTurnOffAutoRenewModalOpen}
              onClose={onCloseTurnOffAutoRenewModal}
              onSubmit={onSubmitExtraProtectionProgramAutoRenewState}
              isLoading={changeExtraProtectionProgramAutoRenewState?.isMutating}
            />

            <EditDonorInformationModal
              isOpen={isEditDonorInformationOpen}
              onClose={closeEditDonorInformationModal}
              propsData={patient}
              refetchPatientData={refetchPatientInfo}
            />
            <div className="mb-4 text-2xl font-normal text-white">Billing details</div>

            {/* {!billingStartDate && paymentDateSource === PaymentDateSourceEnum.BillingStartDate ? (
              <div className="mb-5 flex items-center justify-start gap-1 rounded bg-[#fff4e5] p-3">
                <HiInformationCircle className=" mb-1 h-6 w-6 text-[#663c00]" />
                <p className="text-sm text-[#663c00]">Billing start date is not set.</p>
              </div>
            ) : null} */}

            <div className="flex items-center justify-between">
              <div className="my-2 mr-2 flex w-full items-center justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
                <div>Billing start date</div>
                {billingStartDate ? <div>{formatDateWithSlashSeparator(billingStartDate)}</div> : <div>Not set</div>}
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="my-2 mr-2 flex w-full items-center justify-between gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
                <div className="flex flex-col gap-4">
                  <div>{t('patients:paymentMethodDetails')}</div>
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
                </div>
                <Button
                  className="border-0 p-1 xl:block"
                  size={'sm'}
                  gradientDuoTone="primary"
                  onClick={openEditPaymentMethodModal}>
                  <div>{paymentDetails ? t('common:edit') : t('common:add')}</div>
                </Button>
              </div>
            </div>

            <ReceivedDates patient={patient} />
            <div className="mb-4 flex items-center justify-between">
              <div className="my-2 mr-2 w-full rounded-md border border-transparent text-gray-300 dark:bg-[#292B2C]">
                <div className="flex w-full items-center justify-between gap-12 px-4  py-3 text-sm font-normal leading-tight">
                  <div>{t('patients:specimenTypes')}</div>
                  <div className="flex justify-end text-end">
                    {!!patient?.specimenTypes?.length
                      ? getPatientSpecimenTypesLabels(patient?.specimenTypes)
                      : 'Not set'}
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-12 px-4 py-3 text-sm font-normal leading-tight ">
                  <div>{t('patients:numberOfCanes')}</div>
                  <div>{patient?.numberOfCanes || '0'}</div>
                </div>
              </div>
            </div>

            {billingData?.extraProtection && (
              <div className="mb-4 items-center">
                <div className="my-2 mr-2 flex w-full flex-col gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal text-gray-300 dark:bg-[#292B2C]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-lg text-white">{t('extraProtectionProgramStatus')}</div>
                    <Button
                      className="w-[115px]"
                      gradientDuoTone="primary"
                      onClick={() => {
                        window.open(EPP_LINK, '_blank');
                      }}>
                      {t('common:viewDetails')}
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="uppercase">
                      {
                        PatientExtraProtectionStatusDisplay[
                          billingData?.extraProtection?.status as PatientExtraProtectionSubscriptionStatus
                        ]
                      }
                    </div>
                    {extraProtectiondata && showEPPForPatient && (
                      <Button
                        className="w-[115px] justify-center border-0 p-1"
                        size={'sm'}
                        gradientDuoTone="primary"
                        onClick={openSubscriptionModalOpen}>
                        <div>{subscriptionBtnLabel(billingData?.extraProtection?.status)}</div>
                      </Button>
                    )}
                  </div>
                  {extraProtectiondata &&
                    showEPPForPatient &&
                    isDateTheSameOrAfter &&
                    billingData?.extraProtection?.status === PatientExtraProtectionSubscriptionStatus.Unsubscribed && (
                      <div className="flex items-center gap-1">
                        <HiCalendar />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                          {'Coverage until:  '}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                          {formatDateWithSlashSeparator(billingData?.extraProtection?.nextBillingDate)}
                        </span>
                      </div>
                    )}

                  {extraProtectiondata && showEPPForPatient && (
                    <div className="flex flex-wrap justify-between gap-4">
                      <label className="relative inline-flex cursor-pointer flex-wrap items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkedExtraProtectionAutoRenewSub}
                          className="peer sr-only"
                          onChange={handleExtraProtectionProgram}
                        />
                        <div className="peer h-5 w-10 rounded-full bg-cryo-light-grey after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4  after:rounded-full after:border after:border-cryo-grey after:bg-cryo-grey after:transition-all after:content-[''] peer-checked:bg-gradient-to-r peer-checked:from-cryo-blue peer-checked:to-cryo-cyan peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-0 dark:border-gray-600 dark:bg-cryo-light-grey "></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {`${t('patients:extraProtection.autoRenew.toggleLabel')} ${
                            checkedExtraProtectionAutoRenewSub
                              ? t('patients:extraProtection.autoRenew.on')
                              : t('patients:extraProtection.autoRenew.off')
                          }`}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {eppData && (
              <div className="mb-4 items-center">
                <div className="my-2 mr-2 flex w-full flex-col gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal text-gray-300 dark:bg-[#292B2C]">
                  <div className="text-lg text-white">{t('extraProtectionProgramStatus')}</div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>{eppData?.status}</div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>{`${t('patients:extraProtection.autoRenew.toggleLabel')}: ${
                      eppData?.autoRenew
                        ? t('patients:extraProtection.autoRenew.on')
                        : t('patients:extraProtection.autoRenew.off')
                    }`}</div>
                  </div>
                </div>
              </div>
            )}
          </PatientComponentLayout>

          <PatientComponentLayout col>
            <p className="mb-6 text-2xl font-normal text-white">{t('billingStatements.documents')}</p>
            {_.isEmpty(billingStatements?.items) ? (
              <div className="my-2 flex justify-center gap-5 rounded-lg border-0 p-2 sm:p-4 dark:bg-[#292B2C]">
                <p className="text-sm leading-tight text-gray-300">{t('billingStatements.noDocuments')}</p>
              </div>
            ) : (
              billingStatements?.items?.map(item => (
                <div className="my-10">
                  <p className="mb-2 text-sm font-bold leading-tight text-gray-300">{`${t(
                    'billingStatements.statementNumber'
                  )}: ${item?.statementNumber}`}</p>
                  <p className="mb-2 text-sm font-bold leading-tight text-gray-300">{`${t(
                    'billingStatements.status'
                  )}: ${item?.status}`}</p>
                  <div
                    key={item?.paymentId}
                    className="my-2 flex justify-between gap-5 rounded-lg border-0 p-2 sm:p-4 dark:bg-[#292B2C]">
                    <div
                      className="flex cursor-pointer items-center gap-3 text-left"
                      onClick={() => openPdfInNewTab(item?.paymentId)}>
                      <Image src={doc} alt="Document Icon" width={32} height={32} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight text-gray-300">{item?.fileName}</span>
                        <span className="text-sm font-normal leading-tight text-[#828282]">
                          {formatDateWithSlashSeparator(item?.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <FaEye className="cursor-pointer" size={20} onClick={() => openPdfInNewTab(item?.paymentId)} />
                      <button
                        onClick={() => downloadDocument(item?.paymentId)}
                        disabled={loading[item?.paymentId]}
                        className={`flex items-center ${
                          loading[item?.paymentId] ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}>
                        <FaDownload size={20} className={loading[item?.paymentId] ? 'text-[#828282]' : 'text-white'} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!_.isEmpty(billingStatements?.items) ? (
              <div className="flex pt-8">
                <Pagination {...pagination} />
              </div>
            ) : null}
          </PatientComponentLayout>
        </div>
        <div className="flex w-full flex-col gap-6 xl:w-2/3">
          <PatientComponentLayout col>
            <PaymentDetails label="Upcoming Charges" payment={patient.upcomingCharges} showDraftStatus={false} />
            <PaymentDetails label="Past Charges" payment={patient.pastCharges} />
          </PatientComponentLayout>
        </div>
      </div>
    </>
  );
};
