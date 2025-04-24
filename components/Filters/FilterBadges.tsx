import Image from 'next/image';
import closeIcon from '@/public/icons/close-button.svg';
import { FilterType } from '@/types/view/Filters.type';
import { showBadgelabel } from './FilterBadges.utils';

type Props = {
  // eslint-disable-next-line no-unused-vars
  removeFilter: (el: string) => void;
  filters: { [key: string]: FilterType };
  config: Array<any>;
  autocompleteData?: any;
};

const FilterBadges = ({ filters, removeFilter, config, autocompleteData }: Props) => {
  const clearAutoCompleteData = (key: string) => {
    config.find(filter => {
      if (filter.type === 'autocomplete' && filter.value === key) {
        filter.autocompleteData?.setValues(null);
      }
    });
  };
  return (
    <div className="filter-badges flex flex-wrap gap-3">
      {Object.entries(filters).map(el =>
        el[1] ? (
          <div
            key={el[0]}
            className="dark:br-[#212121] flex flex-nowrap items-center justify-center gap-1 rounded-md bg-[#212121] px-2.5 py-0.5">
            <div className="flex text-center">
              <span className="mr-2 text-xs font-medium capitalize leading-[18px] text-gray-300">
                {config.find(item => item.value.toLowerCase() === el[0].toLowerCase())?.placeholder}:
              </span>
              <span className="text-xs font-bold leading-[18px] text-gray-300">{showBadgelabel(el[1])}</span>
            </div>

            <div className="relative h-3 w-3 cursor-pointer">
              <Image
                priority
                src={closeIcon}
                alt="Prev"
                onClick={() => {
                  autocompleteData?.setValues(null);
                  removeFilter(el[0]);
                  clearAutoCompleteData(el[0]);
                }}
              />
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default FilterBadges;
