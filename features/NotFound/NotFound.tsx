import useTranslation from 'next-translate/useTranslation';
type NotFoundProps = {
  text?: string;
};
export const NotFound: React.FC<NotFoundProps> = ({ text }) => {
  const { t } = useTranslation();
  const STATUS_CODE = 404;
  return (
    <div className="flex h-full flex-col items-center justify-center" data-testid="not-found-container">
      <h1
        data-testid="not-found-status-code"
        className="mb-4 h-14 w-[100px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {STATUS_CODE}
      </h1>
      <div data-testid="not-found-divider" className="my-3 flex w-full justify-center">
        <div className="divider h-[1px] w-[40%] border-b border-cryo-light-grey" />
      </div>
      <p
        data-testid="not-found-text"
        className="mb-4 w-full bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-3xl font-light text-transparent">
        {!!text ? text : t('notFound:notFoundPage')}
      </p>
    </div>
  );
};
