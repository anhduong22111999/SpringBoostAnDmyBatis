import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
// material
import { IconButton, InputAdornment, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import userApi from '../../../api/userApi';
import store from '../../../app/store';
import { addUser } from '../../../app/userSlice';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required')
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      const formData = formik.values;
      const userCurrent = store.getState().user.current.data.user;
      const payload = {
        username: userCurrent.username,
        password: formData.oldPassword,
        newPassword: formData.newPassword,
        lastName: userCurrent.lastName,
        firstName: userCurrent.firstName
      };
      const result = await userApi.changePassword(payload);
      if (result.code === 200) {
        const action = addUser({});
        dispatch(action);
        navigate('/login', { replace: true });
      } else {
        navigate('/changepassword', { replace: true });
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleShowOldPassword = () => {
    setShowOldPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} mb={3}>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showOldPassword ? 'text' : 'password'}
            label="Old Password"
            {...getFieldProps('oldPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowOldPassword} edge="end">
                    <Icon icon={showOldPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.oldPassword && errors.oldPassword)}
            helperText={touched.oldPassword && errors.oldPassword}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            {...getFieldProps('newPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Change Password
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
