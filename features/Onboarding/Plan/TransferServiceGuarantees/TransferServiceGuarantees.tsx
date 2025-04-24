import { ViewTypes } from '@/types';
import { ServiceGuarantee } from '@/types/api/Responses/PaymentInfoResponse.interface';
import { OnboardingFormValues } from '@/types/view/OnboardingFormValues.type';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { AGREEMENT_TEXT } from './TransferServiceGuarantees.const';
import TransferServiceGuaranteesRow from './TransferServiceGuaranteesRow';

const TransferGuaranteesCard = ({
  transferServiceGuarantees,
  agreed,
  currentStep,
}: {
  transferServiceGuarantees: ServiceGuarantee[];
  agreed: () => void;
  currentStep: ViewTypes.OnboardingStep;
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const { setValue, watch } = useFormContext<OnboardingFormValues>();
  const handleSelectPlan = (transferServiceGarantee: string | null) => {
    setValue('transferServiceGuaranteeId', transferServiceGarantee);
  };

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
      {/* Service Guarantee Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CryoFuture Transportation Service Guarantee Agreement</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{currentStep?.description}</p>
      </div>

      {/* Guarantee Levels */}
      <div className="mb-6">
        {transferServiceGuarantees.map((billing: any) => (
          <TransferServiceGuaranteesRow
            key={billing?.id}
            billing={billing}
            isSelected={billing?.id === watch('transferServiceGuaranteeId')}
            onSelect={() => handleSelectPlan(billing?.id)}
          />
        ))}
      </div>

      {/* Details Section */}
      <div className="custom-vertical-scrollbar mb-6 max-h-[200px] overflow-y-auto rounded-lg border p-4 dark:border-gray-600 dark:bg-[#292B2C]">
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

export default TransferGuaranteesCard;
