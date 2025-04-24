import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import classNames from 'classnames';
import { HiCalendar } from 'react-icons/hi';
import { ThemeProvider, createTheme } from '@mui/material';
import styles from './styles.module.css';
import { Controller } from 'react-hook-form';
import { DateFieldProps } from '@/types/view';
import dayjs from 'dayjs';
import { useRef } from 'react';

const DateField = ({ ...props }: DateFieldProps) => {
  const ref = useRef(null);

  const newTheme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            width: '100%',
            color: '#FFFFFF',
            outline: 'none !important',
            border: 'none',
            backgroundColor: '#292B2C',
            borderRadius: 7,
            boxShadow: 'none !important',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'row-reverse',
            boxShadow: 'none !important',
            color: '#FFFFFF',
            outline: 'none !important',
            border: 'none',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            left: '29px !important',
            top: '-6px !important',
            color: props.error ? '#f98080' : 'rgb(107 114 128)',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          shrink: {
            color: 'yellow !important',
            display: 'none  !important',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
            boxShadow: 'none !important',
            outline: 'none !important',
            border: 'none !important',
          },
          notchedOutline: {
            border: 'none !important',
            boxShadow: 'none !important',
          },
          input: {
            boxShadow: 'none !important',
            border: 'none !important',
            padding: '12px 16px',
            '&.Mui-disabled': { '-webkit-text-fill-color': '#d1d5db' },
          },
        },
      },
      // @ts-ignore
      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            color: '#FFFFFF',
          },
        },
      },
      MuiPickersYear: {
        styleOverrides: {
          yearButton: {
            '&.Mui-selected': { backgroundColor: '#4F4F4F !important' },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
            borderRadius: 8,
            borderWidth: 0,
            borderColor: '#2196f3',
            border: '0px solid',
            backgroundColor: '#1E2021',
            '&.Mui-selected': { backgroundColor: '#4F4F4F !important' },
            '&:hover': {
              backgroundColor: '#4f4f4f26 !important',
            },
            '&:focus': {
              backgroundColor: '#4f4f4f26',
              opacity: 50,
            },
          },
          today: {
            backgroundColor: '#1E2021',
            borderColor: '#4F4F4F !important',
            border: '1px solid',
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          switchViewIcon: {
            color: '#fff',
            borderRadius: 8,
            borderWidth: 0,
            border: '0px solid',
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: { button: { color: '#fff', borderRadius: 8 } },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundColor: '#1E2021', marginTop: 5, zIndex: '9999 !important' },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: { zIndex: '9999 !important' },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
            borderRadius: 8,
            borderWidth: 0,
            borderColor: '#2196f3',
            border: '0px solid',
            backgroundColor: '#1E2021',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: '#6B7280',
            fontSize: 20,
          },
          root: {
            '&.Mui-disabled': { color: '#6B7280' },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
          },
        },
      },
    },
  });

  const onChangeError = (error: any) => {
    if (error) {
      props.setError(props.name);
    } else {
      props.clearErrors(props.name);
    }
  };

  return (
    <div className="relative">
      <div
        className={classNames(
          ' bg-[#4F4F4F] from-[#1371FD]  to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
          { [styles.ErrorBorder]: props.error }
        )}
        style={{ borderRadius: 8 }}>
        <ThemeProvider theme={newTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {props.control ? (
              <Controller
                defaultValue={null}
                control={props.control}
                name={props.name}
                rules={{ required: true }}
                render={({ field }) => (
                  <DesktopDatePicker
                    minDate={props.minDate || undefined}
                    maxDate={props.maxDate || undefined}
                    value={field.value ? dayjs(field.value) : field.value}
                    inputRef={field.ref}
                    onChange={date => field.onChange(date)}
                    onError={onChangeError}
                    label={props.placeholder}
                    className={`ring-inset ${styles.MuiOutlinedInputLegendLabel}`}
                    disabled={props.isDisabled}
                    slots={{
                      openPickerIcon: HiCalendar,
                    }}
                  />
                )}
              />
            ) : (
              <DesktopDatePicker
                minDate={props.minDate || undefined}
                maxDate={props.maxDate || undefined}
                value={props.value ? dayjs(props.value) : props.value}
                inputRef={ref}
                onChange={date => props.onChange(date)}
                label={props.placeholder}
                className={`ring-inset ${styles.MuiOutlinedInputLegendLabel}`}
                disabled={props.isDisabled}
                slots={{
                  openPickerIcon: HiCalendar,
                }}
              />
            )}
          </LocalizationProvider>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default DateField;
