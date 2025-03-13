'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import EmotionCache from './emotion-cache';
import { Rtl } from './rtl';

export function ThemeProvider({ children }) {

  const theme = createTheme({
    primaryColor: "chateauGreen",
    // colorScheme: settings.colorScheme,
    // direction: settings.direction,
  });

  return (
    <EmotionCache options={{ key: 'mui' }}>
      {/*<CssVarsProvider defaultColorScheme={settings.colorScheme} defaultMode={settings.colorScheme} theme={theme}>*/}
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <Rtl>{children}</Rtl>
      </CssVarsProvider>
    </EmotionCache>
  );
}
