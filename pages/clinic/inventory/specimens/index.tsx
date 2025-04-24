import Specimens from '@/features/Specimens/ClinicInventory/ClinicSpecimens';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Specimens />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
