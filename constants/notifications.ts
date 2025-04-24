export enum NotificationType {
  TransportationRequested = 'TransportationRequested',
  TerminationRequested = 'TerminationRequested',
}

export const NotificationsTypeTableMapper: Record<NotificationType, string> = {
  TransportationRequested: 'Transportation Requested',
  TerminationRequested: 'Termination Requested',

};

export const NotificationsTypeSelect = [
  { value: NotificationType.TransportationRequested, label: 'Transportation Requested' },
  { value: NotificationType.TerminationRequested, label: 'Termination Requested' },
];

export const NotificationsTypeToasterMapper: Record<NotificationType, string> = {
  TransportationRequested:
    'Transportation request has been requested. Please review the request by clicking on the notification.',
  TerminationRequested:
    'Termination request has been requested. Please review the request by clicking on the notification.',
};

export const buildNotificationsTypeRoute = (notificationType: NotificationType, entityId: string) => {
  switch (notificationType) {
    case NotificationType.TransportationRequested:
      return `/admin/transportation/request/${entityId}`;
    case NotificationType.TerminationRequested:
      return "";
    default:
      return '';
  }
};
