import PanelRow from '@/components/Panel/PanelRow';
import ContactDetails from './ContactDetails';
import { ViewTypes } from '@/types';
import Panel from '@/components/Panel/Panel';
import useTranslation from 'next-translate/useTranslation';
import { clinicTypes } from '@/constants/clinics';

type Props = {
  contactDetails: ViewTypes.ContactDetails;
  secondaryContactDetails: ViewTypes.ContactDetails;
  name: string;
  parentCompany: string;
  type: string;
  onEdit: () => void;
  isEditable?: boolean;
};

const ClinicDetails = ({
  contactDetails,
  secondaryContactDetails,
  name,
  parentCompany,
  type,
  onEdit,
  isEditable,
}: Props) => {
  const { t } = useTranslation('clinics');

  return (
    <Panel title={t('general.title')} isEditable={isEditable} onEdit={onEdit}>
      <PanelRow text={t('general.parentCompany')} value={parentCompany} testId="parent-company"/>
      <PanelRow text={t('general.clinicName')} value={name}  testId="clinic-name" />
      <PanelRow text={t('general.clinicType')} value={clinicTypes.find(item => item.value === type)?.label || type} testId="clinic-type"/>
      <ContactDetails contact={'Primary'} contactDetails={contactDetails} />
      <ContactDetails contact={'Secondary'} contactDetails={secondaryContactDetails} />
    </Panel>
  );
};

export default ClinicDetails;
