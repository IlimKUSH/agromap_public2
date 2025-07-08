'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import TitlesLegend from '@/components/charts/legend/TitlesLegend'

const formatNumber = (num) =>
  new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)

export default function SoilPieChart({ data, title }) {
  const [progress, setProgress] = useState(1)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!Array.isArray(data) || data.length === 0) {
    return <div>Данные загружаются</div>
  }

  const sum = data.reduce((acc, d) => acc + d.totalAreaHa, 0)

  const size = 220
  const center = size / 2
  const radius = 80

  let cumulativeAngle = 0

  const names = data.map((item) => item.name)
  const colors = ['#9e9e9e', '#14532d', '#166534', '#22c55e', '#4ade80']

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          textAlign: 'center',
          color: 'text.primary',
          mb: 2,
          fontSize: '16px',
          lineHeight: 1.4,
        }}
      >
        Распространенные типы <strong style={{ fontWeight: 600 }}>почв</strong>:
        <br />
        <strong style={{ fontWeight: 600 }}>{title}</strong>
      </Typography>

      <Box
        width="100%"
        height="100%"
        sx={{
          minHeight: '325px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          {[...data].reverse().map((item, idx) => {
            const sliceRatio = item.totalAreaHa / (sum ? sum : 0)
            const sliceAngle = sliceRatio * 360 * progress
            const startAngle = cumulativeAngle
            const endAngle = startAngle + sliceAngle
            cumulativeAngle = endAngle

            const largeArc = sliceAngle > 180 ? 1 : 0

            const [x1, y1] = [
              center +
                radius * Math.cos((Math.PI / 180) * startAngle - Math.PI / 2),
              center +
                radius * Math.sin((Math.PI / 180) * startAngle - Math.PI / 2),
            ]
            const [x2, y2] = [
              center +
                radius * Math.cos((Math.PI / 180) * endAngle - Math.PI / 2),
              center +
                radius * Math.sin((Math.PI / 180) * endAngle - Math.PI / 2),
            ]

            const pathData = `
            M ${center} ${center}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `

            const midAngle = (startAngle + endAngle) / 2
            const [tx, ty] = [
              center +
                radius *
                  0.6 *
                  Math.cos((Math.PI / 180) * midAngle - Math.PI / 2),
              center +
                radius *
                  0.6 *
                  Math.sin((Math.PI / 180) * midAngle - Math.PI / 2),
            ]

            const slicePercent = (sliceRatio * 100)
              .toFixed(1)
              .replace(/\.0$/, '')
            const baseScale =
              hoveredIndex === item.name
                ? `scale(${1 + idx * 0.08 + 0.2})`
                : `scale(${1 + idx * 0.08})`

            return (
              <Tooltip
                key={idx}
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: '#333',
                        mb: 1,
                      }}
                    >
                      {item.name}: {formatNumber(item.totalAreaHa)} га.
                    </Typography>
                  </Box>
                }
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: 'white',
                      color: 'black',
                      fontSize: '0.75rem',
                      p: 0.5,
                      border: '1px solid #ccc',
                    },
                  },
                }}
              >
                <g>
                  <path
                    d={pathData}
                    fill={colors[idx]}
                    stroke={'#0b4678'}
                    strokeWidth={0.2}
                    style={{
                      transition: 'transform 0.4s ease, fill 0.4s ease',
                      transformOrigin: `${center}px ${center}px`,
                      transform: baseScale,
                      opacity: 1,
                    }}
                    onMouseEnter={() => {
                      setHoveredIndex(item.name)
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  {sliceAngle > 5 && (
                    <text
                      x={tx}
                      y={ty}
                      style={{
                        transition: 'transform 0.2s ease',
                        pointerEvents: 'none',
                        fill: '#fff',
                        fontWeight: '400',
                        fontSize: '12px',
                        textAnchor: 'middle',
                        alignmentBaseline: 'middle',
                        textShadow: '0 0 4px rgba(0, 0, 0, 1)',
                      }}
                    >
                      {slicePercent}%
                    </text>
                  )}
                </g>
              </Tooltip>
            )
          })}
        </svg>

        <TitlesLegend
          names={names}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          mainBarColors={colors}
        />
      </Box>
    </Box>
  )
}
