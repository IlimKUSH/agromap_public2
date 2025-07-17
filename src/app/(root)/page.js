'use client'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CircularProgress, Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { LanguagePopover } from '@/components/layout/language-popover'
import { useTranslation } from 'next-i18next'
import { usePopover } from '@/hooks/use-popover'
import { IndexCard } from '@/components/overview/index-card'
import { Check } from '@phosphor-icons/react'
import { MapComponent } from '@/components/map/map'
import { RegionsMenu } from '@/components/overview/regions-menu'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import { Option } from '@/components/core/option'
import useFetch from '@/hooks/use-fetch'
import { useMapStore } from '@/stores/map'
import dynamic from 'next/dynamic'

const SoilPieChart = dynamic(
  () => import('../../components/charts/SoilPieChart'),
  {
    ssr: false,
  }
)

const INDEX_COLORS = {
  ndwi: '#4d6ca6',
  ndre: '#b85d58',
  ndvi: '#209661',
}

const REGION_NAMES = [
  'Чуйская',
  'Таласская',
  'Баткенская',
  'Ошская',
  'Джалал-Абадская',
  'Иссык-Кульская',
  'Нарынская',
]

export default function Page() {
  const { i18n } = useTranslation()
  const popover = usePopover()
  const language = i18n.language || 'РУС'
  const mapRef = useRef()

  const [activeType, setActiveType] = useState('ndvi')
  const [activeRegion, setActiveRegion] = useState(null)
  const [activeDistrict, setActiveDistrict] = useState(null)
  const [allRegionIndexes, setAllRegionIndexes] = useState([])
  const [allDistrictIndexes, setAllDistrictIndexes] = useState([])
  const [mapType, setMapType] = useState('pashni')
  const [filterType, setFilterType] = useState('soil')
  const [year, setYear] = useState('2024')

  const { data: regionsData } = useFetch('/api/map/regions', 'GET')

  const { data: indexDictionaryData } = useFetch(
    '/api/map/dictionaries/index',
    'GET'
  )
  const { data: statusDictionaryData } = useFetch(
    '/api/map/dictionaries/status',
    'GET'
  )
  const { data: soilData, update: fetchSoilData } = useFetch('', 'GET')
  const {
    data: cultureData,
    loading: cultureLoading,
    update: fetchCultureData,
  } = useFetch('', 'GET')
  const {
    data: districtsData,
    loading: districtsLoading,
    update: fetchDistrictsData,
  } = useFetch('', 'GET')
  const { update: fetchIndexData } = useFetch('', 'GET')

  const { getRegion, getDistricts, setDistricts } = useMapStore(
    (state) => state
  )

  const fetchIndexAndSoilOrCulture = async (
    type,
    name,
    filter = filterType,
    selectedYear = year
  ) => {
    await fetchIndexData(`/api/map/index?type=${type}&name=${name}`)
    if (filter === 'soil') {
      await fetchSoilData(`/api/map/soil?type=${type}&name=${name}`)
    } else if (filter === 'culture') {
      await fetchCultureData(
        `/api/map/culture?type=${type}&name=${name}&year=${selectedYear}`
      )
    }
  }

  const fetchDistricts = async (regionName) => {
    await fetchDistrictsData(`/api/map/districts?regionName=${regionName}`)
  }

  const getDistrictData = async (regionName) => {
    if (regionName) {
      await fetchIndexAndSoilOrCulture('region', regionName)
      await fetchDistricts(regionName)
    } else {
      setDistricts(regionsData)
    }
  }

  const handleBackToRegions = () => {
    setActiveRegion(null)
    setActiveDistrict(null)
    setDistricts(regionsData)
  }

  const fetchAllRegionIndexes = async () => {
    const promises = REGION_NAMES.map(async (name) => {
      const data = await fetchIndexData(
        `/api/map/index?type=region&name=${encodeURIComponent(name)}`
      )
      return { name, data }
    })
    const results = await Promise.all(promises)
    setAllRegionIndexes(results)
  }

  const fetchAllDistrictIndexes = async () => {
    if (districtsData) {
      const promises = districtsData.features?.map(async (feature) => {
        const data = await fetchIndexData(
          `/api/map/index?type=district&name=${encodeURIComponent(feature.properties.dname_r)}`
        )
        return { name: feature.properties.dname_r, data }
      })
      const results = await Promise.all(promises)
      setAllDistrictIndexes(results)
    }
  }

  const region = allRegionIndexes.find(
    (region) => region.name === (activeRegion || 'Чуйская')
  )
  const district = allDistrictIndexes.find((d) => d.name === activeDistrict)

  const handleRegionSelect = async (regionName) => {
    setActiveRegion(regionName)
    setActiveDistrict(null)
    await getDistrictData(regionName)
    if (mapRef.current && mapRef.current.zoomToRegion) {
      mapRef.current.zoomToRegion(regionName)
    }
  }

  const handleDistrictSelect = async (districtName) => {
    setActiveDistrict(districtName)
    await fetchIndexAndSoilOrCulture('district', districtName)
    if (mapRef.current && mapRef.current.zoomToDistrict) {
      mapRef.current.zoomToDistrict(districtName)
    }
  }

  useEffect(() => {
    if (activeDistrict) {
      fetchIndexAndSoilOrCulture('district', activeDistrict, filterType, year)
    } else if (activeRegion) {
      fetchIndexAndSoilOrCulture('region', activeRegion, filterType, year)
    } else {
      fetchIndexAndSoilOrCulture('region', 'Чуйская', filterType, year)
    }
  }, [filterType, year, activeRegion, activeDistrict])

  useEffect(() => {
    fetchAllRegionIndexes()
    fetchSoilData(`/api/map/soil?type=region&name=Чуйская`)
  }, [])

  useEffect(() => {
    fetchAllDistrictIndexes()
  }, [districtsData])

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: '24px',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={3}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Button
              onClick={() => setMapType('pashni')}
              sx={{
                backgroundColor:
                  mapType === 'pashni' ? 'primary.main' : 'grey.200',
                color: mapType === 'pashni' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor:
                    mapType === 'pashni' ? 'primary.dark' : 'grey.300',
                },
                borderRadius: 2,
                px: 2,
                py: 1,
                minWidth: '100px',
              }}
            >
              <Typography variant="h5">Пашни</Typography>
            </Button>

            <Button
              onClick={() => setMapType('pastbishcha')}
              sx={{
                backgroundColor:
                  mapType === 'pastbishcha' ? 'primary.main' : 'grey.200',
                color: mapType === 'pastbishcha' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor:
                    mapType === 'pastbishcha' ? 'primary.dark' : 'grey.300',
                },
                borderRadius: 2,
                px: 2,
                py: 1,
                minWidth: '100px',
              }}
            >
              <Typography variant="h5">Пастбища</Typography>
            </Button>
          </Box>

          <Typography
            sx={{
              flexShrink: 0,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
            variant="h5"
          >
            Интелектуальная система AgroMap
          </Typography>

          <Stack direction="row" spacing={2}>
            <React.Fragment>
              <Tooltip title="Смена языка">
                <IconButton
                  onClick={popover.handleOpen}
                  ref={popover.anchorRef}
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'inline-flex',
                    },
                  }}
                >
                  <Typography variant="subtitle2">{language}</Typography>
                </IconButton>
              </Tooltip>
              <LanguagePopover
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                open={popover.open}
              />
            </React.Fragment>

            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_API_DOMEN)
              }
            >
              Войти
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {(() => {
            const indexData =
              activeDistrict && district && district.data
                ? district.data
                : region && region.data
                  ? region.data
                  : []
            return indexData.length > 0 ? (
              indexData.map((i) => {
                const isActive = activeType === i.type
                const matchedIndex = indexDictionaryData?.find(
                  (ix) => ix.value === i.type
                )
                const matchedStatus = statusDictionaryData?.find(
                  (ix) => ix.value === i.status
                )

                return (
                  <Grid key={i.type} item md={12 / indexData.length} xs={12}>
                    <IndexCard
                      icon={Check}
                      title={matchedIndex?.title_ru ?? i.type}
                      value={i.viIndex}
                      description={i.interpretation}
                      status={matchedStatus?.title_ru ?? i.status}
                      bgColor={INDEX_COLORS[i.type]}
                      onCardClick={() => setActiveType(i.type)}
                      isActive={isActive}
                    />
                  </Grid>
                )
              })
            ) : (
              <Grid item md={12} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    height: '135px',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Данных нет
                  </Typography>
                </Card>
              </Grid>
            )
          })()}
        </Grid>

        <Grid item md={12} xs={12}>
          <Card sx={{ height: 'calc(100dvh - 265px)' }}>
            <CardHeader
              title={
                (activeRegion && `${activeRegion} область`) ||
                (activeDistrict && `${activeDistrict} район`) ||
                'Кыргызская Республика'
              }
              sx={{
                p: 2,
                '&': {
                  width: '865px',
                },
              }}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">Фильтр по:</Typography>

                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    name="filterType"
                    sx={{ width: '200px' }}
                  >
                    <Option value="soil">типу почвы</Option>
                    <Option value="culture">культурам</Option>
                  </Select>

                  <Box sx={{ width: '150px' }}>
                    {filterType === 'culture' ? (
                      <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        name="year"
                        fullWidth
                      >
                        {Array.from({ length: 6 }, (_, i) => 2020 + i).map(
                          (y) => (
                            <Option
                              key={y}
                              value={String(y)}
                            >{`за ${y}`}</Option>
                          )
                        )}
                      </Select>
                    ) : (
                      // Empty box to reserve the same space
                      <Box sx={{ height: 40 }} />
                    )}
                  </Box>
                </Box>
              }
            />
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item md={2} xs={12}>
                  <RegionsMenu
                    regions={
                      !activeRegion && !activeDistrict
                        ? regionsData?.features
                        : getDistricts()?.features
                    }
                    activeDistrict={activeDistrict}
                    setActiveDistrict={setActiveDistrict}
                    getDistrictsData={getDistrictData}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    onBackToRegions={handleBackToRegions}
                    onRegionSelect={handleRegionSelect}
                    onDistrictSelect={handleDistrictSelect}
                    districtsLoading={districtsLoading}
                  />
                </Grid>
                <Grid item md={8} xs={12}>
                  <MapComponent
                    ref={mapRef}
                    indexDictionaryData={indexDictionaryData}
                    regionsData={regionsData}
                    districtsData={districtsData}
                    getDistrictsData={fetchDistricts}
                    getIndexes={fetchIndexAndSoilOrCulture}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    activeDistrict={activeDistrict}
                    setActiveDistrict={setActiveDistrict}
                    activeType={activeType}
                    indexData={allRegionIndexes}
                    districtsIndexData={allDistrictIndexes}
                    indexColors={INDEX_COLORS}
                    landType={mapType}
                  />
                </Grid>
                <Grid item md={2} xs={12} sx={{ height: '100%' }}>
                  <SoilPieChart
                    data={
                      filterType === 'culture'
                        ? cultureData?.slice(0, 5)
                        : soilData?.slice(0, 5)
                    }
                    title={
                      (activeRegion && `${activeRegion} область`) ||
                      (activeDistrict && `${activeDistrict} район`) ||
                      'Кыргызская Республика'
                    }
                    cultureLoading={cultureLoading}
                    filterType={filterType}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Stack>
    </Box>
  )
}
