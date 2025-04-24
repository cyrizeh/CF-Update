import { useCallback, useEffect } from 'react';
import { Control, Controller, UseFormRegister, UseFormSetValue, UseFormWatch, useFormContext } from 'react-hook-form';
import { MdDelete } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';

import EditableField from '@/components/Forms/EditableField/EditableField';
import TextInput from '@/components/Forms/TextInput/TextInput';

import { useScreenWidth } from '@/hooks';

import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { PricingPlanFormFields } from '../PricingPlanDetailsPage/PricingPlanDetailsPage.types';
import classNames from 'classnames';

type Props = {
  field: any;
  discountIndex: number;
  control: Control<PricingPlanFormFields>;
  watch: UseFormWatch<PricingPlanFormFields>;
  setValue: UseFormSetValue<PricingPlanFormFields>;
  register: UseFormRegister<PricingPlanFormFields>;
  remove: (index: number) => void;
  isReadOnly?: boolean;
};

const PricingPlanFormDiscounts = ({
  field,
  discountIndex,
  control,
  register,
  watch,
  setValue,
  remove,
  isReadOnly = false,
}: Props) => {
  const { isSmallScreen } = useScreenWidth();
  const {
    formState: { errors },
    trigger,
  } = useFormContext<PricingPlanFormFields>();

  const discountType = watch(`form.values.discounts.${discountIndex}.type`);

  const editableInput = useCallback(() => {
    return (
      <EditableField
        name={`form.values.discounts.${discountIndex}.name`}
        control={control}
        error={errors?.form?.values?.discounts?.[discountIndex]?.name}
        trigger={trigger}
      />
    );
  }, [watch, discountIndex, register]);

  useEffect(() => {
    if (discountType === 'PercentageDiscount' && Number(watch(`form.values.discounts.${discountIndex}.amount`)) > 100)
      setValue(`form.values.discounts.${discountIndex}.amount`, 100);
  }, [discountType]);

  return (
    <div
      key={field.id}
      className={classNames(
        'mb-4 grid w-full grid-cols-1 items-center justify-between gap-2 md:grid-cols-[1fr_minmax(100px,_238px)]',
        {
          'grid-cols-2': isReadOnly,
        }
      )}>
      <div className="flex items-center gap-2">
        {!isReadOnly ? (
          editableInput()
        ) : (
          <p className="flex items-center gap-2 text-base font-normal text-white">
            {watch(`form.values.discounts.${discountIndex}.name`)}
          </p>
        )}

        {!isReadOnly && <MdDelete color="white" className="cursor-pointer" onClick={() => remove(discountIndex)} />}
      </div>

      <div className="relative">
        {!isReadOnly && (
          <select
            {...register(`form.values.discounts.${discountIndex}.type`)}
            className="absolute left-1 top-[2px] z-20 rounded border-0 bg-[#292B2C] pr-7 text-gray-500 ring-0 focus:ring-0">
            <option value="FixedDiscount">$</option>
            <option value="PercentageDiscount">%</option>
          </select>
        )}

        <Controller
          defaultValue={0}
          control={control}
          name={`form.values.discounts.${discountIndex}.amount`}
          render={({ field: { onChange, name, value } }) =>
            !isReadOnly ? (
              <ErrorValidationMessage
                touched={errors?.form?.values?.discounts?.[discountIndex]?.amount}
                message={errors?.form?.values?.discounts?.[discountIndex]?.amount?.message}>
                <NumericFormat
                  name={name}
                  value={value}
                  allowNegative={false}
                  customInput={TextInput}
                  full={isSmallScreen}
                  inputstyles="!text-right text-sm font-normal uppercase leading-[21px] text-white"
                  error={
                    errors.form &&
                    errors?.form?.values?.discounts &&
                    errors?.form?.values?.discounts[discountIndex]?.amount
                      ? errors?.form?.values?.discounts[discountIndex]?.amount
                      : null
                  }
                  onBlur={e => {
                    const MAX_VALUE =
                      watch(`form.values.discounts.${discountIndex}.type`) === 'PercentageDiscount' ? 100 : 9999;
                    onChange(Number(e.target.value) > MAX_VALUE ? MAX_VALUE : e.target.value);
                  }}
                />
              </ErrorValidationMessage>
            ) : (
              <div className="flex items-center gap-2 text-base font-normal text-white">
                {watch(`form.values.discounts.${discountIndex}.type`) === 'FixedDiscount' ? '$ ' : '% '}
                {value}
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default PricingPlanFormDiscounts;
