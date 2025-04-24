type LabelValueType = { service: string; price: string };

const servicePrices: LabelValueType[] = [
  {
    service: '1-Year Embryo or Oocyte Storage Term (Annual Billing Paid in Advance)',
    price: '$400',
  },
  {
    service: '1-Year Sperm Storage Term (Annual Billing Paid in Advance)',
    price: '$300',
  },
  {
    service: 'Transfer to/from clinic from/to CryoFuture',
    price: 'Included in storage price',
  },
  {
    service: 'Tank Rental Fee',
    price: 'Included in storage price',
  },
  {
    service: 'Cryogenic Supplies Fee',
    price: 'Included in storage price',
  },
  {
    service: 'Transfer coordination Fee',
    price: 'Included in storage price',
  },
  {
    service: 'Remote Live Temperature & GPS Monitoring',
    price: 'Included in storage price',
  },
];
const ServicePrices = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 bg-[#292B2C]">
        <div className="col-span-2 p-4 text-sm font-normal uppercase leading-[21px] text-white">Service</div>
        <div className="px-2 py-4 text-sm font-normal uppercase leading-[21px] text-white">Price</div>
      </div>

      {servicePrices?.map((servicePrice: LabelValueType) => (
        <div key={servicePrice.service} className="grid grid-cols-3 items-center gap-4 border-b border-neutral-700">
          <div className="col-span-2 p-4 text-sm font-normal leading-[21px] text-neutral-50">
            {servicePrice.service}
          </div>
          <div className="p-2 text-sm font-normal leading-[21px] text-neutral-50">{servicePrice.price}</div>
        </div>
      ))}
    </>
  );
};

export default ServicePrices;
