import { useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { axiosInstance } from '@/api/axiosConfig';
import { debounce } from '@mui/material/utils';
import { createQueryString } from '@/utils/createQueryString';
import { Paper } from '@mui/material';
import { Controller } from 'react-hook-form';
import TextFieldStyled from '../TextField/TextField';

type AutocompleteProps = {
  name: string;
  control: any;
  url: string;
  placeholder: string;
  error: any;
  defaultValue: any;
  disabled?: boolean;
  customOptionField?: string;
  // function to map option name
  mapOptionName?: any;
  isPrefilled?: boolean;
  extraOptions?: any;
  params?: Record<string, any>;
  dataTestId?: string;
};

export const CustomPaper = (props: any) => {
  return (
    <Paper
      elevation={8}
      {...props}
      sx={{
        marginTop: '5px',
        borderRadius: '8px',
        background: '#292B2C',
        boxShadow: '0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
        '& .MuiAutocomplete-listbox': {
          scrollbarWidth: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '0px',
            display: 'block'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#7a7a7a94',
            borderRadius: '8px'
          }
        }
      }}
    />
  );
};

const Autocomplete2 = ({
  url,
  name,
  control,
  placeholder,
  error,
  defaultValue,
  disabled,
  customOptionField = 'name',
  mapOptionName,
  isPrefilled,
  extraOptions,
  params = {},
  dataTestId,
}: AutocompleteProps) => {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<any>([]);

  const fetch = useMemo(
    () =>
      debounce((request: { input: string }, callback) => {
        axiosInstance
          .get(
            `${url}?${createQueryString({
              q: request.input,
              pageSize: 15,
              ...params,
            })}`
          )
          .then(resp => {
            return callback(resp.data?.items);
          });
      }, 400),
    [url]
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      if (isPrefilled) {
        fetch({ input: '' }, (results?: any) => {
          if (active) {
            if (results) {
              const newOptions = results.map((result: any) => ({
                ...result,
                name: result.name || result[customOptionField],
                displayName: mapOptionName ? mapOptionName(result) : result.name || result[customOptionField],
              }));
              setOptions((prevOptions: any) => {
                const combinedOptions = [...(extraOptions || []), ...prevOptions, ...newOptions];

                return combinedOptions.filter(
                  (option, index, self) => index === self.findIndex(o => o.id === option.id)
                );
              });
            } else if (extraOptions) {
              setOptions((prevOptions: any) => {
                const combinedOptions = [...extraOptions, ...prevOptions];

                return combinedOptions.filter(
                  (option, index, self) => index === self.findIndex(o => o.id === option.id)
                );
              });
            }
          }
        });
      } else {
        setOptions(value ? [value] : []);
      }
      return undefined;
    }
    if (!disabled) {
      fetch({ input: inputValue }, (results?: any) => {
        if (active) {
          let newOptions: any = [];

          if (value) newOptions = [value];

          if (results) {
            newOptions = [
              ...results.map((result: any) => ({
                ...result,
                name: result.name || result[customOptionField],
                displayName: mapOptionName ? mapOptionName(result) : result.name || result[customOptionField],
              })),
            ];
          }

          setOptions(newOptions);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, customOptionField, disabled]);

  useEffect(() => {
    if (isPrefilled && !disabled) {
      fetch({ input: '' }, (results?: any) => {
        let initialOptions: any = [];

        if (results) {
          initialOptions = [
            ...results.map((result: any) => ({
              ...result,
              name: result.name || result[customOptionField],
              displayName: mapOptionName ? mapOptionName(result) : result.name || result[customOptionField],
            })),
          ];
        }

        setOptions(() => {
          const combinedOptions = [...(extraOptions ?? []), ...initialOptions];

          return combinedOptions.filter((option, index, self) => index === self.findIndex(o => o.id === option.id));
        });
      });
    }
  }, [isPrefilled, fetch, customOptionField, disabled]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ? [defaultValue] : ''}
      render={({ field }) => {
        return (
          <Autocomplete
            // to show dropdown on the bottom
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false,
                  },
                ],
              },
            }}
            disabled={disabled}
            options={options}
            freeSolo
            PaperComponent={CustomPaper}
            fullWidth
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={field.value}
            noOptionsText="No elements"
            getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
            onChange={(_event: any, newValue: any) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue || '');
              field.onChange(newValue || '');
            }}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            // if user did not choose anything and if one of items is matching we select it
            onBlur={() => {
              const matchedOption = options.find((option: any) => option.name === inputValue);
              if (matchedOption) {
                setValue(matchedOption || '');
                field.onChange(matchedOption || '');
              } else {
                setValue(null);
                field.onChange({
                  name: inputValue,
                });
              }
            }}
            renderInput={params => {
              return (
                <div ref={params.InputProps.ref} className="w-full">
                  <TextFieldStyled {...params} label={placeholder} error={error} dataTestId={dataTestId} />
                </div>
              );
            }}
            renderOption={(props, option) => {
              return (
                <li
                  {...props}
                  className="truncate"
                  style={{
                    padding: '12px 32px',
                    color: 'white',
                  }}>
                  {option?.displayName}
                </li>
              );
            }}
          />
        );
      }}
    />
  );
};

export default Autocomplete2;
