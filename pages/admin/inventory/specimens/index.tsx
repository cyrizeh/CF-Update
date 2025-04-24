import Specimens from '@/features/Specimens/AdminSpecimens';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Specimens />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
