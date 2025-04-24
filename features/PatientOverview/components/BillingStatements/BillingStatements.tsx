import { axiosInstance } from '@/api/axiosConfig';
import { buildPatientStatementEndpointForAdmin } from '@/api/queries/document.queries';
import { useGetPatientBillingStatementsForAdmin } from '@/api/queries/patient.queries';
import Pagination from '@/components/Pagination/Pagination';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { useTableControls } from '@/hooks/useTableControls';
import doc from '@/public/icons/doc.svg';
import { AdminRoute } from '@/types';
import { BillingStatementResponse } from '@/types/api';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { Spinner } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

type AdminPatientBillingStatementsProps = {
  patient: any;
};

export const AdminPatientBillingStatements: React.FC<AdminPatientBillingStatementsProps> = ({ patient }) => {
  const { t } = useTranslation('billing');
  const { query } = useRouter();
  const patientId = query.id as string;
  const openPdfInNewTab = (id: string) => {
    window.open(`${AdminRoute.Patients}/${patientId}/billingStatements/${id}`, '_blank');
  };

  const [billingStatements, setBillingStatements] = useState<BillingStatementResponse | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const { pagination } = useTableControls(billingStatements, {});
  const { data, isLoading } = useGetPatientBillingStatementsForAdmin(patientId, {
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setBillingStatements(data);
    }
  }, [isLoading, data]);

  const downloadDocument = async (statementId: string) => {
    setLoading(prevState => ({ ...prevState, [statementId]: true }));
    try {
      const response = await axiosInstance.get(buildPatientStatementEndpointForAdmin(patientId, statementId));
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
      setLoading(prevState => ({ ...prevState, [statementId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  return (
    <>
      <PatientComponentLayout col>
        <p className="mb-6 text-2xl font-normal text-white">{t('billingStatements.documents')}</p>
        {_.isEmpty(billingStatements?.items) ? (
          <div className="my-2 flex justify-center gap-5 rounded-lg border-0 p-2 sm:p-4 dark:bg-[#292B2C]">
            <p className="text-xl font-medium leading-tight text-gray-300">{t('billingStatements.noDocuments')}</p>
          </div>
        ) : (
          billingStatements?.items?.map(item => (
            <div className="my-10">
              <p className="mb-2 text-sm font-bold leading-tight text-gray-300">{`${t(
                'billingStatements.statementNumber'
              )}: ${item?.statementNumber}`}</p>
              <p className="mb-2 text-sm font-bold leading-tight text-gray-300">{`${t('billingStatements.status')}: ${
                item?.status
              }`}</p>
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
    </>
  );
};
