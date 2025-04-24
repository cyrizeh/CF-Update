import { formatPrice } from '../../utils/billingUtils';
import InvoiceLines from '../InvoiceLines';

const BillingSummary = ({
  pricingLines,
  amountDue,
  invoiceLines,
  discount,
}: {
  pricingLines: any[];
  amountDue: number;
  invoiceLines: any[];
  discount: { name: string; type: string; amount: number } | null;
}) => {
  return (
    <div className="my-5 flex flex-col gap-4">
      <div className="bg-[#292B2C] p-4">
        {pricingLines.map((line, index) => (
          <div key={index} className="flex justify-between text-sm text-white">
            <div>{line?.tissueType}</div>
            <div>{formatPrice(line?.total)}</div>
          </div>
        ))}
      </div>
      <InvoiceLines invoiceLines={invoiceLines} discount={discount} />
      <div className="flex justify-between text-xl font-normal leading-tight text-white">
        <div>Amount Due Now:</div>
        <div className='mr-4'>{formatPrice(amountDue)}</div>
      </div>
    </div>
  );
};

export default BillingSummary;
