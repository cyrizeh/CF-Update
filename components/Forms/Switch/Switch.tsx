type Props = {
  label: string;
  register?: any;
};

const Switch = ({ label, register }: Props) => (
  
  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" value="" className="peer sr-only" {...register} />
    <div className="peer h-5 w-10 rounded-full bg-cryo-light-grey after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4  after:rounded-full after:border after:border-cryo-grey after:bg-cryo-grey after:transition-all after:content-[''] peer-checked:bg-gradient-to-r peer-checked:from-cryo-blue peer-checked:to-cryo-cyan peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-0 dark:border-gray-600 dark:bg-cryo-light-grey "></div>
    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
  </label>
);

export default Switch;
