import useTranslation from 'next-translate/useTranslation';
import { ExtraProtectionProps } from './StoragePlan.types';

export const ExtraProtection: React.FC<ExtraProtectionProps> = ({ extraProtection, payTime }) => {
  const { t } = useTranslation('onboarding');
  return extraProtection ? (
    <div className="mt-10 flex w-full flex-col">
      <div className="inline-flex items-center justify-start gap-[160px] self-stretch">
        <div className="flex h-[18px] shrink grow basis-0 items-center justify-start gap-[9px]">
          <div className="shrink grow basis-0 text-sm font-normal leading-[17.50px] text-zinc-500">
            {extraProtection.name}
          </div>
        </div>
        <div className="text-right text-sm font-normal leading-[21px] text-zinc-500">${extraProtection.netAmount}</div>
      </div>
      <div className="mb-3 w-full border-b border-neutral-600 pt-3"></div>
      <div className="inline-flex h-9 w-full flex-col items-start justify-start gap-2.5">
        <div className="inline-flex items-center justify-between gap-[186px] self-stretch">
          <div className="shrink grow basis-0 text-base font-normal leading-tight text-white">
            {payTime === 'now' ? t('plan.amountDueNow') : t('plan.amountScheduled')}
          </div>
          <div className="text-right text-2xl font-normal leading-9 text-white">${extraProtection?.netAmount ?? 0}</div>
        </div>
      </div>
    </div>
  ) : null;
};
