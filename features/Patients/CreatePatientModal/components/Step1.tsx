import GeneralInfo from './GeneralInfo';
import ContactInfo from './ContactInfo';

const Step1 = ({ currentStep, patient }: any) => {
  return currentStep === 1 ? (
    <div>
      <GeneralInfo patient={patient} />
      <ContactInfo patient={patient} />
    </div>
  ) : null;
};

export default Step1;
