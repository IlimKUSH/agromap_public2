import React from 'react'
import Box from '@mui/material/Box'
import ReactApexCharts from 'react-apexcharts'
import Typography from '@mui/material/Typography'

export default function SoilPieChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Нет данных по почвам</div>
  }

  const labels = data.map((item) => item.name)
  const series = data.map((item) => item.totalAreaHa)

  const chartOptions = {
    chart: {
      type: 'polarArea',
      height: '100%',
    },
    labels,
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 1,
      colors: undefined,
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const label = w.globals.labels[seriesIndex];
        const value = series[seriesIndex];
        const maxLength = 30;
        const truncatedLabel = label.length > maxLength
          ? label.substring(0, maxLength) + '...'
          : label;
        return '<div class="arrow_box">' +
          '<strong>' + truncatedLabel + '</strong><br/>' +
          '<span>' + value + '</span>' +
          '</div>';
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      itemMargin: {
        horizontal: 10,
        vertical: 4,
      },
      markers: {
        width: 12,
        height: 12,
      },
      fontSize: '13px',
      labels: {
        useSeriesColors: false,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
      scrollable: false,
      formatter: function(seriesName) {
        const maxLength = 30;
        return seriesName.length > maxLength
          ? seriesName.substring(0, maxLength) + '...'
          : seriesName;
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 0.6,
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
        },
      },
    ],
  }

  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <ReactApexCharts
        options={chartOptions}
        series={series}
        type="polarArea"
        height={500}
        width="100%"
      />
    </Box>
  )
}
