import { BillingCriteriaHeaders } from '../../utils/billingConstants';

const BillingHeader = ({ criteria }: { criteria: string }) => {
  const headers = BillingCriteriaHeaders[criteria] || [];
  return (
    <div
      className={`grid w-full ${
        headers.length > 2 ? 'grid-cols-4' : 'grid-cols-2'
      } gap-4 bg-[#292B2C] grid-cols-[minmax(116px,_1fr)_repeat(3,_1fr)] md:grid-cols-[minmax(216px,_1fr)_repeat(3,_1fr)]`}>
      {headers.map((header, index) => (
        <div
          key={index}
          className={`flex items-center justify-start ${
            index === 0 ? 'pl-4' : ''
          } py-4 text-sm font-normal uppercase text-white`}>
          {header}
        </div>
      ))}
    </div>
  );
};

export default BillingHeader;
