import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, UseFormTrigger } from 'react-hook-form';
import { BsFillPencilFill } from 'react-icons/bs';
import { ErrorValidationMessage } from '../ErrorValidationMessage/ErrorValidationMessage';
import TextInput from '../TextInput/TextInput';

type Props = {
  control: any;
  name: string;
  error: any;
  trigger: UseFormTrigger<any>;
};

const EditableField = ({ control, name, error, trigger }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setEditing] = useState(false);

  const onStartEditing = () => setEditing(true);

  const onStopEditing = useCallback(() => setEditing(false), []);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        // Trigger validation for the current field
        // @ts-ignore
        const isValid = await trigger(name);

        if (isValid) {
          // Allow stop editing if validation is successful
          onStopEditing();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [name, trigger, onStopEditing]);

  const debounceValidation = useCallback(
    // eslint-disable-next-line no-unused-vars
    (value: string) => {
      const handler = setTimeout(async () => {
        // @ts-ignore
        await trigger(name);
      }, 500); // 500 ms debounce time

      return () => {
        clearTimeout(handler);
      };
    },
    [name, trigger]
  );

  return (
    <Fragment>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) =>
          isEditing ? (
            <div ref={wrapperRef}>
              <ErrorValidationMessage touched={!!error} message={error?.message}>
                <TextInput
                  onChange={e => {
                    onChange(e);
                    debounceValidation(e.target.value);
                  }}
                  value={value}
                  error={error}
                />
              </ErrorValidationMessage>
            </div>
          ) : (
            <div
              onClick={onStartEditing}
              className="flex items-center gap-2 text-sm font-normal leading-[21px] text-white">
              <ErrorValidationMessage touched={!!error} message={error?.message}>
                <div className="flex-1 whitespace-pre-wrap break-all">{value}</div>
              </ErrorValidationMessage>
              <BsFillPencilFill className="flex-shrink-0" />
            </div>
          )
        }
      />
    </Fragment>
  );
};

export default EditableField;
