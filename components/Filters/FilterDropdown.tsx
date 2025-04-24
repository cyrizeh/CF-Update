import { Button, Label } from 'flowbite-react';

import CustomSelect from '../Forms/Select/Select';

import { HiAdjustments } from 'react-icons/hi';
import Autocomplete from '../Forms/Autocomplete/Autocomplete';
import { Filter, FilterProps, SelectFilterType } from '@/types/view/Filters.type';
import DateField from '../Forms/DateField/DateField';

import { Fragment, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Popover } from '@mui/material';
import TextInput from '../Forms/TextInput/TextInput';
import { SelectInstance } from 'react-select';

export type DefaultOption = {
  readonly value: string;
  readonly label: string;
};

const FilterDropdown = ({
  state,
  filters,
  disabled,
  isFiltering,
  removeFilter,
  onSetFilters,
  clearFilters,
  onChangeTemp,
}: FilterProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const hasAutocomplete = () => {
    filters.forEach(filter => {
      if (filter.type === 'autocomplete') {
        filter.autocompleteData?.setValues(null);
      }
    });
  };

  // added to clear react-select-value
  const customSelectRefs = useRef<SelectInstance<DefaultOption>[]>([]);
  const setCustomSelectRef = (index: number) => (ref: SelectInstance<DefaultOption>) => {
    customSelectRefs.current[index] = ref;
  };

  const createFilters = () => {
    const filterType = (filter: Filter, index: number) => {
      switch (filter.type) {
        case 'select':
          return (
            <CustomSelect
              dataTestId={`filter-select-${filter.value}`}
              selectRef={setCustomSelectRef(index)}
              isSearchable={false}
              isMulti={filter?.isMulti}
              name={filter.placeholder}
              value={state[filter.value]}
              key={filter.value}
              onChange={(value: any) => {
                onChangeTemp(filter.value, value);
              }}
              placeholder={filter.placeholder ?? ''}
              options={filter.options?.map(el => ({ value: el.value, label: el.label })) || []}
              optionBy={(state[filter.value] as SelectFilterType)?.keyBadge}
            />
          );
        case 'autocomplete':
          return (
            <Autocomplete
              dataTestId={`filter-autocomplete-${filter.value}`}
              selectRef={setCustomSelectRef(index)}
              removeFilter={() => removeFilter(filter.value)}
              autocompleteData={filter.autocompleteData}
              name={filter.placeholder ?? ''}
              placeholder={filter.placeholder ?? ''}
              onChange={(value: any) => onChangeTemp(filter.value, value)}
            />
          );

        case 'date':
          return (
            <Label>
              <>
                {filter.label && <p>{filter.label}</p>}
                {
                  // @ts-ignore
                  <DateField
                    value={state[filter.value]}
                    onChange={(newValue: any) => {
                      onChangeTemp(filter.value, dayjs(newValue).format('MM/DD/YYYY'));
                    }}
                  />
                }
              </>
            </Label>
          );
        case 'text':
          return (
            <TextInput
              type="text"
              placeholder={filter?.placeholder}
              onChange={e => {
                onChangeTemp(filter.value, e.target.value);
              }}
              value={state[filter.value] as string}
            />
          );
      }
    };

    return filters.map((filter, index) => filterType(filter, index));
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Fragment>
      <Button gradientDuoTone="primary" outline disabled={disabled} aria-describedby={id} onClick={handleClick}>
        <HiAdjustments className="mr-2 text-lg" />
        Filter
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          zIndex: 20,
          '& .MuiPopover-paper': {
            background: 'transparent',
            padding: 0,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <div className="z-100 mt-3 w-[250px]">
          <div className="overflow-hidden rounded-lg bg-neutral-800 shadow-lg  ring-inset ring-black/5">
            <div className="relative bg-neutral-800 p-1">
              <div className="z-100 flex max-h-[250px] w-full max-w-[240px] flex-col gap-2 overflow-y-auto p-3">
                {createFilters()}
              </div>
            </div>

            {isFiltering && (
              <div
                data-testid="clear-filters-button"
                className="z-100 mb-[-2px] inline-flex h-[34px] w-full cursor-pointer items-center justify-center gap-2 bg-neutral-800 px-3  py-2"
                onClick={() => {
                  clearFilters();
                  hasAutocomplete();
                  customSelectRefs.current.forEach(ref => {
                    if (ref && ref.clearValue) {
                      ref.clearValue();
                    }
                  });
                }}>
                <div className="font-['Inter'] text-xs font-medium leading-[18px] text-white">Clear</div>
              </div>
            )}

            <div
              data-testid="apply-filters-button"
              className="inline-flex h-[34px] w-full cursor-pointer items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-400 px-3 py-2"
              onClick={() => {
                onSetFilters();
                handleClose();
              }}>
              <div className="font-['Inter'] text-xs font-medium leading-[18px] text-white">Filter</div>
            </div>
          </div>
        </div>
      </Popover>
    </Fragment>
  );
};

export default FilterDropdown;
