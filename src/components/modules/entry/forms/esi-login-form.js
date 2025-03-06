import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import useFetch from "@/hooks/use-fetch";


export function EsiLoginForm() {
  const { loading, update } = useFetch("", "GET")

  const handleEsiLogin = async () => {
    const data = await update("/api/auth/esi");
    console.log(data)

  };

  return (
    <Stack alignItems="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={handleEsiLogin}
        // disabled={loading}
        fullWidth
        startIcon={<AccountTreeIcon />}
      >
        Войти через ESI
      </Button>
    </Stack>
  );
}
