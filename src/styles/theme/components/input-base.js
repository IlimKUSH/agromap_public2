export const MuiInputBase = {
  styleOverrides: {
    root: {
      'label + &': { marginTop: '0px !important' },
      '--Input-borderRadius': '8px',
      '--Input-paddingBlock': 0,
      '--Input-paddingInline': '12px',
      '--Input-minHeight': '40px',
      borderRadius: 'var(--Input-borderRadius)',
      paddingBlock: 'var(--Input-paddingBlock)',
      paddingInline: 'var(--Input-paddingInline)',
      minHeight: 'var(--Input-minHeight)',
    },
    input: {
      alignItems: 'center',
      alignSelf: 'stretch',
      display: 'inline-flex !important',
      fontSize: 'var(--Input-fontSize, 1rem)',
      caretColor: 'var(--mui-palette-primary-main)', // Add this line
      '&::placeholder': {
        color: 'var(--mui-palette-text-secondary)',
        opacity: 1,
      },
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px white inset !important',
        WebkitTextFillColor: 'currentColor !important',
        caretColor: '#000 !important', // Also for autofilled inputs
      },
    },
    multiline: { '--Input-paddingBlock': '12px' },
    sizeSmall: {
      '--Input-fontSize': '0.875rem',
      '--Input-paddingInline': '8px',
      '--Input-minHeight': '32px',
    },
  },
}
