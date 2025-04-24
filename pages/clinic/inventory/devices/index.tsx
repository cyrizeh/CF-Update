import Devices from '@/features/Specimens/ClinicInventory/ClinicDevices';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Devices />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
