import Devices from '@/features/Specimens/AccountInventory/AccountDevices';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Devices />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
