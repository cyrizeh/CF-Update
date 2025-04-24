export type Filter = {
  type: string;
  value: string;
  placeholder?: string;
  autocompleteData?: any;
  isMulti?: boolean;
  options?: Array<{ name?: string; id?: string; label?: string; value?: string | SelectFilterType }>;
  label?: string;
  elementRef?: any;
};

export type FilterProps = {
  disabled?: boolean;
  state: {
    [key: string]: FilterType;
  };
  filters: Array<Filter>;
  isFiltering: boolean;
  onSetFilters: () => void;
  clearFilters: () => void;
  removeFilter?: any;
  // eslint-disable-next-line no-unused-vars
  onChangeTemp: (type: string, value: string) => void;
};

export type FilterType = string | SelectFilterType;

export type SelectFilterType = {
  labelBadge: string;
  keyBadge: string;
};
