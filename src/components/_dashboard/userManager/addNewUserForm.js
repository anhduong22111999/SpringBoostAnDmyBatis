import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Autocomplete,
  Select,
  Snackbar,
  Alert
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import userApi from '../../../api/userApi';
// ----------------------------------------------------------------------
AddUserForm.propTypes = {
  getListUser: PropTypes.func
};
AddUserForm.defaultProps = {
  getListUser: null
};
export default function AddUserForm(props) {
  const { getListUser } = props;
  const [open, setopen] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('normal');
  const listRole = ['contributor', 'normal', 'admin'];
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    username: Yup.string().required('User name is required'),
    password: Yup.string().required('Password is required')
  });
  function handleClose() {
    setopen(!open);
  }
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });

  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps } = formik;
  async function handleFormSubmit() {
    console.log('role : ', role);
    values.role = [role];
    const result = await userApi.addUser(values);
    if (result.code === 200) {
      getListUser();
      formik.resetForm();
      setopen(true);
    }
    console.log(result);
  }
  return (
    <FormikProvider value={formik}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success">
          Add new user succsess !
        </Alert>
      </Snackbar>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            label="User name"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <Autocomplete
            value={role}
            onChange={(event, newValue) => {
              setRole(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setRole(newInputValue);
            }}
            id="controllable-states-demo"
            options={listRole}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Controllable" variant="outlined" />
            )}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
