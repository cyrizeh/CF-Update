import { AddSpecimanModalDefaultItemsList, DeviceItem } from '@/types/view/AddSpecimanModal.type';

export const consentList: AddSpecimanModalDefaultItemsList[] = [
  {
    label: 'Yes',
    value: 'true',
  },
  {
    label: 'No',
    value: 'false',
  },
];

export const allAneuploidEmbryosStatus: AddSpecimanModalDefaultItemsList[] = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'G (in graveyard tank 1)',
    value: 'GraveyardTank',
  },
  {
    label: 'L (lost)',
    value: 'Lost',
  },
  {
    label: 'B (bill)',
    value: 'Bill',
  },
  {
    label: 'A (abandoned)',
    value: 'Abandoned',
  },
];

export const initialDeviceData: DeviceItem = {
  description: '',
  notes: '',
  specimentype: '',
  numberOfSpecimens: '1',
  rfId: '',
  rfidType: null,
  rfidReader: '',
  rfidReaderId: '',
  rfidItemType: '',
  deviceType: '',
  qty: 1,
  color: '',
  freesedate: null,
};

export const locationStatuses = [
  {
    label: 'At Clinic',
    value: 'AtClinic',
  },
  {
    label: 'At Location',
    value: 'AtLocation',
  },
  {
    label: 'In Transfer',
    value: 'InTransfer',
  },
  {
    label: 'Thawed',
    value: 'Thawed',
  },
  {
    label: 'Discarded',
    value: 'Discarded',
  },
  {
    label: 'Donated',
    value: 'Donated',
  },
  {
    label: 'Non Active',
    value: 'NonActive',
  },
  {
    label: 'All Statuses',
    value: 'All Statuses',
  },
  {
    label: 'Picked Up',
    value: 'PickedUp',
  },
  {
    label: 'Not Assigned',
    value: 'NotAssigned',
  },
];

export const inventoryStatistics = [
  {
    label: 'At Clinic',
    key: 'atClinicCount',
  },
  {
    label: 'At Location',
    key: 'atLocationCount',
  },
  {
    label: 'In Transfer',
    key: 'inTransferCount',
  },
  {
    label: 'Thawed',
    key: 'thawedCount',
  },
  {
    label: 'Discarded',
    key: 'discardedCount',
  },
  {
    label: 'Donated',
    key: 'donatedCount',
  },
  {
    label: 'Non Active',
    key: 'nonActiveCount',
  },
  {
    label: 'Picked Up',
    key: 'pickedUpCount',
  },
  {
    label: 'Not Assigned',
    key: 'notAssignedCount',
  },
  {
    label: 'Total',
    key: 'totalCount',
  },
];

export const disposeStatuses = [
  {
    label: 'Thawed',
    value: 'Thawed',
  },
  {
    label: 'Discarded',
    value: 'Discarded',
  },
  {
    label: 'Donated',
    value: 'Donated',
  },
];

export const disposeActions = [
  { label: 'Thaw', value: 'Thawed' },
  { label: 'Discard', value: 'Discarded' },
  { label: 'Donate', value: 'Donated' },
];

export const LocationStatusTitle: Record<string, string> = {
  AtClinic: 'At Clinic',
  AtLocation: 'At Location',
  InTransfer: 'In Transfer',
  Thawed: 'Thawed',
  Discarded: 'Discarded',
  Donated: 'Donated',
  NonActive: 'Non Active',
  'All Statuses': 'All Statuses',
  PickedUp: 'Picked Up',
  NotAssigned: 'Not Assigned',
};

export const SpecimenTypeList = [
  { value: 'Sperm', label: 'Sperm' },
  { value: 'Oocyte', label: 'Oocyte' },
  { value: 'Embryos', label: 'Embryos' },
  { value: 'OvarianTissue', label: 'Ovarian Tissue' },
  { value: 'TesticularTissue', label: 'Testicular Tissue' },
  { value: 'DonorSperm', label: 'Donor Sperm' },
  { value: 'DonorOocyte', label: 'Donor Oocyte' },
  { value: 'Embryos (DonorSperm)', label: 'Embryos (Donor Sperm)' },
  { value: 'Embryos (DonorOocyte)', label: 'Embryos (Donor Oocyte)' },
  { value: 'Embryos (DonorSperm + DonorOocyte)', label: 'Embryos (Donor Sperm + Donor Oocyte)' },
];

export const IdLabResultList = [
  { value: 'NonReactive', label: 'Non Reactive' },
  { value: 'Reactive', label: 'Reactive' },
  { value: 'Incomplete Testing', label: 'Incomplete Testing' },
];

export const ReactiveTypeList = [
  { value: 'HepB', label: 'Hepatitis B (HepB)' },
  { value: 'HepC', label: 'Hepatitis C (HepC)' },
  { value: 'HIV', label: 'HIV' },
  { value: 'RPR', label: 'Rapid Plasma Reagin (RPR)' },
  { value: 'HTLV', label: 'Human T-Lymphotropic Virus (HTLV)' },
  { value: 'CMV', label: 'Cytomegalovirus (CMV)' },
  { value: 'Incomplete', label: 'Incomplete' },
];

export const DeviceTypeList = [
  { value: 'Straw', label: 'Straw' },
  { value: 'Vial', label: 'Vial' },
];

export enum PickUpCaneStatus {
  Requested = 'Requested',
  Withdrawn = 'Withdrawn',
  WithLocation = 'WithLocation',
}

export const PickUpCaneStatusTitle: Record<PickUpCaneStatus, string> = {
  [PickUpCaneStatus.Requested]: 'Requested',
  [PickUpCaneStatus.Withdrawn]: 'Withdrawn',
  [PickUpCaneStatus.WithLocation]: 'With Location',
};

export enum LocationStatus {
  AtClinic = "AtClinic",
  InTransfer = "InTransfer",
  AtLocation = "AtLocation",
  Thawed = "Thawed",
  Discarded = "Discarded",
  Donated = "Donated",
  NonActive = "NonActive",
  PickedUp = "PickedUp",
  NotAssigned = "NotAssigned",
}
