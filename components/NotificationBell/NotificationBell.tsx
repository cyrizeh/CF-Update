import { useNotificationsContext } from '@/contexts/NotificationContext/NotificationContext';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

const NotificationBell = () => {
  const { unreadCount } = useNotificationsContext();
  return (
    <Link
      type="button"
      className="relative inline-flex h-8 w-8 items-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400 p-2 text-center text-sm font-medium text-white"
      href={'/admin/notifications/unread'}>
      <FaBell size={20}></FaBell>
      <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white dark:border-gray-900 dark:bg-cryo-light-grey">
        {unreadCount}
      </div>
    </Link>
  );
};
export default NotificationBell;
