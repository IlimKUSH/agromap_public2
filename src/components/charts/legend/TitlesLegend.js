import React from 'react'
import { Box, Tooltip, Typography } from '@mui/material'

export const truncateLabel = (label) => {
  return label.length > 25 ? label.substring(0, 25) + '...' : label
}

const TitlesLegend = ({
  names,
  hoveredIndex,
  setHoveredIndex,
  mainBarColors,
}) => {
  const colors = [...mainBarColors].reverse()

  return (
    <Box
      sx={{
        display: 'grid',
        alignSelf: 'center',
        gridTemplateColumns: '1fr',
        gap: 1.5,
        mb: 2,
        minHeight: '80px',
      }}
    >
      {names.map((title, index) => {
        const barOpacity =
          hoveredIndex === null || hoveredIndex === title ? 1 : 0.3
        return (
          <Box
            key={title}
            sx={{ display: 'flex', alignItems: 'start', opacity: barOpacity }}
            onMouseEnter={() => setHoveredIndex(title)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: colors[index],
                borderRadius: '50%',
                mr: 1,
                alignSelf: 'center',
              }}
            />
            <Tooltip
              title={title}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: colors[index],
                    color: '#fff',
                    fontSize: '0.85rem',
                    p: 1,
                    border: `1px solid #fff`,
                  },
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'center',
                }}
              >
                {truncateLabel(title) || 'Культура неизвестна'}
              </Typography>
            </Tooltip>
          </Box>
        )
      })}
    </Box>
  )
}

export default TitlesLegend
