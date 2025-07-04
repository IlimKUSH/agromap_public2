import * as React from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'
import Box from '@mui/material/Box'
import '@/styles/global.css'

export default function Layout({ children }) {
  return (
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
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <Box
            component="main"
            sx={{
              '--Content-margin': '0 auto',
              '--Content-paddingX': '24px',
              '--Content-paddingY': { xs: '24px', lg: '64px' },
              '--Content-padding':
                'var(--Content-paddingY) var(--Content-paddingX)',
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
  )
}
