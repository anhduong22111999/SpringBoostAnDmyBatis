// material
import { Alert, Snackbar, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import categoryApi from '../../../api/categoryApi';
// ----------------------------------------------------------------------
EditCategoryForm.propTypes = {
  getlistCategory: PropTypes.func,
  category: PropTypes.object
};
EditCategoryForm.defaultProps = {
  getlistCategory: null,
  category: null
};
export default function EditCategoryForm(props) {
  const { getlistCategory, category } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('success');
  const [loading, setLoading] = useState(false);
  const categorySchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
  });
  function handleClose() {
    setOpen(!open);
  }
  const initialValues = { title: '' };
  if (category !== null) {
    initialValues.title = category.title;
    initialValues._id = category._id;
  }
  const formik = useFormik({
    initialValues,
    validationSchema: categorySchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });

  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps } = formik;
  async function handleFormSubmit() {
    setLoading(true);
    const result = await categoryApi.editCategory(values);
    if (result.code === 200 && result.errorMess === '') {
      formik.resetForm();
      setOpen(true);
      props.onChildClick();
      if (getlistCategory !== null) {
        getlistCategory();
      }
      setLoading(false);
    } else {
      setOpen(true);
      setMessage(result.errorMess || 'edit category failse !');
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
            Edit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
