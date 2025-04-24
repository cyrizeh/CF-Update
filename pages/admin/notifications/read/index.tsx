import ReadNotifications from '@/features/Notifications/ReadNotifications';
import { NotificationsPageLayout } from '..';

function ReadNotificationsPage(props: any) {
  return <ReadNotifications {...props} />;
}

ReadNotificationsPage.getLayout = NotificationsPageLayout;

export default ReadNotificationsPage;
