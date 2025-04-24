import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import classNames from 'classnames';
import { ThemeProvider, createTheme } from '@mui/material';

import styles from '../DateField/styles.module.css';

const TextFieldStyled = ({ error, dataTestId, ...props }: TextFieldProps & { dataTestId?: string }) => {
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
            padding: '0 !important',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'row-reverse',
            boxShadow: 'none !important',
            outline: 'none !important',
            border: 'none',
          },
          input: {
            fontSize: '14px !important',
            fontStyle: 'normal !important',
            fontWeight: '400 !important',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            top: '-6px !important',
            fontSize: '14px !important',
            fontStyle: 'normal !important',
            fontWeight: '400 !important',
            color: error ? '#f98080' : 'rgb(107 114 128)',
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
            padding: '0 !important',
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
            fontSize: '14px !important',
            fontStyle: 'normal !important',
            fontWeight: '400 !important',
            color: '#d1d5db',
            padding: '11px 30px 11px 16px !important',
            '&.Mui-disabled': {
              '-webkit-text-fill-color': '#d1d5db',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundColor: '#1E2021', marginTop: 5, zIndex: '500 !important' },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: '#6B7280',
            fontSize: 20,
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

  return (
    <div className="relative">
      <div
        className={classNames(
          'bg-[#4F4F4F] from-[#1371FD] to-[#18E3BB] p-[1px] transition focus-within:bg-gradient-to-r',
          { [styles.ErrorBorder]: error }
        )}
        style={{ borderRadius: 8 }}>
        <ThemeProvider theme={newTheme}>
          <TextField
            {...props}
            fullWidth
            inputProps={{
              ...(props.inputProps || {}),
              'data-testid': dataTestId,
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default TextFieldStyled;
