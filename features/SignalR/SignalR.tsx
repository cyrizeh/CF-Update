import React, { ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAccessToken } from '@/api/axiosConfig';
import {
  NotificationType,
  NotificationsTypeToasterMapper,
  buildNotificationsTypeRoute,
} from '@/constants/notifications';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useNotificationsContext } from '@/contexts/NotificationContext/NotificationContext';
export interface ISignalRProviderProps {
  children?: ReactNode;
}

const CustomToastWithLink = ({
  notificationType,
  entityId,
}: {
  notificationType: NotificationType;
  entityId: string;
}) => (
  <Link href={`${buildNotificationsTypeRoute(notificationType, entityId)}`}>
    {NotificationsTypeToasterMapper[notificationType]}
  </Link>
);

const SignalR = ({ children }: ISignalRProviderProps) => {
  const { refreshNotifications } = useNotificationsContext();
  const connectionRef = React.useRef<HubConnection>();
  const { user } = useUser();
  const connectToSocket = React.useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const socketConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_ORIGIN_URL}/hubs/notification`, {
          accessTokenFactory: () => accessToken,
        })
        .configureLogging(LogLevel.Critical)
        .build();

      if (!connectionRef.current) {
        socketConnection.on('ReceiveMessage', event => {
          toast.info(<CustomToastWithLink notificationType={event?.notificationType} entityId={event?.entityId} />);
          refreshNotifications();
        });
      }
      socketConnection.start();
      connectionRef.current = socketConnection;
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    if (user) {
      connectToSocket();
      return () => {
        connectionRef.current?.stop();
      };
    }
  }, [user, connectToSocket]);

  return <>{children}</>;
};

export { SignalR };
