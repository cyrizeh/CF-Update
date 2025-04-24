export const pickListStatuses = [
  { label: 'Requested', value: 'Requested' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Completed', value: 'Completed' },
];

export enum PickUpCaneStatus {
  Withdrawn = 'Withdrawn',
  Requested = 'Requested',
}

export enum PickListStatus {
  Requested = 'Requested',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Assigned = 'Assigned',
}

export const PickListStatusTitle: Record<string, string> = {
  [PickListStatus.Requested]: 'Requested',
  [PickListStatus.InProgress]: 'In Progress',
  [PickListStatus.Completed]: 'Completed',
  [PickListStatus.Assigned]: 'Assigned',
};

export enum PickListType {
  Transfer = "Transfer",
  Thaw = "Thaw",
  Discard = "Discard",
  Donate = "Donate",
  Create = "Create"
}
