import useDocumentMutation from '@/api/mutations/useDocumentMutation';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import DocumentPreview from '@/features/Documents/DocumentPreview';
import { NotFound } from '@/features/NotFound/NotFound';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { id } = query;
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const { getPatientDocumentForAdmin } = useDocumentMutation();

  useEffect(() => {
    setIsLoading(true);
    getPatientDocumentForAdmin
      .trigger({
        id: id as string,
      })
      .then(res => {
        setData(res?.data);
      })
      .catch(err => setError(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:documentNotFound')} />;
  }

  return <DocumentPreview data={data} />;
}
