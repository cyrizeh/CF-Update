import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import useTranslation from 'next-translate/useTranslation';

export const DocumentsListMobile = ({ documents, onSelectRow }: any) => {
  const { t } = useTranslation('documents');
  return (
    <div>
      {!!documents.length &&
        documents.map((document: any, idx: number) => {
          return (
            <div key={idx}>
              <div className="border-b border-dark-grey-300 text-sm font-normal">
                <div className="flex flex-row items-center gap-6 py-3.5">
                  <div className="flex items-center gap-6">
                    <Checkbox onChange={() => onSelectRow(`${document.id}`)} />
                  </div>

                  <div className="flex w-full  flex-col gap-2.5">
                    <span className="...  max-w-[80%]  truncate text-white hover:cursor-pointer hover:underline">
                      {document?.name}
                    </span>
                    <span className="...  truncate  text-gray-500 hover:cursor-pointer hover:underline">
                      {t('status')}: {document?.status}
                    </span>
                    <span className="...  truncate  text-gray-500 hover:cursor-pointer hover:underline">
                      {document?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
