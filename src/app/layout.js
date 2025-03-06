import * as React from 'react';

import '@/styles/global.css';

import {I18nProvider} from '@/components/core/i18n-provider';
import {LocalizationProvider} from '@/components/core/localization-provider';
import {ThemeProvider} from '@/components/core/theme-provider/theme-provider';
// import { Toaster } from '@/components/core/toaster';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#090a0b",
};

export default async function RootLayout({children}) {

  return (
    <html lang="en">
    <body>
    <LocalizationProvider>
      <I18nProvider language="en">
        <ThemeProvider>
          {children}
          {/*<Toaster position="bottom-right" />*/}
        </ThemeProvider>
      </I18nProvider>
    </LocalizationProvider>
    </body>
    </html>
  );
}
