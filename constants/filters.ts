import { DocumentStatus } from '@/types/view';
import { getDocumentStatusTitle } from '@/types/view/DocumentStatus.enum';
import { NotificationType } from './notifications';

export const IdLabTypeFilter = [
  {
    label: 'Non Reactive',
    value: {
      labelBadge: 'Non Reactive',
      keyBadge: 'NonReactive',
    },
  },
  {
    label: 'Reactive',
    value: {
      labelBadge: 'Reactive',
      keyBadge: 'Reactive',
    },
  },
  {
    label: 'Incomplete Testing',
    value: {
      labelBadge: 'Incomplete Testing',
      keyBadge: 'Incomplete Testing',
    },
  },
];

export const tissueTypeListFilter = [
  {
    label: 'Sperm',
    value: {
      labelBadge: 'Sperm',
      keyBadge: 'Sperm',
    },
  },
  {
    label: 'Oocyte',
    value: {
      labelBadge: 'Oocyte',
      keyBadge: 'Oocyte',
    },
  },
  {
    label: 'Embryos',
    value: {
      labelBadge: 'Embryos',
      keyBadge: 'Embryos',
    },
  },
  {
    label: 'Ovarian Tissue',
    value: {
      labelBadge: 'Ovarian Tissue',
      keyBadge: 'OvarianTissue',
    },
  },
  {
    label: 'Testicular Tissue',
    value: {
      labelBadge: 'Testicular Tissue',
      keyBadge: 'TesticularTissue',
    },
  },
  {
    label: 'Donor Sperm',
    value: {
      labelBadge: 'Donor Sperm',
      keyBadge: 'DonorSperm',
    },
  },
  {
    label: 'Donor Oocyte',
    value: {
      labelBadge: 'Donor Oocyte',
      keyBadge: 'DonorOocyte',
    },
  },
  {
    label: 'Embryos (Donor Sperm)',
    value: {
      labelBadge: 'Embryos (Donor Sperm)',
      keyBadge: 'Embryos (DonorSperm)',
    },
  },
  {
    label: 'Embryos (Donor Oocyte)',
    value: {
      labelBadge: 'Embryos (Donor Oocyte)',
      keyBadge: 'Embryos (DonorOocyte)',
    },
  },
  {
    label: 'Embryos (Donor Sperm + Donor Oocyte)',
    value: {
      labelBadge: 'Embryos (Donor Sperm + Donor Oocyte)',
      keyBadge: 'Embryos (DonorSperm + DonorOocyte)',
    },
  },
];

export const locationStatusesFilter = [
  {
    label: 'All Statuses',
    value: {
      labelBadge: 'All Statuses',
      keyBadge: 'All Statuses',
    },
  },
  {
    label: 'At Clinic',
    value: {
      labelBadge: 'At Clinic',
      keyBadge: 'AtClinic',
    },
  },
  {
    label: 'At Location',
    value: {
      labelBadge: 'At Location',
      keyBadge: 'AtLocation',
    },
  },
  {
    label: 'In Transfer',
    value: {
      labelBadge: 'In Transfer',
      keyBadge: 'InTransfer',
    },
  },
  {
    label: 'Thawed',
    value: {
      labelBadge: 'Thawed',
      keyBadge: 'Thawed',
    },
  },
  {
    label: 'Discarded',
    value: {
      labelBadge: 'Discarded',
      keyBadge: 'Discarded',
    },
  },
  {
    label: 'Donated',
    value: {
      labelBadge: 'Donated',
      keyBadge: 'Donated',
    },
  },
  {
    label: 'Non Active',
    value: {
      labelBadge: 'Non Active',
      keyBadge: 'NonActive',
    },
  },
  {
    label: 'Picked Up',
    value: {
      labelBadge: 'Picked Up',
      keyBadge: 'PickedUp',
    },
  },
  {
    label: 'Not Assigned',
    value: {
      labelBadge: 'Not Assigned',
      keyBadge: 'NotAssigned',
    },
  },
];

