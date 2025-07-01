import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree'
import Box from '@mui/material/Box'
import { Tooltip } from '@mui/material'
export function Subscriptions2({ subscriptions }) {
  return (
    <Card>
      <CardContent sx={{ pb: '8px' }}>
        {/* Legend */}
        {/*<Tooltip title="Измерения считаются в млн. га.">*/}
        {/*  <InfoIcon />*/}
        {/*</Tooltip>*/}
        <Typography variant="subtitle2" sx={{ color: '#212636', mb: 1 }}>
          S<sub>терр</sub> ≈ 10.3 тыс. га.
        </Typography>

        <Typography variant="subtitle2" sx={{ color: '#212636', mb: 1 }}>
          Состояние культур
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            mb: 1, // Margin below legend
          }}
        >
          {/* NDWI */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ff6c47', // Red for NDWI
                borderRadius: '50%',
              }}
            />
            <Typography variant="caption">Плохое</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: '12px',
                height: '12px',
                backgroundColor: '#5265ff', // Blue for SRVI
                borderRadius: '50%',
              }}
            />
            <Typography variant="caption">Нормальное</Typography>
          </Box>
          {/* NDVI */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: '12px',
                height: '12px',
                backgroundColor: '#16b364', // Green for NDVI
                borderRadius: '50%',
              }}
            />
            <Typography variant="caption">Хорошее</Typography>
          </Box>
          {/* SRVI */}
        </Box>

        <List disablePadding>
          {subscriptions.map((subscription) => (
            <SubscriptionItem
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

function SubscriptionItem({ subscription }) {
  return (
    <ListItem disableGutters>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <ListItemText
          disableTypography
          primary={
            <Typography noWrap variant="subtitle2">
              {subscription.title}
            </Typography>
          }
        />
        {/* Progress bar container */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden',
            mt: 1,
          }}
        >
          {/* Bad segment with Tooltip */}
          <Tooltip title={`${subscription.size1} гектар`} arrow>
            <Box
              sx={{
                width: subscription.width1,
                backgroundColor: '#ff6c47',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
          {/* Normal segment with Tooltip */}
          <Tooltip title={`${subscription.size2} гектар`} arrow>
            <Box
              sx={{
                width: subscription.width2,
                backgroundColor: '#5265ff',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
          {/* Good segment with Tooltip */}
          <Tooltip title={`${subscription.size3} гектар`} arrow>
            <Box
              sx={{
                width: subscription.width3,
                backgroundColor: '#16b364',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        </Box>

        {/* Percentages below the progress bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          {/* Bad segment percentage */}
          <Typography
            variant="caption"
            sx={{ color: '#ff6c47', flex: subscription.width1 }}
          >
            {subscription.width1}
          </Typography>
          {/* Normal segment percentage */}
          <Typography
            variant="caption"
            sx={{ color: '#5265ff', flex: subscription.width2 }}
          >
            {subscription.width2}
          </Typography>
          {/* Good segment percentage */}
          <Typography
            variant="caption"
            sx={{ color: '#16b364', flex: subscription.width3 }}
          >
            {subscription.width3}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  )
}
