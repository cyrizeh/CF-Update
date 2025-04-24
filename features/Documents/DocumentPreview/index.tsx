import worker from '@/pdf-worker';
import { FC, useEffect, useState } from 'react';

import { Button, Spinner } from 'flowbite-react';
import { Document, Page, pdfjs } from 'react-pdf';
import useTranslation from 'next-translate/useTranslation';

pdfjs.GlobalWorkerOptions.workerSrc = worker;

type DocumentType = {
  documentUri: string;
  name?: string;
};
type DocumentPreviewProps = {
  data: DocumentType;
};
const DocumentPreview: FC<DocumentPreviewProps> = ({ data }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState(1);
  const [pdfDocBytes, setPdfDocBytes] = useState<DocumentType | null>(null);
  const [isVisibleBtn, setIsVisibleBtn] = useState(false);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages);
    setIsVisibleBtn(true);
  }

  useEffect(() => {
    if (data?.documentUri !== pdfDocBytes?.documentUri) {
      setPdfDocBytes(data);
    }
  }, [data]);

  const downloadDocument = () => {
    if (pdfDocBytes && !!pdfDocBytes?.name) {
      fetch(pdfDocBytes.documentUri)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = pdfDocBytes?.name || 'document.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error fetching and downloading the document:', error);
        });
    } else if (pdfDocBytes) {
      const a = document.createElement('a');
      a.href = pdfDocBytes?.documentUri;
      document.body.appendChild(a);
      window.URL.revokeObjectURL(pdfDocBytes?.documentUri);
      a.click();
    }
  };

  if (!pdfDocBytes)
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm md:mt-60">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      {isVisibleBtn && (
        <Button gradientDuoTone="primary" onClick={downloadDocument} className="my-8">
          Download document
        </Button>
      )}
      <Document
        file={pdfDocBytes?.documentUri}
        loading={
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
            </div>
          </div>
        }
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center">
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default DocumentPreview;
