import { v4 as uuidv4 } from 'uuid';

const InvoiceLines = ({
  invoiceLines,
  discount,
}: {
  invoiceLines: any[];
  discount: { name: string; type: string; amount: number } | null;
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {invoiceLines?.map(line => (
        <div key={line?.id || uuidv4()} className="flex w-full flex-col">
          {/* Invoice Line Name and Gross Amount */}
          <div className="inline-flex items-center justify-between gap-4">
            <div className="text-sm font-normal text-zinc-500">{line?.name}:</div>
            <div className="text-sm font-normal text-zinc-500 mr-4">${line?.grossAmount}</div>
          </div>

          {/* Discount Section */}
          {!!line?.discountAmount && !!discount && (
            <div className="inline-flex items-center justify-between gap-4">
              <div className="shrink grow basis-0 break-all text-sm font-normal leading-[17.50px] text-zinc-500">
                {discount?.name} ({discount?.type === 'FixedDiscount' ? '$' : '%'}
                {discount?.amount}):
              </div>
              <div className="text-sm font-normal text-zinc-500 mr-4">${line?.discountAmount}</div>
            </div>
          )}

          {/* Separator */}
          <div className="mb-3 w-full border-b border-neutral-600 pt-3"></div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceLines;
