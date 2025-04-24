import TextInput from '@/components/Forms/TextInput/TextInput';
import closeIcon from '@/public/icons/close-button.svg';
import { Button, Modal, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import useEditPricingPlanNameModal from './useEditPricingPlanNameModal';

const EditPricingPlanNameModal: React.FC<{ open: boolean; onClose: any; plan: {id: string, name: string}, refetchData: any}> = ({ open, onClose, plan, refetchData }) => {
  const { t } = useTranslation('pricingPlans');
  const { planName, error, isLoading, changePlanName, setError, updatePlanName, rootRef } =
    useEditPricingPlanNameModal(onClose, plan, refetchData);

  const onCloseModal = () => {
    changePlanName('');
    setError('');
    onClose();
  };

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={open} size="md" onClose={onCloseModal}>
        <div className="flex items-center justify-center p-5">
          <div className="text-3xl font-light">{t('edit_name')}</div>

          <div className="absolute right-4 cursor-pointer" onClick={onCloseModal}>
            <Image priority src={closeIcon} alt="Close" />
          </div>
        </div>

        <Modal.Body>
          <div>
            <TextInput
              type="text"
              placeholder="Plan name"
              value={planName}
              onChange={changePlanName}
              error={error}
            />
            <div className="pt-2 text-xs text-rose-400">{error}</div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-between">
          <Button color="transparent" onClick={onClose}>
            {t('common:cancel')}
          </Button>

          <Button type="submit" gradientDuoTone="primary" onClick={updatePlanName}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
              </div>
            ) : (
              <div>{t('common:save')}</div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPricingPlanNameModal;
