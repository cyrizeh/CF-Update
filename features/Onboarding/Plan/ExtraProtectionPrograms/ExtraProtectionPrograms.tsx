import { ViewTypes } from '@/types';
import { ExtraProtectionProgram } from '@/types/api/Responses/PaymentInfoResponse.interface';
import { OnboardingFormValues } from '@/types/view/OnboardingFormValues.type';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ExtraProtectionProgramRow from './ExtraProtectionProgramRow';

const ExtraProtectionProgramsCard = ({
  extraProtectionPrograms,
  agreed,
  currentStep,
}: {
  extraProtectionPrograms: ExtraProtectionProgram[];
  agreed: () => void;
  currentStep: ViewTypes.OnboardingStep;
}) => {
  const [protectionLevels, setProtectionLevels] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const { setValue, watch } = useFormContext<OnboardingFormValues>();

  const handleSelectPlan = (extraProtectionProgramId: string | null) => {
    setValue('extraProtectionProgramId', extraProtectionProgramId);
  };

  const AGREEMENT_TEXT = [
    {
      header: 'Acknowledgment:',
      content:
        'I/We have reviewed the information above on the Extra Protection Program (“The Program”) and have selected the protection option above. I/We agree to the dispute resolution procedures as detailed in the terms and conditions, including the agreement to arbitrate disputes and waive rights to sue in court.	',
    },
    {
      header: 'No Admission of Fault Clause:',
      content:
        'I/We understand and agree that my/our acceptance of any payment made by CryoFuture pursuant to The Program shall not admit or infer any liability and/or assumption of risk by CryoFuture on behalf of the Client(s). Said payment shall constitute a full and complete waiver, release and settlement by Client(s) and anyone who could stand legally in Client’s(’) position of CryoFuture, their staff, affiliates and assigns with respect to any other rights, claims or remedies that Client(s) have or has or might have against CryoFuture. This waiver, release and settlement shall include all claims or potential claims arising out of or relating to the storage of the Specimens including, but not limited to, contingent claims, counterclaims, third-party claims, liabilities, demands, losses, judgments, actions, suits, causes of action, accountings, rights, damages, punitive damages, penalties, and interests, direct or derivative, nominally or beneficially possessed or claimed, known or unknown, suspected or unsuspected, choate or inchoate.',
    },
    {
      header: 'Price Changes:',
      content:
        'CryoFuture reserves the right to adjust the pricing of the Program in the future. If the price changes, CryoFuture will provide reasonable notice before the changes take effect, and you will have the option to continue or opt-out of the service guarantee at the new pricing.',
    },
    {
      header: 'Entire Agreement:',
      content:
        'This Agreement, including the Protection Program Terms and Conditions incorporated by reference and linked here: https://cryofuture.com/epp/, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous agreements or understandings, whether written or oral.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          agreed();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    const target = endRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  useEffect(() => {
    const levels = extraProtectionPrograms.flatMap(
      program => program?.protectionLevels?.map(level => `${level.type}: $${level.protectionAmount}`) || []
    );
    setProtectionLevels(levels);
  }, [extraProtectionPrograms]);

  const makeContentWithLinks = (text: string) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) =>
      linkRegex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline">
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex w-full flex-col rounded-lg">
      {/* Service Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Extra Protection Program</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{currentStep?.description}</p>
      </div>

      {/* Protection Levels */}
      <div className="mb-3">
        <h4 className="text-md mb-2 font-bold text-gray-900 dark:text-white">
          Protect Protection Levels (available based on a current subscription)
        </h4>
        <ol className="list-decimal pl-6 text-sm text-gray-600 dark:text-gray-400">
          {protectionLevels?.map((level, index) => (
            <li key={index}>{level}</li>
          ))}
        </ol>
      </div>

      {/* Programs List */}
      <div className="mb-6">
        {extraProtectionPrograms.map(program => (
          <ExtraProtectionProgramRow
            key={program.id}
            program={program}
            onSelect={() => handleSelectPlan(program?.id || null)}
            isSelected={program?.id === watch('extraProtectionProgramId')}
          />
        ))}
      </div>

      {/* Details Section */}
      <div className="custom-vertical-scrollbar max-h-[200px] overflow-y-auto rounded-lg border p-4 dark:border-gray-600 dark:bg-[#292B2C]">
        {AGREEMENT_TEXT.map((section, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-md font-bold text-gray-900 dark:text-white">{section.header}</h4>
            <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-400">
              {makeContentWithLinks(section.content)}
            </p>
          </div>
        ))}
        <div ref={endRef} className="h-2"></div>
      </div>
    </div>
  );
};

export default ExtraProtectionProgramsCard;
