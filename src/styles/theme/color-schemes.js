import {
  california,
  chateauGreen,
  kepple,
  neonBlue,
  nevada,
  redOrange,
  royalBlue,
  shakespeare,
  stormGrey,
  tomatoOrange,
} from './colors'

const primarySchemes = {
  chateauGreen: {
    light: {
      ...chateauGreen,
      light: chateauGreen[400],
      main: chateauGreen[500],
      dark: chateauGreen[600],
      contrastText: 'var(--mui-palette-common-white)',
      activated:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
      hovered:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
      selected:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
    },
  },
}

export function colorSchemes(config) {
  let primary = primarySchemes[config.primaryColor]

  if (!primary) {
    primary = primarySchemes.chateauGreen
  }

  return {
    light: {
      palette: {
        action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
        background: {
          default: 'var(--mui-palette-common-white)',
          defaultChannel: '255 255 255',
          paper: 'var(--mui-palette-common-white)',
          level1: 'var(--mui-palette-neutral-50)',
          level2: 'var(--mui-palette-neutral-100)',
          level3: 'var(--mui-palette-neutral-200)',
        },
        common: { black: '#000000', white: '#ffffff' },
        divider: 'var(--mui-palette-neutral-200)',
        dividerChannel: '220 223 228',
        error: {
          ...redOrange,
          light: redOrange[400],
          main: redOrange[500],
          dark: redOrange[600],
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        info: {
          ...shakespeare,
          light: shakespeare[400],
          main: shakespeare[500],
          dark: shakespeare[600],
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        neutral: { ...stormGrey },
        primary: primary.light,
        secondary: {
          ...nevada,
          light: nevada[600],
          main: nevada[700],
          dark: nevada[800],
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        success: {
          ...kepple,
          light: kepple[400],
          main: kepple[500],
          dark: kepple[600],
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        text: {
          primary: 'var(--mui-palette-neutral-900)',
          primaryChannel: '33 38 54',
          secondary: 'var(--mui-palette-neutral-500)',
          secondaryChannel: '102 112 133',
          disabled: 'var(--mui-palette-neutral-400)',
        },
        warning: {
          ...california,
          light: california[400],
          main: california[500],
          dark: california[600],
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        Avatar: { defaultBg: 'var(--mui-palette-neutral-600)' },
        Backdrop: { bg: 'rgb(18, 22, 33, 0.8)' },
        OutlinedInput: { border: 'var(--mui-palette-neutral-200)' },
        TableCell: { border: 'var(--mui-palette-divider)' },
        Tooltip: { bg: 'rgba(10, 13, 20, 0.75)' },
      },
    },
  }
}
