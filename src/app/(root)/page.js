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
import {Summary} from "@/components/overview/summary";
import {Check, Warning} from "@phosphor-icons/react";
import {Subscriptions2} from "@/components/map/subscription2";
import {MapComponent} from "@/components/map/map";
import {Subscriptions} from "@/components/overview/subscriptions";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import {Option} from '@/components/core/option';
import EntryModal from "@/components/modules/entry/entry-modal";


export default function Page() {
  const {i18n} = useTranslation();
  const popover = usePopover();
  const language = i18n.language || 'ru';
  const flag = languageFlags[language];

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
            Интелектуальная система Агромап&#34;
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

            <EntryModal/>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{position: 'relative'}}>
          <Grid md={2.4} xs={12}>
            <Summary
              amount={0.6}
              bg="#16b364"
              description="Здоровье растений"
              icon={Check}
              iconColor="#fffff"
              title="NDVI"
              titleSx={{color: '#ffffff'}}
            />
          </Grid>
          <Grid md={2.4} xs={12}>
            <Summary
              amount={0.3}
              description="Влажность почвы"
              diff="Влажность в норме"
              icon={Check}
              iconColor="var(--mui-palette-success-400)"
              title="NDWI"
              trend="up"
            />
          </Grid>
          <Grid md={2.4} xs={12}>
            <Summary
              amount={0.2}
              background="#d2f9des"
              description="Состояние листвы "
              diff="Состояние листвы в норме"
              icon={Check}
              iconColor="var(--mui-palette-success-400)"
              title="VARI"
              trend="down"
            />
          </Grid>
          <Grid md={2.4} xs={12}>
            <Summary
              amount={-0.3}
              background="#d2f9des"
              description="Растительный покров почвы"
              diff="Растительность на почве ослаблена"
              icon={Warning}
              iconColor="var(--mui-palette-warning-400)"
              title="SAVI"
              trend="up"
            />
          </Grid>
          <Grid md={2.4} xs={12}>
            <IconButton sx={{position: 'absolute', zIndex: 1000, right: -13, top: 70}}>
              <KeyboardDoubleArrowRightIcon sx={{fontSize: '46px'}}/>
            </IconButton>
            <Summary
              amount={-0.7}
              background="#d2f9des"
              description="Содержание хлорофилла"
              diff="Пониженное содержание хлорофилла"
              icon={Warning}
              iconColor="var(--mui-palette-warning-400)"
              title="NDRE"
              trend="up"
            />
          </Grid>

          {/* MAP */}
          <Grid md={12} xs={12}>
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
                title="Нарынская область"
              />
              <CardContent sx={{p: 0, flex: 1}}>
                <Grid container spacing={2}>
                  <Grid md={2} xs={12}>
                    <Subscriptions
                      subscriptions={[
                        {
                          id: 'supabase',
                          title: 'Ак-Талинский',
                          size: '1.3',
                          prod: 78,
                        },
                        {
                          id: 'supabase',
                          title: 'Ат-Башинский',
                          size: '1.2',
                          prod: 47,
                        },
                        {
                          id: 'supabase',
                          title: 'Джумгальский',
                          size: '0.9',
                          prod: 39,
                        },
                        {
                          id: 'supabase',
                          title: 'Кочкорский',
                          size: '0.7',
                          prod: 34,
                        },
                        {
                          id: 'supabase',
                          title: 'Нарынский ',
                          size: '0.4',
                          prod: 25,
                        },
                        {
                          id: 'vercel',
                          title: 'Тогуз-Тороузский',
                          size: '0.3',
                          prod: 14,
                        },
                        {
                          id: 'vercel',
                          title: 'Куланакский',
                          size: '0.2',
                          prod: 9,
                        },
                      ]}
                    />
                  </Grid>
                  <Grid md={8} xs={12}>
                    <MapComponent/>
                  </Grid>
                  <Grid md={2} xs={12}>
                    <Subscriptions2
                      subscriptions={[
                        {
                          width1: '50%',
                          width2: '20%',
                          width3: '30%',
                          size1: '260',
                          size2: '216',
                          size3: '109',
                          id: 'supabase',
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

              <Stack
                direction="row"
                spacing={2}
                sx={{position: 'absolute', bottom: 0, alignItems: 'center', p: '0 0 17px 15px'}}
              >
                <img alt="logo" height={50} src="/logo.png" width={50}/>
                <Typography variant="h6">AgroMap</Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
