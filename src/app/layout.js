import * as React from "react";
import {ThemeProvider} from "@/components/core/theme-provider/theme-provider";
import {LocalizationProvider} from "@/components/core/localization-provider";
import {Toaster} from "@/components/core/toaster"; // Ensure this imports your MUI theme

export default function RootLayout({children}) {
  return (
    <html lang="en">
    <body>
    <LocalizationProvider>
      {/*<I18nProvider language="en">*/}
      <ThemeProvider>
        {children}
        <Toaster position="bottom-right"/>
      </ThemeProvider>
      {/*</I18nProvider>*/}
    </LocalizationProvider>
    </body>
    </html>
  );
}
