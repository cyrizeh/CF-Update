import { axiosInstance } from '@/api/axiosConfig';
import { useCallback, useEffect, useState } from 'react';

export const useAutocompleteOptions = (url: string, preload: string | undefined = undefined) => {
  const [hasOptions, setHasOptions] = useState(false);
  const [asyncValue, setValues] = useState(null);

  useEffect(() => {
    if (preload) {
      axiosInstance.get(`${url}?PageSize=15&q=${preload}`).then(resp => {
        const value = resp.data?.items.find((el: any) => el.name === preload);
        // @ts-ignore
        setValues({ value: value.id, label: value.name });
      });
    }
  }, [preload, url]);

  const loadOptions = useCallback(
    (inputValue: string, callback: any) => {
      axiosInstance.get(`${url}?PageSize=15&q=${inputValue}`).then(resp => {
        setHasOptions(!!resp.data?.items.length);
        return callback(resp.data?.items.map((el: any) => ({ value: el.id, label: el.name })));
      });
    },
    [url]
  );

  return { hasOptions, asyncValue, setHasOptions, loadOptions, setValues };
};
