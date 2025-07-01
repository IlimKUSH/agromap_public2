"use client"
import * as React from 'react';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {languageFlags, LanguagePopover} from "@/components/layout/language-popover";
import {useTranslation} from "next-i18next";
import {usePopover} from "@/hooks/use-popover";
import {IndexCard} from "@/components/overview/index-card";
import {Check, Warning} from "@phosphor-icons/react";
import {Subscriptions2} from "@/components/map/subscription2";
import {MapComponent} from "@/components/map/map";
import {RegionsMenu} from "@/components/overview/regions-menu";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import {Option} from '@/components/core/option';
import EntryModal from "@/components/modules/entry/entry-modal";
import useFetch from "@/hooks/use-fetch";
import { useMapStore } from "@/stores/map";
import {use, useEffect, useState} from 'react';

export default function Page() {
  const {i18n} = useTranslation();
  const popover = usePopover();
  const language = i18n.language || 'ru';
  const flag = languageFlags[language];

  const [activeType, setActiveType] = useState("ndvi"); // default active index
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const clearActive = () => {
    setActiveRegion(null);
    setActiveDistrict(null);
  };

  const { getRegion, getDistricts, setDistricts } = useMapStore((state) => state)
  const {data: regionsData, update: fetchRegions} = useFetch("/api/map/regions", "GET");
  const { data: indexes } = useFetch("/api/map/dictionaries/index", "GET")
  const { data: statuses } = useFetch("/api/map/dictionaries/status", "GET")

  const {data: districtsData, update: fetchDistricts} = useFetch("", "GET");

  const {data: index, update: fetchIndexes} = useFetch("/api/map/index?type=region&name=Чуйская", "GET");

  const getDistrictsData = async (regionName) => {
    await fetchDistricts(`/api/map/districts?regionName=${regionName}`)
  }

  const getIndexes = async (type, name) => {
    await fetchIndexes(`/api/map/index?type=${type}&name=${name}`)
  }

  const getDistrictData = async (regionName) => {
    if (regionName) {
      await getDistrictsData(regionName)
      await getIndexes("region", regionName);
    } else {
      setDistricts(regionsData);
    }
  }

  const indexColors = {
    ndwi: "#0c44ae",
    ndre: "#bb2720",
    ndvi: "#209661",
  };

  const handleBackToRegions = () => {
    setActiveRegion(null);
    setActiveDistrict(null);
    setDistricts(regionsData);
  };

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
          direction={{xs: 'column', sm: 'row', md: 'row'}}
          spacing={3}
          sx={{alignItems: 'center', justifyContent: 'space-between'}}
        >
          <Box>
            <Button>
              <Typography color="secondary" variant="h4">
                Пашни
              </Typography>
            </Button>
            <Button disabled sx={{backgroundColor: '#f0f4f8'}}>
              <Typography variant="h4">Пастбища</Typography>
            </Button>
          </Box>

          <Typography sx={{flexShrink: 0, textAlign: 'center', fontWeight: 'bold'}} variant="h5">
            Интелектуальная система Агромап
          </Typography>

          <Stack direction="row" spacing={2}>
            <React.Fragment>
              <Tooltip title="Language">
                <IconButton
                  onClick={popover.handleOpen}
                  ref={popover.anchorRef}
                  sx={{display: {xs: 'none', md: 'inline-flex'}}}
                >
                  <Box sx={{height: '24px', width: '24px'}}>
                    <Box alt={language} component="img" src={flag}
                         sx={{height: 'auto', width: '100%'}}/>
                  </Box>
                </IconButton>
              </Tooltip>
              <LanguagePopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose}
                               open={popover.open}/>
            </React.Fragment>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.href = process.env.NEXT_PUBLIC_API_DOMEN}
            >
              Войти
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{position: 'relative'}}>
          {index?.map((i) => {
            const matchedIndex = indexes?.find(ix => ix.value === i.type);
            const matchedStatus = statuses?.find(ix => ix.value === i.status);
            const isActive = activeType === i.type;

            return (
              <Grid key={i.type} item md={2.4} xs={12}>
                <IndexCard
                  amount={i.viIndex}
                  diff={i.interpretation}
                  bg={indexColors[i.type]}
                  description={matchedStatus?.title_ru ?? i.status}
                  icon={Check}
                  iconColor={isActive ? "#ffffff" : "#000000"}
                  title={matchedIndex?.title_ru ?? i.type}
                  titleSx={{ color: isActive ? "#ffffff" : undefined }}
                  onClick={() => setActiveType(i.type)}
                  isActive={isActive}
                />
              </Grid>
            )
          })}
          </Grid>

        <Grid item md={12} xs={12}>

          <Card>
            <CardHeader
              action={
                <Stack alignItems="center" direction="row" spacing={1} sx={{width: '100%'}}>
                  <Typography variant="subtitle1">Фильтр по:</Typography>
                  <Select defaultValue="культурам" name="Тип почвы"
                          sx={{maxWidth: '100%', width: '200px'}}>
                    <Option value="Тип почвы">типу почвы</Option>
                    <Option value="Болотистая">высоте</Option>
                    <Option value="культурам">культурам</Option>
                  </Select>
                  <Select defaultValue="за 2024" name="Тип почвы"
                          sx={{maxWidth: '100%', width: '240px'}}>
                    <Option value="Период">Период</Option>
                    <Option value="за 2024">за 2024</Option>
                  </Select>
                </Stack>
              }
              sx={{
                p: 2,
                '&': {
                  width: '865px',
                },
              }}
              title={getRegion() ?? "Кыргызская Республика"}
            />
            <CardContent sx={{p: 0, flex: 1}}>
              <Grid container spacing={2}>
                <Grid item md={2} xs={12}>
                  <RegionsMenu
                    subscriptions={(!activeRegion && !activeDistrict) ? regionsData?.features : getDistricts()?.features}
                    getDistrictsData={getDistrictData}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    activeDistrict={activeDistrict}
                    setActiveDistrict={setActiveDistrict}
                    onBackToRegions={handleBackToRegions}
                  />
                </Grid>
                <Grid item md={8} xs={12}>
                  <MapComponent
                    regionsData={regionsData}
                    districtsData={districtsData}
                    getDistrictsData={getDistrictsData}
                    getIndexes={getIndexes}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    activeDistrict={activeDistrict}
                    setActiveDistrict={setActiveDistrict}
                    clearActive={clearActive}
                  />
                </Grid>
                <Grid item md={2} xs={12}>
                  <Subscriptions2
                    subscriptions={[
                      {
                        width1: '50%',
                        width2: '20%',
                        width3: '30%',
                        size1: '260',
                        size2: '216',
                        size3: '109',
                        id: 'asd',
                        title: 'Зерновые - 2,0 тыс. га.',
                      },
                      {
                        width1: '10%',
                        width2: '10%',
                        width3: '80%',
                        size1: '260',
                        size2: '216',
                        size3: '109',
                        id: 'vercel',
                        title: 'Зернобобовые - 1,2 тыс. га.',
                      },
                      {
                        width1: '30%',
                        width2: '30%',
                        width3: '40%',
                        size1: '177',
                        size2: '180',
                        size3: '220',
                        id: 'auth0',
                        title: 'Кормовые - 0,6 тыс. га.',
                      },
                      {
                        width1: '35%',
                        width2: '35%',
                        width3: '30%',
                        size1: '260',
                        size2: '259',
                        size3: '207',
                        id: 'google_cloud',
                        title: 'Масличные - 0,4 тыс. га.',
                      },
                      {
                        width1: '70%',
                        width2: '15%',
                        width3: '15%',
                        size1: '548',
                        size2: '149',
                        size3: '149',
                        id: 'stripe',
                        title: 'Овощные - 0.2 тыс. га.',
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </Grid>

        {/*  <Grid container spacing={2} sx={{position: 'relative'}}>*/}

        {/*    /!* MAP *!/*/}
        {/*    <Grid item md={2} xs={12}>*/}
        {/*      <Regions*/}
        {/*        subscriptions={(!activeRegion && !activeDistrict) ? regionsData?.features : getDistricts()?.features}*/}
        {/*        getDistrictsData={getDistrictData}*/}
        {/*        activeRegion={activeRegion}*/}
        {/*        setActiveRegion={setActiveRegion}*/}
        {/*        activeDistrict={activeDistrict}*/}
        {/*        setActiveDistrict={setActiveDistrict}*/}
        {/*        onBackToRegions={handleBackToRegions}*/}
        {/*      />*/}
        {/*    </Grid>*/}
        {/*  */}
        {/*    <Grid item md={8} xs={12}>*/}
        {/*      <MapComponent*/}
        {/*        regionsData={regionsData}*/}
        {/*        districtsData={districtsData}*/}
        {/*        getDistrictsData={getDistrictsData}*/}
        {/*        getIndexes={getIndexes}*/}
        {/*        activeRegion={activeRegion}*/}
        {/*        setActiveRegion={setActiveRegion}*/}
        {/*        activeDistrict={activeDistrict}*/}
        {/*        setActiveDistrict={setActiveDistrict}*/}
        {/*        clearActive={clearActive}*/}
        {/*      />*/}
        {/*    </Grid>*/}

        {/*    <Grid item md={2} xs={12}>*/}
        {/*      <Subscriptions2*/}
        {/*        subscriptions={[*/}
        {/*          {*/}
        {/*            width1: '50%',*/}
        {/*            width2: '20%',*/}
        {/*            width3: '30%',*/}
        {/*            size1: '260',*/}
        {/*            size2: '216',*/}
        {/*            size3: '109',*/}
        {/*            id: 'asd',*/}
        {/*            title: 'Зерновые - 2,0 тыс. га.',*/}
        {/*          },*/}
        {/*          {*/}
        {/*            width1: '10%',*/}
        {/*            width2: '10%',*/}
        {/*            width3: '80%',*/}
        {/*            size1: '260',*/}
        {/*            size2: '216',*/}
        {/*            size3: '109',*/}
        {/*            id: 'vercel',*/}
        {/*            title: 'Зернобобовые - 1,2 тыс. га.',*/}
        {/*          },*/}
        {/*          {*/}
        {/*            width1: '30%',*/}
        {/*            width2: '30%',*/}
        {/*            width3: '40%',*/}
        {/*            size1: '177',*/}
        {/*            size2: '180',*/}
        {/*            size3: '220',*/}
        {/*            id: 'auth0',*/}
        {/*            title: 'Кормовые - 0,6 тыс. га.',*/}
        {/*          },*/}
        {/*          {*/}
        {/*            width1: '35%',*/}
        {/*            width2: '35%',*/}
        {/*            width3: '30%',*/}
        {/*            size1: '260',*/}
        {/*            size2: '259',*/}
        {/*            size3: '207',*/}
        {/*            id: 'google_cloud',*/}
        {/*            title: 'Масличные - 0,4 тыс. га.',*/}
        {/*          },*/}
        {/*          {*/}
        {/*            width1: '70%',*/}
        {/*            width2: '15%',*/}
        {/*            width3: '15%',*/}
        {/*            size1: '548',*/}
        {/*            size2: '149',*/}
        {/*            size3: '149',*/}
        {/*            id: 'stripe',*/}
        {/*            title: 'Овощные - 0.2 тыс. га.',*/}
        {/*          },*/}
        {/*        ]}*/}
        {/*      />*/}
        {/*    </Grid>*/}
        {/*</Grid>*/}
      </Stack>
    </Box>
  );
}