export const transportationStatusesFilter = [
  {
    label: 'Requested',
    value: {
      labelBadge: 'Requested',
      keyBadge: 'Requested',
    },
  },
  {
    label: 'Documents Uploaded',
    value: {
      labelBadge: 'Documents Uploaded',
      keyBadge: 'DocumentsUploaded',
    },
  },
  {
    label: 'Approved',
    value: {
      labelBadge: 'Approved',
      keyBadge: 'Approved',
    },
  },
  {
    label: 'Consent Signed',
    value: {
      labelBadge: 'Consent Signed',
      keyBadge: 'ConsentSigned',
    },
  },
  {
    label: 'Partner Consent Signed',
    value: {
      labelBadge: 'Partner Consent Signed',
      keyBadge: 'PartnerConsentSigned',
    },
  },
  {
    label: 'Paid',
    value: {
      labelBadge: 'Paid',
      keyBadge: 'Paid',
    },
  },
  {
    label: 'Shipped',
    value: {
      labelBadge: 'Shipped',
      keyBadge: 'Shipped',
    },
  },
  {
    label: 'Received',
    value: {
      labelBadge: 'Received',
      keyBadge: 'Received',
    },
  },
];

export const NotificationsTypeSelectFilter = [
  {
    label: 'Transportation Requested',
    value: {
      labelBadge: 'Transportation Requested',
      keyBadge: NotificationType.TransportationRequested,
    },
  },
  {
    label: 'Termination Requested',
    value: {
      labelBadge: 'Termination Requested',
      keyBadge: NotificationType.TerminationRequested,
    },
  },
];

export const transferInStatusesFilter = [
  {
    label: 'Requested',
    value: {
      labelBadge: 'Requested',
      keyBadge: 'Requested',
      disabled: true,
    },
  },
  {
    label: 'In Progress',
    value: {
      labelBadge: 'In Progress',
      keyBadge: 'InProgress',
      disabled: true,
    },
  },
  {
    label: 'Ready for shipment',
    value: {
      labelBadge: 'Ready for shipment',
      keyBadge: 'ReadyForShipment',
      disabled: true,
    },
  },
  {
    label: 'Shipped',
    value: {
      labelBadge: 'Shipped',
      keyBadge: 'Shipped',
      disabled: true,
    },
  },
  {
    label: 'Delivered',
    value: {
      labelBadge: 'Delivered',
      keyBadge: 'Delivered',
      disabled: true,
    },
  },
  {
    label: 'In Treatment',
    value: {
      labelBadge: 'In Treatment',
      keyBadge: 'InTreatment',
      disabled: false,
    },
  },
  {
    label: 'Completed',
    value: {
      labelBadge: 'Completed',
      keyBadge: 'Completed',
      disabled: false,
    },
  },
];

export const transferOutStatusesFilter = [
  {
    label: 'Requested',
    value: {
      labelBadge: 'Requested',
      keyBadge: 'Requested',
    },
  },
  {
    label: 'Pick up Scheduled',
    value: {
      labelBadge: 'Pick up Scheduled',
      keyBadge: 'PickupScheduled',
    },
  },
  {
    label: 'Arrived at Cryofuture for storage',
    value: {
      labelBadge: 'Arrived at Cryofuture for storage',
      keyBadge: 'ArrivedAtCryoFutureForStorage',
    },
  },
  {
    label: 'Returned to tanks',
    value: {
      labelBadge: 'Returned to tanks',
      keyBadge: 'ReturnedToTanks',
    },
  },
];

export const terminationStatusesFilter = [
  {
    label: 'Requested',
    value: {
      labelBadge: 'Requested',
      keyBadge: 'Requested',
    },
  },
  {
    label: '60d cooldown',
    value: {
      labelBadge: '60d cooldown',
      keyBadge: 'Cooldown',
    },
  },
  {
    label: 'Completed',
    value: {
      labelBadge: 'Completed',
      keyBadge: 'Completed',
    },
  },
  {
    label: 'Cancelled',
    value: {
      labelBadge: 'Cancelled',
      keyBadge: 'Cancelled',
    },
  },
];

