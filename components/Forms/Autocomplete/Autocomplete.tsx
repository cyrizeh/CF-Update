// @ts-nocheck
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import AsyncSelect from 'react-select/async';
import { StylesConfig } from 'react-select/dist/declarations/src';
import { Control, Controller } from 'react-hook-form';
import { components } from 'react-select';
type Props = {
  name: string;
  error?: any;
  placeholder: any;
  control?: Control<any>;
  onChange?: any;
  removeFilter?: any;
  autocompleteData: {
    hasOptions: boolean;
    loadOptions: any;
    asyncValue: any;
    setHasOptions: (value: boolean) => void;
    setValues: (value: any) => void;
  };
  selectRef?: any;
  dataTestId?: string;
};

const Autocomplete = ({
  name,
  error,
  placeholder,
  control,
  autocompleteData,
  selectRef,
  dataTestId,
  ...props
}: Props) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  const CustomInput = (props: any) => <components.Input data-testid={dataTestId && `${dataTestId}-input`} {...props} />;

  const colorStyles: StylesConfig = {
    control: styles => ({
      ...styles,
      backgroundColor: '#292b2c',
      border: `none`,
      borderRadius: '7px',
      boxShadow: 'none',
      height: 42,
      ':focus': { border: 'none', boxShadow: 'none' },
      ':hover': {
        border: `none`,
        borderColor: 'none',
      },
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: '#1E2021',
      border: 'none',
      borderRadius: 8,
      fontSize: '14px',
      zIndex: 999,
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: styles => ({ 
      ...styles, 
      backgroundColor: '#1E2021', 
      border: 'none', 
      borderRadius: 8, 
      fontSize: '14px',
      scrollbarWidth: 'auto',
      '&::-webkit-scrollbar': {
        width: '5px',
        display: 'block'
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#7a7a7a94',
        borderRadius: '8px'
      }
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? '' : isFocused ? '' : undefined,
        color: isDisabled ? '#ccc' : isSelected ? '#d1d5db' : '#d1d5db',
        cursor: isDisabled ? 'not-allowed' : 'default',
        fontSize: '14px',
        fontFamily: 'Inter',
        fontWeight: 400,
        ':hover': { backgroundColor: '#292B2C' },
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? '' : '') : undefined,
        },
      };
    },

    valueContainer: styles => ({ ...styles, height: 42, paddingTop: 0 }),

    input: styles => ({
      ...styles,
      fontSize: '14px',
      fontFamily: 'Inter',
      color: '#d1d5db',
      fontWeight: 400,
      boxShadow: 'none !important',
      ':focus': { border: 'none' },
      input: { boxShadow: 'none !important' },
    }),
    placeholder: (styles, { isFocused }) => ({
      ...styles,
      fontSize: '14px',
      fontFamily: 'Inter',
      fontWeight: '400',
      color: error && !isFocused ? '#f98080' : 'rgb(107 114 128)',
    }),
    singleValue: styles => ({
      ...styles,
      fontSize: '14px',
      fontFamily: 'Inter',
      color: '#d1d5db',
      fontWeight: 400,
    }),
  };

  useEffect(() => {
    autocompleteData.loadOptions('', (options: any) => {
      setDefaultOptions(options || []);
    });
  }, [autocompleteData]);

  if (control) {
    return (
      <div className={classNames('relative')}>
        <div
          className={classNames(
            ' bg-[#4F4F4F] from-[#1371FD]  to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
            { 'bg-[#f98080]': error }
          )}
          style={{ borderRadius: 8 }}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <AsyncSelect
                {...props}
                isClearable
                styles={colorStyles}
                placeholder={placeholder}
                menuPortalTarget={document.body}
                loadOptions={autocompleteData?.loadOptions}
                value={autocompleteData?.asyncValue ?? null}
                menuIsOpen={autocompleteData?.hasOptions}
                onInputChange={(val: any) => {
                  if (!val && autocompleteData?.setHasOptions) autocompleteData.setHasOptions(false);
                }}
                onChange={(val: any) => {
                  if (val && autocompleteData?.setHasOptions) autocompleteData.setHasOptions(false);
                  field.onChange(val?.value || '');
                  autocompleteData?.setValues(val);
                }}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  Input: CustomInput,
                }}
              />
            )}
          />
        </div>
      </div>
    );
  } else
    return (
      <div className={classNames('relative')}>
        <div
          className={classNames(
            ' bg-[#4F4F4F] from-[#1371FD]  to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
            { 'bg-[#f98080]': error }
          )}
          style={{ borderRadius: 8 }}>
          <AsyncSelect
            {...props}
            ref={selectRef}
            isClearable
            styles={colorStyles}
            menuPortalTarget={document.body}
            onKeyDown={event => event.stopPropagation()}
            placeholder={placeholder}
            loadOptions={autocompleteData?.loadOptions}
            value={autocompleteData?.asyncValue ?? null}
            // menuIsOpen={autocompleteData?.hasOptions}
            defaultOptions={defaultOptions}
            onInputChange={(val: any) => {
              if (!val && autocompleteData?.setHasOptions) autocompleteData.setHasOptions(false);
            }}
            onChange={(val: any, { action }) => {
              if (val && autocompleteData?.setHasOptions) autocompleteData.setHasOptions(false);
              autocompleteData?.setValues(val);
              props.onChange({ label: val?.label, value: val?.value, keyBadge: val?.key, labelBadge: val?.labelBadge });

              if (action === 'clear') {
                props.removeFilter();
                autocompleteData?.setValues(null);
                props.onChange('');
              }
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              Input: CustomInput,
            }}
          />
        </div>
      </div>
    );
};

export default Autocomplete;
