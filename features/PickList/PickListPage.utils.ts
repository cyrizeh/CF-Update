import {
  buildAccountClinicProfilePageRoute,
  buildAccountPatientProfilePageRoute,
  buildAccountPickListDetailsPageRoute,
  buildAdminCaneDetailsPageRoute,
  buildAdminClinicDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
  buildAdminPickListDetailsPageRoute,
  buildClinicAdminCaneDetailsPageRoute,
  buildClinicAdminPatientDetailsPageRoute,
  buildClinicClinicPageRoute,
  buildClinicPickListDetailsPageRoute,
  buildNetworkAdminCaneDetailsPageRoute,
} from '@/constants/buildRoutes';
import { UserRole } from '@/types';
import { isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { PickListType } from './PickListPage.constants';

export const buildRouteToPickListDetailsPage = (id: string, roles: UserRole[]) => {
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  if (isCryoAdmin) {
    return buildAdminPickListDetailsPageRoute(id);
  } else if (isClinicAdmin) {
    return buildClinicPickListDetailsPageRoute(id);
  } else if (isNetworkAdmin) {
    return buildAccountPickListDetailsPageRoute(id);
  } else return '';
};

export const useGetPickListDetailsPageColumn = (request: any) => {
  const firstColumn = [
    {
      name: 'Ticket type',
      value: request?.type || 'N/A',
      show: true,
    },

    {
      name: 'Number of canes',
      value: request?.numberOfCanes || 'N/A',
      show: true,
    },
    {
      name: 'Created date',
      value: request?.created ? formatDateWithSlashSeparator(request?.created) : 'N/A',
      show: request?.type !== PickListType.Create,
    },
  ].filter(el => !!el.show);

  const secondColumn = [
    {
      name: 'Receiving clinic',
      value: request?.clinicName || 'N/A',
      show: request?.type !== PickListType.Create,
    },
    {
      name: 'Scheduled date',
      value: request?.scheduledDate ? formatDateWithSlashSeparator(request?.scheduledDate) : 'N/A',
      show: request?.type !== PickListType.Create,
    },
    {
      name: 'Processing Person',
      value: request?.assignedToEmail || 'N/A',
      show: true,
    },
    {
      name: 'Created date',
      value: request?.created ? formatDateWithSlashSeparator(request?.created) : 'N/A',
      show: request?.type === PickListType.Create,
    },
  ].filter(el => !!el.show);

  return { firstColumn, secondColumn };
};

export const buildRouteToPatientPage = (id: string, roles: UserRole[]) => {
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  if (isCryoAdmin) {
    return buildAdminGeneralPatientPageRoute(id);
  } else if (isClinicAdmin) {
    return buildClinicAdminPatientDetailsPageRoute(id);
  } else if (isNetworkAdmin) {
    return buildAccountPatientProfilePageRoute(id);
  } else return '';
};

export const buildRouteToCaneDetailsPage = (id: string, roles: UserRole[]) => {
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  if (isCryoAdmin) {
    return buildAdminCaneDetailsPageRoute(id);
  } else if (isClinicAdmin) {
    return buildClinicAdminCaneDetailsPageRoute(id);
  } else if (isNetworkAdmin) {
    return buildNetworkAdminCaneDetailsPageRoute(id);
  } else return '';
};

export const buildRouteToClinicDetailsPage = (id: string, roles: UserRole[]) => {
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  if (isCryoAdmin) {
    return buildAdminClinicDetailsPageRoute(id);
  } else if (isClinicAdmin) {
    return buildClinicClinicPageRoute();
  } else if (isNetworkAdmin) {
    return buildAccountClinicProfilePageRoute(id);
  } else return '';
};
