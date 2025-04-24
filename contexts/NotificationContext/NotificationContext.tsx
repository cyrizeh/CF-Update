import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetNotifications } from '@/api/queries/notifications.queries';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import useRole from '@/hooks/useRole';

type NotificationsContextType = {
  unreadCount: number;
  refreshNotifications: any;
};

const NotificationsContext = createContext<NotificationsContextType>(undefined!);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { roles } = useRole();

  const { data: notificationsData, mutate: refetch } = useGetNotifications(
    { isRead: false },
    isUserAdmin(roles) || isUserGodAdmin(roles)
  );

  useEffect(() => {
    if (notificationsData) {
      setUnreadCount(notificationsData.totalCount);
    }
  }, [notificationsData]);

  const refreshNotifications = () => {
    refetch();
  };

  return (
    <NotificationsContext.Provider value={{ unreadCount, refreshNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
