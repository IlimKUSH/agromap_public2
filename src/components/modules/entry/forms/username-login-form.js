import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useProfileStore} from "@/stores/profile";
import {Button, CircularProgress, Divider, Fade, IconButton, Slide, Stack, TextField, Typography} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MapIcon from '@mui/icons-material/Map';
import {usernameSchema} from "@/validator-schemas/username";
import {toast} from "@/components/core/toaster";
import {EsiLoginForm} from "@/components/modules/entry/forms/esi-login-form";

const ROLES = {
  gazr: "gazr",
  zembalance: "zemBalance",
}

export function UsernameLoginForm() {
  const profile = useProfileStore((state) => state);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: yupResolver(usernameSchema),
  });

  const handleLogin = async (data) => {
    await profile.logIn(data);
    const userData = profile.getUserData();

    if (userData == null) {
      setError("root.serverError", {type: "custom", message: "Неправильный логин или пароль"})
      toast.error("Неправильный логин или пароль")
      return;
    }

    if (userData.role === ROLES.gazr || userData.role === ROLES.zembalance) {
      setStep(1);
      return;
    }

    await redirectBy("default")
  };

  const redirectBy = async (loginType) => {
    const osmToken = await profile.getOsmToken();
    const cookie = await profile.getCookie();
    const userData = await profile.getUserData();

    if (osmToken?.data) {
      window.location.href = `${process.env.NEXT_PUBLIC_API_DOMEN}?token=${encodeURIComponent(osmToken.data)}&axelorToken=${encodeURIComponent(cookie)}&role=${encodeURIComponent(userData.role)}&loginType=${encodeURIComponent(loginType)}`;
    }
  }

  const handleBack = () => {
    setStep(0)
    profile.logOut()
  }

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <Fade in={step === 0} timeout={500}>
            <Stack>
              <Stack gap={3} width="100%">
                <Typography variant="h5" fontWeight={600} textAlign="center">
                  Вход в систему
                </Typography>

                <TextField
                  fullWidth
                  label="Логин"
                  variant="outlined"
                  {...register("username")}
                  error={!!errors.username || errors.root?.serverError?.message}
                  helperText={errors.username?.message}
                />

                <TextField
                  fullWidth
                  label="Пароль"
                  type="password"
                  variant="outlined"
                  {...register("password")}
                  error={!!errors.password || errors.root?.serverError?.message}
                  helperText={errors.password?.message}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} color="inherit"/> : null}
                >
                  Войти
                </Button>
              </Stack>

              <Divider sx={{my: 2}}>
                <Typography variant="body2" color="text.secondary">или</Typography>
              </Divider>

              <EsiLoginForm/>
            </Stack>


          </Fade>
        );
      case 1:
        return (
          <Slide direction="up" in={step === 1} mountOnEnter unmountOnExit>
            <Stack>
              <IconButton onClick={handleBack}>
                <KeyboardBackspaceIcon/>
              </IconButton>
              <Stack gap={3} width="100%">

                <Typography variant="h5" fontWeight={600} textAlign="center">
                  Выберите способ входа
                </Typography>

                <Button
                  sx={{fontSize: "16px"}}
                  variant="outlined"
                  startIcon={<LandscapeIcon/>}
                  onClick={() => redirectBy("zemBalance")}
                >
                  Войти через Земельный баланс
                </Button>

                <Button
                  sx={{fontSize: "16px"}}
                  variant="outlined"
                  startIcon={<MapIcon/>}
                  onClick={() => redirectBy("agromap")}
                >
                  Войти через Агромап
                </Button>
              </Stack>
            </Stack>
          </Slide>
        );
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(handleLogin)}>
      {renderForm()}
    </Stack>
  );
}