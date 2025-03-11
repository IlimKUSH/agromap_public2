import * as React from 'react';

import '@/styles/global.css';

import {I18nProvider} from '@/components/core/i18n-provider';
import {LocalizationProvider} from '@/components/core/localization-provider';
import {ThemeProvider} from '@/components/core/theme-provider/theme-provider';
import {GlobalStyles, Box} from "@mui/material";
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
          <React.Fragment>
            <GlobalStyles
              styles={{
                body: {
                  '--MainNav-height': '56px',
                  '--MainNav-zIndex': 1000,
                  '--SideNav-width': '280px',
                  '--SideNav-zIndex': 1100,
                  '--MobileNav-width': '320px',
                  '--MobileNav-zIndex': 1100,
                },
              }}
            />
            <Box
              sx={{
                bgcolor: 'var(--mui-palette-background-default)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                minHeight: '100%',
              }}
            >
              <Box sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}>
                <Box
                  component="main"
                  sx={{
                    '--Content-margin': '0 auto',
                    '--Content-paddingX': '24px',
                    '--Content-paddingY': {xs: '24px', lg: '64px'},
                    '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
                    '--Content-width': '100%',
                    display: 'flex',
                    flex: '1 1 auto',
                    flexDirection: 'column',
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </React.Fragment>
          {/*<Toaster position="bottom-right" />*/}
        </ThemeProvider>
      </I18nProvider>
    </LocalizationProvider>
    </body>
    </html>
  );
}
