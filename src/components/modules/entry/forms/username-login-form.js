import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProfileStore } from "@/stores/profile";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


const schema = yup.object().shape({
  username: yup.string().required("Login"),
  password: yup.string().required("Password"),
});

export function UsernameLoginForm() {
  const profile = useProfileStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data) => {
    await profile.logIn(data);
    const authToken = await profile.getToken();

    if (authToken.data != null && document != null) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = "https://agro.brisklyminds.com/token=" + authToken.data;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };


  return (
    <Stack component="form" gap={2} onSubmit={handleSubmit(handleLogin)}>
      <TextField
        fullWidth
        label="Логин"
        variant="outlined"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        sx={{ borderRadius: 2, background: "white" }}
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
      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} fullWidth>
        Войти
      </Button>
    </Stack>
  );
}
