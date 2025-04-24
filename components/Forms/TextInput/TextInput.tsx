import classNames from 'classnames';
import { Label, TextInputProps } from 'flowbite-react';
import styles from './styles.module.css';

interface Props extends TextInputProps {
  ref?: any;
  register?: any;
  error?: any;
  full?: any;
  placeholder?: any;
  inputstyles?: string;
  label?: string | boolean;
  adornments?: {
    content: any;
    position: 'start' | 'end';
    svgClass?: string;
  };
}

const TextInput = ({ ref, register, label, full, inputstyles, ...props }: Props) => {
  const labelValue = label ? (typeof label === 'boolean' ? props.placeholder : label) : '';
  const widthclass = full ? 'w-full' : '';
  const { error } = props;

  return (
    <div className={classNames('relative', widthclass, { [styles.withLabel]: label })}>
      {!!label && <Label className="mt-2 text-sm font-normal">{labelValue}</Label>}

      <div
        className={classNames(
          ' bg-[#4F4F4F] from-[#1371FD]  to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
          { [styles.ErrorBorder]: error }
        )}
        style={{ borderRadius: 8 }}>
        {props.adornments && (
          <div
            className={classNames(
              'z-30 text-[#6B7280]',
              props?.className,
              {
                [styles.AdornmentsStartIcon]: props?.adornments?.position === 'start',
                [styles.AdornmentsEndIcon]: props?.adornments?.position === 'end',
              },
              props?.adornments?.svgClass
            )}>
            {<props.adornments.content />}
          </div>
        )}

        <input
          ref={ref}
          type="text"
          {...register}
          {...props}
          style={{ borderRadius: 7 }}
          className={classNames(styles.Input, 'focus:ring-0', inputstyles, {
            [styles.Error]: props.error,
            [styles.AdornmentsStart]: props?.adornments?.position === 'start',
            [styles.AdornmentsEnd]: props?.adornments?.position === 'end',
          })}
        />
      </div>
    </div>
  );
};

export default TextInput;
