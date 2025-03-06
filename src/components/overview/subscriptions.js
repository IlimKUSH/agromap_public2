import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export function Subscriptions({ subscriptions }) {
  return (
    <Card>
      {/* <CardHeader
        sx={{ padding: "16px 16px 0 16px" }}
        title="Области"
        subheader="Площадь в гектарах"
      /> */}
      <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "16px 20px 0 20px"}}>
      <Typography variant="subtitle2">Районы</Typography>
      <Typography variant="caption">
        <AutoGraphIcon fontSize={"small"} sx={{ marginLeft: "85px", color: "#212636" }} />
        <sub>%</sub>
      </Typography>
      <Typography variant="caption">S<sub>тыс. га.</sub></Typography>
      </Box>


      <CardContent sx={{ pb: '8px' }}>
        <List disablePadding>
          {subscriptions.map((subscription) => (
            <SubscriptionItem key={subscription.id} subscription={subscription} />
          ))}
        </List>
      </CardContent>
      {/*<Divider />*/}
      {/*<CardActions>*/}
      {/*  <Button color="secondary" endIcon={<ArrowRightIcon />} size="small">*/}
      {/*    See all subscriptions*/}
      {/*  </Button>*/}
      {/*</CardActions>*/}
    </Card>
  );
}

function SubscriptionItem({ subscription }) {
  return (
    <ListItem disableGutters>
      <ListItemText
        disableTypography
        primary={
          <Typography noWrap variant="subtitle2">
            {subscription.title}
          </Typography>
        }
        // secondary={
        //   <Typography noWrap variant="caption">
        //     Площадь: {subscription.size} га.
        //   </Typography>
        // }
      />
      <Typography variant="caption" sx={{ marginRight: "40px" }}>{subscription.prod}%</Typography>
      <Typography variant="caption">{subscription.size}</Typography>
      {/* <IconButton>
        <KeyboardArrowDownIcon weight="bold" />
      </IconButton> */}
    </ListItem>
  );
}
