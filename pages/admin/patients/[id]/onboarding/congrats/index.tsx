import OnboardingLastStep from './OnboardingLastStep';
import { PatientProfilePageLayout } from '../..';

function Congrats() {
  return <OnboardingLastStep />;
}

Congrats.getLayout = PatientProfilePageLayout;

export default Congrats;
