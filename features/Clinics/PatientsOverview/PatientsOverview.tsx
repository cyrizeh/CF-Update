import Panel from '@/components/Panel/Panel';
import PanelRow from '@/components/Panel/PanelRow';
import { ViewTypes } from '@/types';

type Props = {
  clinic: ViewTypes.Clinic;
};

const PatientsOverview = ({ clinic }: Props) => {
  return (
    <Panel title={'Patients overview'} isEditable={false}>
      <PanelRow text={'Patients'} value={clinic.patientsCount.toString()} testId="patients-overview-patients" />
      {/* <PanelRow text={'Signed contracts'} value={clinic.contractsCount.toString()} /> */}
      <PanelRow text={'Contract type'} value={'Transport and Storage'} testId="patients-overview-contract-type" />
      <PanelRow text={'Canes'} value={clinic?.specimensCount.toString()} testId="patients-overview-canes" />
    </Panel>
  );
};

export default PatientsOverview;
