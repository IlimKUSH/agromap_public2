import * as yup from 'yup'

export const usernameSchema = yup.object().shape({
  username: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль'),
})
