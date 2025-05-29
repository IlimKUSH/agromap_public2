'use client';

import Button from "@mui/material/Button";
import * as React from "react";
import {useState} from "react";
import {useProfileStore} from "@/stores/profile";


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
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          window.location.href = process.env.NEXT_PUBLIC_API_DOMEN;
        }}
      >
        Войти
      </Button>

      {/*<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">*/}
      {/*  <Stack direction="row" p={2} sx={{ paddingBottom: 0 }}>*/}
      {/*    <Stack direction="row" spacing={2} sx={{ flex: "1 1 auto", alignItems: "center" }}>*/}
      {/*      <Image src="/logo.png" alt="logo" width={50} height={50} style={{ borderRadius: "50%", backgroundColor: "white", padding: 5 }} />*/}
      {/*      <Typography variant="h6" fontWeight={700}>*/}
      {/*        ГипроЗем ГИС системы*/}
      {/*      </Typography>*/}
      {/*    </Stack>*/}
      {/*    <IconButton onClick={handleClose} size="small">*/}
      {/*      <CloseIcon />*/}
      {/*    </IconButton>*/}
      {/*  </Stack>*/}

      {/*  <DialogContent>*/}
      {/*    <UsernameLoginForm />*/}
      {/*  </DialogContent>*/}
      {/*</Dialog>*/}
    </>
  );
}
