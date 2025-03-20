import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr/TrendDown';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp';
import {Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';


export function Summary({ amount, diff, bg, icon: Icon, title, description, iconColor, titleSx }) {
  return (
    <Card sx={{ backgroundColor: bg }}>
      <CardContent sx={{ p: 1 }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', ...titleSx }}>
          <Avatar
            sx={{
              '--Avatar-size': '48px',
              bgcolor: bg ?? 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: iconColor,
            }}
          >
            <Icon fontSize={20} />
          </Avatar>
          <div>
            <Typography variant="h5" sx={{width: '150px'}}>{title } ≈ {new Intl.NumberFormat('en-US').format(amount)}</Typography>
          </div>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Tooltip sx={{ fontSize: '14px' }}
                     title={"Это один из самых популярных индексов, используемых для оценки состояния растительности. Он основан на разнице между отражением инфракрасного и красного света. Растения сильно поглощают красный свет и отражают инфракрасный, особенно если они здоровы и имеют хорошее покрытие."}>
              <IconButton>
                <InfoIcon sx={{ color: titleSx ? "#fff" : "" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        <Typography color="text.secondary" variant="body1" sx={{ ...titleSx, mt: "8px" }}>
          {description}
        </Typography>
      </CardContent>
      <Divider />
      <Box sx={{ p: '8px' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography color="text.secondary" variant="body2" fontWeight={600} sx={{ ...titleSx }}>
            {diff ?? "Значения нормальные"}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
