export const transferInStatuses = [
  { label: 'Requested', value: 'Requested', disabled: true },
  { label: 'In Progress', value: 'InProgress', disabled: true },
  { label: 'Ready for shipment', value: 'ReadyForShipment', disabled: true },
  { label: 'Shipped', value: 'Shipped', disabled: true },
  { label: 'Delivered', value: 'Delivered', disabled: true },
  { label: 'In Treatment', value: 'InTreatment', disabled: false },
  { label: 'Completed', value: 'Completed', disabled: false },
];

export const transferOutStatuses = [
  { label: 'Requested', value: 'Requested' },
  { label: 'Pick up Scheduled', value: 'PickupScheduled' },
  { label: 'Arrived at Cryofuture for storage', value: 'ArrivedAtCryoFutureForStorage' },
  { label: 'Returned to tanks', value: 'ReturnedToTanks' },
];

export const caneTransferStatuses = [
  { label: 'Stay at clinic', value: 'StayAtClinic' },
  { label: 'Return to Cryofuture', value: 'ReturnToCryoFuture' },
  { label: 'Thawed', value: 'AllThawed' },
  { label: 'Confirmed Arrival', value: 'ConfirmedArrival' },
];
