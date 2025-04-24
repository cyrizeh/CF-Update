import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Spinner } from 'flowbite-react';
import { PDFDocument } from 'pdf-lib';
import { axiosInstance } from '@/api/axiosConfig';
import worker from '@/pdf-worker';
import { useRouter } from 'next/router';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
pdfjs.GlobalWorkerOptions.workerSrc = worker;

const SignDoc = () => {
  const [pdfDocBytes, setPdfDocBytes] = useState(null);
  const [numPages, setNumPages] = useState(1);
  const signatureCanvasRef = useRef<any>(null);
  const [docId, setDocId] = useState('');
  const router = useRouter();
  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages);
  }
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axiosInstance.get('/patients/onboarding');
      const { id } = data.currentStep.patientDocument;
      setDocId(id);
      const { data: doc } = await axiosInstance.get(`/patients/getDocumentForSigning?patientDocumentId=${id}`);
      setPdfDocBytes(doc.documentUri);
    };

    fetch();
  }, []);

  const generatePDF = async () => {
    const dataURL = signatureCanvasRef.current.toDataURL();

    if (dataURL && pdfDocBytes) {
      const existingPdfBytes = await fetch(pdfDocBytes).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const counter = pdfDoc.getPages().length - 1;
      const page = pdfDoc.getPages()[counter];
      const { width, height } = page.getSize();
      const signatureImage = await pdfDoc.embedPng(dataURL);
      const signatureDimensions = signatureImage.scale(0.2);
      page.drawImage(signatureImage, {
        x: width / 2 - signatureDimensions.width / 2,
        y: height / 5 - signatureDimensions.height / 2,
        width: signatureDimensions.width,
        height: signatureDimensions.height,
      });
      const pdfBytes = await pdfDoc.save();
      const formData = new FormData();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      formData.append('file', blob);
      formData.append('patientDocumentId', docId);

      await axiosInstance.post('/Patients/UploadSignedDocument', formData);
      router.back();
    }
  };

  if (!pdfDocBytes) {
    return <Spinner />;
  }
  return (
    <div>
      <div>
        <Document file={pdfDocBytes} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-col items-center">
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
      <div style={{ background: '#f4f4f4', margin: '0 auto', width: '612px' }}>
        <div>Signature:</div>
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 1024, height: 200, className: 'sigCanvas' }}
          ref={signatureCanvasRef}
        />
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Button onClick={generatePDF}>Upload document</Button>
      </div>
    </div>
  );
};
SignDoc.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;
export default SignDoc;
