import usePatientMutation from '@/api/mutations/usePatientMutation';
import { useGetPatientAttachments } from '@/api/queries/patient.queries';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import PlusIcon from '@/public/icons/PlusIcon';
import doc from '@/public/icons/doc.svg';
import { PatientOverviewProps } from '@/types/view';
import { hasPermission, isUserAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { Button } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import PatientComponentLayout from '../PatientComponentLayout';
import AddAttachment from './modal/AddAttachment';
import useRole from '@/hooks/useRole';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const Attachments = ({ patient, isReadonly }: PatientOverviewProps) => {
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const {
    isModalOpen: isDeleteItemOpen,
    onCloseModal: onCloseDeleteItem,
    onOpenModal: onOpenDeleteItem,
  } = useToggleModal();

  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isPatient = isUserPatient(roles);
  const { userPermissions } = usePermissions();
  const isUserCanCreateOrDeleteAttachments = !isReadonly && hasPermission(userPermissions, 'create:attachments');
  const [attachmentsList, setAttachmentsList] = useState<any>(null);

  const { pagination } = useTableControls(attachmentsList, {});
  const [activeId, setActiveId] = useState('');

  const {
    data: attachments,
    isLoading,
    mutate: refetchAttachments,
  } = useGetPatientAttachments(
    patient.id,
    {
      pageSize: pagination.size,
      pageNumber: pagination.currentPage,
    },
    isPatient
  );

  const { deleteAttachment, downloadPatientAttachment } = usePatientMutation(patient.id);

  useEffect(() => {
    if (!isLoading && attachments) {
      setAttachmentsList(attachments);
    }
  }, [attachments, isLoading]);

  const { t } = useTranslation('attachments');
  const download = async (documentId: string) => {
    try {
      const { data } = await downloadPatientAttachment.trigger({
        patientId: patient?.id,
        documentId,
        isPatient,
      });
      const url = data.documentUri;
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error('Cannot download file');
    }
  };

  const onOpenAlert = (id: string) => {
    setActiveId(id);
    onOpenDeleteItem();
  };

  const onDeleteAttachment = () => {
    deleteAttachment
      .trigger({ attachmentId: activeId })
      .then(() => {
        // @ts-ignore
        refetchAttachments(undefined, { revalidate: true });
        toast.success(`Attachment has been deleted`);
      })
      .catch(reason => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.AttachmentId[0]);
        }
      })
      .finally(() => {
        onCloseDeleteItem();
      });
  };

  return (
    <PatientComponentLayout col>
      <AddAttachment
        refetchAttachmentsList={refetchAttachments}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        patient={patient}
      />
      <ConfirmationModal
        isOpen={isDeleteItemOpen}
        onClose={onCloseDeleteItem}
        onConfirm={onDeleteAttachment}
        isLoading={deleteAttachment.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className=" text-2xl font-normal text-white">{t('title')}</span>

        {isUserCanCreateOrDeleteAttachments && (
          <Button gradientDuoTone="primary" onClick={onOpenModal}>
            <div className="mr-2">
              <PlusIcon />
            </div>
            {t('add')}
          </Button>
        )}
      </div>

      {!_.isEmpty(attachmentsList?.items) ? (
        <div className="pt-6">
          {attachmentsList.items?.map((item: any) => (
            <div
              key={item.id}
              className="my-2 flex items-center justify-between rounded-lg border-0 p-2 sm:p-4 dark:bg-[#292B2C]">
              <div className="flex cursor-pointer items-center gap-3 text-left" onClick={() => download(item.id)}>
                <Image src={doc} alt="doc" />
                <div className="flex flex-col">
                  <span className="sensitive max-w-[80%] break-words text-sm font-medium leading-tight text-gray-300 sm:max-w-full">
                    {item.fileName}
                  </span>
                  <span className="text-sm font-normal leading-tight text-[#828282]">{item.contentType}</span>
                </div>
              </div>
              {isCryoAdmin && (
                <MdDelete color="white" className="cursor-pointer" onClick={() => onOpenAlert(item.id)} />
              )}
            </div>
          ))}
          <div className="flex pt-8">
            <Pagination {...pagination} />
          </div>
        </div>
      ) : null}
    </PatientComponentLayout>
  );
};

export default Attachments;
