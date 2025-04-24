import { MdDelete } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { useCallback, useEffect } from 'react';
import { Control, Controller, UseFormRegister, UseFormSetValue, UseFormWatch, useFormContext } from 'react-hook-form';

import TextInput from '@/components/Forms/TextInput/TextInput';
import EditableField from '@/components/Forms/EditableField/EditableField';

import { useScreenWidth } from '@/hooks';

import { ViewTypes } from '@/types';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
// TODO: rewrite and delete all ts-ignore
type Props = {
  field: any;
  index: number;
  discountIndex: number;
  control: Control<ViewTypes.FormFields>;
  watch: UseFormWatch<ViewTypes.FormFields>;
  setValue: UseFormSetValue<ViewTypes.FormFields>;
  register: UseFormRegister<ViewTypes.FormFields>;
  // eslint-disable-next-line no-unused-vars
  remove: (index: number) => void;
};

const Discounts = ({ field, index, discountIndex, control, register, watch, setValue, remove }: Props) => {
  const { isSmallScreen } = useScreenWidth();
  const {
    formState: { errors },
    trigger,
  } = useFormContext();

  const discountType = watch(`form.${index}.values.discounts.${discountIndex}.type`);

  const editableInput = useCallback(() => {
    return (
      <EditableField
        name={`form.${index}.values.discounts.${discountIndex}.name`}
        control={control}
        // @ts-ignore
        error={errors?.form?.[index]?.values?.discounts?.[discountIndex]?.name}
        trigger={trigger}
      />
    );
  }, [watch, index, discountIndex, register]);

  useEffect(() => {
    if (
      discountType === 'PercentageDiscount' &&
      Number(watch(`form.${index}.values.discounts.${discountIndex}.amount`)) > 100
    )
      setValue(`form.${index}.values.discounts.${discountIndex}.amount`, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType]);

  return (
    <div key={field.id} className="mb-4 grid w-full grid-cols-[1fr_minmax(100px,_238px)] items-center justify-between">
      <div className="flex items-center gap-2">
        {editableInput()}

        {discountIndex > 0 && (
          <MdDelete color="white" className="cursor-pointer" onClick={() => remove(discountIndex)} />
        )}
      </div>

      <div className="relative">
        <select
          {...register(`form.${index}.values.discounts.${discountIndex}.type`)}
          className="absolute left-1 top-[2px] z-20 rounded border-0 bg-[#292B2C] pr-7 text-gray-500 ring-0 focus:ring-0">
          <option value="FixedDiscount">$</option>
          <option value="PercentageDiscount">%</option>
        </select>

        <Controller
          defaultValue={0}
          control={control}
          name={`form.${index}.values.discounts.${discountIndex}.amount`}
          render={({ field: { onChange, name, value } }) => (
            <ErrorValidationMessage
              // @ts-ignore
              touched={errors?.form?.[index]?.values?.discounts?.[discountIndex]?.amount}
              // @ts-ignore
              message={errors?.form?.[index]?.values?.discounts?.[discountIndex]?.amount?.message}>
              <NumericFormat
                name={name}
                value={value}
                allowNegative={false}
                // onValueChange={v => onChange(v.floatValue)}
                customInput={TextInput}
                full={isSmallScreen}
                inputstyles="!text-right text-sm font-normal uppercase leading-[21px] text-white"
                error={
                  errors.form &&
                  // @ts-ignore
                  errors?.form?.[index]?.values?.discounts &&
                  // @ts-ignore
                  errors?.form?.[index]?.values?.discounts[discountIndex]?.amount
                    ? // @ts-ignore
                      errors?.form?.[index]?.values?.discounts[discountIndex]?.amount
                    : null
                }
                onBlur={e => {
                  const MAX_VALUE =
                    watch(`form.${index}.values.discounts.${discountIndex}.type`) === 'PercentageDiscount' ? 100 : 9999;
                  onChange(Number(e.target.value) > MAX_VALUE ? MAX_VALUE : e.target.value);
                }}
              />
            </ErrorValidationMessage>
          )}
        />
      </div>
    </div>
  );
};

export default Discounts;
