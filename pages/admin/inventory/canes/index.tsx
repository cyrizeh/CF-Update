import Canes from '@/features/Specimens/AdminCanes';
import { InventoryPageLayout } from '..';

function CanesInventoryPage() {
  return <Canes />;
}

CanesInventoryPage.getLayout = InventoryPageLayout;

export default CanesInventoryPage;
