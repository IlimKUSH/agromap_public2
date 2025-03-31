import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useProfileStore} from "@/stores/profile";
import {Button, Fade, Slide, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MapIcon from '@mui/icons-material/Map';
import IconButton from "@mui/material/IconButton";
import {usernameSchema} from "@/validator-schemas/username";


export function UsernameLoginForm() {
  const profile = useProfileStore((state) => state);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: yupResolver(usernameSchema),
  });

  const handleLogin = async (data) => {
    if (data) {
      setStep(2);
    }

    // Actual login logic
    // await profile.logIn(data);
    // const authToken = await profile.getToken();

    // if (authToken.data != null && document != null) {
    //   const a = document.createElement("a");
    //   a.style.display = "none";
    //   a.href = `https://agro.brisklyminds.com?token=${encodeURIComponent(authToken.data)}&axelorToken=${encodeURIComponent(profile.getCookie())}`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <Fade in={step === 1} timeout={500}>
            <Stack gap={3} width="100%">
              <Typography variant="h5" fontWeight={600} textAlign="center">
                Вход в систему
              </Typography>

              <TextField
                fullWidth
                label="Логин"
                variant="outlined"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <TextField
                fullWidth
                label="Пароль"
                type="password"
                variant="outlined"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                // endIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : null}
              >
                Войти
              </Button>
            </Stack>
          </Fade>
        );
      case 2:
        return (
          <Slide direction="up" in={step === 2} mountOnEnter unmountOnExit>
            <Stack>
              <IconButton onClick={() => setStep(1)}>
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
                >
                  Войти через Земельный баланс
                </Button>

                <Button
                  sx={{fontSize: "16px"}}
                  variant="outlined"
                  startIcon={<MapIcon/>}
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
    <Stack
      component="form"
      gap={2}
      onSubmit={handleSubmit(handleLogin)}
    >
      {renderForm()}
    </Stack>
  );
}