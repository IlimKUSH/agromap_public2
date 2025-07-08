'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { toast } from '@/components/core/toaster'

const languageOptions = {
  ru: { label: 'РУС' },
  ky: { label: 'КЫР' },
}

export function LanguagePopover({ anchorEl, onClose, open = false }) {
  const { i18n, t } = useTranslation()

  const handleChange = React.useCallback(
    async (language) => {
      onClose?.()
      await i18n.changeLanguage(language)
      toast.success(t('languageChanged'))
    },
    [onClose, i18n, t]
  )

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '60px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {Object.keys(languageOptions).map((language) => {
        const option = languageOptions[language]

        return (
          <MenuItem
            key={language}
            onClick={() => {
              handleChange(language).catch(() => {
                // ignore
              })
            }}
          >
            <Typography variant="subtitle2">{option.label}</Typography>
          </MenuItem>
        )
      })}
    </Menu>
  )
}
