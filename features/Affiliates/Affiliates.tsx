import useTranslation from 'next-translate/useTranslation';

const Affiliates = () => {
  const { t } = useTranslation('affiliates');
  return (
    <>
      <h1 className="mb-4 h-14 w-56 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('title')}
      </h1>
    </>
  );
};

export default Affiliates;