export const billingStatusListFilter = [
  {
    label: 'Upcoming',
    value: {
      labelBadge: 'Upcoming',
      keyBadge: 'Upcoming',
    },
  },
  {
    label: 'Created',
    value: {
      labelBadge: 'Created',
      keyBadge: 'Created',
    },
  },
  {
    label: 'Processing',
    value: {
      labelBadge: 'Processing',
      keyBadge: 'Processing',
    },
  },
  {
    label: 'Succeeded',
    value: {
      labelBadge: 'Succeeded',
      keyBadge: 'Succeeded',
    },
  },
  {
    label: 'Cancelled',
    value: {
      labelBadge: 'Cancelled',
      keyBadge: 'Cancelled',
    },
  },
  {
    label: 'Requires Action',
    value: {
      labelBadge: 'Requires Action',
      keyBadge: 'RequiresAction',
    },
  },
  {
    label: 'Failed',
    value: {
      labelBadge: 'Failed',
      keyBadge: 'Failed',
    },
  },
];

export const OnboardingStatusFilter = [
  {
    label: 'Not Started',
    value: {
      labelBadge: 'Not Started',
      keyBadge: 'NotStarted',
    },
  },
  {
    label: 'Onboarding',
    value: {
      labelBadge: 'Onboarding',
      keyBadge: 'Onboarding',
    },
  },
  {
    label: 'Documents Signed',
    value: {
      labelBadge: 'Documents Signed',
      keyBadge: 'DocumentsSigned',
    },
  },
  {
    label: 'Plan Selected',
    value: {
      labelBadge: 'Plan Selected',
      keyBadge: 'PlanSelected',
    },
  },
  {
    label: 'Onboarded',
    value: {
      labelBadge: 'Onboarded',
      keyBadge: 'Onboarded',
    },
  },
];

export const documentStatusFilter = Object.values(DocumentStatus).map((status) => ({
  label: getDocumentStatusTitle(status),
  value: {
    labelBadge: getDocumentStatusTitle(status),
    keyBadge: status,
  },
}));

export const billedToFilter = [
  {
    label: 'Patient',
    value: { keyBadge: 'Patient', labelBadge: 'Patient' },
  },
  {
    label: 'Clinic',
    value: { keyBadge: 'Clinic', labelBadge: 'Clinic' },
  },
];

export const billingStatusFilter = [
  {
    label: 'Unpaid',
    value: { keyBadge: 'Unpaid', labelBadge: 'Unpaid' },
  },
  {
    label: 'Paid',
    value: { keyBadge: 'Paid', labelBadge: 'Paid' },
  },
];

export const disposeStatusesFilter = [
  {
    label: 'Thawed',
    value: { keyBadge: 'Thawed', labelBadge: 'Thawed' },
  },
  {
    label: 'Discarded',
    value: { keyBadge: 'Discarded', labelBadge: 'Discarded' },
  },
  {
    label: 'Donated',
    value: { keyBadge: 'Donated', labelBadge: 'Donated' },
  },
];

export const pickListStatusesFilter = [
  {
    label: 'Requested',
    value: {
      labelBadge: 'Requested',
      keyBadge: 'Requested',
    },
  },
  {
    label: 'Assigned',
    value: {
      labelBadge: 'Assigned',
      keyBadge: 'Assigned',
    },
  },
  {
    label: 'In Progress',
    value: {
      labelBadge: 'In Progress',
      keyBadge: 'InProgress',
    },
  },
  {
    label: 'Completed',
    value: {
      labelBadge: 'Completed',
      keyBadge: 'Completed',
    },
  },
];

export const allAneuploidEmbryosStatusFilter = [
  {
    label: 'Yes',
    value: {
      labelBadge: 'Yes',
      keyBadge: 'Yes',
    },
  },
  {
    label: 'G (in graveyard tank 1)',
    value: {
      labelBadge: 'G (in graveyard tank 1)',
      keyBadge: 'GraveyardTank',
    },
  },
  {
    label: 'L (lost)',
    value: {
      labelBadge: 'L (lost)',
      keyBadge: 'Lost',
    },
  },
  {
    label: 'B (bill)',
    value: {
      labelBadge: 'B (bill)',
      keyBadge: 'Bill',
    },
  },
  {
    label: 'A (abandoned)',
    value: {
      labelBadge: 'A (abandoned)',
      keyBadge: 'Abandoned',
    },
  },
];

