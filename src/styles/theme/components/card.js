import { paperClasses } from '@mui/material/Paper'

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '20px',
        [`&.${paperClasses.elevation1}`]: {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 5px 22px 0 rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(255, 255, 255, 0.12)'
              : '0 5px 22px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        },
      }
    },
  },
}
