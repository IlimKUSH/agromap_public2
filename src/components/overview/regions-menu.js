import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
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
    <Card>
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
        <List disablePadding>
          {regions?.length > 0 ? (
            regions.map((region, index) => {
              const regionName = region.properties?.adm1_ru
              const districtName = region.properties?.adm2_ru

              const isRegion = !!regionName && !districtName
              const isDistrict = !!districtName
              const isActive =
                (isRegion && activeRegion === regionName) ||
                (isDistrict && activeDistrict === districtName)

              const handleSelect = () => {
                if (isRegion) {
                  if (onRegionSelect) {
                    onRegionSelect(regionName)
                  } else {
                    setActiveRegion(regionName)
                    setActiveDistrict(null)
                    getDistrictsData(regionName)
                  }
                } else if (isDistrict) {
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
                        {districtName ?? regionName}
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
              <Typography variant="body1" color="text.secondary">
                Данные отсутствуют
              </Typography>
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  )
}
