import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {Box, CardActions} from '@mui/material';
import Button from "@mui/material/Button";
import {ArrowLeftIcon} from "@mui/x-date-pickers";

export function RegionsMenu({subscriptions, getDistrictsData, activeRegion, setActiveRegion, activeDistrict, setActiveDistrict, onBackToRegions}) {
  const isRegionView = !activeRegion && !activeDistrict;
  const title = isRegionView ? 'Области' : 'Районы';

  return (
    <Card>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px"}}>
        <Typography variant="subtitle1">{title}</Typography>
        { !isRegionView && (
          <Button color="secondary" startIcon={<ArrowLeftIcon />} size="small" onClick={onBackToRegions}>
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
          {subscriptions?.map((subscription, index) => {
            const isRegion = !!subscription?.properties?.adm1_ru && !subscription?.properties?.adm2_ru;
            const isDistrict = !!subscription?.properties?.adm2_ru;
            const isActive = (isRegion && activeRegion === subscription?.properties?.adm1_ru) || (isDistrict && activeDistrict === subscription?.properties?.adm2_ru);

            const handleSelect = () => {
              if (isRegion) {
                setActiveRegion(subscription?.properties?.adm1_ru);
                setActiveDistrict(null);
                getDistrictsData(subscription?.properties?.adm1_ru);
              } else if (isDistrict) {
                setActiveDistrict(subscription?.properties?.adm2_ru);
                setActiveRegion(null);
              }
            }

            return (
              <ListItem disableGutters key={index} selected={isActive} sx={{p: "10px 30px", cursor: "pointer", backgroundColor: isActive ? "#ffe0b2" : "unset"}}>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography noWrap variant="subtitle2"
                                onClick={handleSelect}
                                sx={isActive ? {fontWeight: 'bold', color: '#ff9800'} : {}}>
                      {subscription?.properties?.adm2_ru ?? subscription?.properties?.adm1_ru}
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
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}

