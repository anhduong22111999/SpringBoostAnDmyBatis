// material
import { Alert, Snackbar, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import categoryApi from '../../../api/categoryApi';
// ----------------------------------------------------------------------
AddCategoryForm.propTypes = {
  getlistCategory: PropTypes.func
};
AddCategoryForm.defaultProps = {
  getlistCategory: null
};
export default function AddCategoryForm(props) {
  const { getlistCategory } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('success');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const categorySchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
  });
  function handleClose() {
    setOpen(!open);
  }
  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: categorySchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });

  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps } = formik;
  async function handleFormSubmit() {
    setLoading(true);
    const result = await categoryApi.addCategory(values);
    if (result.code === 200 && result.errorMess === '') {
      formik.resetForm();
      setOpen(true);
      setMessage('Add new category succsess !');
      setColor('success');
      if (getlistCategory !== null) {
        getlistCategory();
      }
      setLoading(false);
    } else {
      setOpen(true);
      setMessage(result.errorMess || 'Add new category failse !');
      setColor('error');
      setLoading(false);
    }
  }
  return (
    <FormikProvider value={formik}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={color}>
          {message}
        </Alert>
      </Snackbar>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Title"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
            />
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            add
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
