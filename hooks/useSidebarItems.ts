import {
  FaFileAlt,
  FaFileInvoiceDollar,
  FaGripVertical,
  FaHospital,
  FaUser,
  FaVial,
  FaBoxes,
  FaBell,
  FaTruck,
  FaRegTimesCircle,
  FaFileInvoice,
  FaTruckLoading,
  FaShippingFast,
} from 'react-icons/fa';
import { TbTransferIn, TbTransferOut } from 'react-icons/tb';
import { AdminRoute, PatientRoute, ClinicRoute, ViewTypes, AccountRoute } from '@/types';
import useRole from './useRole';
import { useEffect, useState } from 'react';
import { isUserAdmin, isUserPatient, isUserGodAdmin, isUserClinicAdmin, isUserAccountAdmin } from '@/utils';
import { useRouter } from 'next/router';
import { hasPermission } from '@/utils';
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const adminSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: AdminRoute.Overview,
    label: 'Overview',
    path: AdminRoute.Overview,
    icon: FaGripVertical,
  },
  {
    key: AdminRoute.Clinics,
    label: 'Clinics',
    path: AdminRoute.Clinics,
    icon: FaHospital,
  },
  {
    key: AdminRoute.Facilities,
    label: 'Facilities',
    path: AdminRoute.Facilities,
    icon: FaBoxes,
  },
  {
    key: '/admin/patients',
    label: 'Patients',
    path: AdminRoute.Patients,
    icon: FaUser,
  },
  {
    key: AdminRoute.Transportation,
    label: 'Transportations',
    path: AdminRoute.Transportation,
    icon: FaTruck,
  },
  {
    key: AdminRoute.Shipping,
    label: 'Shipping',
    path: AdminRoute.Shipping,
    icon: FaShippingFast,
  },
  {
    key: AdminRoute.PickList,
    label: 'Pick List',
    path: AdminRoute.PickList,
    icon: FaTruckLoading,
  },
  {
    key: AdminRoute.Inventory,
    label: 'Inventory',
    path: AdminRoute.CaneInventory,
    icon: FaVial,
  },
  {
    key: '/admin/notifications',
    label: 'Notifications',
    path: AdminRoute.Notifications,
    icon: FaBell,
  },
  {
    key: AdminRoute.TransferIn,
    label: 'Transfer back to clinic',
    path: AdminRoute.TransferIn,
    icon: TbTransferIn,
  },
  {
    key: AdminRoute.TransferOut,
    label: 'Transfer to CryoFuture',
    path: AdminRoute.TransferOut,
    icon: TbTransferOut,
  },
];
const adminToolItems: ViewTypes.SidebarItem[] = [
  {
    key: AdminRoute.Documents,
    label: 'Documents',
    path: AdminRoute.Documents,
    icon: FaFileAlt,
  },
  {
    key: AdminRoute.Billing,
    label: 'Billing',
    path: AdminRoute.Billing,
    icon: FaFileInvoiceDollar,
  },
  {
    key: AdminRoute.PricingPlans,
    label: 'Pricing Plans',
    path: AdminRoute.PricingPlans,
    icon: FaCircleDollarToSlot,
  },
];

const patientSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: PatientRoute.Overview,
    label: 'Overview',
    path: PatientRoute.Overview,
    icon: FaGripVertical,
  },
  {
    key: PatientRoute.Billing,
    label: 'Current Pricing',
    path: PatientRoute.Billing,
    icon: FaFileInvoiceDollar,
  },
  {
    key: PatientRoute.BillingStatements,
    label: 'Billing and Payments',
    path: PatientRoute.BillingStatements,
    icon: FaFileInvoice,
  },
  {
    key: PatientRoute.Specimens,
    label: 'Specimens',
    path: PatientRoute.Specimens,
    icon: FaVial,
  },
];


const clinicAdminSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: '/clinic/general',
    label: 'Overview',
    path: ClinicRoute.Overview,
    icon: FaGripVertical,
  },
  {
    key: '/clinic/patients',
    label: 'Patients',
    path: ClinicRoute.Patients,
    icon: FaUser,
  },
  {
    key: ClinicRoute.Transportation,
    label: 'Transportations',
    path: ClinicRoute.Transportation,
    icon: FaTruck,
  },
  {
    key: ClinicRoute.Inventory,
    label: 'Inventory',
    path: ClinicRoute.CaneInventory,
    icon: FaVial,
  },
  {
    key: ClinicRoute.TransferIn,
    label: 'Transfer back to clinic',
    path: ClinicRoute.TransferIn,
    icon: TbTransferIn,
  },
  {
    key: ClinicRoute.TransferOut,
    label: 'Transfer to CryoFuture',
    path: ClinicRoute.TransferOut,
    icon: TbTransferOut,
  },
  {
    key: ClinicRoute.Documents,
    label: 'Documents',
    path: ClinicRoute.Documents,
    icon: FaFileAlt,
  },
];

const accountAdminSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: '/account/overview',
    label: 'Overview',
    path: AccountRoute.Overview,
    icon: FaGripVertical,
  },
  {
    key: AccountRoute.Clinics,
    label: 'Clinics',
    path: AccountRoute.Clinics,
    icon: FaHospital,
  },
  {
    key: '/account/patients',
    label: 'Patients',
    path: AccountRoute.Patients,
    icon: FaUser,
  },
  {
    key: AccountRoute.Transportation,
    label: 'Transportations',
    path: AccountRoute.Transportation,
    icon: FaTruck,
  },
  {
    key: AccountRoute.Inventory,
    label: 'Inventory',
    path: AccountRoute.CaneInventory,
    icon: FaVial,
  },
];

const transportationPatientSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: PatientRoute.TransportationProfile,
    label: 'Overview',
    path: PatientRoute.TransportationProfile,
    icon: FaGripVertical,
  },
];

const terminationsSidebarItems: ViewTypes.SidebarItem[] = [
  {
    key: AdminRoute.Terminations,
    label: 'Terminations',
    path: AdminRoute.Terminations,
    icon: FaRegTimesCircle,
  },
];

export const useSidebarItems = () => {
  const router = useRouter();
  const transportationUrl = router.pathname.includes('/transportation/');
  const { userPermissions } = usePermissions();
  const isUserCanReadTerminations = hasPermission(userPermissions, 'read:terminations');

  const [items, setItems] = useState<ViewTypes.SidebarItem[]>([]);
  const [toolItems, setToolItems] = useState<ViewTypes.SidebarItem[]>([]);
  const { roles } = useRole();

  useEffect(() => {
    if (isUserAdmin(roles) || isUserGodAdmin(roles)) {
      setItems(isUserCanReadTerminations ? adminSidebarItems.concat(terminationsSidebarItems) : adminSidebarItems);
      setToolItems(adminToolItems);
    } else if (isUserPatient(roles) && !transportationUrl) {
      setItems(patientSidebarItems);
    } else if (isUserPatient(roles) && transportationUrl) {
      setItems(transportationPatientSidebarItems);
    } else if (isUserAccountAdmin(roles)) {
      setItems(accountAdminSidebarItems);
    } else if (isUserClinicAdmin(roles)) {
      setItems(clinicAdminSidebarItems);
    } else if (isUserAccountAdmin(roles)) {
      setItems(accountAdminSidebarItems);
    }
  }, [roles]);

  return { items, toolItems };
};
