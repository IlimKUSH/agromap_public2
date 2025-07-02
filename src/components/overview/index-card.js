import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr/TrendDown'
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp'
import { Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import useFetch from '@/hooks/use-fetch'

export function IndexCard({
  title,
  value,
  status,
  description,
  bgColor,
  icon: Icon,
  onCardClick,
  isActive,
}) {
  const bgColorActive = isActive ? (bgColor ?? '#e0e0e0') : undefined
  const titleColor = isActive ? '#ffffff' : undefined
  const iconColor = isActive ? '#ffffff' : '#000000'

  return (
    <Card
      onClick={onCardClick}
      sx={{
        backgroundColor: bgColorActive,
        cursor: 'pointer',
        transition: '0.2s ease',
        '&:hover': {
          boxShadow: `0 0 0 2px ${bgColor}`,
        },
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Stack
          spacing={3}
          sx={{ alignItems: 'center', flexDirection: 'row', color: titleColor }}
        >
          <Avatar
            sx={{
              '--Avatar-size': '48px',
              bgcolor: bgColorActive ?? 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: iconColor,
            }}
          >
            <Icon fontSize={20} />
          </Avatar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="h5">
              {title} ≈ {new Intl.NumberFormat('en-US').format(value)}
            </Typography>

            <Tooltip
              sx={{ fontSize: '14px' }}
              title={
                'Это один из самых популярных индексов, используемых для оценки состояния растительности...'
              }
            >
              <IconButton>
                <InfoIcon sx={{ color: isActive ? '#fff' : '' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <Typography
          color="text.secondary"
          variant="body1"
          sx={{ color: titleColor, mt: '8px' }}
        >
          {status}
        </Typography>
      </CardContent>

      <Divider />

      <Box sx={{ p: '8px' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            color="text.secondary"
            variant="body2"
            fontWeight={600}
            sx={{ color: titleColor }}
          >
            {description ?? '---'}
          </Typography>
          {/*Icon*/}
        </Stack>
      </Box>
    </Card>
  )
}
