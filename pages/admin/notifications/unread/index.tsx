import UnReadNotifications from '@/features/Notifications/UnReadNotifications';
import { NotificationsPageLayout } from '..';

function UnReadNotificationsPage(props: any) {
  return <UnReadNotifications {...props} />;
}

UnReadNotificationsPage.getLayout = NotificationsPageLayout;

export default UnReadNotificationsPage;
