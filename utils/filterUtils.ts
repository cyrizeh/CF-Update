import { axiosInstance } from '@/api/axiosConfig';
import { FilterType } from '@/types/view/Filters.type';
import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

interface Option {
  value: string;
  label: string;
  keyBadge: string;
  labelBadge: string;
}

interface AutocompleteOptions {
  hasOptions: boolean;
  asyncValue: Option | null;
  setHasOptions: React.Dispatch<React.SetStateAction<boolean>>;
  loadOptions: (inputValue: string, callback: (options: Option[]) => void) => void;
  setValues: React.Dispatch<React.SetStateAction<Option | null>>;
}

export const removeSpaces = (text: string): string => {
  return _.replace(text, /\s+/g, '');
};

export const convertFilterToString = (filter: FilterType): string => {
  if (typeof filter === 'string') {
    return filter;
  } else {
    return filter?.keyBadge || '';
  }
};

export const convertFilterToLabelString = (filter: FilterType): string => {
  if (typeof filter === 'string') {
    return filter;
  } else {
    return filter?.labelBadge || '';
  }
};
export const convertFilterToTrimmedFilter = (text: FilterType) => removeSpaces(convertFilterToString(text));
export const convertFilterToTrimmedLabelString = (text: FilterType) => removeSpaces(convertFilterToLabelString(text));

export const useFilterAutocompleteOptions = (
  url: string,
  preload?: string,
  labelKey: string = 'name'
): AutocompleteOptions => {
  const [hasOptions, setHasOptions] = useState(false);
  const [asyncValue, setValues] = useState<Option | null>(null);

  useEffect(() => {
    if (preload) {
      axiosInstance.get(`${url}?PageSize=15&q=${preload}`).then((resp: AxiosResponse<any>) => {
        const value = resp.data?.items.find((el: any) => el[labelKey] === preload);
        setValues({ value: value?.id, label: value?.[labelKey], keyBadge: value?.id, labelBadge: value?.[labelKey] });
      });
    }
  }, [preload, url, labelKey]);

  const loadOptions = useCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      axiosInstance.get(`${url}?PageSize=15&q=${inputValue}`).then((resp: AxiosResponse<any>) => {
        setHasOptions(!!resp.data?.items.length);
        return callback(
          resp.data?.items.map((el: any) => ({
            value: el?.id,
            label: el?.[labelKey],
            asyncValue: el?.id,
            key: el?.id,
            labelBadge: el?.[labelKey],
          }))
        );
      });
    },
    [url, labelKey]
  );

  return { hasOptions, asyncValue, setHasOptions, loadOptions, setValues };
};
