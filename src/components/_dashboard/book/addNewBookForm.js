// material
import { Alert, Autocomplete, Input, Snackbar, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import bookApi from '../../../api/bookApi';
import store from '../../../app/store';
// ----------------------------------------------------------------------
AddBookForm.propTypes = {
  getlistBook: PropTypes.func,
  listCategory: PropTypes.array
};
AddBookForm.defaultProps = {
  getlistBook: null,
  listCategory: null
};
export default function AddBookForm(props) {
  const { getlistBook, listCategory } = props;
  const [open, setopen] = useState(false);
  const [file, setFile] = useState(false);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(listCategory[0]._id);
  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title required'),
    description: Yup.string().required('Description required'),
    author: Yup.string().required('User name is required')
  });
  function handleClose() {
    setopen(!open);
  }
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      author: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });
  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps } = formik;
  async function handleFormSubmit() {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('author', values.author);
    formData.append('owner', store.getState().user.current.data.user._id);
    formData.append('category', categoryId);
    values.category = categoryId;
    values.file = file;
    values.owner = store.getState().user.current.data.user._id;
    const result = await bookApi.addBook(formData);
    if (result.code === 200) {
      getlistBook();
      setopen(true);
      formik.resetForm();
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
          Add new Book succsess !
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

            <TextField
              fullWidth
              label="Description"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
          </Stack>
          <TextField
            fullWidth
            autoComplete="author"
            label="Author"
            {...getFieldProps('author')}
            error={Boolean(touched.author && errors.author)}
            helperText={touched.author && errors.author}
          />
          <Autocomplete
            options={listCategory}
            defaultValue={listCategory.find((category) => category.title[0])}
            getOptionLabel={(category) => category.title}
            style={{ width: 300 }}
            onChange={(event, newValue) => {
              setCategoryId(newValue._id);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Combo box" variant="outlined" fullWidth />
            )}
          />
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={(event) => {
              const { 0: file } = event.target.files;
              setFile(file);
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add book
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
