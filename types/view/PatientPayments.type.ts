export enum PatientExtraProtectionSubscriptionStatus {
  Unsubscribed = 'Unsubscribed',
  Subscribed = 'Subscribed',
  OptedOut = 'OptedOut',
}

export const PatientExtraProtectionStatusDisplay: Record<PatientExtraProtectionSubscriptionStatus, string> = {
  [PatientExtraProtectionSubscriptionStatus.Unsubscribed]: 'Unsubscribed',
  [PatientExtraProtectionSubscriptionStatus.Subscribed]: 'Subscribed',
  [PatientExtraProtectionSubscriptionStatus.OptedOut]: 'Opted Out',
};
