import useDocumentMutation from '@/api/mutations/useDocumentMutation';
import DocumentPreview from '@/features/Documents/DocumentPreview';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const { query } = useRouter();
  const { id } = query;
  const { getPatientStatement  } = useDocumentMutation();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    getPatientStatement 
      .trigger({
        id: id as string,
      })
      .then(res => {
        setData(res?.data);
      });
  }, [id]);
  return <DocumentPreview data={data} />;
}
