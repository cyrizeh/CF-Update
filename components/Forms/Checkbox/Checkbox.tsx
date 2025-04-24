import classNames from 'classnames';
import styles from './styles.module.css';

type Props = {
  checked?: boolean;
  label?: any;
  onChange?: () => void;
  register?: any;
  disabled?: boolean;
  labelStyles?: string;
  dataTestId?: string;
};

const Checkbox = ({ checked, disabled, label, register, onChange, labelStyles, dataTestId }: Props) => {
  return (
    <div data-testid={dataTestId} className="flex items-center">
      <input
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        id={register?.name}
        {...register}
        style={{ border: 'none', cursor: disabled ? 'auto' : 'pointer' }}
        className={classNames(
          styles.Checkbox,
          'cursor-pointer border-0 ring-0 focus:ring-0 disabled:opacity-40 dark:ring-0 dark:focus:ring-0'
        )}
      />
      {label ? (
        <label htmlFor={register?.name} className={classNames('cursor-pointer pl-3', labelStyles)}>
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default Checkbox;
