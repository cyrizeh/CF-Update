import useRole from '@/hooks/useRole';
import doc from '@/public/icons/doc.svg';
import { ViewTypes } from '@/types';
import { DocumentStatus } from '@/types/view';
import { getDocumentStatusTitle } from '@/types/view/DocumentStatus.enum';
import { isUserAdmin, isUserClinicAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import PatientComponentLayout from './PatientComponentLayout';

const Documents = ({ documents }: { documents: ViewTypes.PatientDocumentInfo[] }) => {
  const { roles } = useRole();
  const isPatient = isUserPatient(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isClinicAdmin = isUserClinicAdmin(roles);
  const { t } = useTranslation('documents');
  const openPdfInNewTab = async (id: string, status: string) => {
    if (status !== DocumentStatus.Complete && (isPatient || isCryoAdmin || isClinicAdmin)) {
      const errorMsg = t('notSignedDocumentsErrorMsg');
      return toast.error(errorMsg);
    }

    if (isPatient) {
      window.open(`/patient/documents/${id}`, '_blank');
    } else if (isCryoAdmin) {
      window.open(`/admin/documents/${id}`, '_blank');
    } else if (isClinicAdmin) {
      window.open(`/clinic/documents/${id}`, '_blank');
    }
  };

  return (
    <PatientComponentLayout col>
      <span className="mb-6 text-2xl font-normal text-white">Documents</span>
      {documents?.map(item => (
        <div
          key={item.id}
          className="my-2 flex flex-col flex-wrap justify-between gap-2 rounded-lg border-0 p-2 sm:flex-row sm:p-4 dark:bg-[#292B2C]">
          <div
            className="flex cursor-pointer items-center gap-3 text-left"
            onClick={() => openPdfInNewTab(item.id, item.status)}>
            <Image src={doc} alt="doc" />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight text-gray-300">{item.name}</span>
              <span className="text-sm font-normal leading-tight text-[#828282]">{item.type}</span>
            </div>
          </div>

          {item.status === DocumentStatus?.Complete ? (
            <Button gradientDuoTone="primary" outline disabled>
              {getDocumentStatusTitle(item.status)}
            </Button>
          ) : (
            <Button color="red" outline disabled>
              {getDocumentStatusTitle(item.status)}
            </Button>
          )}
        </div>
      ))}
    </PatientComponentLayout>
  );
};

export default Documents;
