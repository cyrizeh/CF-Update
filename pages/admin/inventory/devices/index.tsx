import Devices from '@/features/Specimens/AdminDevices';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Devices />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
