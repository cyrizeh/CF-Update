import Specimens from '@/features/Specimens/AccountInventory/AccountSpecimens';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Specimens />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
