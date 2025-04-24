import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';

const FormButtons = ({ isSaving, onSave, disabled }: { isSaving: boolean; onSave: () => void; disabled?: boolean }) => {
  const { t } = useTranslation('pricingPlans');

  return (
    <div className="flex w-full justify-end p-2 pb-10">
      <Button
        size={'xs'}
        gradientDuoTone="primary"
        disabled={isSaving || disabled}
        onClick={onSave}
        className="mb-3 h-[38px] w-full cursor-pointer self-center md:mb-0 md:max-w-[135px]">
        {isSaving ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" className="mt-[-1px]" />
            {t('saving')}
          </div>
        ) : (
          <div className="text-sm font-medium leading-[150%]">{t('common:save')}</div>
        )}
      </Button>
    </div>
  );
};

export default FormButtons;