export const pickListTypesFilter = [
  {
    label: 'Create',
    value: {
      labelBadge: 'Create',
      keyBadge: 'Create',
    },
  },
  {
    label: 'Transfer',
    value: {
      labelBadge: 'Transfer',
      keyBadge: 'Transfer',
    },
  },
  {
    label: 'Thaw',
    value: {
      labelBadge: 'Thaw',
      keyBadge: 'Thaw',
    },
  },
  {
    label: 'Discard',
    value: {
      labelBadge: 'Discard',
      keyBadge: 'Discard',
    },
  },
  {
    label: 'Donate',
    value: {
      labelBadge: 'Donate',
      keyBadge: 'Donate',
    },
  },
];

export const fdaEligibilityTypesFilter = [
  {
    label: 'Yes',
    value: {
      labelBadge: 'Yes',
      keyBadge: 'Yes',
    },
  },
  {
    label: 'No',
    value: {
      labelBadge: 'No',
      keyBadge: 'No',
    },
  },
  {
    label: 'N/A',
    value: {
      labelBadge: 'N/A',
      keyBadge: 'N/A',
    },
  },
];

export const ReactiveTypeListFilter = [
  {
    label: 'Hepatitis B (HepB)',
    value: {
      labelBadge: 'HepB',
      keyBadge: 'HepB',
    },
  },
  {
    label: 'Hepatitis C (HepC)',
    value: {
      labelBadge: 'HepC',
      keyBadge: 'HepC',
    },
  },
  {
    label: 'HIV',
    value: {
      labelBadge: 'HIV',
      keyBadge: 'HIV',
    },
  },
  {
    label: 'Rapid Plasma Reagin (RPR)',
    value: {
      labelBadge: 'RPR',
      keyBadge: 'RPR',
    },
  },
  {
    label: 'Human T-Lymphotropic Virus (HTLV)',
    value: {
      labelBadge: 'HTLV',
      keyBadge: 'HTLV',
    },
  },
  {
    label: 'Cytomegalovirus (CMV)',
    value: {
      labelBadge: 'CMV',
      keyBadge: 'CMV',
    },
  },
  {
    label: 'Incomplete',
    value: {
      labelBadge: 'Incomplete',
      keyBadge: 'Incomplete',
    },
  },
];

export const noticeStatusListFilter = [
  {
    label: 'Delivered',
    value: {
      labelBadge: 'Delivered',
      keyBadge: 'Delivered',
    },
  },
  {
    label: 'Bounced',
    value: {
      labelBadge: 'Bounced',
      keyBadge: 'Bounced',
    },
  },
  {
    label: 'Failed',
    value: {
      labelBadge: 'Failed',
      keyBadge: 'Failed',
    },
  },
];

export const noticeTypeListFilter = [
  {
    label: 'Upcoming Payment',
    value: {
      labelBadge: 'Upcoming Payment',
      keyBadge: 'UpcomingPayment',
    },
  },
  {
    label: 'Follow Up',
    value: {
      labelBadge: 'Follow Up',
      keyBadge: 'FollowUp',
    },
  },
  {
    label: 'Thank You',
    value: {
      labelBadge: 'Thank You',
      keyBadge: 'ThankYou',
    },
  },
  {
    label: 'Final Payment Reminder',
    value: {
      labelBadge: 'Final Payment Reminder',
      keyBadge: 'FinalPaymentReminder',
    },
  },
  {
    label: 'Final Notice',
    value: {
      labelBadge: 'Final Notice',
      keyBadge: 'FinalNotice',
    },
  },
  {
    label: 'Payment Failed',
    value: {
      labelBadge: 'Payment Failed',
      keyBadge: 'PaymentFailed',
    },
  },
  {
    label: 'Card Expiring',
    value: {
      labelBadge: 'Card Expiring',

      keyBadge: 'CardExpiring',
    },
  },
];