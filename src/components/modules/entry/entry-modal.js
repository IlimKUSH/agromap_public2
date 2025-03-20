'use client';

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {DialogActions, DialogTitle, TextField} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import * as React from "react";
import {useState} from "react";
import {UsernameLoginForm} from "@/components/modules/entry/forms/username-login-form";
import {EsiLoginForm} from "@/components/modules/entry/forms/esi-login-form";
import {useProfileStore} from "@/stores/profile";
import Image from "next/image";


export default function EntryModal() {
  const [open, setOpen] = useState(false);

  const profile = useProfileStore((state) => state);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (profile?.authToken?.data != null) {
    const handleRedirect = () => {
      if (document != null) {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = `https://agro.brisklyminds.com?token=${encodeURIComponent(profile.authToken.data)}&axelorToken=${encodeURIComponent(profile.getCookie())}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    return <Button variant="contained" color="secondary" onClick={handleRedirect}>
      Перейти в ЛК
    </Button>
  }

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Войти
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Stack direction="row" p={2}>
          <Stack direction="row" spacing={2} sx={{ flex: "1 1 auto", alignItems: "center" }}>
            <Image src="/logo.png" alt="logo" width={50} height={50} style={{ borderRadius: "50%", backgroundColor: "white", padding: 5 }} />
            <Typography variant="h6" fontWeight={700}>
              Интеллектуальная система Агромап&#34;
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <DialogTitle textAlign="center" fontWeight={700}>
          Вход в систему
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" gap={2}>
            <UsernameLoginForm />
            <EsiLoginForm />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
