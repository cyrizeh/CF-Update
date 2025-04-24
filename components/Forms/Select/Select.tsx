/* eslint-disable no-unused-vars */
// @ts-nocheck

import classNames from 'classnames';
import { Control, Controller, FieldError } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import Select, { components } from 'react-select';

type Props = {
  value?: any;
  disabled?: boolean;
  options?: Array<any>;
  error?: FieldError | undefined;
  name?: string;
  isMulti?: boolean;
  control?: Control<any>;
  placeholder?: any;
  onChange?: (value: any) => void;
  isSearchable?: boolean;
  optionBy?: string;
  onChangeByName?: any;
  selectRef?: any;
  stylesProps?: {
    // Todo: add for other Select Props
    option?: React.CSSProperties;
    valueContainer?: React.CSSProperties;
    control?: React.CSSProperties;
  };
  dataTestId?: string;
};

const CustomSelect = ({
  value,
  name,
  options,
  control,
  error,
  disabled,
  placeholder,
  onChange: onChangeProps,
  selectRef,
  stylesProps,
  dataTestId,
  ...props
}: Props) => {
  const CustomControl = (props: any) => (
    <components.Control
      {...props}
      innerRef={props.innerRef}
      innerProps={{ ...props.innerProps, 'data-testid': dataTestId }}>
      {props.children}
    </components.Control>
  );

  const CustomIndicatorsContainer = (props: any) => (
    <components.IndicatorsContainer
      {...props}
      innerProps={{ 'data-testid': dataTestId && `${dataTestId}-indicators-container`, ...props.innerProps }}
    />
  );

  const CustomInput = (props: any) => (
    <components.Input data-testid={dataTestId && `${dataTestId}-custom-input`} {...props} />
  );

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
      ...stylesProps?.control,
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: '#1E2021',
      border: 'none',
      borderRadius: 8,
      fontSize: '14px',
      zIndex: 200,
    }),
    multiValue: styles => ({
      ...styles,
      fontSize: '14px',
      maxWidth: 80,
      backgroundColor: '#292B2C',
      alignItems: 'center',
      color: '#fff !important',
    }),
    multiValueLabel: styles => ({
      ...styles,
      color: '#fff',
    }),
    multiValueRemove: styles => ({
      ...styles,
      color: '#fff',
      display: 'none',
      borderRadius: 4,
      height: 20,
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
        backgroundColor: isDisabled ? undefined : isSelected ? '#292B2C' : isFocused ? '' : undefined,
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
        ...stylesProps?.option,
      };
    },
    valueContainer: styles => ({
      ...styles,
      height: 42,
      paddingTop: 0,
      paddingLeft: 10,
      ...stylesProps?.valueContainer,
    }),
    input: styles => ({
      ...styles,
      fontSize: '14px',
      fontFamily: 'Inter',
      color: '#d1d5db',
      fontWeight: 400,
      boxShadow: 'none !important',
      padding: '0px 2px !important',
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

  const MoreSelectedBadge = ({ items }: { items: any }) => {
    const style = {
      marginLeft: 'auto',
      borderRadius: '4px',
      fontSize: '11px',
      padding: '3px',
      order: 99,
    };

    const title = items.join(', ');
    const label = `+ ${items.length}`;

    return (
      <div style={style} title={title}>
        {label}
      </div>
    );
  };

  const MultiValue = ({ index, getValue, ...props }: { index: any; getValue: any }) => {
    const maxToShow = 1;
    const overflow = getValue()
      .slice(maxToShow)
      .map((x: any) => x.label);

    return index < maxToShow ? (
      // @ts-ignore
      <components.MultiValue {...props} />
    ) : index === maxToShow ? (
      <MoreSelectedBadge items={overflow} />
    ) : null;
  };

  if (control && name) {
    return (
      <div className={classNames('relative')}>
        <div
          className={classNames(
            ' bg-[#4F4F4F] from-[#1371FD]  to-[#18E3BB] p-[1px]  transition focus-within:bg-gradient-to-r',
            { 'bg-[#f98080]': error, 'opacity-40': disabled }
          )}
          style={{ borderRadius: 8 }}>
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <Select
                data-testid={dataTestId}
                isDisabled={disabled}
                isMulti={props.isMulti}
                styles={colorStyles}
                placeholder={placeholder}
                hideSelectedOptions={false}
                closeMenuOnSelect={!props.isMulti}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                menuPosition="fixed"
                minMenuHeight={'100px'}
                components={{
                  IndicatorSeparator: () => null,
                  Control: CustomControl,
                  IndicatorsContainer: CustomIndicatorsContainer,
                  Input: CustomInput,
                }}
                options={options}
                onChange={(val: any) => {
                  if (props.isMulti) {
                    onChange(val);
                  } else {
                    onChange(val?.value || '');
                    props?.onChangeByName ? props.onChangeByName(val?.label) : null;
                  }
                  onChangeProps?.(val);
                }}
                onBlur={onBlur}
                value={
                  props.isMulti
                    ? value
                    : options?.find((el: any) =>
                        props.optionBy ? el.label === props.optionBy || el.name === props.optionBy : el.value === value
                      ) ?? ''
                }
                name={name}
                ref={ref}
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
            'bg-[#4F4F4F]  from-[#1371FD] to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
            { 'bg-[#f98080]': error, 'opacity-40': disabled }
          )}
          style={{ borderRadius: 8 }}>
          <Select
            {...props}
            data-testid={dataTestId}
            ref={selectRef}
            isDisabled={disabled}
            isMulti={props.isMulti}
            closeMenuOnSelect={!props.isMulti}
            options={options}
            menuPlacement="auto"
            hideSelectedOptions={false}
            styles={colorStyles}
            placeholder={placeholder}
            menuPortalTarget={document.body}
            value={
              props.isMulti
                ? value
                : props.optionBy
                ? options?.find((el: any) =>
                    props.optionBy
                      ? el.label === props.optionBy ||
                        el.name === props.optionBy ||
                        el?.value?.keyBadge === props.optionBy
                      : el.value === value
                  ) ?? ''
                : options?.find((el: any) => el.value == value)
            }
            onChange={(option: { value: string; label: string }[]) => {
              onChangeProps ? (props.isMulti ? onChangeProps(option || []) : onChangeProps(option?.value || '')) : null;
            }}
            components={{
              MultiValue,
              IndicatorSeparator: () => null,
              Control: CustomControl,
              IndicatorsContainer: CustomIndicatorsContainer,
              Input: CustomInput,
            }}
          />
        </div>
      </div>
    );
};

export default CustomSelect;
