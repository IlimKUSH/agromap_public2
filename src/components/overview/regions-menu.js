'use client'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Box, CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import { ArrowLeftIcon } from '@mui/x-date-pickers'

export function RegionsMenu({
  regions,
  activeDistrict,
  setActiveDistrict,
  getDistrictsData,
  activeRegion,
  setActiveRegion,
  onBackToRegions,
  onRegionSelect,
}) {
  const isRegion = !activeRegion && !activeDistrict
  const title = isRegion ? 'Области' : 'Районы'
  console.log(regions)
  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        {!isRegion && (
          <Button
            color="secondary"
            startIcon={<ArrowLeftIcon />}
            size="small"
            onClick={onBackToRegions}
          >
            Назад
          </Button>
        )}
        {/* <Typography variant="caption">
        <AutoGraphIcon fontSize={"small"} sx={{ marginLeft: "85px", color: "#212636" }} />
        <sub>%</sub>
      </Typography> */}
        {/* <Typography variant="caption">S<sub>тыс. га.</sub></Typography> */}
      </Box>

      <CardContent sx={{ p: 0 }}>
        <List disablePadding sx={{ maxHeight: '490px', overflowY: 'auto' }}>
          {regions?.length > 0 ? (
            regions.map((region, index) => {
              const regionName = region.properties?.pname_r
              const districtName = region.properties?.dname_r

              const isDistrict = !!districtName
              const isActive =
                (isDistrict && activeDistrict === districtName) ||
                (!isDistrict && activeRegion === regionName)

              const handleSelect = () => {
                if (isRegion) {
                  if (onRegionSelect) {
                    onRegionSelect(
                      isRegion
                        ? region.properties?.pname_r
                        : region.properties?.dname_r
                    )
                  } else {
                    setActiveRegion(regionName)
                    setActiveDistrict(null)
                    getDistrictsData(regionName)
                  }
                } else {
                  setActiveDistrict(districtName)
                  setActiveRegion(null)
                }
              }

              return (
                <ListItem
                  disableGutters
                  key={index}
                  selected={isActive}
                  sx={{
                    p: '10px 30px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#ffe0b2' : 'unset',
                    '&:hover': {
                      backgroundColor: isActive ? '#ffe0b2' : '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        noWrap
                        variant="subtitle2"
                        onClick={handleSelect}
                        sx={
                          isActive
                            ? {
                                fontWeight: 'bold',
                                color: '#ff9800',
                              }
                            : {}
                        }
                      >
                        {isRegion
                          ? region.properties?.pname_r
                          : region.properties?.dname_r}
                      </Typography>
                    }
                    // secondary={
                    //   <Typography noWrap variant="caption">
                    //     Площадь: {subscription.size} га.
                    //   </Typography>
                    // }
                  />
                  {/* <Typography variant="caption" sx={{ marginRight: "40px" }}>{subscription.prod}%</Typography> */}
                  {/* <Typography variant="caption">{subscription.size}</Typography> */}
                  {/* <IconButton>
              <KeyboardArrowDownIcon weight="bold" />
            </IconButton> */}
                </ListItem>
              )
            })
          ) : (
            <ListItem
              disableGutters
              sx={{
                p: '10px 30px',
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} color="primary" />
                <Typography variant="body1" color="text.secondary">
                  Данные загружаются
                </Typography>
              </Box>
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  )
}
