import { PatientOnboardingBadgeProps } from '@/features/Patients/PatientBadges/PatientBadge.types';
import { Badge } from '@/components/Badge/Badge';

export const PatientOnboardingBadge = ({ onboarding }: PatientOnboardingBadgeProps) => {
  const getBadgeColor = (onBoardingStatus: string): string => {
    const value = onBoardingStatus?.toLowerCase().trim();
    if (value === 'onboarding') return 'purple-300';
    if (value === 'onboarded') return 'green-300';
    return 'primary';
  };

  return <Badge textColor={getBadgeColor(onboarding)}>{onboarding}</Badge>;
};
