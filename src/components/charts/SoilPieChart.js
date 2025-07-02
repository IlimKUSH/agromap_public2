import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Tooltip as MuiTooltip } from '@mui/material'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb2720', '#209661', '#0c44ae', '#8884d8', '#a28fd0']

function OnlyValueTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const value = payload[0].value
    return (
      <div style={{ background: 'white', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
        <span style={{ fontWeight: 'bold' }}>{value.toLocaleString()}</span>
      </div>
    )
  }
  return null
}

// Custom legend with ellipsis and tooltip, using flexbox for full width
function CustomLegend({ payload }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
      {payload.map((entry, index) => {
        const name = entry.value
        return (
            <MuiTooltip 
            key={`item-${index}`}
             title={name}>
<li
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                marginRight: 8,
                borderRadius: 2,
                flex: '0 0 auto',
              }}
            />
            <span
              title={name}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 13,
              }}
            >
              {name}
            </span>
          </li>
            </MuiTooltip>
        )
      })}
    </ul>
  )
}

export default function SoilPieChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>Нет данных по почвам</div>
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="totalAreaHa"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<OnlyValueTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
} 