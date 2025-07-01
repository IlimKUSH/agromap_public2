'use client';

import Button from "@mui/material/Button";
import {useProfileStore} from "@/stores/profile";


export default function EntryModal() {

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => window.location.href = process.env.NEXT_PUBLIC_API_DOMEN}
    >
      Войти
    </Button>
  );
}
