import { inputBaseClasses } from '@mui/material/InputBase'

export const MuiFilledInput = {
  defaultProps: { disableUnderline: true },
  styleOverrides: {
    root: { 'label + &': { marginTop: '8px' } },
    input: {
      height: 'auto',
      padding: 0,
      [`label[data-shrink=false]+.${inputBaseClasses.formControl} &`]: {
        '&::placeholder': { opacity: '1 !important' },
      },
      '&:-webkit-autofill': {
        marginInline: 'calc(var(--Input-paddingInline) * -1)',
        paddingInline: 'var(--Input-paddingInline)',
      },
    },
  },
}
